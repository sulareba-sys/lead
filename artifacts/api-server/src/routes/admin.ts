import { Router, type IRouter } from "express";
import { gte, lt, eq } from "drizzle-orm";
import { db, productsTable, ordersTable } from "@workspace/db";
import { VerifyAdminBody } from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_PASSWORD = "lead@99";

router.post("/admin/verify", async (req, res): Promise<void> => {
  const parsed = VerifyAdminBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.password === ADMIN_PASSWORD) {
    res.json({ success: true, token: "admin-session-token" });
  } else {
    res.json({ success: false, token: null });
  }
});

router.get("/admin/dashboard", async (req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const allOrders = await db.select().from(ordersTable);
  const todayOrders = allOrders.filter((o) => {
    const createdAt = new Date(o.createdAt);
    return createdAt >= today && createdAt < tomorrow;
  });

  const revenueToday = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = allOrders.filter((o) => o.status === "pending").length;

  const allProducts = await db.select().from(productsTable);
  const lowStockCount = allProducts.filter((p) => p.stockStatus === "low_stock").length;

  const recentOrders = allOrders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(serializeOrder);

  res.json({
    totalOrdersToday: todayOrders.length,
    revenueToday,
    pendingOrders,
    totalProducts: allProducts.length,
    lowStockCount,
    recentOrders,
  });
});

router.get("/admin/alerts", async (req, res): Promise<void> => {
  const products = await db.select().from(productsTable).where(eq(productsTable.stockStatus, "low_stock"));
  res.json(products.map(serializeProduct));
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
