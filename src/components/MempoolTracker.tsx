import React, { useEffect, useState } from 'react';
import { RefreshCw, Activity, Box, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { formatFeeRate, formatSats, formatTime, shortenTxid } from '../utils/formatters';

interface Block {
  id: string;
  height: number;
  timestamp: number;
  txCount: number;
  size: number;
  weight: number;
  fees: number;
}

interface MempoolStats {
  count: number;
  vsize: number;
  totalFees: number;
  feeRange: number[];
}

export const MempoolTracker = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [mempoolStats, setMempoolStats] = useState<MempoolStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMempoolStats = async () => {
    try {
      const response = await fetch('https://mempool.space/api/mempool');
      const data = await response.json();
      setMempoolStats({
        count: data.count || 0,
        vsize: data.vsize || 0,
        totalFees: data.total_fee || 0, // Updated to match API response field
        feeRange: data.fee_histogram?.map((entry: [number, number]) => entry[0]) || [] // Extract fee rates from histogram
      });
    } catch (err) {
      console.error('Error fetching mempool stats:', err);
      setError('Failed to load mempool statistics');
    }
  };

  const fetchLatestBlocks = async () => {
    try {
      const response = await fetch('https://mempool.space/api/v1/blocks');
      const data = await response.json();
      setBlocks(data.slice(0, 5).map((block: any) => ({
        id: block.id,
        height: block.height,
        timestamp: block.timestamp,
        txCount: block.tx_count,
        size: block.size,
        weight: block.weight,
        fees: block.extras?.totalFees || 0
      })));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blocks:', err);
      setError('Failed to load block data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMempoolStats();
    fetchLatestBlocks();
    
    const interval = setInterval(() => {
      fetchMempoolStats();
      fetchLatestBlocks();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([fetchMempoolStats(), fetchLatestBlocks()]).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Mempool Overview */}
        <Card title="Mempool Overview" className="bg-purple-900/20 border border-purple-500/20">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-8">
              {mempoolStats && (
                <>
                  <Stat
                    icon={<Box className="h-5 w-5 text-purple-400" />}
                    label="Transactions"
                    value={mempoolStats.count.toLocaleString()}
                  />
                  <Stat
                    icon={<Activity className="h-5 w-5 text-purple-400" />}
                    label="Virtual Size"
                    value={`${(mempoolStats.vsize / 1000000).toFixed(2)} MB`}
                  />
                  <Stat
                    icon={<Clock className="h-5 w-5 text-purple-400" />}
                    label="Total Fees"
                    value={`${mempoolStats.totalFees.toFixed(4)} BTC`}
                  />
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              isLoading={loading}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Latest Blocks */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-100">Latest Blocks</h3>
            <div className="grid gap-4">
              <AnimatePresence>
                {blocks.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-500/20 rounded-lg p-2">
                          <Box className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm text-purple-300">
                              #{block.height}
                            </span>
                            <ArrowRight className="h-4 w-4 text-purple-500" />
                            <span className="font-mono text-sm text-purple-300">
                              {shortenTxid(block.id)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {new Date(block.timestamp * 1000).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <BlockStat label="Transactions" value={block.txCount.toLocaleString()} />
                        <BlockStat label="Size" value={`${(block.size / 1000000).toFixed(2)} MB`} />
                        <BlockStat label="Weight" value={`${(block.weight / 1000000).toFixed(2)} MWU`} />
                        <BlockStat label="Fees" value={`${(block.fees / 100000000).toFixed(4)} BTC`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Fee Range */}
          {mempoolStats?.feeRange && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-purple-100 mb-4">Fee Range</h3>
              <div className="flex justify-between items-center bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                {mempoolStats.feeRange.map((fee, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-gray-400 mb-1">
                      {index === 0 ? 'Min' : index === mempoolStats.feeRange.length - 1 ? 'Max' : `${index * 20}%`}
                    </div>
                    <div className="font-mono text-purple-300">{formatFeeRate(fee)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center space-x-3">
    {icon}
    <div>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="font-mono text-lg text-purple-100">{value}</div>
    </div>
  </div>
);

const BlockStat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="text-sm text-gray-400">{label}</div>
    <div className="font-mono text-purple-300">{value}</div>
  </div>
);