import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";
import { insertQuerySchema } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express) {
  app.post("/api/query", async (req, res) => {
    try {
      const { query } = insertQuerySchema.parse(req.body);

      // First, check if we have this query in our database
      const existingQueries = await storage.getRecentQueries(100);
      const similarQuery = existingQueries.find(q => 
        q.query.toLowerCase().trim() === query.toLowerCase().trim()
      );

      if (similarQuery) {
        // If we have a matching query, return the cached response
        return res.json(similarQuery);
      }

      // If no cache hit, process with OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a blockchain data analyzer. Format responses as JSON with relevant blockchain data."
          },
          {
            role: "user",
            content: query
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content || "{}";
      const response = JSON.parse(content);

      // Save the new query and response to database
      const savedQuery = await storage.saveQuery({ 
        query, 
        response: response // Ensure response is saved as a proper JSON object
      });

      // If the response contains transaction data, store it
      if (response.type === 'transaction' && Array.isArray(response.data)) {
        for (const tx of response.data) {
          if (tx.hash && tx.from && tx.to && tx.amount) {
            await storage.saveTransaction({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              amount: tx.amount
            });
          }
        }
      }

      // If the response contains wallet data, store it
      if (response.type === 'wallet' && response.data.address) {
        await storage.saveWallet({
          address: response.data.address,
          balance: response.data.balance || '0 ETH'
        });
      }

      res.json(savedQuery);
    } catch (error: any) {
      const message = error?.message || "An error occurred";
      res.status(400).json({ error: message });
    }
  });

  app.get("/api/transactions", async (_req, res) => {
    try {
      const transactions = await storage.getMockTransactions();
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/recent-queries", async (_req, res) => {
    try {
      const queries = await storage.getRecentQueries(10);
      res.json(queries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}