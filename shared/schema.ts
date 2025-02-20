import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const blockchainQueries = pgTable("blockchain_queries", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  response: jsonb("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const mockTransactions = pgTable("mock_transactions", {
  id: serial("id").primaryKey(),
  from: text("from").notNull(),
  to: text("to").notNull(),
  amount: text("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  hash: text("hash").notNull(),
});

export const insertQuerySchema = createInsertSchema(blockchainQueries).pick({
  query: true,
  response: true,
});

export const insertTransactionSchema = createInsertSchema(mockTransactions).pick({
  from: true,
  to: true,
  amount: true,
  hash: true,
});

export type InsertQuery = z.infer<typeof insertQuerySchema>;
export type Query = typeof blockchainQueries.$inferSelect;
export type Transaction = typeof mockTransactions.$inferSelect;
