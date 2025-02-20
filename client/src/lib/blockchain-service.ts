import { etherscanService, type EtherscanTransaction } from './etherscan-service';

export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  gasFee?: string;
  timestamp: Date;
}

export interface WalletInfo {
  address: string;
  balance: string;
  transactions: number;
  totalGasFees?: string;
}

export class BlockchainService {
  async getTopWallets(limit: number = 10): Promise<WalletInfo[]> {
    return mockWallets.slice(0, limit);
  }

  async getTopGasSpenders(dateRange: { from: Date; to: Date }): Promise<WalletInfo[]> {
    try {
      // Get transactions from Etherscan
      const transactions = await etherscanService.getLatestTransactions(1000);

      // Calculate gas fees per wallet
      const walletGasFees = new Map<string, number>();

      transactions.forEach(tx => {
        const from = tx.from.toLowerCase();
        const currentFees = walletGasFees.get(from) || 0;
        // Add gas fees for this transaction
        walletGasFees.set(from, currentFees + parseFloat(tx.value));
      });

      // Convert to array and sort by gas fees
      const topSpenders = Array.from(walletGasFees.entries())
        .map(([address, fees]) => ({
          address,
          balance: "Loading...", // We can fetch this separately if needed
          transactions: transactions.filter(tx => 
            tx.from.toLowerCase() === address.toLowerCase()
          ).length,
          totalGasFees: `${fees.toFixed(4)} ETH`
        }))
        .sort((a, b) => 
          parseFloat(b.totalGasFees!.replace(" ETH", "")) - 
          parseFloat(a.totalGasFees!.replace(" ETH", ""))
        );

      return topSpenders;
    } catch (error) {
      console.error("Error fetching gas spenders:", error);
      throw new Error("Failed to analyze gas fees");
    }
  }

  async getRecentTransactions(limit: number = 10): Promise<BlockchainTransaction[]> {
    try {
      const etherscanTxs = await etherscanService.getLatestTransactions(limit);
      return etherscanTxs.map(this.convertEtherscanTransaction);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  private convertEtherscanTransaction(tx: EtherscanTransaction): BlockchainTransaction {
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      amount: tx.value + " ETH",
      timestamp: new Date(tx.timeStamp),
      gasFee: tx.value + " ETH" // This would be actual gas fee in production
    };
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

export const blockchainService = new BlockchainService();