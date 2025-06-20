import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Newspaper, ArrowUpRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NewsCardSkeleton } from './LoadingSkeleton';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
}

export const NewsAggregator = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch live Bitcoin news from our Supabase edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-news`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newsData = await response.json();
      
      // Ensure we have valid news data
      if (Array.isArray(newsData) && newsData.length > 0) {
        setNews(newsData);
        setLastUpdated(new Date());
        setError(null);
      } else {
        throw new Error('No news data received');
      }

    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load live news. Please try again.');
      
      // Fallback to local data if API fails
      const fallbackNews: NewsItem[] = [
        {
          id: 'local-1',
          title: 'Bitcoin Network Hashrate Hits New Record High',
          summary: 'Bitcoin mining difficulty adjusts upward as network security reaches unprecedented levels with institutional miners expanding operations globally.',
          source: 'Bitcoin Magazine',
          url: 'https://bitcoinmagazine.com',
          publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          imageUrl: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 'local-2',
          title: 'Lightning Network Capacity Surges Past 5,000 BTC',
          summary: 'Bitcoin\'s Lightning Network continues rapid growth with new payment channels and increased adoption by major exchanges and payment processors.',
          source: 'CoinTelegraph',
          url: 'https://cointelegraph.com',
          publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          imageUrl: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 'local-3',
          title: 'Major Corporation Adds Bitcoin to Treasury Holdings',
          summary: 'Another Fortune 500 company announces Bitcoin allocation as corporate adoption trend continues amid inflation concerns and monetary policy uncertainty.',
          source: 'Bitcoin News',
          url: 'https://news.bitcoin.com',
          publishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 'local-4',
          title: 'Bitcoin ETF Sees Record Daily Inflows',
          summary: 'Spot Bitcoin ETFs attract massive institutional investment as traditional finance embraces digital assets with unprecedented trading volumes.',
          source: 'CoinDesk',
          url: 'https://coindesk.com',
          publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
          imageUrl: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 'local-5',
          title: 'Bitcoin Mining Sustainability Report Released',
          summary: 'New research shows Bitcoin mining renewable energy usage reaches 58% as industry continues push toward carbon neutrality and sustainable operations.',
          source: 'Bitcoin Magazine',
          url: 'https://bitcoinmagazine.com',
          publishedAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
          imageUrl: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      ];
      
      setNews(fallbackNews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Update every hour (3600000 ms) for fresh live content
    const interval = setInterval(fetchNews, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchNews();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0118] text-white pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Bitcoin News
          </h1>
          <p className="text-xl text-gray-400">
            Live updates from trusted Bitcoin sources • Updates every hour
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-400">
              {lastUpdated ? `Live • Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            aria-label="Refresh news"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 p-4 rounded-xl mb-8 backdrop-blur-sm"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {loading && news.length === 0 ? (
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <NewsCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {news.slice(0, 5).map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} getTimeAgo={getTimeAgo} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {news.length === 0 && !loading && (
          <div className="text-center py-20">
            <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No news articles available at the moment.</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              aria-label="Try loading news again"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface NewsCardProps {
  article: NewsItem;
  index: number;
  getTimeAgo: (dateString: string) => string;
}

const NewsCard = ({ article, index, getTimeAgo }: NewsCardProps) => {
  const { title, summary, source, url, publishedAt, imageUrl } = article;

  const handleClick = () => {
    // Open the specific article URL in a new tab
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="block bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      role="button"
      tabIndex={0}
      aria-label={`Read article: ${title}`}
    >
      <article className="p-6 flex gap-6">
        {imageUrl ? (
          <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
            <img 
              src={imageUrl} 
              alt=""
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="w-48 h-32 flex-shrink-0 bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-900/40 transition-colors">
            <Newspaper className="h-12 w-12 text-purple-500/50" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors flex items-start gap-2 leading-tight">
              <span className="flex-1">{title}</span>
              <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 flex-shrink-0 mt-1" />
            </h3>
          </div>
          
          <p className="text-gray-400 mb-4 line-clamp-2 leading-relaxed">{summary}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300 group-hover:bg-purple-500/30 transition-colors">
                {source}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <time dateTime={publishedAt}>{getTimeAgo(publishedAt)}</time>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="h-3 w-3" />
              <span>Read article</span>
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
};