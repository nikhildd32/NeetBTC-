interface HistoricalFeeData {
  timestamp: number;
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  mempoolSize: number;
  pendingTxs: number;
  blockHeight: number;
}

interface FeePrediction {
  nextHour: {
    low: number;
    medium: number;
    high: number;
    confidence: number;
  };
  next6Hours: {
    low: number;
    medium: number;
    high: number;
    confidence: number;
  };
  next24Hours: {
    low: number;
    medium: number;
    high: number;
    confidence: number;
  };
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: string[];
  lastUpdated: number;
}

class AIFeePredictionService {
  private historicalData: HistoricalFeeData[] = [];
  private readonly MAX_HISTORY = 1000; // Keep last 1000 data points
  private readonly STORAGE_KEY = 'neetbtc_fee_history';

  constructor() {
    this.loadHistoricalData();
  }

  private loadHistoricalData() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.historicalData = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading historical fee data:', error);
    }
  }

  private saveHistoricalData() {
    try {
      // Keep only the most recent data points
      if (this.historicalData.length > this.MAX_HISTORY) {
        this.historicalData = this.historicalData.slice(-this.MAX_HISTORY);
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.historicalData));
    } catch (error) {
      console.error('Error saving historical fee data:', error);
    }
  }

  public addDataPoint(data: Omit<HistoricalFeeData, 'timestamp'>) {
    const dataPoint: HistoricalFeeData = {
      ...data,
      timestamp: Date.now()
    };

    // Avoid duplicate timestamps
    const lastPoint = this.historicalData[this.historicalData.length - 1];
    if (!lastPoint || dataPoint.timestamp - lastPoint.timestamp > 60000) { // 1 minute minimum
      this.historicalData.push(dataPoint);
      this.saveHistoricalData();
    }
  }

  private calculateMovingAverage(values: number[], window: number): number {
    if (values.length < window) return values.reduce((a, b) => a + b, 0) / values.length;
    
    const recent = values.slice(-window);
    return recent.reduce((a, b) => a + b, 0) / recent.length;
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 3) return 'stable';

    const recent = values.slice(-6); // Last 6 data points
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const change = (secondAvg - firstAvg) / firstAvg;

    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private predictWithLinearRegression(values: number[], periods: number): number {
    if (values.length < 3) return values[values.length - 1] || 0;

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const prediction = slope * (n + periods - 1) + intercept;
    return Math.max(1, prediction); // Ensure minimum fee of 1 sat/vB
  }

  private getConfidenceScore(dataPoints: number, volatility: number, trend: string): number {
    let confidence = 0.5; // Base confidence

    // More data points = higher confidence
    confidence += Math.min(dataPoints / 100, 0.3);

    // Lower volatility = higher confidence
    confidence += Math.max(0, 0.2 - volatility / 100);

    // Stable trends = higher confidence
    if (trend === 'stable') confidence += 0.1;

    return Math.min(0.95, Math.max(0.1, confidence));
  }

  private identifyFactors(current: HistoricalFeeData, historical: HistoricalFeeData[]): string[] {
    const factors: string[] = [];

    if (historical.length < 5) {
      factors.push('Limited historical data');
      return factors;
    }

    const recentData = historical.slice(-10);
    const avgMempoolSize = recentData.reduce((a, b) => a + b.mempoolSize, 0) / recentData.length;
    const avgPendingTxs = recentData.reduce((a, b) => a + b.pendingTxs, 0) / recentData.length;

    // Mempool congestion
    if (current.mempoolSize > avgMempoolSize * 1.5) {
      factors.push('High mempool congestion');
    } else if (current.mempoolSize < avgMempoolSize * 0.7) {
      factors.push('Low mempool congestion');
    }

    // Transaction volume
    if (current.pendingTxs > avgPendingTxs * 1.3) {
      factors.push('High transaction volume');
    } else if (current.pendingTxs < avgPendingTxs * 0.8) {
      factors.push('Low transaction volume');
    }

    // Time-based patterns
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 17) {
      factors.push('Business hours activity');
    } else if (hour >= 22 || hour <= 6) {
      factors.push('Low activity period');
    }

    // Weekend effect
    const day = new Date().getDay();
    if (day === 0 || day === 6) {
      factors.push('Weekend trading patterns');
    }

    // Fee level assessment
    if (current.fastestFee > 50) {
      factors.push('High fee environment');
    } else if (current.fastestFee < 10) {
      factors.push('Low fee environment');
    }

    return factors;
  }

  public generatePrediction(): FeePrediction | null {
    if (this.historicalData.length < 3) {
      return null; // Need at least 3 data points
    }

    const current = this.historicalData[this.historicalData.length - 1];
    const fastestFees = this.historicalData.map(d => d.fastestFee);
    const halfHourFees = this.historicalData.map(d => d.halfHourFee);
    const hourFees = this.historicalData.map(d => d.hourFee);

    const trend = this.calculateTrend(fastestFees);
    const volatility = this.calculateVolatility(fastestFees);
    const confidence = this.getConfidenceScore(this.historicalData.length, volatility, trend);

    // Predict for different time horizons
    const nextHourFastest = this.predictWithLinearRegression(fastestFees, 2);
    const nextHourMedium = this.predictWithLinearRegression(halfHourFees, 2);
    const nextHourLow = this.predictWithLinearRegression(hourFees, 2);

    const next6HoursFastest = this.predictWithLinearRegression(fastestFees, 12);
    const next6HoursMedium = this.predictWithLinearRegression(halfHourFees, 12);
    const next6HoursLow = this.predictWithLinearRegression(hourFees, 12);

    const next24HoursFastest = this.predictWithLinearRegression(fastestFees, 48);
    const next24HoursMedium = this.predictWithLinearRegression(halfHourFees, 48);
    const next24HoursLow = this.predictWithLinearRegression(hourFees, 48);

    // Apply trend adjustments
    const trendMultiplier = trend === 'increasing' ? 1.1 : trend === 'decreasing' ? 0.9 : 1.0;

    const factors = this.identifyFactors(current, this.historicalData);

    return {
      nextHour: {
        high: Math.round(nextHourFastest * trendMultiplier),
        medium: Math.round(nextHourMedium * trendMultiplier),
        low: Math.round(nextHourLow * trendMultiplier),
        confidence: confidence
      },
      next6Hours: {
        high: Math.round(next6HoursFastest * trendMultiplier),
        medium: Math.round(next6HoursMedium * trendMultiplier),
        low: Math.round(next6HoursLow * trendMultiplier),
        confidence: confidence * 0.9 // Slightly lower confidence for longer predictions
      },
      next24Hours: {
        high: Math.round(next24HoursFastest * trendMultiplier),
        medium: Math.round(next24HoursMedium * trendMultiplier),
        low: Math.round(next24HoursLow * trendMultiplier),
        confidence: confidence * 0.8 // Lower confidence for 24h predictions
      },
      trend,
      factors,
      lastUpdated: Date.now()
    };
  }

  public getHistoricalDataCount(): number {
    return this.historicalData.length;
  }

  public clearHistory() {
    this.historicalData = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const aiFeePredictionService = new AIFeePredictionService();
export type { FeePrediction, HistoricalFeeData };