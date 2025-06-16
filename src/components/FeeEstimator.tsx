import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, Zap, Rocket, TrendingUp, AlertTriangle, Timer, DollarSign, Brain, Target, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiFeePredictionService, FeePrediction } from '../services/aiFeePrediction';
import { FeeCardSkeleton } from './LoadingSkeleton';

interface FeeEstimate {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

interface MempoolFees {
  [key: string]: number;
}

interface FeeData {
  recommended: FeeEstimate;
  mempool: MempoolFees;
  timestamp: number;
}

export const FeeEstimator = () => {
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiPrediction, setAiPrediction] = useState<FeePrediction | null>(null);
  const [showPredictions, setShowPredictions] = useState(false);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      
      // Fetch from multiple sources for better accuracy
      const [recommendedResponse, mempoolResponse] = await Promise.all([
        fetch('https://mempool.space/api/v1/fees/recommended'),
        fetch('https://mempool.space/api/v1/fees/mempool-blocks')
      ]);

      if (!recommendedResponse.ok || !mempoolResponse.ok) {
        throw new Error('Failed to fetch fee data');
      }

      const recommended = await recommendedResponse.json();
      const mempoolBlocks = await mempoolResponse.json();

      // Calculate additional fee estimates from mempool data
      const mempoolFees: MempoolFees = {};
      
      if (mempoolBlocks && mempoolBlocks.length > 0) {
        // Extract fee rates from the first few mempool blocks
        const feeRates = mempoolBlocks.slice(0, 6).map((block: any) => ({
          medianFee: block.medianFee || 0,
          feeRange: block.feeRange || [0, 0]
        }));

        // Calculate percentile-based fees
        const allFees = feeRates.flatMap(block => [block.medianFee, ...block.feeRange]).filter(fee => fee > 0);
        allFees.sort((a, b) => a - b);

        if (allFees.length > 0) {
          mempoolFees['10min'] = allFees[Math.floor(allFees.length * 0.9)] || recommended.fastestFee;
          mempoolFees['30min'] = allFees[Math.floor(allFees.length * 0.7)] || recommended.halfHourFee;
          mempoolFees['1hour'] = allFees[Math.floor(allFees.length * 0.5)] || recommended.hourFee;
          mempoolFees['2hour'] = allFees[Math.floor(allFees.length * 0.3)] || Math.max(recommended.economyFee, 1);
        }
      }

      // Fallback to recommended if mempool data is insufficient
      if (Object.keys(mempoolFees).length === 0) {
        mempoolFees['10min'] = recommended.fastestFee;
        mempoolFees['30min'] = recommended.halfHourFee;
        mempoolFees['1hour'] = recommended.hourFee;
        mempoolFees['2hour'] = recommended.economyFee || Math.max(recommended.hourFee * 0.7, 1);
      }

      const newFeeData = {
        recommended,
        mempool: mempoolFees,
        timestamp: Date.now()
      };

      setFeeData(newFeeData);

      // Add data to AI service for predictions
      aiFeePredictionService.addDataPoint({
        fastestFee: recommended.fastestFee,
        halfHourFee: recommended.halfHourFee,
        hourFee: recommended.hourFee,
        economyFee: recommended.economyFee || Math.max(recommended.hourFee * 0.7, 1),
        mempoolSize: 3500000, // Approximate - would need actual mempool size
        pendingTxs: 5000, // Approximate - would need actual pending tx count
        blockHeight: 800000 // Approximate - would need actual block height
      });

      // Generate AI prediction
      const prediction = aiFeePredictionService.generatePrediction();
      setAiPrediction(prediction);

