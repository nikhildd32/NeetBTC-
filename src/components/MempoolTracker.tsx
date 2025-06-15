import React, { useEffect, useState, useRef, Suspense } from 'react';
import { RefreshCw, Activity, Box, Clock, Zap, TrendingUp, Users, Layers, Timer, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box as ThreeBox, Sphere } from '@react-three/drei';
import * as THREE from 'three';

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

interface MempoolBlock {
  feeRate: number;
  txCount: number;
  position: [number, number, number];
  color: string;
  size: number;
}

// 3D Mempool Visualization Component
const MempoolVisualization = ({ data }: { data: MempoolStats | null }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  if (!data?.feeHistogram) return null;

  const blocks: MempoolBlock[] = data.feeHistogram.slice(0, 15).map((item, index) => {
    const [feeRate, txCount] = item;
    const normalizedHeight = Math.max(0.1, (txCount / Math.max(...data.feeHistogram.map(h => h[1]))) * 3);
    
    // Color based on fee rate
    let color = '#7c3aed'; // purple
    if (feeRate > 50) color = '#ef4444'; // red for high fees
    else if (feeRate > 20) color = '#f59e0b'; // yellow for medium fees
    else if (feeRate > 10) color = '#10b981'; // green for low fees

    return {
      feeRate,
      txCount,
      position: [
        (index % 5) * 2 - 4,
        normalizedHeight / 2,
        Math.floor(index / 5) * 2 - 2
      ] as [number, number, number],
      color,
      size: normalizedHeight
    };
  });

  return (
    <group ref={groupRef}>
      {blocks.map((block, index) => (
        <MempoolBlockComponent key={index} block={block} index={index} />
      ))}
      
      {/* Base platform */}
      <ThreeBox args={[12, 0.1, 8]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#1f2937" transparent opacity={0.3} />
      </ThreeBox>
      
      {/* Grid lines */}
      <gridHelper args={[12, 10, '#374151', '#374151']} position={[0, -0.45, 0]} />
    </group>
  );
};

const MempoolBlockComponent = ({ block, index }: { block: MempoolBlock; index: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = block.position[1] + Math.sin(state.clock.elapsedTime + index) * 0.05;
      if (hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group>
      <ThreeBox
        ref={meshRef}
        args={[1.5, block.size, 1.5]}
        position={block.position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={block.color} 
          transparent 
          opacity={0.8}
          emissive={block.color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </ThreeBox>
      
      {hovered && (
        <Text
          position={[block.position[0], block.position[1] + block.size + 0.5, block.position[2]]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`${block.feeRate} sat/vB\n${block.txCount} txs`}
        </Text>
      )}
    </group>
  );
};

// Floating particles effect
const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#a855f7" transparent opacity={0.6} />
    </points>
  );
};

export const MempoolTracker = () => {
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

      setRecentBlocks(blocksData.slice(0, 6).map((block: any) => ({
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
            Real-time 3D visualization of unconfirmed transactions
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
                trend="+2.3%"
              />
              <StatCard
                icon={<Layers className="h-6 w-6" />}
                title="Mempool Size"
                value={`${(mempoolStats.vsize / 1000000).toFixed(2)} MB`}
                subtitle="Virtual bytes"
                color="blue"
                trend="+1.8%"
              />
              <StatCard
                icon={<DollarSign className="h-6 w-6" />}
                title="Total Fees"
                value={`${(mempoolStats.totalFees / 100000000).toFixed(4)} BTC`}
                subtitle="Pending rewards"
                color="green"
                trend="+5.2%"
              />
              <StatCard
                icon={<Timer className="h-6 w-6" />}
                title="Avg Fee Rate"
                value={`${mempoolStats.feeHistogram[0]?.[0] || 0} sat/vB`}
                subtitle="Current priority"
                color="orange"
                trend="-0.5%"
              />
            </>
          )}
        </motion.div>

        {/* 3D Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-2xl p-8 mb-12 backdrop-blur-md shadow-2xl"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
              Live Mempool Visualization
            </h2>
            <p className="text-gray-400">Interactive 3D representation of transaction fee distribution</p>
          </div>
          
          <div className="h-[500px] rounded-xl overflow-hidden bg-black/20 border border-purple-500/20">
            <Canvas camera={{ position: [8, 6, 8], fov: 60 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
              <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={1} color="#ffffff" />
              
              <Suspense fallback={null}>
                <MempoolVisualization data={mempoolStats} />
                <FloatingParticles />
              </Suspense>
              
              <OrbitControls 
                enablePan={false} 
                enableZoom={true} 
                enableRotate={true}
                minDistance={5}
                maxDistance={20}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </div>
          
          <div className="mt-6 flex justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-400">Low Fees (1-10 sat/vB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-400">Medium Fees (10-20 sat/vB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-400">High Fees (20-50 sat/vB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-400">Very High Fees (50+ sat/vB)</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Blocks Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Recent Blocks
          </h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <AnimatePresence>
              {recentBlocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 cursor-pointer group"
                >
                  <div className="text-center">
                    <div className="bg-purple-500/20 rounded-lg p-3 mb-3 group-hover:bg-purple-500/30 transition-colors">
                      <Box className="h-6 w-6 text-purple-400 mx-auto" />
                    </div>
                    
                    <div className="font-mono text-lg font-bold text-purple-300 mb-1">
                      #{block.height}
                    </div>
                    
                    <div className="text-xs text-gray-400 mb-3">
                      {getTimeAgo(block.timestamp)}
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Txs:</span>
                        <span className="text-white font-mono">{block.txCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Size:</span>
                        <span className="text-white font-mono">{(block.size / 1000000).toFixed(2)}MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fees:</span>
                        <span className="text-white font-mono">{(block.fees / 100000000).toFixed(3)}₿</span>
                      </div>
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
  color: 'purple' | 'blue' | 'green' | 'orange';
  trend?: string;
}

const StatCard = ({ icon, title, value, subtitle, color, trend }: StatCardProps) => {
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
        {trend && (
          <div className={`text-xs px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {trend}
          </div>
        )}
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