// API endpoints
const MEMPOOL_API_BASE = 'https://mempool.space/api';

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

// Mock Bitcoin news data for demo purposes
export const fetchBitcoinNews = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      title: 'Bitcoin Reaches New All-Time High as Institutional Adoption Grows',
      summary: 'Bitcoin has surged to unprecedented levels as major corporations and financial institutions continue to add BTC to their balance sheets, signaling growing mainstream acceptance.',
      source: 'Bitcoin Magazine',
      url: 'https://bitcoinmagazine.com',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      title: 'Lightning Network Sees Record Transaction Volume',
      summary: 'The Lightning Network has processed a record number of transactions this month, demonstrating the growing utility of Bitcoin\'s second-layer scaling solution.',
      source: 'CoinTelegraph',
      url: 'https://cointelegraph.com',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '3',
      title: 'Central Bank Digital Currencies vs Bitcoin: The Great Debate',
      summary: 'As more countries explore CBDCs, experts debate whether these government-issued digital currencies pose a threat to Bitcoin\'s decentralized nature.',
      source: 'Bitcoin News',
      url: 'https://news.bitcoin.com',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '4',
      title: 'Bitcoin Mining Difficulty Adjusts to New Record High',
      summary: 'Bitcoin\'s mining difficulty has reached a new all-time high, reflecting the increasing computational power securing the network.',
      source: 'Bitcoin Magazine',
      url: 'https://bitcoinmagazine.com',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '5',
      title: 'El Salvador Reports Significant Bitcoin Holdings Growth',
      summary: 'El Salvador continues to accumulate Bitcoin, with President Bukele announcing the country\'s latest BTC purchases amid ongoing economic reforms.',
      source: 'CoinTelegraph',
      url: 'https://cointelegraph.com',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '6',
      title: 'Bitcoin ETF Sees Massive Inflows as Wall Street Embraces Crypto',
      summary: 'Bitcoin exchange-traded funds have attracted billions in new investments, marking a significant shift in traditional finance\'s approach to cryptocurrency.',
      source: 'Bitcoin News',
      url: 'https://news.bitcoin.com',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.pexels.com/photos/7567522/pexels-photo-7567522.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '7',
      title: 'Taproot Adoption Accelerates Among Bitcoin Developers',
      summary: 'Bitcoin\'s Taproot upgrade continues to gain traction among developers, enabling more efficient and private transactions on the network.',
      source: 'Bitcoin Magazine',
      url: 'https://bitcoinmagazine.com',
      publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.pexels.com/photos/6771607/pexels-photo-6771607.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '8',
      title: 'Bitcoin Conference 2024 Announces Keynote Speakers',
      summary: 'The world\'s largest Bitcoin conference has revealed its lineup of speakers, featuring industry leaders and prominent Bitcoin advocates.',
      source: 'CoinTelegraph',
      url: 'https://cointelegraph.com',
      publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '9',
      title: 'Regulatory Clarity Emerges as More Countries Define Bitcoin Status',
      summary: 'Several nations have provided clearer regulatory frameworks for Bitcoin, offering more certainty for businesses and investors in the cryptocurrency space.',
      source: 'Bitcoin News',
      url: 'https://news.bitcoin.com',
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.pexels.com/photos/8369769/pexels-photo-8369769.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '10',
      title: 'Bitcoin Layer 2 Solutions Show Promising Development Progress',
      summary: 'Various Bitcoin layer 2 protocols are making significant strides in development, promising enhanced scalability and functionality for the Bitcoin ecosystem.',
      source: 'Bitcoin Magazine',
      url: 'https://bitcoinmagazine.com',
      publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.pexels.com/photos/7567439/pexels-photo-7567439.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];
};