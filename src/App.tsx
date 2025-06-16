import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { MempoolTracker } from './components/MempoolTracker';
import { FeeEstimator } from './components/FeeEstimator';
import { NewsAggregator } from './components/NewsAggregator';
import { Recommendations } from './components/Recommendations';

function App() {
  return (
    <div className="min-h-screen bg-[#0A0118] text-white">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mempool" element={<MempoolTracker />} />
        <Route path="/fees" element={<FeeEstimator />} />
        <Route path="/news" element={<NewsAggregator />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </div>
  );
}

export default App;