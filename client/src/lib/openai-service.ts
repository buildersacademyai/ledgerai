import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface BlockchainQueryResult {
  type: 'wallet' | 'transaction' | 'analysis';
  data: any;
  explanation: string;
}

const SYSTEM_PROMPT = `You are a blockchain data analyst assistant specialized in Ethereum blockchain analysis. Your role is to:

1. Analyze user queries about blockchain data
2. Structure responses based on the type of query (wallet analysis, transaction analysis, or general analysis)
3. Provide detailed explanations of blockchain patterns and insights

Format your responses as JSON with the following structure:
{
  "type": "wallet" | "transaction" | "analysis",
  "data": {
    // For wallet queries: address, balance, transaction count, etc.
    // For transaction queries: array of transactions with hash, from, to, amount
    // For analysis: metrics, patterns, insights
  },
  "explanation": "A clear explanation of the data and its implications"
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
            content: `Analyze the provided Ethereum transactions and identify:
1. Transaction patterns and trends
2. Notable wallet behaviors
3. Potential trading strategies or market implications
4. Unusual or significant activities
5. Network usage patterns

Provide insights in a clear, structured format.`
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
            content: `You are a blockchain query optimization expert. 
Suggest improvements to make blockchain data queries more precise and informative.
Consider:
1. Time ranges
2. Transaction types
3. Value thresholds
4. Specific protocols or contracts
5. Wallet categories (e.g., whale addresses, DEX contracts)

Return an array of suggested query improvements.`
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