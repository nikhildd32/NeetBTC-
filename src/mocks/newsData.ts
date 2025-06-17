/**
 * Mock Bitcoin news data for development and testing purposes only.
 * In production, this data should be replaced with real API calls.
 */

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
}

export const mockNewsData: NewsItem[] = [
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
  }
]; 