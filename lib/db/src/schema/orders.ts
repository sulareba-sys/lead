import { pgTable, serial, text, doublePrecision, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  serialCode: text("serial_code").notNull().unique(),
  items: jsonb("items").notNull(),
  customerLocation: text("customer_location").notNull(),
  deliveryType: text("delivery_type").notNull(),
  deliveryFee: doublePrecision("delivery_fee").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  branch: text("branch").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
