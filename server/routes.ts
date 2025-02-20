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
      const savedQuery = await storage.saveQuery({ query, response });
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