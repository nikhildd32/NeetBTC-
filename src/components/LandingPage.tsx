import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Bitcoin, Newspaper, Github, Code2, Globe, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Section refs for scroll-triggered animations
  const [whyRef, whyInView] = useInView({ 
    triggerOnce: true, 
    threshold: 0.3,
    rootMargin: '-100px 0px'
  });
  
  const [faqRef, faqInView] = useInView({ 
    triggerOnce: true, 
    threshold: 0.3,
    rootMargin: '-100px 0px'
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-1, 1, -1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0118] overflow-hidden">
      {/* Hero Section with Enhanced Animations */}
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            style={{ y: y1 }}
            className="absolute w-[1200px] h-[1200px] bg-gradient-to-r from-purple-600/20 via-purple-800/10 to-transparent rounded-full blur-3xl -top-96 -left-96"
          />
          <motion.div 
            style={{ y: y2 }}
            className="absolute w-[800px] h-[800px] bg-gradient-to-l from-purple-900/20 via-purple-600/10 to-transparent rounded-full blur-3xl -bottom-64 -right-64"
          />
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div
          style={{ opacity, scale }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-6xl mx-auto px-4 text-center"
        >
          {/* Logo with advanced animations */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <motion.h1 
              className="text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tight leading-none"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.span 
                className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 text-transparent bg-clip-text"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Neet
              </motion.span>
              <motion.span 
                className="text-white"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255,255,255,0.5)',
                    '0 0 40px rgba(255,255,255,0.8)',
                    '0 0 20px rgba(255,255,255,0.5)'
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                BTC
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Subtitle with typewriter effect */}
          <motion.div
            variants={itemVariants}
            className="mb-16"
          >
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              Real-time Bitcoin dashboard with essential tools and live data
            </motion.p>
          </motion.div>

          {/* Quick Access Buttons with enhanced animations */}
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <QuickAccessButton
              icon={<Activity className="h-8 w-8" />}
              title="Mempool"
              description="Live transaction tracking"
              onClick={() => navigate('/mempool')}
              delay={0}
            />
            <QuickAccessButton
              icon={<Bitcoin className="h-8 w-8" />}
              title="Fees"
              description="Smart fee estimation"
              onClick={() => navigate('/fees')}
              delay={0.1}
            />
            <QuickAccessButton
              icon={<Newspaper className="h-8 w-8" />}
              title="News"
              description="Latest Bitcoin updates"
              onClick={() => navigate('/news')}
              delay={0.2}
            />
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-purple-400 text-sm font-medium">Scroll to explore</span>
            <ChevronDown className="h-6 w-6 text-purple-400" />
          </motion.div>
        </motion.div>
      </div>

      {/* Why Section with matching format */}
      <motion.section
        ref={whyRef}
        initial="hidden"
        animate={whyInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center py-32 px-4 relative"
      >
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute w-[800px] h-[800px] bg-gradient-to-r from-purple-600/10 to-transparent rounded-full blur-3xl top-1/2 left-1/4 transform -translate-y-1/2" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 text-transparent bg-clip-text">
                Why NeetBTC
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Bitcoin users often need to juggle multiple websites to track mempool data,
              estimate fees, and stay updated with news. NeetBTC brings these essential
              tools together in one intuitive dashboard.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<Globe className="h-8 w-8" />}
              title="Accessibility"
              description="Making Bitcoin data accessible to everyone through a clean, intuitive interface"
              delay={0}
            />
            <FeatureCard
              icon={<Code2 className="h-8 w-8" />}
              title="Open Source"
              description="Transparent development and community-driven improvements"
              delay={0.1}
            />
            <FeatureCard
              icon={<Github className="h-8 w-8" />}
              title="Community"
              description="Built by Bitcoiners, for Bitcoiners"
              delay={0.2}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section with matching format */}
      <motion.section
        ref={faqRef}
        initial="hidden"
        animate={faqInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center py-32 px-4 relative"
      >
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute w-[800px] h-[800px] bg-gradient-to-l from-purple-600/10 to-transparent rounded-full blur-3xl top-1/2 right-1/4 transform -translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 text-transparent bg-clip-text">
                FAQ
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="space-y-6"
          >
            <FAQItem
              question="What is a mempool?"
              answer="The mempool (memory pool) is a waiting area for Bitcoin transactions that haven't yet been confirmed in a block. It's like a queue where transactions wait to be processed by miners."
              delay={0}
            />
            <FAQItem
              question="What is sat/vB?"
              answer="Sat/vB (satoshis per virtual byte) is the fee rate for Bitcoin transactions. Higher sat/vB means higher priority and faster confirmation times, but also higher fees."
              delay={0.1}
            />
            <FAQItem
              question="Why isn't my transaction confirming?"
              answer="Transactions might not confirm quickly if the fee rate is too low compared to current network demand. You can use our Fee Estimator to check recommended rates for different confirmation priorities."
              delay={0.2}
            />
            <FAQItem
              question="How can I prevent a transaction from getting stuck?"
              answer="Use our Fee Estimator before sending transactions to choose an appropriate fee rate based on your desired confirmation time. Higher fee rates generally mean faster confirmations."
              delay={0.3}
            />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

const QuickAccessButton = ({ icon, title, description, onClick, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay: number;
}) => (
  <motion.button
    onClick={onClick}
    variants={{
      hidden: { 
        opacity: 0, 
        y: 60,
        scale: 0.8,
        rotateX: -15
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: delay
        }
      }
    }}
    whileHover={{ 
      scale: 1.05,
      y: -10,
      rotateY: 5,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }}
    whileTap={{ scale: 0.95 }}
    className="group relative p-8 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30 transition-all duration-500 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/25"
  >
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-purple-500/0 to-purple-400/0 group-hover:from-purple-600/10 group-hover:via-purple-500/5 group-hover:to-purple-400/10 rounded-2xl transition-all duration-500" />
    
    {/* Glowing border effect */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-400/0 to-purple-500/0 group-hover:from-purple-500/20 group-hover:via-purple-400/30 group-hover:to-purple-500/20 blur-sm transition-all duration-500" />
    
    <div className="relative z-10 flex flex-col items-center text-center">
      <motion.div 
        className="mb-6 p-4 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-all duration-300"
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-purple-300 group-hover:text-purple-200 transition-colors">
          {icon}
        </span>
      </motion.div>
      
      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
        {description}
      </p>
    </div>
  </motion.button>
);

const FeatureCard = ({ icon, title, description, delay }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    variants={{
      hidden: { 
        opacity: 0, 
        y: 60,
        scale: 0.9
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: delay
        }
      }
    }}
    whileHover={{ 
      scale: 1.05,
      y: -10,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }}
    className="group p-8 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/20 transition-all duration-500 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/20"
  >
    <motion.div 
      className="text-purple-400 mb-6 group-hover:text-purple-300 transition-colors"
      whileHover={{ scale: 1.2, rotate: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-bold mb-4 text-purple-100 group-hover:text-white transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const FAQItem = ({ question, answer, delay }: { 
  question: string; 
  answer: string;
  delay: number;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div
      variants={{
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
            damping: 15,
            delay: delay
          }
        }
      }}
      className="group border border-purple-500/20 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20"
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex justify-between items-center text-left bg-purple-900/20 group-hover:bg-purple-900/30 transition-all duration-300"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-lg font-semibold text-purple-100 group-hover:text-white transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        >
          <ChevronDown className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
        </motion.div>
      </motion.button>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? "auto" : 0, 
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="overflow-hidden"
      >
        <motion.div 
          className="px-8 py-6 bg-purple-900/10 text-gray-300 leading-relaxed"
          initial={{ y: -10 }}
          animate={{ y: isOpen ? 0 : -10 }}
          transition={{ duration: 0.3 }}
        >
          {answer}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};