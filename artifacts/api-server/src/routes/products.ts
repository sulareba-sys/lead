import { Router, type IRouter } from "express";
import { eq, ilike, and } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductBody,
  UpdateProductParams,
  DeleteProductParams,
  UpdateProductStockParams,
  UpdateProductStockBody,
} from "@workspace/api-zod";
import { SQL } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, branch, search, discount } = parsed.data;

  const conditions: SQL[] = [];
  if (category) {
    conditions.push(eq(productsTable.category, category));
  }
  if (discount !== undefined && discount !== null) {
    conditions.push(eq(productsTable.isDiscount, discount === true || (discount as unknown as string) === "true"));
  }
  if (search) {
    conditions.push(ilike(productsTable.name, `%${search}%`));
  }

  let products;
  if (conditions.length > 0) {
    products = await db.select().from(productsTable).where(and(...conditions)).orderBy(productsTable.createdAt);
  } else {
    products = await db.select().from(productsTable).orderBy(productsTable.createdAt);
  }

  if (branch) {
    products = products.filter((p) => p.branches.includes(branch));
  }

  res.json(products.map(serializeProduct));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db.insert(productsTable).values({
    name: parsed.data.name,
    price: parsed.data.price,
    originalPrice: parsed.data.originalPrice ?? null,
    category: parsed.data.category,
    stockStatus: parsed.data.stockStatus,
    stockQuantity: parsed.data.stockQuantity,
    imageUrl: parsed.data.imageUrl ?? null,
    branches: parsed.data.branches as string[],
    isDiscount: parsed.data.isDiscount,
    discountStartDate: parsed.data.discountStartDate ?? null,
    discountEndDate: parsed.data.discountEndDate ?? null,
  }).returning();

  res.status(201).json(serializeProduct(product));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(serializeProduct(product));
});

router.put("/products/:id", async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.price !== undefined) updateData.price = parsed.data.price;
  if (parsed.data.originalPrice !== undefined) updateData.originalPrice = parsed.data.originalPrice;
  if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
  if (parsed.data.stockStatus !== undefined) updateData.stockStatus = parsed.data.stockStatus;
  if (parsed.data.stockQuantity !== undefined) updateData.stockQuantity = parsed.data.stockQuantity;
  if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl;
  if (parsed.data.branches !== undefined) updateData.branches = parsed.data.branches;
  if (parsed.data.isDiscount !== undefined) updateData.isDiscount = parsed.data.isDiscount;
  if (parsed.data.discountStartDate !== undefined) updateData.discountStartDate = parsed.data.discountStartDate;
  if (parsed.data.discountEndDate !== undefined) updateData.discountEndDate = parsed.data.discountEndDate;

  const [product] = await db
    .update(productsTable)
    .set(updateData)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(serializeProduct(product));
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.sendStatus(204);
});

router.patch("/products/:id/stock", async (req, res): Promise<void> => {
  const params = UpdateProductStockParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProductStockBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { stockStatus: parsed.data.stockStatus };
  if (parsed.data.stockQuantity !== undefined) updateData.stockQuantity = parsed.data.stockQuantity;

  const [product] = await db
    .update(productsTable)
    .set(updateData)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(serializeProduct(product));
});

function serializeProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    category: p.category,
    stockStatus: p.stockStatus,
    stockQuantity: p.stockQuantity,
    imageUrl: p.imageUrl ?? null,
    branches: p.branches,
    isDiscount: p.isDiscount,
    discountStartDate: p.discountStartDate ?? null,
    discountEndDate: p.discountEndDate ?? null,
    createdAt: p.createdAt.toISOString(),
  };
}

export default router;
