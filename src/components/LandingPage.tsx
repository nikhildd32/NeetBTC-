import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Bitcoin, Newspaper, Github, Code2, Globe, ChevronDown, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [whyRef, whyInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0118]">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0">
          <div className="absolute w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-3xl -top-96 -left-96 animate-pulse-slow"></div>
          <div className="absolute w-[600px] h-[600px] bg-purple-800/10 rounded-full blur-3xl -bottom-64 -right-64 animate-pulse-slow delay-1000"></div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-6xl mx-auto px-4 text-center"
        >
          {/* Logo and Title */}
          <motion.h1 
            variants={fadeInUp}
            className="text-8xl md:text-9xl font-bold mb-8 tracking-tight"
          >
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 text-transparent bg-clip-text animate-gradient-text">Neet</span>
            <span className="text-white">BTC</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-300 mb-16 max-w-2xl mx-auto"
          >
            Real-time Bitcoin dashboard with essential tools and live data
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="group relative px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              Create Account
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="group px-8 py-4 text-lg font-semibold text-purple-300 bg-purple-900/20 backdrop-blur-sm rounded-xl border border-purple-500/30 transition-all duration-300 hover:scale-105 hover:bg-purple-900/30 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
            >
              Look Around
            </button>
          </motion.div>

          {/* Quick Access Buttons */}
          <motion.div 
            variants={fadeInUp}
            className="grid md:grid-cols-3 gap-6"
          >
            <QuickAccessButton
              icon={<Activity className="h-6 w-6" />}
              title="Mempool"
              onClick={() => navigate('/mempool')}
            />
            <QuickAccessButton
              icon={<Bitcoin className="h-6 w-6" />}
              title="Fees"
              onClick={() => navigate('/fees')}
            />
            <QuickAccessButton
              icon={<Newspaper className="h-6 w-6" />}
              title="News"
              onClick={() => navigate('/news')}
            />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="h-8 w-8 text-purple-400" />
        </motion.div>
      </div>

      {/* Why Section */}
      <motion.div
        ref={whyRef}
        initial="hidden"
        animate={whyInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="py-32 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Why NeetBTC Exists
          </h2>
          <div className="bg-purple-900/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/20">
            <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
              Bitcoin users often need to juggle multiple websites to track mempool data,
              estimate fees, and stay updated with news. NeetBTC brings these essential
              tools together in one intuitive dashboard.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Feature
                icon={<Globe className="h-6 w-6" />}
                title="Accessibility"
                description="Making Bitcoin data accessible to everyone through a clean, intuitive interface"
              />
              <Feature
                icon={<Code2 className="h-6 w-6" />}
                title="Open Source"
                description="Transparent development and community-driven improvements"
              />
              <Feature
                icon={<Github className="h-6 w-6" />}
                title="Community"
                description="Built by Bitcoiners, for Bitcoiners"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        ref={faqRef}
        initial="hidden"
        animate={faqInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="py-32 px-4 bg-purple-900/5"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            FAQ
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="What is a mempool?"
              answer="The mempool (memory pool) is a waiting area for Bitcoin transactions that haven't yet been confirmed in a block. It's like a queue where transactions wait to be processed by miners."
            />
            <FAQItem
              question="What is sat/vB?"
              answer="Sat/vB (satoshis per virtual byte) is the fee rate for Bitcoin transactions. Higher sat/vB means higher priority and faster confirmation times, but also higher fees."
            />
            <FAQItem
              question="Why isn't my transaction confirming?"
              answer="Transactions might not confirm quickly if the fee rate is too low compared to current network demand. You can use our Fee Estimator to check recommended rates for different confirmation priorities."
            />
            <FAQItem
              question="How can I prevent a transaction from getting stuck?"
              answer="Use our Fee Estimator before sending transactions to choose an appropriate fee rate based on your desired confirmation time. Higher fee rates generally mean faster confirmations."
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const QuickAccessButton = ({ icon, title, onClick }: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="group flex items-center justify-center gap-3 px-6 py-4 bg-purple-900/20 backdrop-blur-sm rounded-xl border border-purple-500/30 transition-all duration-300 hover:scale-105 hover:bg-purple-900/30 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
  >
    <span className="text-purple-400 group-hover:text-purple-300 transition-colors">
      {icon}
    </span>
    <span className="text-lg font-medium text-purple-100">{title}</span>
  </button>
);

const Feature = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]">
    <div className="text-purple-400 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-purple-100">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-purple-500/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center text-left bg-purple-900/20 hover:bg-purple-900/30 transition-colors"
      >
        <span className="text-lg font-medium text-purple-100">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-purple-400" />
        </motion.div>
      </button>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 bg-purple-900/10 text-gray-300">
          {answer}
        </div>
      </motion.div>
    </div>
  );
};