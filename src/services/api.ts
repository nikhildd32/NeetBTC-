// API endpoints
const MEMPOOL_API_BASE = import.meta.env.VITE_MEMPOOL_API_BASE || 'https://mempool.space/api';

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 10,
  timeWindow: 1000, // 1 second
  lastRequest: 0,
  requestCount: 0
};

/**
 * Implements rate limiting for API calls
 * @throws {Error} If rate limit is exceeded
 */
const checkRateLimit = () => {
  const now = Date.now();
  if (now - RATE_LIMIT.lastRequest > RATE_LIMIT.timeWindow) {
    RATE_LIMIT.requestCount = 0;
    RATE_LIMIT.lastRequest = now;
  }
  
  RATE_LIMIT.requestCount++;
  if (RATE_LIMIT.requestCount > RATE_LIMIT.maxRequests) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
};

/**
 * Fetches mempool and block data from the mempool.space API
 * @returns {Promise<{mempool: any, blocks: any}>} Mempool and blocks data
 * @throws {Error} If the API request fails
 */
export const fetchMempoolData = async () => {
  try {
    checkRateLimit();
    
    const [mempoolResponse, blocksResponse] = await Promise.all([
      fetch(`${MEMPOOL_API_BASE}/mempool`),
      fetch(`${MEMPOOL_API_BASE}/blocks`)
    ]);

    if (!mempoolResponse.ok || !blocksResponse.ok) {
      throw new Error(`API request failed: ${mempoolResponse.statusText || blocksResponse.statusText}`);
    }

    const mempoolData = await mempoolResponse.json();
    const blocksData = await blocksResponse.json();

    return {
      mempool: mempoolData,
      blocks: blocksData
    };
  } catch (error) {
    console.error('Error fetching mempool data:', error);
    throw new Error('Failed to fetch mempool data. Please try again later.');
  }
};

/**
 * Fetches data for a specific block
 * @param {string} hash - The block hash to fetch
 * @returns {Promise<any>} Block data
 * @throws {Error} If the API request fails
 */
export const fetchBlockData = async (hash: string) => {
  try {
    checkRateLimit();
    
    const response = await fetch(`${MEMPOOL_API_BASE}/block/${hash}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching block data:', error);
    throw new Error('Failed to fetch block data. Please try again later.');
  }
};

/**
 * Fetches recommended fee estimates
 * @returns {Promise<{high: number, medium: number, low: number, timestamp: number}>} Fee estimates
 * @throws {Error} If the API request fails
 */
export const fetchFeeEstimates = async () => {
  try {
    checkRateLimit();
    
    const response = await fetch(`${MEMPOOL_API_BASE}/v1/fees/recommended`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      high: data.fastestFee,
      medium: data.halfHourFee,
      low: data.hourFee,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching fee estimates:', error);
    throw new Error('Failed to fetch fee estimates. Please try again later.');
  }
};

// Import mock data for development/testing
import { mockNewsData } from '../mocks/newsData';

/**
 * Fetches Bitcoin news data
 * In production, this should be replaced with a real API call
 * @returns {Promise<NewsItem[]>} Array of news items
 */
export const fetchBitcoinNews = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In development, return mock data
  if (import.meta.env.DEV) {
    return mockNewsData;
  }
  
  // In production, this should be replaced with a real API call
  throw new Error('News API not implemented in production');
};