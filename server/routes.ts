import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";
import { insertQuerySchema } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a blockchain data analyzer. Format responses as JSON with the following structure:
{
  "type": "wallet" | "transaction" | "analysis",
  "data": object | array,
  "explanation": string
}

For gas fee analysis queries:
1. Include 'type': 'analysis'
2. Structure data with 'topSpenders' array
3. Add timeframe information

For wallet queries:
1. Include 'type': 'wallet'
2. Structure data with address, balance, and transaction count
3. Add relevant transaction history

For transaction queries:
1. Include 'type': 'transaction'
2. Structure data as an array of transactions with hash, from, to, amount
3. Add timestamp and gas information`;

function isValidResponse(response: any): boolean {
  // Check if response has required structure
  if (!response || typeof response !== 'object') return false;
  if (!['wallet', 'transaction', 'analysis'].includes(response.type)) return false;
  if (!response.data || typeof response.data !== 'object') return false;
  if (!response.explanation || typeof response.explanation !== 'string') return false;

  // Check for specific data based on type
  switch (response.type) {
    case 'wallet':
      return response.data.address && response.data.balance;
    case 'transaction':
      return Array.isArray(response.data) && response.data.length > 0 &&
        response.data.every((tx: any) => tx.hash && tx.from && tx.to);
    case 'analysis':
      return response.data.topSpenders || response.data.metrics || response.data.insights;
    default:
      return false;
  }
}

function createErrorResponse(message: string) {
  return {
    type: "error",
    data: { error: message },
    explanation: "The AI model could not provide an accurate answer. Please try rephrasing your question."
  };
}

export async function registerRoutes(app: Express) {
  app.post("/api/query", async (req, res) => {
    try {
      const { query } = await insertQuerySchema.pick({ query: true }).parseAsync(req.body);

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: query
            }
          ],
          response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || "{}";
        let response = JSON.parse(content);

        // Only store valid responses
        if (!isValidResponse(response)) {
          response = createErrorResponse("Could not generate a valid response for your query");
          return res.status(400).json({ query, response });
        }

        // Store the valid response
        const savedQuery = await storage.saveQuery({ query, response });

        // Process additional data based on response type
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

        if (response.type === 'wallet' && response.data.address) {
          await storage.saveWallet({
            address: response.data.address,
            balance: response.data.balance || '0 ETH'
          });
        }

        res.json(savedQuery);
      } catch (error: any) {
        console.error("OpenAI API error:", error);
        const response = createErrorResponse(error.message);
        res.status(400).json({ query, response });
      }
    } catch (error: any) {
      const message = error?.message || "An error occurred";
      const response = createErrorResponse(message);
      res.status(400).json({ query: req.body.query || "", response });
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