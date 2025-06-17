import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Newspaper, Github, Code2, Globe, ChevronDown, Sparkles } from 'lucide-react';
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

  // Bitcoin logo SVG component
  const BitcoinLogo = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-orange-500 ${className}`}
    >
      <circle cx="16" cy="16" r="16" fill="currentColor"/>
      <path
        d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.113-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.181-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313L8.556 19.83l2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.874 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
        fill="white"
      />
    </svg>
  );

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
          
          {/* Floating Bitcoin logos */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            >
              <BitcoinLogo size={16 + Math.random() * 16} className="opacity-20" />
            </motion.div>
          ))}

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

          {/* Large floating Bitcoin logos in background */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`large-${i}`}
              className="absolute opacity-5"
              style={{
                left: `${20 + (i * 30)}%`,
                top: `${30 + (i * 20)}%`,
              }}
              animate={{
                y: [-30, 30, -30],
                rotate: [0, 180, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <BitcoinLogo size={80 + i * 20} />
            </motion.div>
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
              icon={<BitcoinLogo size={32} />}
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
              icon={<BitcoinLogo size={32} />}
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
              answer="Transactions might not confirm quickly if the fee rate is too low compared to current network demand. You can use our Fee Estimator to check recommended rates for different confirmation priorities. If your transaction is stuck, you can use RBF (Replace-By-Fee) to increase the fee and speed up confirmation."
              delay={0.2}
            />
            <FAQItem
              question="Explore"
              answer="NeetBTC features advanced capabilities including smart fee predictions using advanced algorithms, comprehensive accessibility support with screen reader compatibility, keyboard shortcuts for power users (press ? to see all shortcuts), loading skeletons for better perceived performance, and robust error handling to ensure a smooth user experience."
              delay={0.3}
            />
          </motion.div>

          {/* Easter Egg Button - Hidden at bottom */}
          <motion.div
            variants={itemVariants}
            className="mt-20 flex justify-center"
          >
            <motion.button
              onClick={() => navigate('/recommendations')}
              className="group relative px-4 py-2 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-lg border border-yellow-500/20 transition-all duration-300 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-500/20 opacity-60 hover:opacity-100"
              whileHover={{ 
                scale: 1.1,
                y: -2,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Explore recommendations"
            >
              <div className="relative z-10 flex items-center gap-2">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </motion.div>
                <span className="text-sm font-medium bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text">
                  ✨
                </span>
              </div>
            </motion.button>
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
    className="group relative p-8 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-purple-500/30 transition-all duration-500 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
    aria-label={`Go to ${title} - ${description}`}
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
        className="w-full px-8 py-6 flex justify-between items-center text-left bg-purple-900/20 group-hover:bg-purple-900/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
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
          id={`faq-answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
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