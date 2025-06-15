// API endpoints
const MEMPOOL_API_BASE = 'https://mempool.space/api';
const NEWS_API_BASE = 'https://newsapi.org/v2';

export const fetchMempoolData = async () => {
  try {
    const [mempoolResponse, blocksResponse] = await Promise.all([
      fetch(`${MEMPOOL_API_BASE}/mempool`),
      fetch(`${MEMPOOL_API_BASE}/blocks`)
    ]);

    const mempoolData = await mempoolResponse.json();
    const blocksData = await blocksResponse.json();

    return {
      mempool: mempoolData,
      blocks: blocksData
    };
  } catch (error) {
    console.error('Error fetching mempool data:', error);
    throw error;
  }
};

export const fetchBlockData = async (hash: string) => {
  try {
    const response = await fetch(`${MEMPOOL_API_BASE}/block/${hash}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching block data:', error);
    throw error;
  }
};

export const fetchTransactionData = async (txid: string) => {
  try {
    const response = await fetch(`${MEMPOOL_API_BASE}/tx/${txid}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching transaction data:', error);
    throw error;
  }
};

export const fetchFeeEstimates = async () => {
  try {
    const response = await fetch(`${MEMPOOL_API_BASE}/v1/fees/recommended`);
    const data = await response.json();
    
    return {
      high: data.fastestFee,
      medium: data.halfHourFee,
      low: data.hourFee,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching fee estimates:', error);
    throw error;
  }
};

export const fetchBitcoinNews = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-news`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Bitcoin news:', error);
    throw error;
  }
};