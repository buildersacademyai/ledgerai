import axios from 'axios';
import { ethers } from 'ethers';

export interface EtherscanTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  blockNumber: string;
}

export class EtherscanService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    // We'll need to get this from environment variables
    this.apiKey = process.env.ETHERSCAN_API_KEY || '';
    this.baseUrl = 'https://api.etherscan.io/api';
  }

  async getLatestTransactions(limit: number = 10): Promise<EtherscanTransaction[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address: 'latest',
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: limit,
          sort: 'desc',
          apikey: this.apiKey
        }
      });

      if (response.data.status === '1' && response.data.result) {
        return response.data.result.map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.formatEther(tx.value),
          timeStamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          blockNumber: tx.blockNumber
        }));
      }
      
      throw new Error('Failed to fetch transactions from Etherscan');
    } catch (error) {
      console.error('Etherscan API error:', error);
      throw error;
    }
  }

  async getAddressBalance(address: string): Promise<string> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          module: 'account',
          action: 'balance',
          address,
          tag: 'latest',
          apikey: this.apiKey
        }
      });

      if (response.data.status === '1' && response.data.result) {
        return ethers.formatEther(response.data.result);
      }

      throw new Error('Failed to fetch address balance');
    } catch (error) {
      console.error('Etherscan API error:', error);
      throw error;
    }
  }

  async getTransactionsByAddress(address: string, limit: number = 10): Promise<EtherscanTransaction[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: limit,
          sort: 'desc',
          apikey: this.apiKey
        }
      });

      if (response.data.status === '1' && response.data.result) {
        return response.data.result.map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.formatEther(tx.value),
          timeStamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          blockNumber: tx.blockNumber
        }));
      }

      throw new Error('Failed to fetch transactions for address');
    } catch (error) {
      console.error('Etherscan API error:', error);
      throw error;
    }
  }
}

export const etherscanService = new EtherscanService();
