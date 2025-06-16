import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { MempoolTracker } from './components/MempoolTracker';
import { FeeEstimator } from './components/FeeEstimator';
import { NewsAggregator } from './components/NewsAggregator';
import { Recommendations } from './components/Recommendations';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0A0118] text-white">
        <Header />
        <main id="main-content" role="main">
          <Routes>
            <Route path="/" element={
              <ErrorBoundary>
                <LandingPage />
              </ErrorBoundary>
            } />
            <Route path="/mempool" element={
              <ErrorBoundary>
                <MempoolTracker />
              </ErrorBoundary>
            } />
            <Route path="/fees" element={
              <ErrorBoundary>
                <FeeEstimator />
              </ErrorBoundary>
            } />
            <Route path="/news" element={
              <ErrorBoundary>
                <NewsAggregator />
              </ErrorBoundary>
            } />
            <Route path="/recommendations" element={
              <ErrorBoundary>
                <Recommendations />
              </ErrorBoundary>
            } />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;