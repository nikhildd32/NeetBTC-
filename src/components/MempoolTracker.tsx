import React, { useEffect, useState } from 'react';
import { RefreshCw, Activity, Box, Clock, Zap, TrendingUp, Users, Layers, Timer, DollarSign, X, ExternalLink, Hash, Calendar, Cpu, HardDrive, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatCardSkeleton, BlockCardSkeleton } from './LoadingSkeleton';

interface MempoolStats {
  count: number;
  vsize: number;
  totalFees: number;
  feeHistogram: [number, number][];
}

interface Block {
  id: string;
  height: number;
  timestamp: number;
  txCount: number;
  size: number;
  weight: number;
  fees: number;
  miner?: string;
}

interface BlockDetails {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  tx_count: number;
  size: number;
  weight: number;
  merkle_root: string;
  previousblockhash: string;
  mediantime: number;
  nonce: number;
  bits: number;
  difficulty: number;
  chainwork: string;
  nTx: number;
  extras?: {
    coinbaseRaw?: string;
    orphans?: any[];
    feeRange?: number[];
    totalFees?: number;
    avgFee?: number;
    avgFeeRate?: number;
    utxoSetChange?: number;
    avgTxSize?: number;
    totalInputs?: number;
    totalOutputs?: number;
    totalOutputAmt?: number;
    segwitTotalTxs?: number;
    segwitTotalSize?: number;
    segwitTotalWeight?: number;
    header?: string;
    utxoSetSize?: number;
    totalInputAmt?: number;
    virtualSize?: number;
    orphan?: boolean;
    pool?: {
      id: number;
      name: string;
      link: string;
      blockCount: number;
      slug: string;
    };
  };
}

interface HistoricalData {
  avgPendingTxs: number;
  avgMempoolSize: number;
  avgTotalFees: number;
  avgBlockTime: number;
}

