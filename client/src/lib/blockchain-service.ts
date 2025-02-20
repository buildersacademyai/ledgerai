// Mock blockchain data service to simulate Ethereum interactions
// In a production environment, this would connect to real blockchain APIs

export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: Date;
}

export interface WalletInfo {
  address: string;
  balance: string;
  transactions: number;
}

const mockWallets: WalletInfo[] = [
  {
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    balance: "100.5 ETH",
    transactions: 150
  },
  {
    address: "0x123f681646d4a755815f9cb19e1acc8565a0c2ac",
    balance: "50.2 ETH",
    transactions: 75
  }
];

const mockTransactions: BlockchainTransaction[] = [
  {
    hash: "0xabc123...",
    from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    to: "0x123f681646d4a755815f9cb19e1acc8565a0c2ac",
    amount: "1.5 ETH",
    timestamp: new Date()
  },
  {
    hash: "0xdef456...",
    from: "0x123f681646d4a755815f9cb19e1acc8565a0c2ac",
    to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    amount: "0.8 ETH",
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  }
];

export class BlockchainService {
  async getTopWallets(limit: number = 10): Promise<WalletInfo[]> {
    return mockWallets.slice(0, limit);
  }

  async getRecentTransactions(limit: number = 10): Promise<BlockchainTransaction[]> {
    return mockTransactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getWalletInfo(address: string): Promise<WalletInfo | null> {
    return mockWallets.find(wallet => wallet.address.toLowerCase() === address.toLowerCase()) || null;
  }

  async getTransactionsByWallet(address: string): Promise<BlockchainTransaction[]> {
    return mockTransactions.filter(
      tx => tx.from.toLowerCase() === address.toLowerCase() || 
            tx.to.toLowerCase() === address.toLowerCase()
    );
  }

  async searchTransactions(query: string): Promise<BlockchainTransaction[]> {
    // Simple mock search implementation
    return mockTransactions.filter(tx => 
      tx.hash.includes(query) ||
      tx.from.toLowerCase().includes(query.toLowerCase()) ||
      tx.to.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const blockchainService = new BlockchainService();
