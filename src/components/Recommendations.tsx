import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Wallet, 
  Zap, 
  Globe, 
  Users, 
  ExternalLink, 
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Bitcoin,
  Lock,
  TrendingUp
} from 'lucide-react';

export const Recommendations = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0118] text-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-12 w-12 text-yellow-400" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text">
              Our Recommendations
            </h1>
            <motion.div
              animate={{
                rotate: [0, -360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              <Sparkles className="h-12 w-12 text-orange-400" />
            </motion.div>
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Curated tools, wallets, and resources we trust for your Bitcoin journey
          </motion.p>
        </motion.div>

        {/* Categories */}
        <motion.div
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Wallets Section */}
          <RecommendationSection
            icon={<Wallet className="h-8 w-8" />}
            title="Bitcoin Wallets"
            description="Secure, trusted wallets for storing your Bitcoin"
            items={[
              {
                name: "Sparrow Wallet",
                description: "Advanced desktop wallet with full node support and privacy features",
                url: "https://sparrowwallet.com",
                features: ["Full Node Support", "Hardware Wallet Integration", "CoinJoin Privacy", "PSBT Support"],
                rating: 5,
                category: "Desktop"
              },
              {
                name: "BlueWallet",
                description: "User-friendly mobile wallet with Lightning Network support",
                url: "https://bluewallet.io",
                features: ["Lightning Network", "Watch-Only Wallets", "Multisig", "Open Source"],
                rating: 5,
                category: "Mobile"
              },
              {
                name: "Coldcard",
                description: "Ultra-secure hardware wallet for serious Bitcoin holders",
                url: "https://coldcard.com",
                features: ["Air-Gapped", "Secure Element", "Multisig", "Open Source"],
                rating: 5,
                category: "Hardware"
              }
            ]}
          />

          {/* Tools Section */}
          <RecommendationSection
            icon={<Zap className="h-8 w-8" />}
            title="Bitcoin Tools"
            description="Essential tools for Bitcoin users and developers"
            items={[
              {
                name: "Bitcoin Core",
                description: "The reference implementation of Bitcoin",
                url: "https://bitcoincore.org",
                features: ["Full Node", "Wallet", "Mining", "Development"],
                rating: 5,
                category: "Node"
              },
              {
                name: "BTCPay Server",
                description: "Self-hosted Bitcoin payment processor",
                url: "https://btcpayserver.org",
                features: ["Self-Hosted", "No Fees", "Privacy", "Lightning Support"],
                rating: 5,
                category: "Payment"
              },
              {
                name: "Electrum",
                description: "Lightweight Bitcoin wallet with advanced features",
                url: "https://electrum.org",
                features: ["SPV Verification", "Hardware Wallet Support", "Multisig", "Plugin System"],
                rating: 5,
                category: "Wallet"
              }
            ]}
          />

          {/* Security Section */}
          <RecommendationSection
            icon={<Shield className="h-8 w-8" />}
            title="Security Best Practices"
            description="Essential security practices for Bitcoin users"
            items={[
              {
                name: "Hardware Wallets",
                description: "Always use hardware wallets for significant amounts",
                url: "#",
                features: ["Offline Storage", "Secure Chip", "PIN Protection", "Recovery Seed"],
                rating: 5,
                category: "Practice"
              },
              {
                name: "Multisig Setup",
                description: "Use multisig for enhanced security and redundancy",
                url: "#",
                features: ["Multiple Keys", "Redundancy", "Shared Control", "Advanced Security"],
                rating: 5,
                category: "Practice"
              },
              {
                name: "Seed Backup",
                description: "Properly backup and secure your recovery seed phrases",
                url: "#",
                features: ["Metal Backup", "Multiple Locations", "Secure Storage", "Test Recovery"],
                rating: 5,
                category: "Practice"
              }
            ]}
          />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <motion.div
            className="p-8 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Bitcoin className="h-16 w-16 text-orange-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-white">
              Start Your Bitcoin Journey
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              These recommendations are based on our experience and community feedback. 
              Always do your own research and start with small amounts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-green-500/20 rounded-full text-green-400 text-sm">
                ✓ Community Vetted
              </span>
              <span className="px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm">
                ✓ Security Focused
              </span>
              <span className="px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm">
                ✓ Open Source Preferred
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

interface RecommendationItem {
  name: string;
  description: string;
  url: string;
  features: string[];
  rating: number;
  category: string;
}

interface RecommendationSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: RecommendationItem[];
}

const RecommendationSection = ({ icon, title, description, items }: RecommendationSectionProps) => {
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
            {icon}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {title}
          </h2>
        </div>
        <p className="text-gray-400 text-lg">
          {description}
        </p>
      </div>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <RecommendationCard key={index} item={item} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

const RecommendationCard = ({ item, index }: { item: RecommendationItem; index: number }) => {
  const handleClick = () => {
    if (item.url && item.url !== '#') {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        delay: index * 0.1 
      }}
      whileHover={{ 
        scale: 1.05,
        y: -10,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      onClick={handleClick}
      className={`group p-6 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30 transition-all duration-500 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/25 ${
        item.url !== '#' ? 'cursor-pointer' : ''
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
            {item.name}
          </h3>
          <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300">
            {item.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Rating Stars */}
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          {item.url !== '#' && (
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-purple-300 transition-colors" />
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-4 leading-relaxed group-hover:text-gray-300 transition-colors">
        {item.description}
      </p>

      {/* Features */}
      <div className="space-y-2">
        {item.features.map((feature, featureIndex) => (
          <div key={featureIndex} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span className="text-sm text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      {/* Action Indicator */}
      {item.url !== '#' && (
        <div className="mt-4 pt-4 border-t border-purple-500/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
              Visit Website
            </span>
            <ArrowRight className="h-4 w-4 text-purple-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      )}
    </motion.div>
  );
};