import { pgTable, text, serial, integer, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const blockchainQueries = pgTable("blockchain_queries", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  response: jsonb("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 42 }).notNull().unique(),
  balance: text("balance").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  from: varchar("from_address", { length: 42 }).notNull(),
  to: varchar("to_address", { length: 42 }).notNull(),
  amount: text("amount").notNull(),
  hash: varchar("hash", { length: 66 }).notNull().unique(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertQuerySchema = createInsertSchema(blockchainQueries).omit({
  id: true,
  timestamp: true,
}).extend({
  query: z.string().min(1, "Query cannot be empty"),
  response: z.object({
    type: z.string(),
    data: z.any(),
    explanation: z.string().optional(),
  }),
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  address: true,
  balance: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  from: true,
  to: true,
  amount: true,
  hash: true,
});

export type InsertQuery = z.infer<typeof insertQuerySchema>;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Query = typeof blockchainQueries.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;