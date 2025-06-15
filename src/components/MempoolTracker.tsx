import React, { useEffect, useState, useRef } from 'react';
import { RefreshCw, Activity, Box, Clock, Zap, TrendingUp, Users, Layers, Timer, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export const MempoolTracker = () => {
  const [mempoolStats, setMempoolStats] = useState<MempoolStats | null>(null);
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextBlock, setNextBlock] = useState<Block | null>(null);
  const [blockConfirmed, setBlockConfirmed] = useState(false);
  const [lastBlockHeight, setLastBlockHeight] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio context for the confirmation sound
  useEffect(() => {
    // Create a simple audio context for the "ding" sound
    const createConfirmationSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playConfirmationSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a nice "ding" sound like NBA 2K
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      };
      
      return playConfirmationSound;
    };

    const playSound = createConfirmationSound();
    audioRef.current = { play: playSound } as any;
  }, []);

  const fetchMempoolData = async () => {
    try {
      const [mempoolResponse, blocksResponse] = await Promise.all([
        fetch('https://mempool.space/api/mempool'),
        fetch('https://mempool.space/api/v1/blocks')
      ]);

      const mempoolData = await mempoolResponse.json();
      const blocksData = await blocksResponse.json();

      setMempoolStats({
        count: mempoolData.count || 0,
        vsize: mempoolData.vsize || 0,
        totalFees: mempoolData.total_fee || 0,
        feeHistogram: mempoolData.fee_histogram || []
      });

      // Process recent blocks
      const processedBlocks = blocksData.slice(0, 5).map((block: any) => ({
        id: block.id,
        height: block.height,
        timestamp: block.timestamp,
        txCount: block.tx_count,
        size: block.size,
        weight: block.weight,
        fees: block.extras?.totalFees || 0,
        miner: getMinerName(block.extras?.pool?.name)
      }));

      // Check for new block confirmation
      if (lastBlockHeight && processedBlocks[0]?.height > lastBlockHeight) {
        setBlockConfirmed(true);
        // Play confirmation sound
        if (audioRef.current?.play) {
          try {
            audioRef.current.play();
          } catch (e) {
            console.log('Audio play failed:', e);
          }
        }
        setTimeout(() => setBlockConfirmed(false), 3000);
      }

      setLastBlockHeight(processedBlocks[0]?.height);
      setRecentBlocks(processedBlocks);

      // Create next block simulation
      if (mempoolData.fee_histogram && mempoolData.fee_histogram.length > 0) {
        const topFees = mempoolData.fee_histogram
          .sort((a: [number, number], b: [number, number]) => b[0] - a[0])
          .slice(0, 2000);

        const totalTxs = topFees.reduce((sum: number, [, count]: [number, number]) => sum + count, 0);
        const totalFeesNext = topFees.reduce((sum: number, [fee, count]: [number, number]) => sum + (fee * count * 140), 0);

        setNextBlock({
          id: 'pending',
          height: processedBlocks[0]?.height + 1 || 0,
          timestamp: Date.now() / 1000,
          txCount: Math.min(totalTxs, 3000),
          size: 1400000,
          weight: 4000000,
          fees: totalFeesNext / 100000000,
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

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-[#0A0118] text-white pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute w-[1000px] h-[1000px] bg-purple-600/5 rounded-full blur-3xl -top-96 -left-96 animate-pulse-slow"></div>
        <div className="absolute w-[800px] h-[800px] bg-purple-800/5 rounded-full blur-3xl -bottom-64 -right-64 animate-pulse-slow delay-1000"></div>
      </div>

      {/* Block Confirmation Celebration */}
      <AnimatePresence>
        {blockConfirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {/* Confetti-like particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0,
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  rotate: 0
                }}
                animate={{ 
                  opacity: 0,
                  scale: 1,
                  x: window.innerWidth / 2 + (Math.random() - 0.5) * 800,
                  y: window.innerHeight / 2 + (Math.random() - 0.5) * 600,
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              />
            ))}
            
            {/* Success message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-400/50">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-6 w-6 animate-spin" />
                  <span className="text-xl font-bold">Block Confirmed!</span>
                  <Sparkles className="h-6 w-6 animate-spin" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 text-transparent bg-clip-text animate-gradient-text">
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
              {mempoolStats ? `Live • Updated ${new Date().toLocaleTimeString()}` : 'Connecting...'}
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
          >
            {error}
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          {mempoolStats && (
            <>
              <StatCard
                icon={<Users className="h-6 w-6" />}
                title="Pending Transactions"
                value={mempoolStats.count.toLocaleString()}
                subtitle="Waiting for confirmation"
                color="purple"
              />
              <StatCard
                icon={<Layers className="h-6 w-6" />}
                title="Mempool Size"
                value={`${(mempoolStats.vsize / 1000000).toFixed(2)} MB`}
                subtitle="Virtual bytes"
                color="blue"
              />
              <StatCard
                icon={<DollarSign className="h-6 w-6" />}
                title="Total Fees"
                value={`${(mempoolStats.totalFees / 100000000).toFixed(4)} BTC`}
                subtitle="Pending rewards"
                color="green"
              />
              <StatCard
                icon={<Timer className="h-6 w-6" />}
                title="Next Block ETA"
                value="~8 min"
                subtitle="Estimated time"
                color="orange"
              />
            </>
          )}
        </motion.div>

        {/* Block Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
              Block Timeline
            </h2>
            <p className="text-gray-400">Live block confirmations and mining progress</p>
          </div>

          {/* Animated Block Timeline */}
          <div className="relative">
            <div className="flex justify-center items-center space-x-8 overflow-x-auto pb-4">
              {/* Next Block (Mining) */}
              {nextBlock && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Mining animation rings */}
                  <div className="absolute inset-0 -m-4">
                    <div className="w-full h-full border-2 border-green-500/30 rounded-2xl animate-ping"></div>
                  </div>
                  <div className="absolute inset-0 -m-2">
                    <div className="w-full h-full border border-green-500/50 rounded-2xl animate-pulse"></div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-900/60 to-green-800/30 rounded-xl p-6 border-2 border-green-500/70 shadow-2xl shadow-green-500/30 min-w-[220px] relative z-10">
                    <div className="text-center">
                      {/* Mining indicator */}
                      <div className="bg-green-500/30 rounded-lg p-3 mb-3 relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 mx-auto"
                        >
                          <div className="w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded animate-pulse"></div>
                        </motion.div>
                        <div className="absolute -top-1 -right-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-3 h-3 bg-green-400 rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                      
                      <div className="font-mono text-xl font-bold text-green-300 mb-1">
                        #{nextBlock.height}
                      </div>
                      
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-sm text-green-400 mb-3 font-bold"
                      >
                        ⚡ MINING NOW ⚡
                      </motion.div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Est. Txs:</span>
                          <span className="text-white font-mono font-bold">{nextBlock.txCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Est. Fees:</span>
                          <span className="text-green-300 font-mono font-bold">{nextBlock.fees.toFixed(3)} BTC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Arrow indicator */}
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-purple-400"
              >
                <ArrowRight className="h-8 w-8" />
              </motion.div>

              {/* Recent Blocks */}
              <div className="flex space-x-6">
                {recentBlocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    className={`rounded-xl p-5 border transition-all duration-300 cursor-pointer min-w-[200px] relative overflow-hidden ${
                      index === 0 
                        ? 'bg-gradient-to-br from-purple-900/60 to-purple-800/30 border-purple-500/70 shadow-2xl shadow-purple-500/30' 
                        : 'bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-gray-600/40 hover:border-purple-500/40 shadow-lg'
                    }`}
                  >
                    {/* Confirmed badge for latest block */}
                    {index === 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                      >
                        ✓ CONFIRMED
                      </motion.div>
                    )}
                    
                    <div className="text-center relative z-10">
                      <div className={`rounded-lg p-3 mb-3 ${index === 0 ? 'bg-purple-500/30' : 'bg-gray-600/30'}`}>
                        <Box className={`h-6 w-6 mx-auto ${index === 0 ? 'text-purple-300' : 'text-gray-400'}`} />
                      </div>
                      
                      <div className={`font-mono text-xl font-bold mb-2 ${index === 0 ? 'text-purple-200' : 'text-gray-300'}`}>
                        #{block.height}
                      </div>
                      
                      <div className="text-xs text-gray-400 mb-3 font-medium">
                        {getTimeAgo(block.timestamp)}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Txs:</span>
                          <span className="text-white font-mono font-bold">{block.txCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fees:</span>
                          <span className="text-white font-mono font-bold">{(block.fees / 100000000).toFixed(3)} BTC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Miner:</span>
                          <span className="text-white font-mono text-xs truncate max-w-[100px] font-bold">{block.miner}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtle background animation for latest block */}
                    {index === 0 && (
                      <motion.div
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: 'purple' | 'blue' | 'green' | 'orange';
}

const StatCard = ({ icon, title, value, subtitle, color }: StatCardProps) => {
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
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
        <p className="text-2xl font-bold font-mono text-white mb-1">
          {value}
        </p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </motion.div>
  );
};