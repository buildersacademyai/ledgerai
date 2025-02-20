import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface BlockchainQueryResult {
  type: 'wallet' | 'transaction' | 'analysis';
  data: any;
  explanation: string;
}

const SYSTEM_PROMPT = `You are a blockchain data analyst assistant. Analyze user queries about Ethereum blockchain data and provide structured responses.
Format your responses as JSON with the following structure:
{
  "type": "wallet" | "transaction" | "analysis",
  "data": {
    // Relevant blockchain data based on query type
  },
  "explanation": "A clear explanation of the data"
}`;

export class OpenAIService {
  async processBlockchainQuery(query: string): Promise<BlockchainQueryResult> {
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
      const response = JSON.parse(content);

      // Validate response structure
      if (!response.type || !response.data || !response.explanation) {
        throw new Error("Invalid response format from OpenAI");
      }

      return response as BlockchainQueryResult;
    } catch (error) {
      console.error("Error processing blockchain query:", error);
      throw new Error("Failed to process blockchain query");
    }
  }

  async analyzeTransactionPattern(transactions: any[]): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Analyze the given transaction patterns and provide insights. Focus on trends, unusual activity, and potential implications."
          },
          {
            role: "user",
            content: JSON.stringify(transactions)
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content || "{}";
      const response = JSON.parse(content);
      return response.analysis || "No significant patterns found";
    } catch (error) {
      console.error("Error analyzing transaction pattern:", error);
      throw new Error("Failed to analyze transaction pattern");
    }
  }

  async suggestQueryImprovements(query: string): Promise<string[]> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Suggest improvements or alternative ways to phrase the blockchain query to get better results. Return an array of suggestions."
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
      return response.suggestions || [];
    } catch (error) {
      console.error("Error suggesting query improvements:", error);
      return ["Try being more specific", "Include time ranges if relevant", "Specify wallet addresses if known"];
    }
  }
}

export const openAIService = new OpenAIService();