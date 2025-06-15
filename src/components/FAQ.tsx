import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const FAQ = () => {
  const faqs = [
    {
      question: "What is a mempool?",
      answer: "The mempool (memory pool) is a waiting area for Bitcoin transactions that haven't yet been confirmed in a block. It's like a queue where transactions wait to be processed by miners."
    },
    {
      question: "What is sat/vB?",
      answer: "Sat/vB (satoshis per virtual byte) is the fee rate for Bitcoin transactions. Higher sat/vB means higher priority and faster confirmation times, but also higher fees."
    },
    {
      question: "Why isn't my transaction confirming?",
      answer: "Transactions might not confirm quickly if the fee rate is too low compared to current network demand. You can use our Fee Estimator to check recommended rates for different confirmation priorities."
    },
    {
      question: "How can I prevent a transaction from getting stuck?",
      answer: "Use our Fee Estimator before sending transactions to choose an appropriate fee rate based on your desired confirmation time. Higher fee rates generally mean faster confirmations."
    },
    {
      question: "How can I look up a transaction?",
      answer: "Enter your transaction ID (TXID) in our Mempool Tracker to view its current status, including confirmation progress and fee information."
    }
  ];

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div
      initial={false}
      className="border border-gray-700 rounded-lg overflow-hidden"
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center text-left bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
      >
        <span className="text-lg font-medium">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-purple-400" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-800/30 text-gray-300">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};