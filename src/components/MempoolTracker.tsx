import React, { useEffect, useState, useRef } from 'react';
import { RefreshCw, Activity, Box, Clock, Zap, TrendingUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { useRefreshData } from '../hooks/useRefreshData';

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
}

export const MempoolTracker = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mempoolStats, setMempoolStats] = useState<MempoolStats | null>(null);
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      setRecentBlocks(blocksData.slice(0, 3).map((block: any) => ({
        id: block.id,
        height: block.height,
        timestamp: block.timestamp,
        txCount: block.tx_count,
        size: block.size,
        weight: block.weight,
        fees: block.extras?.totalFees || 0
      })));

      setError(null);
    } catch (err) {
      console.error('Error fetching mempool data:', err);
      setError('Failed to load mempool data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMempoolData();
    const interval = setInterval(fetchMempoolData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // D3 Visualization
  useEffect(() => {
    if (!mempoolStats?.feeHistogram || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = mempoolStats.feeHistogram.slice(0, 20); // Show top 20 fee buckets

    const xScale = d3.scaleBand()
      .domain(data.map((d, i) => i.toString()))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[1]) || 0])
      .range([height, 0]);

    // Create gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "mempoolGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", height)
      .attr("x2", 0).attr("y2", 0);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#7c3aed")
      .attr("stop-opacity", 0.8);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#a855f7")
      .attr("stop-opacity", 1);

    // Create bars
    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(i.toString()) || 0)
      .attr("width", xScale.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", "url(#mempoolGradient)")
      .attr("rx", 4)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50)
      .attr("y", d => yScale(d[1]))
      .attr("height", d => height - yScale(d[1]));

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat((d, i) => `${data[parseInt(d)]?.[0] || 0}`))
      .selectAll("text")
      .style("fill", "#9ca3af")
      .style("font-size", "12px");

    // Add y-axis
    g.append("g")
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll("text")
      .style("fill", "#9ca3af")
      .style("font-size", "12px");

    // Style axes
    g.selectAll(".domain, .tick line")
      .style("stroke", "#374151");

    // Add labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#9ca3af")
      .style("font-size", "14px")
      .text("Transaction Count");

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .style("fill", "#9ca3af")
      .style("font-size", "14px")
      .text("Fee Rate (sat/vB)");

  }, [mempoolStats]);

  const handleRefresh = () => {
    setLoading(true);
    fetchMempoolData();
  };

  return (
    <div className="min-h-screen bg-[#0A0118] text-white pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Bitcoin Mempool
          </h1>
          <p className="text-xl text-gray-400">
            Real-time visualization of unconfirmed Bitcoin transactions
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-gray-400">
            {mempoolStats ? `Last updated: ${new Date().toLocaleTimeString()}` : 'Loading...'}
          </p>
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

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
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
                icon={<Activity className="h-6 w-6" />}
                title="Mempool Size"
                value={`${(mempoolStats.vsize / 1000000).toFixed(2)} MB`}
                subtitle="Virtual bytes"
                color="blue"
              />
              <StatCard
                icon={<Zap className="h-6 w-6" />}
                title="Total Fees"
                value={`${(mempoolStats.totalFees / 100000000).toFixed(4)} BTC`}
                subtitle="Pending fee rewards"
                color="green"
              />
            </>
          )}
        </motion.div>

        {/* Mempool Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Fee Distribution</h2>
          <div className="flex justify-center">
            <svg ref={svgRef} className="w-full max-w-4xl"></svg>
          </div>
        </motion.div>

        {/* Recent Blocks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-8"
        >
          <h2 className="text-2xl font-semibold mb-6">Recent Blocks</h2>
          <div className="grid gap-4">
            <AnimatePresence>
              {recentBlocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-purple-900/30 rounded-lg p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-500/20 rounded-lg p-3">
                        <Box className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-lg font-semibold text-purple-300">
                            #{block.height}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {new Date(block.timestamp * 1000).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <BlockStat label="Transactions" value={block.txCount.toLocaleString()} />
                      <BlockStat label="Size" value={`${(block.size / 1000000).toFixed(2)} MB`} />
                      <BlockStat label="Fees" value={`${(block.fees / 100000000).toFixed(4)} BTC`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
  color: 'purple' | 'blue' | 'green';
}

const StatCard = ({ icon, title, value, subtitle, color }: StatCardProps) => {
  const colorClasses = {
    purple: 'bg-purple-900/20 border-purple-500/30 hover:border-purple-500/50',
    blue: 'bg-blue-900/20 border-blue-500/30 hover:border-blue-500/50',
    green: 'bg-green-900/20 border-green-500/30 hover:border-green-500/50'
  };

  const iconColorClasses = {
    purple: 'bg-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 ${colorClasses[color]}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold font-mono text-white">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

const BlockStat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="text-sm text-gray-400 mb-1">{label}</div>
    <div className="font-mono text-purple-300 font-semibold">{value}</div>
  </div>
);