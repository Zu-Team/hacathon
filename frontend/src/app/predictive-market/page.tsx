'use client';

import { useState, useEffect } from 'react';

interface MarketPrediction {
  asset: string;
  current_price: number;
  predicted_price: number;
  forecast_change: number;
  confidence: number;
  risk_level: 'low' | 'medium' | 'high';
  sentiment_score: number;
  recommendation: 'BUY' | 'HOLD' | 'SELL';
  sector: string;
}

interface MacroIndicator {
  name: string;
  current_value: number;
  trend: 'up' | 'down' | 'stable';
  impact: 'positive' | 'negative' | 'neutral';
  prediction_7d: number;
}

interface SentimentData {
  company: string;
  sentiment_score: number;
  trending_topics: string[];
  news_impact: 'positive' | 'negative' | 'neutral';
  social_mentions: number;
  sector: string;
}

interface Opportunity {
  sector: string;
  growth_potential: number;
  risk_level: number;
  sentiment_momentum: number;
  liquidity: number;
  gap_detected: boolean;
  suggested_action: string;
}

interface MarketNews {
  headline: string;
  impact: 'positive' | 'negative' | 'neutral';
  sector: string;
  timestamp: string;
  sentiment_score: number;
}

export default function PredictiveMarketPage() {
  const [predictions, setPredictions] = useState<MarketPrediction[]>([]);
  const [macroIndicators, setMacroIndicators] = useState<MacroIndicator[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [predictionsEnabled, setPredictionsEnabled] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedScenario, setSelectedScenario] = useState<'bullish' | 'neutral' | 'bearish'>('neutral');

  const generateMarketData = async () => {
    setIsSimulating(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate market predictions
    const marketPredictions: MarketPrediction[] = [
      {
        asset: 'Tech Index',
        current_price: 12500,
        predicted_price: 13100,
        forecast_change: 4.8,
        confidence: 0.82,
        risk_level: 'medium',
        sentiment_score: 0.67,
        recommendation: 'BUY',
        sector: 'Technology'
      },
      {
        asset: 'Green Energy ETF',
        current_price: 89.5,
        predicted_price: 96.2,
        forecast_change: 7.5,
        confidence: 0.91,
        risk_level: 'low',
        sentiment_score: 0.85,
        recommendation: 'BUY',
        sector: 'Energy'
      },
      {
        asset: 'Healthcare Fund',
        current_price: 156.8,
        predicted_price: 152.1,
        forecast_change: -3.0,
        confidence: 0.74,
        risk_level: 'medium',
        sentiment_score: -0.23,
        recommendation: 'HOLD',
        sector: 'Healthcare'
      },
      {
        asset: 'Banking Sector',
        current_price: 2340,
        predicted_price: 2280,
        forecast_change: -2.6,
        confidence: 0.68,
        risk_level: 'high',
        sentiment_score: -0.45,
        recommendation: 'SELL',
        sector: 'Financial'
      },
      {
        asset: 'ESG Bonds',
        current_price: 102.3,
        predicted_price: 107.8,
        forecast_change: 5.4,
        confidence: 0.88,
        risk_level: 'low',
        sentiment_score: 0.72,
        recommendation: 'BUY',
        sector: 'Fixed Income'
      }
    ];

    // Generate macro indicators
    const macroData: MacroIndicator[] = [
      {
        name: 'Inflation Rate',
        current_value: 3.1,
        trend: 'down',
        impact: 'positive',
        prediction_7d: 2.9
      },
      {
        name: 'Interest Rate',
        current_value: 5.25,
        trend: 'stable',
        impact: 'neutral',
        prediction_7d: 5.25
      },
      {
        name: 'GDP Growth',
        current_value: 2.3,
        trend: 'up',
        impact: 'positive',
        prediction_7d: 2.5
      },
      {
        name: 'Unemployment',
        current_value: 3.8,
        trend: 'stable',
        impact: 'positive',
        prediction_7d: 3.7
      }
    ];

    // Generate sentiment data
    const sentimentInfo: SentimentData[] = [
      {
        company: 'TechCorp',
        sentiment_score: 0.67,
        trending_topics: ['AI breakthrough', 'Q4 earnings beat'],
        news_impact: 'positive',
        social_mentions: 15420,
        sector: 'Technology'
      },
      {
        company: 'GreenPower Inc',
        sentiment_score: 0.85,
        trending_topics: ['solar expansion', 'government contracts'],
        news_impact: 'positive',
        social_mentions: 8930,
        sector: 'Energy'
      },
      {
        company: 'MediBank',
        sentiment_score: -0.45,
        trending_topics: ['regulatory concerns', 'loan defaults'],
        news_impact: 'negative',
        social_mentions: 12650,
        sector: 'Financial'
      },
      {
        company: 'HealthTech',
        sentiment_score: -0.23,
        trending_topics: ['FDA delays', 'competition'],
        news_impact: 'negative',
        social_mentions: 5670,
        sector: 'Healthcare'
      }
    ];

    // Generate opportunities
    const marketOpportunities: Opportunity[] = [
      {
        sector: 'Green Energy',
        growth_potential: 9.2,
        risk_level: 3.1,
        sentiment_momentum: 8.5,
        liquidity: 7.8,
        gap_detected: true,
        suggested_action: 'Launch ESG Fund'
      },
      {
        sector: 'AI & Robotics',
        growth_potential: 12.4,
        risk_level: 6.2,
        sentiment_momentum: 9.1,
        liquidity: 8.9,
        gap_detected: false,
        suggested_action: 'Increase allocation'
      },
      {
        sector: 'Healthcare Tech',
        growth_potential: 7.8,
        risk_level: 4.3,
        sentiment_momentum: 6.7,
        liquidity: 6.5,
        gap_detected: true,
        suggested_action: 'Create specialized fund'
      },
      {
        sector: 'Fintech',
        growth_potential: 8.9,
        risk_level: 5.7,
        sentiment_momentum: 7.2,
        liquidity: 9.1,
        gap_detected: false,
        suggested_action: 'Monitor for entry'
      }
    ];

    // Generate market news
    const newsData: MarketNews[] = [
      {
        headline: 'Federal Reserve signals potential rate cut in Q2',
        impact: 'positive',
        sector: 'All',
        timestamp: new Date().toISOString(),
        sentiment_score: 0.72
      },
      {
        headline: 'Tech giants report strong AI revenue growth',
        impact: 'positive',
        sector: 'Technology',
        timestamp: new Date().toISOString(),
        sentiment_score: 0.85
      },
      {
        headline: 'Banking sector faces new regulatory scrutiny',
        impact: 'negative',
        sector: 'Financial',
        timestamp: new Date().toISOString(),
        sentiment_score: -0.45
      },
      {
        headline: 'Green energy investments surge 40% this quarter',
        impact: 'positive',
        sector: 'Energy',
        timestamp: new Date().toISOString(),
        sentiment_score: 0.91
      }
    ];

    setPredictions(marketPredictions);
    setMacroIndicators(macroData);
    setSentimentData(sentimentInfo);
    setOpportunities(marketOpportunities);
    setMarketNews(newsData);
    
    setIsSimulating(false);
  };

  useEffect(() => {
    generateMarketData();
  }, []);

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-400 bg-green-900/30';
    if (score < -0.3) return 'text-red-400 bg-red-900/30';
    return 'text-yellow-400 bg-yellow-900/30';
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'text-green-400 bg-green-900/30';
      case 'HOLD': return 'text-yellow-400 bg-yellow-900/30';
      case 'SELL': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const exportToN8n = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      scenario: selectedScenario,
      predictions_enabled: predictionsEnabled,
      market_predictions: predictions,
      macro_indicators: macroIndicators,
      sentiment_analysis: sentimentData,
      opportunities: opportunities,
      market_news: marketNews,
      export_format: "n8n_workflow_compatible"
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  const sectors = ['All', 'Technology', 'Energy', 'Healthcare', 'Financial', 'Fixed Income'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-magenta-500/10"></div>
        <div className="relative bg-black/40 backdrop-blur-sm border-b border-teal-500/30 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-magenta-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <span className="text-3xl">🧠</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-magenta-400 bg-clip-text text-transparent">
                      Smart Investment Analyst
                    </h1>
                    <p className="text-gray-300 text-lg mt-2">See the Future of Markets Before It Happens</p>
                  </div>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Predictive insights powered by real-time data streams, AI analysis, and market sentiment tracking 
                  to identify investment opportunities and risks before they impact your portfolio.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={generateMarketData}
                    disabled={isSimulating}
                    className="px-8 py-4 bg-gradient-to-r from-teal-600 to-magenta-600 hover:from-teal-700 hover:to-magenta-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    {isSimulating ? 'Analyzing Markets...' : 'Simulate Market'}
                  </button>
                  <button
                    onClick={() => setPredictionsEnabled(!predictionsEnabled)}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      predictionsEnabled 
                        ? 'bg-gradient-to-r from-teal-600 to-magenta-600 text-white shadow-lg' 
                        : 'bg-gray-800/50 text-gray-300 border border-gray-600'
                    }`}
                  >
                    {predictionsEnabled ? 'Predictions ON' : 'Predictions OFF'}
                  </button>
                </div>
              </div>
              
              {/* AI Brain Visualization */}
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-900/30 to-magenta-900/30 rounded-2xl p-8 border border-teal-500/30 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 bg-gradient-to-r from-teal-500 to-magenta-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <span className="text-6xl">🔮</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-sm">📈</span>
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-sm">📊</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">Predictive AI Brain</h3>
                    <p className="text-gray-300 mb-6">
                      Real-time analysis of market data, news sentiment, and economic indicators
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-2xl mb-2">📰</div>
                        <div className="text-sm text-gray-400">News Analysis</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-2xl mb-2">💬</div>
                        <div className="text-sm text-gray-400">Social Sentiment</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-2xl mb-2">📊</div>
                        <div className="text-sm text-gray-400">Market Data</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="text-sm text-gray-400">Predictions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  selectedSector === sector
                    ? 'bg-gradient-to-r from-teal-600 to-magenta-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {(['bearish', 'neutral', 'bullish'] as const).map((scenario) => (
              <button
                key={scenario}
                onClick={() => setSelectedScenario(scenario)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  selectedScenario === scenario
                    ? 'bg-gradient-to-r from-teal-600 to-magenta-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
                }`}
              >
                {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Market Predictions Dashboard */}
        {predictions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Market Predictions Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {predictions
                .filter(p => selectedSector === 'All' || p.sector === selectedSector)
                .map((prediction, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{prediction.asset}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRecommendationColor(prediction.recommendation)}`}>
                      {prediction.recommendation}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Price</span>
                      <span className="text-white font-semibold">${prediction.current_price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Predicted Price</span>
                      <span className="text-white font-semibold">${prediction.predicted_price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Forecast Change</span>
                      <span className={`font-semibold ${prediction.forecast_change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {prediction.forecast_change > 0 ? '+' : ''}{prediction.forecast_change.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence</span>
                      <span className="text-teal-400 font-semibold">{(prediction.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk Level</span>
                      <span className={`font-semibold ${getRiskColor(prediction.risk_level)}`}>
                        {prediction.risk_level.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sentiment</span>
                      <span className={`font-semibold ${prediction.sentiment_score > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {prediction.sentiment_score > 0 ? '+' : ''}{prediction.sentiment_score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Macro Indicators */}
        {macroIndicators.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Macro-Economic Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {macroIndicators.map((indicator, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-2">{indicator.name}</h3>
                  <div className="text-3xl font-bold text-teal-400 mb-2">{indicator.current_value}%</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      indicator.impact === 'positive' ? 'text-green-400 bg-green-900/30' :
                      indicator.impact === 'negative' ? 'text-red-400 bg-red-900/30' :
                      'text-yellow-400 bg-yellow-900/30'
                    }`}>
                      {indicator.impact.toUpperCase()}
                    </span>
                    <span className="text-gray-400">
                      {indicator.trend === 'up' ? '📈' : indicator.trend === 'down' ? '📉' : '➡️'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    7d forecast: {indicator.prediction_7d}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sentiment Analysis */}
        {sentimentData.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Market Sentiment Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sentimentData.map((sentiment, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{sentiment.company}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSentimentColor(sentiment.sentiment_score)}`}>
                      {(sentiment.sentiment_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Social Mentions</span>
                      <span className="text-white font-semibold">{sentiment.social_mentions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">News Impact</span>
                      <span className={`font-semibold ${
                        sentiment.news_impact === 'positive' ? 'text-green-400' :
                        sentiment.news_impact === 'negative' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {sentiment.news_impact.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Trending Topics:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sentiment.trending_topics.map((topic, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunity Radar */}
        {opportunities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Investment Opportunity Radar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{opportunity.sector}</h3>
                    {opportunity.gap_detected && (
                      <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full font-semibold">
                        GAP DETECTED
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Growth Potential</span>
                      <span className="text-green-400 font-semibold">{opportunity.growth_potential}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk Level</span>
                      <span className={`font-semibold ${getRiskColor(opportunity.risk_level < 4 ? 'low' : opportunity.risk_level < 7 ? 'medium' : 'high')}`}>
                        {opportunity.risk_level}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sentiment Momentum</span>
                      <span className="text-teal-400 font-semibold">{opportunity.sentiment_momentum}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Liquidity</span>
                      <span className="text-magenta-400 font-semibold">{opportunity.liquidity}/10</span>
                    </div>
                    <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                      <div className="text-sm text-gray-300 font-medium">Suggested Action:</div>
                      <div className="text-sm text-white mt-1">{opportunity.suggested_action}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market News Ticker */}
        {marketNews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Live Market News</h2>
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-lg">🔴</span>
                  <span className="text-white font-semibold">LIVE</span>
                  <span className="text-gray-400 text-sm">Market News Feed</span>
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {marketNews.map((news, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <span className={`text-lg ${
                      news.impact === 'positive' ? 'text-green-400' :
                      news.impact === 'negative' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {news.impact === 'positive' ? '📈' : news.impact === 'negative' ? '📉' : '➡️'}
                    </span>
                    <div className="flex-1">
                      <div className="text-white font-medium">{news.headline}</div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                        <span>{news.sector}</span>
                        <span>•</span>
                        <span>{new Date(news.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span className={`${
                          news.sentiment_score > 0 ? 'text-green-400' :
                          news.sentiment_score < 0 ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          Sentiment: {news.sentiment_score > 0 ? '+' : ''}{news.sentiment_score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Export Section */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white">Export Investment Insights (n8n)</h2>
            <p className="text-gray-400">JSON payload ready for workflow automation and portfolio management</p>
          </div>
          
          <div className="p-6">
            <div className="bg-gray-900/50 rounded-xl border border-gray-600/50 overflow-hidden mb-4">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-600/50">
                <span className="text-teal-400 text-sm font-mono">market_insights.json</span>
              </div>
              <pre className="p-4 text-sm text-gray-300 overflow-x-auto max-h-64">
                {exportToN8n()}
              </pre>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportToN8n());
                  alert('Market insights copied to clipboard!');
                }}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-magenta-600 hover:from-teal-700 hover:to-magenta-700 text-white font-semibold rounded-xl transition-all duration-300"
              >
                📋 Copy JSON
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([exportToN8n()], {type: 'application/json'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `predictive-market-data-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
                className="px-6 py-3 bg-gradient-to-r from-magenta-600 to-teal-600 hover:from-magenta-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300"
              >
                💾 Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
