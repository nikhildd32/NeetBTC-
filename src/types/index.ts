// Bitcoin data types
export interface Transaction {
  txid: string;
  vsize: number;
  fee: number;
  feeRate: number;
  time: number; // Unix timestamp
}

export interface MempoolData {
  transactions: Transaction[];
  count: number;
  vsize: number;
  totalFees: number;
}

export interface FeeEstimates {
  low: number;
  medium: number;
  high: number;
  timestamp: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface AddressData {
  address: string;
  balance: number;
  txCount: number;
  transactions: Transaction[];
}