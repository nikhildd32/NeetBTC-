import React from 'react';
import { motion } from 'framer-motion';
import { FeeEstimator } from '../FeeEstimator';

export const DemoFees = () => {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Fee Estimator Demo</h1>
          <p className="text-xl text-gray-400">
            Live fee recommendations for different transaction priorities
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FeeEstimator />
        </motion.div>
      </div>
    </div>
  );
};