import { Router, type IRouter } from "express";
import { eq, ilike } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";
import {
  ListOrdersQueryParams,
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  GetOrderByCodeParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/orders", async (req, res): Promise<void> => {
  const parsed = ListOrdersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { status, branch, search } = parsed.data;

  let orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }
  if (branch) {
    orders = orders.filter((o) => o.branch === branch);
  }
  if (search) {
    orders = orders.filter((o) => o.serialCode.toLowerCase().includes(search.toLowerCase()));
  }

  res.json(orders.map(serializeOrder));
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [order] = await db.insert(ordersTable).values({
    serialCode: parsed.data.serialCode,
    items: parsed.data.items,
    customerLocation: parsed.data.customerLocation,
    deliveryType: parsed.data.deliveryType,
    deliveryFee: parsed.data.deliveryFee,
    totalPrice: parsed.data.totalPrice,
    branch: parsed.data.branch,
    status: "pending",
  }).returning();

  res.status(201).json(serializeOrder(order));
});

router.get("/orders/code/:code", async (req, res): Promise<void> => {
  const params = GetOrderByCodeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.serialCode, params.data.code));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(serializeOrder(order));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(serializeOrder(order));
});

router.patch("/orders/:id", async (req, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;

  const [order] = await db
    .update(ordersTable)
    .set(updateData)
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(serializeOrder(order));
});

function serializeOrder(o: typeof ordersTable.$inferSelect) {
  return {
    id: o.id,
    serialCode: o.serialCode,
    items: o.items as Array<{productId: number; productName: string; quantity: number; price: number}>,
    customerLocation: o.customerLocation,
    deliveryType: o.deliveryType,
    deliveryFee: o.deliveryFee,
    totalPrice: o.totalPrice,
    branch: o.branch,
    status: o.status,
    notes: o.notes ?? null,
    createdAt: o.createdAt.toISOString(),
  };
}

export default router;
