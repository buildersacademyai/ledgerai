# LedgerAI 🔍

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://ledgerai.buildersacademy.ai)

LedgerAI is a specialized blockchain exploration platform that transforms complex blockchain queries into intuitive, user-friendly insights using advanced AI and comprehensive data sources.

Live at: [ledgerai.buildersacademy.ai](https://ledgerai.buildersacademy.ai)

## 🌟 Features

- **Natural Language Queries**: Ask complex blockchain questions in plain English
- **Sonic Blockchain Integration**: High-performance blockchain data indexing and querying
- **Real-time Analysis**: Get instant insights about transactions, wallets, and smart contracts
- **Intelligent Data Visualization**: Dynamic charts and graphs for better understanding
- **Smart Caching**: Efficient response caching for frequently asked queries

## 🚀 Example Queries

- "Which wallet paid the highest gas fees last month?"
- "Show me the top 10 Ethereum holders"
- "Find the largest transactions in the last 7 days"
- "Which wallet interacted with Uniswap the most?"

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn/UI + Tailwind CSS
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT-4o for natural language processing
- **Blockchain Data**: Etherscan API integration
- **Visualization**: Recharts for dynamic data visualization
- **State Management**: TanStack Query (React Query)

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────┐     ┌─────────────┐
│  React UI   │────>│  Express │────>│  OpenAI API │
└─────────────┘     │  Server  │     └─────────────┘
                    └────┬─────┘
                         │         ┌─────────────┐
                         ├────────>│ Etherscan   │
                         │         │    API      │
                         │         └─────────────┘
                         │         ┌─────────────┐
                         └────────>│ PostgreSQL  │
                                  │  Database   │
                                  └─────────────┘
```

## 🔧 Setup & Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
DATABASE_URL=your_postgres_url
ETHERSCAN_API_KEY=your_etherscan_key
OPENAI_API_KEY=your_openai_key
```

4. Start the development server:
```bash
npm run dev
```

## 📚 API Documentation

### Query Endpoint

```typescript
POST /api/query
Content-Type: application/json

{
  "query": "string"  // Your natural language query
}

Response:
{
  "type": "wallet" | "transaction" | "analysis",
  "data": object | array,
  "explanation": string
}
```

### Recent Queries

```typescript
GET /api/recent-queries

Response: Array<{
  id: number,
  query: string,
  response: object,
  timestamp: string
}>
```

## 💡 How It Works

1. User submits a natural language query
2. GPT-4o processes and structures the query
3. Backend fetches data from Etherscan/database
4. AI analyzes and formats the response
5. Results are visualized and cached

## 🌐 Live Demo

Visit [ledgerai.buildersacademy.ai](https://ledgerai.buildersacademy.ai) to try it out!

## 📞 Contact

For any queries, reach out to: contact@buildersacademy.ai