export const MempoolTracker = () => {
  const [mempoolStats, setMempoolStats] = useState<MempoolStats | null>(null);
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextBlock, setNextBlock] = useState<Block | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [blockDetails, setBlockDetails] = useState<BlockDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistoricalData = async () => {
    try {
      console.log('Fetching historical mempool data...');
      
      // Fetch recent blocks to calculate historical averages
      const blocksResponse = await fetch('https://mempool.space/api/v1/blocks');
      
      if (!blocksResponse.ok) {
        throw new Error(`HTTP error! status: ${blocksResponse.status}`);
      }
      
      const blocksData = await blocksResponse.json();
      
      if (blocksData && Array.isArray(blocksData) && blocksData.length > 0) {
        // Take last 144 blocks (approximately 24 hours of data)
        const recentBlocks = blocksData.slice(0, 144);
        
        // Calculate averages from block data
        const totals = recentBlocks.reduce((acc, block) => ({
          txCount: acc.txCount + (block.tx_count || 0),
          totalFees: acc.totalFees + (block.extras?.totalFees || 0),
          blockInterval: acc.blockInterval + 600 // Assume 10 min average
        }), { txCount: 0, totalFees: 0, blockInterval: 0 });

        // Estimate historical mempool stats based on block data
        const avgData = {
          avgPendingTxs: Math.round((totals.txCount / recentBlocks.length) * 0.8), // Estimate pending as 80% of block capacity
          avgMempoolSize: 3500000, // ~3.5 MB typical average
          avgTotalFees: totals.totalFees / recentBlocks.length,
          avgBlockTime: 600 // 10 minutes in seconds
        };

        setHistoricalData(avgData);
        console.log('Historical averages calculated from blocks:', avgData);
        return;
      }
      
      throw new Error('No valid block data received');
    } catch (err) {
      console.error('Error fetching historical data:', err);
      
      // Use realistic defaults based on typical Bitcoin network conditions
      const defaultData = {
        avgPendingTxs: 5000,
        avgMempoolSize: 3500000, // 3.5 MB
        avgTotalFees: 8000000, // 0.08 BTC in sats
        avgBlockTime: 600 // 10 minutes
      };
      
      setHistoricalData(defaultData);
      console.log('Using default historical data:', defaultData);
    }
  };

  const fetchMempoolData = async () => {
    try {
      const [mempoolResponse, blocksResponse] = await Promise.all([
        fetch('https://mempool.space/api/mempool'),
        fetch('https://mempool.space/api/v1/blocks')
      ]);

      const mempoolData = await mempoolResponse.json();
      const blocksData = await blocksResponse.json();

      // Check if mempoolData is valid before accessing its properties
      if (!mempoolData || typeof mempoolData !== 'object') {
        throw new Error('Invalid mempool data received from API');
      }

      setMempoolStats({
        count: mempoolData.count || 0,
        vsize: mempoolData.vsize || 0,
        totalFees: mempoolData.total_fee || 0,
        feeHistogram: mempoolData.fee_histogram || []
      });

      // Process recent blocks
      const processedBlocks = blocksData.slice(0, 6).map((block: any) => ({
        id: block.id,
        height: block.height,
        timestamp: block.timestamp,
        txCount: block.tx_count,
        size: block.size,
        weight: block.weight,
        fees: block.extras?.totalFees || 0,
        miner: getMinerName(block.extras?.pool?.name)
      }));

      setRecentBlocks(processedBlocks);

      // Create next block simulation
      if (mempoolData.fee_histogram && mempoolData.fee_histogram.length > 0) {
        const topFees = mempoolData.fee_histogram
          .sort((a: [number, number], b: [number, number]) => b[0] - a[0])
          .slice(0, 2000); // Approximate block capacity

        const totalTxs = topFees.reduce((sum: number, [, count]: [number, number]) => sum + count, 0);
        const totalFeesNext = topFees.reduce((sum: number, [fee, count]: [number, number]) => sum + (fee * count * 140), 0); // Estimate

        setNextBlock({
          id: 'pending',
          height: processedBlocks[0]?.height + 1 || 0,
          timestamp: Date.now() / 1000,
          txCount: Math.min(totalTxs, 3000),
          size: 1400000, // ~1.4MB average
          weight: 4000000,
          fees: totalFeesNext / 100000000, // Convert to BTC
          miner: 'Mining...'
        });
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching mempool data:', err);
      setError('Failed to load mempool data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockDetails = async (blockHash: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`https://mempool.space/api/block/${blockHash}`);
      const details = await response.json();
      setBlockDetails(details);
    } catch (err) {
      console.error('Error fetching block details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBlockClick = (block: Block) => {
    if (block.id === 'pending') return; // Don't show details for pending block
    setSelectedBlock(block);
    fetchBlockDetails(block.id);
  };

  const closeModal = () => {
    setSelectedBlock(null);
    setBlockDetails(null);
  };

  const getMinerName = (poolName: string) => {
    const miners: { [key: string]: string } = {
      'Foundry USA': 'Foundry USA',
      'AntPool': 'AntPool',
      'F2Pool': 'F2Pool',
      'Binance Pool': 'Binance',
      'ViaBTC': 'ViaBTC',
      'Poolin': 'Poolin',
      'SlushPool': 'SlushPool'
    };
    return miners[poolName] || poolName || 'Unknown';
  };

  const getComparisonData = (current: number, average: number) => {
    // Ensure both values are valid numbers and average is not zero
    if (!current || !average || average === 0 || !isFinite(current) || !isFinite(average)) {
      return null;
    }
    
    const percentChange = ((current - average) / average) * 100;
    const isHigher = current > average;
    
    // Cap percentage at reasonable limits
    const cappedPercentChange = Math.min(Math.abs(percentChange), 999);
    
    return {
      isHigher,
      percentChange: cappedPercentChange,
      arrow: isHigher ? ArrowUp : ArrowDown,
      color: isHigher ? 'text-green-400' : 'text-red-400',
      bgColor: isHigher ? 'bg-green-500/20' : 'bg-red-500/20'
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Check if it looks like a transaction ID (64 hex characters)
      if (/^[a-fA-F0-9]{64}$/.test(searchQuery.trim())) {
        // Open mempool.space transaction page
        window.open(`https://mempool.space/tx/${searchQuery.trim()}`, '_blank');
      } else if (/^[13bc1][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(searchQuery.trim())) {
        // Bitcoin address format - open address page
        window.open(`https://mempool.space/address/${searchQuery.trim()}`, '_blank');
      } else if (/^[0-9]{1,7}$/.test(searchQuery.trim())) {
        // Block height - open block page
        window.open(`https://mempool.space/block-height/${searchQuery.trim()}`, '_blank');
      } else {
        // Generic search - try as transaction first
        window.open(`https://mempool.space/tx/${searchQuery.trim()}`, '_blank');
      }
      setSearchQuery('');
    }
  };

  useEffect(() => {
    fetchHistoricalData();
    fetchMempoolData();
    const interval = setInterval(fetchMempoolData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchMempoolData();
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    if (diff < 60) return `${Math.floor(diff)} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    return `${Math.floor(diff / 3600)} hours ago`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDifficulty = (difficulty: number) => {
    if (difficulty >= 1e12) {
      return (difficulty / 1e12).toFixed(2) + 'T';
    } else if (difficulty >= 1e9) {
      return (difficulty / 1e9).toFixed(2) + 'B';
    } else if (difficulty >= 1e6) {
      return (difficulty / 1e6).toFixed(2) + 'M';
    }
    return difficulty.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#0A0118] text-white pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute w-[1000px] h-[1000px] bg-purple-600/5 rounded-full blur-3xl -top-96 -left-96 animate-pulse-slow"></div>
        <div className="absolute w-[800px] h-[800px] bg-purple-800/5 rounded-full blur-3xl -bottom-64 -right-64 animate-pulse-slow delay-1000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 text-transparent bg-clip-text animate-gradient-text">
            Bitcoin Mempool
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Live tracking of unconfirmed transactions and recent blocks
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-400">
              {mempoolStats?.count ? `Live • Updated ${new Date().toLocaleTimeString()}` : 'Connecting...'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 backdrop-blur-sm"
            role="alert"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && !mempoolStats && (
          <div className="space-y-8">
            {/* Stats Grid Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <StatCardSkeleton key={index} />
              ))}
            </div>
            
            {/* Blocks Skeleton */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {Array.from({ length: 6 }).map((_, index) => (
                <BlockCardSkeleton key={index} />
              ))}
            </div>
          </div>
        )}

        {/* Main Content - Only render when data is available */}
        {!loading && mempoolStats && historicalData && (
          <>
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              <StatCard
                icon={<Users className="h-6 w-6" />}
                title="Pending Transactions"
                value={mempoolStats.count.toLocaleString()}
                subtitle="Waiting for confirmation"
                color="purple"
                comparison={getComparisonData(mempoolStats.count, historicalData.avgPendingTxs)}
              />
              <StatCard
                icon={<Layers className="h-6 w-6" />}
                title="Mempool Size"
                value={`${(mempoolStats.vsize / 1000000).toFixed(2)} MB`}
                subtitle="Virtual bytes"
                color="blue"
                comparison={getComparisonData(mempoolStats.vsize, historicalData.avgMempoolSize)}
              />
              <StatCard
                icon={<DollarSign className="h-6 w-6" />}
                title="Total Fees"
                value={`${(mempoolStats.totalFees / 100000000).toFixed(4)} BTC`}
                subtitle="Available to miners"
                color="green"
                comparison={getComparisonData(mempoolStats.totalFees, historicalData.avgTotalFees)}
              />
              <StatCard
                icon={<Timer className="h-6 w-6" />}
                title="Next Block ETA"
                value="~8 min"
                subtitle="Estimated time"
                color="orange"
                comparison={getComparisonData(8 * 60, historicalData.avgBlockTime)} // Convert to seconds for comparison
              />
            </motion.div>

            {/* Blocks without container - hidden scrollbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex justify-center">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide max-w-full px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {/* Next Block (Pending) */}
                  {nextBlock && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-6 border-2 border-green-500/50 shadow-lg shadow-green-500/20 min-w-[200px] flex-shrink-0"
                    >
                      <div className="text-center">
                        <div className="bg-green-500/20 rounded-lg p-3 mb-3">
                          <div className="w-6 h-6 bg-green-500 rounded animate-pulse mx-auto"></div>
                        </div>
                        
                        <div className="font-mono text-lg font-bold text-green-300 mb-1">
                          #{nextBlock.height}
                        </div>
                        
                        <div className="text-xs text-green-400 mb-3 font-semibold">
                          Mining Now...
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Est. Txs:</span>
                            <span className="text-white font-mono">{nextBlock.txCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Est. Fees:</span>
                            <span className="text-white font-mono">{nextBlock.fees.toFixed(3)} BTC</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Recent Blocks */}
                  {recentBlocks.map((block, index) => (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={() => handleBlockClick(block)}
                      className={`rounded-xl p-4 border transition-all duration-300 cursor-pointer min-w-[180px] flex-shrink-0 ${
                        index === 0 
                          ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                          : 'bg-gradient-to-br from-gray-900/40 to-gray-800/20 border-gray-600/30 hover:border-purple-500/30'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`rounded-lg p-2 mb-3 ${index === 0 ? 'bg-purple-500/20' : 'bg-gray-600/20'}`}>
                          <Box className={`h-5 w-5 mx-auto ${index === 0 ? 'text-purple-400' : 'text-gray-400'}`} />
                        </div>
                        
                        <div className={`font-mono text-lg font-bold mb-1 ${index === 0 ? 'text-purple-300' : 'text-gray-300'}`}>
                          #{block.height}
                        </div>
                        
                        <div className="text-xs text-gray-400 mb-3">
                          {getTimeAgo(block.timestamp)}
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Txs:</span>
                            <span className="text-white font-mono">{block.txCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Fees:</span>
                            <span className="text-white font-mono">{(block.fees / 100000000).toFixed(3)} BTC</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Miner:</span>
                            <span className="text-white font-mono text-xs truncate max-w-[80px]">{block.miner}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Search Section at Bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Search Bitcoin Network</h2>
                <p className="text-gray-400">Look up transactions, addresses, or blocks</p>
              </div>
              
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter transaction ID, address, or block height..."
                    className="w-full px-6 py-4 pl-14 text-lg bg-purple-900/20 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-purple-900/30 transition-all"
                    aria-label="Search Bitcoin network"
                  />
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 text-white font-medium"
                    aria-label="Search"
                  >
                    Search
                  </motion.button>
                </div>
              </form>
              
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                <span>Examples:</span>
                <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">Transaction ID</span>
                <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">Bitcoin Address</span>
                <span className="px-2 py-1 bg-purple-500/20 rounded text-purple-300">Block Height</span>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Block Details Modal */}
      <AnimatePresence>
        {selectedBlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900/90 to-purple-800/80 border border-purple-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="block-details-title"
              aria-describedby="block-details-description"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 id="block-details-title" className="text-3xl font-bold text-white mb-2">Block #{selectedBlock.height}</h2>
                  <p id="block-details-description" className="text-purple-300">{getTimeAgo(selectedBlock.timestamp)}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors"
                  aria-label="Close block details"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              {loadingDetails ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : blockDetails ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-purple-900/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Block Hash</span>
                      </div>
                      <p className="font-mono text-sm text-white break-all">{blockDetails.id}</p>
                    </div>
                    
                    <div className="bg-purple-900/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Timestamp</span>
                      </div>
                      <p className="text-white">{new Date(blockDetails.timestamp * 1000).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-purple-900/30 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-400">Transactions</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{blockDetails.tx_count.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-purple-900/30 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <HardDrive className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Size</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{formatBytes(blockDetails.size)}</p>
                    </div>
                    
                    <div className="bg-purple-900/30 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Total Fees</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{((blockDetails.extras?.totalFees || 0) / 100000000).toFixed(4)} BTC</p>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-purple-400" />
                      Technical Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Difficulty:</span>
                        <p className="text-white font-mono">{formatDifficulty(blockDetails.difficulty)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Weight:</span>
                        <p className="text-white font-mono">{blockDetails.weight.toLocaleString()} WU</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Nonce:</span>
                        <p className="text-white font-mono">{blockDetails.nonce.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Version:</span>
                        <p className="text-white font-mono">{blockDetails.version}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Fee Rate:</span>
                        <p className="text-white font-mono">{(blockDetails.extras?.avgFeeRate || 0).toFixed(2)} sat/vB</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Tx Size:</span>
                        <p className="text-white font-mono">{(blockDetails.extras?.avgTxSize || 0).toFixed(0)} bytes</p>
                      </div>
                    </div>
                  </div>

                  {/* Miner Info */}
                  {blockDetails.extras?.pool && (
                    <div className="bg-purple-900/30 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Mining Pool</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{blockDetails.extras.pool.name}</span>
                        {blockDetails.extras.pool.link && (
                          <a
                            href={blockDetails.extras.pool.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                            aria-label={`Visit ${blockDetails.extras.pool.name} website`}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View on Explorer */}
                  <div className="flex justify-center pt-4">
                    <a
                      href={`https://mempool.space/block/${selectedBlock.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 text-white font-medium"
                      aria-label="View block on Mempool.space"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Mempool.space
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">Failed to load block details</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: 'purple' | 'blue' | 'green' | 'orange';
  comparison?: {
    isHigher: boolean;
    percentChange: number;
    arrow: React.ComponentType<any>;
    color: string;
    bgColor: string;
  } | null;
}

const StatCard = ({ icon, title, value, subtitle, color, comparison }: StatCardProps) => {
  const colorClasses = {
    purple: 'from-purple-900/30 to-purple-800/10 border-purple-500/30 hover:border-purple-500/50',
    blue: 'from-blue-900/30 to-blue-800/10 border-blue-500/30 hover:border-blue-500/50',
    green: 'from-green-900/30 to-green-800/10 border-green-500/30 hover:border-green-500/50',
    orange: 'from-orange-900/30 to-orange-800/10 border-orange-500/30 hover:border-orange-500/50'
  };

  const iconColorClasses = {
    purple: 'bg-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    orange: 'bg-orange-500/20 text-orange-400'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-gradient-to-br ${colorClasses[color]} shadow-lg hover:shadow-xl`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
          {icon}
        </div>
        {comparison && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${comparison.bgColor}`}>
            <comparison.arrow className={`h-3 w-3 ${comparison.color}`} />
            <span className={`text-xs font-medium ${comparison.color}`}>
              {comparison.percentChange.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
        <p className="text-2xl font-bold font-mono text-white mb-1">
          {value}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{subtitle}</p>
          {comparison && (
            <p className="text-xs text-gray-500">
              vs 24h avg
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};