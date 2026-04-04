import { pgTable, serial, text, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  originalPrice: doublePrecision("original_price"),
  category: text("category").notNull(),
  stockStatus: text("stock_status").notNull().default("in_stock"),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  imageUrl: text("image_url"),
  branches: text("branches").array().notNull().default(["ilesha_garage", "omobolanle", "ilesha"]),
  isDiscount: boolean("is_discount").notNull().default(false),
  discountStartDate: text("discount_start_date"),
  discountEndDate: text("discount_end_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
