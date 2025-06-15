import React from 'react';
import { MempoolTracker } from './MempoolTracker';
import { FeeEstimator } from './FeeEstimator';
import { NewsAggregator } from './NewsAggregator';

export const Dashboard = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section id="mempool">
            <MempoolTracker />
          </section>
          <section id="news">
            <NewsAggregator />
          </section>
        </div>
        <div className="space-y-8">
          <section id="fees">
            <FeeEstimator />
          </section>
        </div>
      </div>
    </main>
  );
};