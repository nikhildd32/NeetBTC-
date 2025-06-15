import React from 'react';
import { RefreshCw, ExternalLink, Newspaper, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRefreshData } from '../hooks/useRefreshData';
import { fetchBitcoinNews } from '../services/api';
import { NewsItem } from '../types';

export const NewsAggregator = () => {
  const { data, loading, error, refetch } = useRefreshData<NewsItem[]>(
    fetchBitcoinNews,
    300000 // Refresh every 5 minutes
  );

  return (
    <div className="min-h-screen bg-[#0A0118] text-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Bitcoin News
          </h1>
          <p className="text-xl text-gray-400">
            Latest updates from trusted Bitcoin sources
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-gray-400">
            {data ? `Last updated: ${new Date().toLocaleTimeString()}` : 'Loading...'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 rounded-lg border border-purple-500/30 hover:bg-purple-900/30 hover:border-purple-500/50 transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-8">
            Failed to load news. Please try again.
          </div>
        )}

        <AnimatePresence>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6"
            >
              {data?.map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface NewsCardProps {
  article: NewsItem;
  index: number;
}

const NewsCard = ({ article, index }: NewsCardProps) => {
  const { title, summary, source, url, publishedAt, imageUrl } = article;
  
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="block bg-purple-900/20 border border-purple-500/30 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 group"
    >
      <div className="p-6 flex gap-6">
        {imageUrl ? (
          <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="w-48 h-32 flex-shrink-0 bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-900/40 transition-colors">
            <Newspaper className="h-12 w-12 text-purple-500/50" />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
              {title}
              <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
            </h3>
          </div>
          
          <p className="text-gray-400 mt-2 line-clamp-2">{summary}</p>
          
          <div className="flex justify-between items-center mt-4">
            <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300 group-hover:bg-purple-500/30 transition-colors">
              {source}
            </span>
            <time className="text-sm text-gray-500">
              {new Date(publishedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>
        </div>
      </div>
    </motion.a>
  );
};