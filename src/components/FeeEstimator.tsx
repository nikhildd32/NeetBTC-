import React from 'react';
import { RefreshCw, Clock, Zap, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRefreshData } from '../hooks/useRefreshData';
import { fetchFeeEstimates } from '../services/api';

export const FeeEstimator = () => {
  const { data, loading, error, refetch } = useRefreshData(
    fetchFeeEstimates,
    60000 // Refresh every minute
  );

  const getEstimatedCost = (feeRate: number, txSize: number = 225): number => {
    return (feeRate * txSize) / 100000000; // Convert to BTC
  };

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
            Bitcoin Fee Estimator
          </h1>
          <p className="text-xl text-gray-400">
            Live fee recommendations for different transaction priorities
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
            Failed to load fee estimates. Please try again.
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {data && (
            <>
              <FeeCard
                title="Economic"
                description="within 1 hour"
                feeRate={data.low}
                icon={<Clock className="h-6 w-6" />}
                btcCost={getEstimatedCost(data.low)}
                variant="success"
              />
              <FeeCard
                title="Standard"
                description="within 30 minutes"
                feeRate={data.medium}
                icon={<Zap className="h-6 w-6" />}
                btcCost={getEstimatedCost(data.medium)}
                variant="warning"
              />
              <FeeCard
                title="Priority"
                description="within 10 minutes"
                feeRate={data.high}
                icon={<Rocket className="h-6 w-6" />}
                btcCost={getEstimatedCost(data.high)}
                variant="danger"
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

interface FeeCardProps {
  title: string;
  description: string;
  feeRate: number;
  icon: React.ReactNode;
  btcCost: number;
  variant: 'success' | 'warning' | 'danger';
}

const FeeCard = ({ title, description, feeRate, icon, btcCost, variant }: FeeCardProps) => {
  const variants = {
    success: 'bg-green-900/20 border-green-500/30 hover:border-green-500/50',
    warning: 'bg-yellow-900/20 border-yellow-500/30 hover:border-yellow-500/50',
    danger: 'bg-red-900/20 border-red-500/30 hover:border-red-500/50'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 ${variants[variant]}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div className={`p-2 rounded-lg ${variant === 'success' ? 'bg-green-500/20' : variant === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold font-mono mb-2">
          {feeRate} <span className="text-lg">sat/vB</span>
        </p>
        <p className="text-sm text-gray-400">
          ≈ {btcCost.toFixed(8)} BTC for average transaction
        </p>
      </div>
    </motion.div>
  );
};