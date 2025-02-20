import { Query, InsertQuery, Transaction } from "@shared/schema";

export interface IStorage {
  saveQuery(query: InsertQuery): Promise<Query>;
  getRecentQueries(limit: number): Promise<Query[]>;
  getMockTransactions(): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private queries: Map<number, Query>;
  private transactions: Map<number, Transaction>;
  private currentId: number;

  constructor() {
    this.queries = new Map();
    this.transactions = new Map();
    this.currentId = 1;
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockTransactions: Transaction[] = [
      {
        id: 1,
        from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        to: "0x123f681646d4a755815f9cb19e1acc8565a0c2ac",
        amount: "1.5 ETH",
        timestamp: new Date(),
        hash: "0xabc123..."
      },
      // Add more mock transactions as needed
    ];

    mockTransactions.forEach(tx => {
      this.transactions.set(tx.id, tx);
    });
  }

  async saveQuery(insertQuery: InsertQuery): Promise<Query> {
    const id = this.currentId++;
    const query: Query = {
      id,
      ...insertQuery,
      timestamp: new Date(),
    };
    this.queries.set(id, query);
    return query;
  }

  async getRecentQueries(limit: number): Promise<Query[]> {
    return Array.from(this.queries.values())
      .sort((a, b) => {
        const timeA = a.timestamp?.getTime() ?? 0;
        const timeB = b.timestamp?.getTime() ?? 0;
        return timeB - timeA;
      })
      .slice(0, limit);
  }

  async getMockTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }
}

export const storage = new MemStorage();