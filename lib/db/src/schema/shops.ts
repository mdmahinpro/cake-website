import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const shopsTable = pgTable("shops", {
  id:         text("id").primaryKey(),
  data:       jsonb("data").notNull().$type<Record<string, unknown>>(),
  adminToken: text("admin_token").notNull(),
  updatedAt:  timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Shop = typeof shopsTable.$inferSelect;
