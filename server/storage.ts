import { db } from "./db";
import { 
  type Query, type InsertQuery,
  type Transaction, type InsertTransaction,
  type Wallet, type InsertWallet,
  blockchainQueries, transactions, wallets
} from "@shared/schema";
import { desc, eq, ilike } from "drizzle-orm";

export interface IStorage {
  saveQuery(query: InsertQuery): Promise<Query>;
  getRecentQueries(limit: number): Promise<Query[]>;
  getMockTransactions(): Promise<Transaction[]>;
  getWallet(address: string): Promise<Wallet | undefined>;
  saveWallet(wallet: InsertWallet): Promise<Wallet>;
  saveTransaction(transaction: InsertTransaction): Promise<Transaction>;
  findSimilarQueries(queryText: string): Promise<Query[]>;
}

export class DatabaseStorage implements IStorage {
  async saveQuery(insertQuery: InsertQuery): Promise<Query> {
    const [query] = await db
      .insert(blockchainQueries)
      .values({
        ...insertQuery,
        timestamp: new Date(),
      })
      .returning();
    return query;
  }

  async getRecentQueries(limit: number): Promise<Query[]> {
    return await db
      .select()
      .from(blockchainQueries)
      .orderBy(desc(blockchainQueries.timestamp))
      .limit(limit);
  }

  async findSimilarQueries(queryText: string): Promise<Query[]> {
    return await db
      .select()
      .from(blockchainQueries)
      .where(ilike(blockchainQueries.query, queryText.trim()))
      .orderBy(desc(blockchainQueries.timestamp))
      .limit(5);
  }

  async getMockTransactions(): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.timestamp))
      .limit(10);
  }

  async getWallet(address: string): Promise<Wallet | undefined> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.address, address.toLowerCase()));
    return wallet;
  }

  async saveWallet(wallet: InsertWallet): Promise<Wallet> {
    const [saved] = await db
      .insert(wallets)
      .values({
        ...wallet,
        address: wallet.address.toLowerCase(), // Normalize addresses
        lastUpdated: new Date()
      })
      .returning();
    return saved;
  }

  async saveTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [saved] = await db
      .insert(transactions)
      .values({
        ...transaction,
        from: transaction.from.toLowerCase(), // Normalize addresses
        to: transaction.to.toLowerCase(),
        timestamp: new Date()
      })
      .returning();
    return saved;
  }
}

export const storage = new DatabaseStorage();