      setError(null);
    } catch (err) {
      console.error('Error fetching fee data:', err);
      setError('Failed to load fee estimates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeData();
    const interval = setInterval(fetchFeeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchFeeData();
  };

  const getEstimatedCost = (feeRate: number, txSize: number = 225): { btc: number; usd: number; sats: number } => {
    const sats = Math.ceil(feeRate * txSize);
    const btc = sats / 100000000;
    const usd = btc * 45000; // Approximate USD value - in production, fetch real BTC price
    
    return { btc, usd, sats };
  };

  const formatTimeEstimate = (priority: string): string => {
    const estimates: { [key: string]: string } = {
      'fastest': '~10 minutes',
      'halfHour': '~30 minutes', 
      'hour': '~1 hour',
      'economy': '~2+ hours'
    };
    return estimates[priority] || 'Unknown';
  };

  const getPriorityDescription = (priority: string): string => {
    const descriptions: { [key: string]: string } = {
      'fastest': 'Highest priority - next block inclusion likely',
      'halfHour': 'High priority - confirmation within 30 minutes',
      'hour': 'Standard priority - confirmation within 1 hour',
      'economy': 'Low priority - confirmation when network is less busy'
    };
    return descriptions[priority] || '';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-400" />;
      default:
        return <Target className="h-4 w-4 text-blue-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-red-400';
      case 'decreasing':
        return 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0118] text-white pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Bitcoin Fee Estimator
          </h1>
          <p className="text-xl text-gray-400">
            Real-time fee recommendations with AI-powered predictions
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-400">
              {feeData ? `Live data • Updated ${new Date(feeData.timestamp).toLocaleTimeString()}` : 'Loading...'}
            </p>
            {aiPrediction && (
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
                <Brain className="h-3 w-3 text-purple-400" />
                <span className="text-xs text-purple-300">AI Predictions Available</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {aiPrediction && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPredictions(!showPredictions)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                  showPredictions 
                    ? 'bg-purple-600 border-purple-500 text-white' 
                    : 'bg-purple-900/20 border-purple-500/30 text-purple-300 hover:bg-purple-900/30'
                }`}
              >
                <Brain className="h-4 w-4" />
                AI Predictions
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 rounded-lg border border-purple-500/30 hover:bg-purple-900/30 hover:border-purple-500/50 transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-8"
          >
            {error}
          </motion.div>
        )}

        {/* AI Predictions Panel */}
        <AnimatePresence>
          {showPredictions && aiPrediction && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/40 backdrop-blur-xl rounded-2xl border border-purple-500/40 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Brain className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">AI Fee Predictions</h3>
                      <p className="text-sm text-gray-400">
                        Based on {aiFeePredictionService.getHistoricalDataCount()} data points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(aiPrediction.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(aiPrediction.trend)}`}>
                      {aiPrediction.trend}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-purple-300 mb-2">Next Hour</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">High:</span>
                        <span className="text-white font-mono">{aiPrediction.nextHour.high} sat/vB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Medium:</span>
                        <span className="text-white font-mono">{aiPrediction.nextHour.medium} sat/vB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Low:</span>
                        <span className="text-white font-mono">{aiPrediction.nextHour.low} sat/vB</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Confidence: {(aiPrediction.nextHour.confidence * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-purple-300 mb-2">Next 6 Hours</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">High:</span>
                        <span className="text-white font-mono">{aiPrediction.next6Hours.high} sat/vB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Medium:</span>
                        <span className="text-white font-mono">{aiPrediction.next6Hours.medium} sat/vB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Low:</span>
                        <span className="text-white font-mono">{aiPrediction.next6Hours.low} sat/vB</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Confidence: {(aiPrediction.next6Hours.confidence * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-purple-300 mb-2">Next 24 Hours</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">High:</span>
                        <span className="text-white font-mono">{aiPrediction.next24Hours.high} sat/vB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Medium:</span>
                        <span className="text-white font-mono">{aiPrediction.next24Hours.medium} sat/vB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Low:</span>
                        <span className="text-white font-mono">{aiPrediction.next24Hours.low} sat/vB</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Confidence: {(aiPrediction.next24Hours.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {aiPrediction.factors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-purple-300 mb-2">Influencing Factors</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiPrediction.factors.map((factor, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fee Estimates */}
        {loading && !feeData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <FeeCardSkeleton key={index} />
            ))}
          </motion.div>
        ) : feeData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <FeeCard
              title="Priority"
              description="Next block (~10 min)"
              feeRate={feeData.recommended.fastestFee}
              icon={<Rocket className="h-6 w-6" />}
              cost={getEstimatedCost(feeData.recommended.fastestFee)}
              variant="danger"
              priority="fastest"
              timeEstimate={formatTimeEstimate('fastest')}
              priorityDescription={getPriorityDescription('fastest')}
            />
            <FeeCard
              title="Standard"
              description="Within 30 minutes"
              feeRate={feeData.recommended.halfHourFee}
              icon={<Zap className="h-6 w-6" />}
              cost={getEstimatedCost(feeData.recommended.halfHourFee)}
              variant="warning"
              priority="halfHour"
              timeEstimate={formatTimeEstimate('halfHour')}
              priorityDescription={getPriorityDescription('halfHour')}
            />
            <FeeCard
              title="Economic"
              description="Within 1 hour"
              feeRate={feeData.recommended.hourFee}
              icon={<Clock className="h-6 w-6" />}
              cost={getEstimatedCost(feeData.recommended.hourFee)}
              variant="success"
              priority="hour"
              timeEstimate={formatTimeEstimate('hour')}
              priorityDescription={getPriorityDescription('hour')}
            />
            <FeeCard
              title="Low Priority"
              description="2+ hours"
              feeRate={feeData.recommended.economyFee || Math.max(feeData.recommended.hourFee * 0.7, 1)}
              icon={<Timer className="h-6 w-6" />}
              cost={getEstimatedCost(feeData.recommended.economyFee || Math.max(feeData.recommended.hourFee * 0.7, 1))}
              variant="info"
              priority="economy"
              timeEstimate={formatTimeEstimate('economy')}
              priorityDescription={getPriorityDescription('economy')}
            />
          </motion.div>
        ) : null}

        {/* Network Status */}
        {feeData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Network Status
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Minimum Fee</p>
                <p className="text-2xl font-bold text-white">{feeData.recommended.minimumFee || 1} sat/vB</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Network Congestion</p>
                <p className="text-2xl font-bold text-white">
                  {feeData.recommended.fastestFee > 50 ? 'High' : 
                   feeData.recommended.fastestFee > 20 ? 'Medium' : 'Low'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Fee Spread</p>
                <p className="text-2xl font-bold text-white">
                  {feeData.recommended.fastestFee - feeData.recommended.hourFee} sat/vB
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface FeeCardProps {
  title: string;
  description: string;
  feeRate: number;
  icon: React.ReactNode;
  cost: { btc: number; usd: number; sats: number };
  variant: 'success' | 'warning' | 'danger' | 'info';
  priority: string;
  timeEstimate: string;
  priorityDescription: string;
}

const FeeCard = ({ 
  title, 
  description, 
  feeRate, 
  icon, 
  cost, 
  variant, 
  priority, 
  timeEstimate, 
  priorityDescription 
}: FeeCardProps) => {
  const variants = {
    success: 'bg-green-900/20 border-green-500/30 hover:border-green-500/50',
    warning: 'bg-yellow-900/20 border-yellow-500/30 hover:border-yellow-500/50',
    danger: 'bg-red-900/20 border-red-500/30 hover:border-red-500/50',
    info: 'bg-blue-900/20 border-blue-500/30 hover:border-blue-500/50'
  };

  const iconVariants = {
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 ${variants[variant]}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconVariants[variant]}`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-3xl font-bold font-mono mb-1">
            {feeRate} <span className="text-lg">sat/vB</span>
          </p>
          <p className="text-sm text-gray-400">{timeEstimate}</p>
        </div>
        
        <div className="pt-3 border-t border-gray-600/30">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Cost (225 vB):</span>
              <span className="text-white font-mono">{cost.sats} sats</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">BTC:</span>
              <span className="text-white font-mono">{cost.btc.toFixed(8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">USD:</span>
              <span className="text-white font-mono">${cost.usd.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-xs text-gray-500">{priorityDescription}</p>
        </div>
      </div>
    </motion.div>
  );
};