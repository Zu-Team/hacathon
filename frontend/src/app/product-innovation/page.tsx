'use client';

import { useState, useEffect } from 'react';

interface CustomerData {
  segment: string;
  needs: string[];
  pain_points: string[];
  behavior_score: number;
  market_size: number;
}

interface MarketTrend {
  trend: string;
  impact: 'high' | 'medium' | 'low';
  growth_rate: number;
  technology_readiness: number;
  regulatory_status: 'clear' | 'pending' | 'restricted';
}

interface CompetitorProduct {
  company: string;
  product: string;
  strengths: string[];
  weaknesses: string[];
  market_share: number;
  feature_gaps: string[];
}

interface ProductConcept {
  name: string;
  description: string;
  key_features: string[];
  target_segment: string;
  compliance_check: 'pass' | 'fail' | 'pending';
  confidence: number;
  adoption_likelihood: number;
  cost_to_build: number;
  regulatory_risk: 'low' | 'medium' | 'high';
  roi_potential: number;
}

interface MarketGap {
  gap_name: string;
  customer_demand: number;
  market_size: number;
  competition_level: 'low' | 'medium' | 'high';
  opportunity_score: number;
}

interface CustomerFeedback {
  product: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  feedback_text: string;
  rating: number;
  demographic: string;
}

interface SimulationResult {
  adoption_curve: { month: number; adoption_rate: number }[];
  roi_forecast: { quarter: number; roi: number }[];
  risk_reward_score: number;
  market_fit: number;
}

export default function ProductInnovationPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [productConcepts, setProductConcepts] = useState<ProductConcept[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [competitorProducts, setCompetitorProducts] = useState<CompetitorProduct[]>([]);
  const [marketGaps, setMarketGaps] = useState<MarketGap[]>([]);
  const [customerFeedback, setCustomerFeedback] = useState<CustomerFeedback[]>([]);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [scenario, setScenario] = useState<'optimistic' | 'neutral' | 'pessimistic'>('neutral');
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);

  const availableFeatures = [
    'AI-Powered Recommendations',
    'Biometric Authentication',
    'Real-time Notifications',
    'Social Trading',
    'ESG Integration',
    'Micro-Investing',
    'Gamification',
    'Voice Banking',
    'AR/VR Interface',
    'Blockchain Integration'
  ];

  const generateInnovationData = async () => {
    setIsSimulating(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate customer data
    const customerInfo: CustomerData[] = [
      {
        segment: 'Gen Z (18-26)',
        needs: ['Mobile-first experience', 'Social features', 'Sustainability focus'],
        pain_points: ['Complex interfaces', 'High fees', 'Slow onboarding'],
        behavior_score: 8.5,
        market_size: 15.2
      },
      {
        segment: 'Millennials (27-42)',
        needs: ['Investment tools', 'Financial planning', 'Flexible banking'],
        pain_points: ['Limited investment options', 'Poor customer service', 'Inflexible terms'],
        behavior_score: 7.8,
        market_size: 28.4
      },
      {
        segment: 'Gen X (43-58)',
        needs: ['Security features', 'Traditional banking', 'Retirement planning'],
        pain_points: ['Technology complexity', 'Digital security concerns', 'Limited personalization'],
        behavior_score: 6.2,
        market_size: 22.1
      }
    ];

    // Generate market trends
    const trends: MarketTrend[] = [
      {
        trend: 'AI-Powered Personal Finance',
        impact: 'high',
        growth_rate: 85,
        technology_readiness: 90,
        regulatory_status: 'clear'
      },
      {
        trend: 'Sustainable Finance',
        impact: 'high',
        growth_rate: 72,
        technology_readiness: 75,
        regulatory_status: 'clear'
      },
      {
        trend: 'Social Trading Platforms',
        impact: 'medium',
        growth_rate: 58,
        technology_readiness: 80,
        regulatory_status: 'pending'
      },
      {
        trend: 'Voice Banking',
        impact: 'medium',
        growth_rate: 45,
        technology_readiness: 65,
        regulatory_status: 'clear'
      }
    ];

    // Generate competitor data
    const competitors: CompetitorProduct[] = [
      {
        company: 'FinTechCorp',
        product: 'Digital Wallet Pro',
        strengths: ['User-friendly interface', 'Fast transactions', 'Low fees'],
        weaknesses: ['Limited features', 'Poor customer support', 'Security concerns'],
        market_share: 12.5,
        feature_gaps: ['AI recommendations', 'Social features', 'ESG integration']
      },
      {
        company: 'BankTech Solutions',
        product: 'Smart Banking App',
        strengths: ['Advanced security', 'Comprehensive features', 'Good support'],
        weaknesses: ['Complex interface', 'High fees', 'Slow updates'],
        market_share: 18.3,
        feature_gaps: ['Mobile-first design', 'Gamification', 'Voice commands']
      }
    ];

    // Generate market gaps
    const gaps: MarketGap[] = [
      {
        gap_name: 'AI-Powered Green Savings',
        customer_demand: 8.7,
        market_size: 12.4,
        competition_level: 'low',
        opportunity_score: 9.2
      },
      {
        gap_name: 'Gen-Z Social Investment Platform',
        customer_demand: 9.1,
        market_size: 8.9,
        competition_level: 'medium',
        opportunity_score: 8.8
      },
      {
        gap_name: 'Voice-Activated Banking',
        customer_demand: 6.8,
        market_size: 15.2,
        competition_level: 'low',
        opportunity_score: 7.5
      }
    ];

    // Generate customer feedback
    const feedback: CustomerFeedback[] = [
      {
        product: 'AI-Powered Green Savings',
        sentiment: 'positive',
        feedback_text: 'Love the eco-friendly rewards! Finally a bank that aligns with my values.',
        rating: 4.8,
        demographic: 'Gen Z'
      },
      {
        product: 'Social Investment Platform',
        sentiment: 'positive',
        feedback_text: 'Great concept but needs better security features and lower fees.',
        rating: 4.2,
        demographic: 'Millennial'
      },
      {
        product: 'Voice Banking Assistant',
        sentiment: 'neutral',
        feedback_text: 'Convenient but sometimes misunderstands commands. Needs improvement.',
        rating: 3.5,
        demographic: 'Gen X'
      }
    ];

    setCustomerData(customerInfo);
    setMarketTrends(trends);
    setCompetitorProducts(competitors);
    setMarketGaps(gaps);
    setCustomerFeedback(feedback);
    
    setIsSimulating(false);
  };

  const generateProductConcepts = () => {
    const concepts: ProductConcept[] = [
      {
        name: 'AI-Powered Green Savings Account',
        description: 'Sustainable savings account with AI-driven eco-friendly rewards and carbon footprint tracking',
        key_features: ['Eco-linked rewards', 'Carbon tracking', 'AI recommendations', 'Mobile-first design'],
        target_segment: 'Gen Z & Millennials',
        compliance_check: 'pass',
        confidence: 82,
        adoption_likelihood: 75,
        cost_to_build: 6.5,
        regulatory_risk: 'low',
        roi_potential: 18.5
      },
      {
        name: 'Social Investment Hub',
        description: 'Community-driven investment platform with social features and peer learning',
        key_features: ['Social trading', 'Peer insights', 'Gamification', 'Educational content'],
        target_segment: 'Gen Z',
        compliance_check: 'pending',
        confidence: 78,
        adoption_likelihood: 68,
        cost_to_build: 8.2,
        regulatory_risk: 'medium',
        roi_potential: 22.1
      },
      {
        name: 'Voice Banking Assistant',
        description: 'Hands-free banking with AI voice assistant for all financial operations',
        key_features: ['Voice commands', 'Natural language processing', 'Multi-language support', 'Smart reminders'],
        target_segment: 'All ages',
        compliance_check: 'pass',
        confidence: 71,
        adoption_likelihood: 55,
        cost_to_build: 7.8,
        regulatory_risk: 'low',
        roi_potential: 15.3
      }
    ];

    setProductConcepts(concepts);
    
    // Generate simulation results
    const simulations: SimulationResult[] = concepts.map(concept => ({
      adoption_curve: Array.from({length: 12}, (_, i) => ({
        month: i + 1,
        adoption_rate: Math.min(concept.adoption_likelihood * (1 + i * 0.1), 100)
      })),
      roi_forecast: Array.from({length: 4}, (_, i) => ({
        quarter: i + 1,
        roi: concept.roi_potential * (0.5 + i * 0.2)
      })),
      risk_reward_score: (concept.roi_potential / concept.cost_to_build) * 10,
      market_fit: concept.adoption_likelihood * 0.8
    }));

    setSimulationResults(simulations);
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-400 bg-green-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'low': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-400 bg-green-900/30';
      case 'pending': return 'text-yellow-400 bg-yellow-900/30';
      case 'fail': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'neutral': return 'text-yellow-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const exportToN8n = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      scenario: scenario,
      product_concepts: productConcepts.map(concept => ({
        name: concept.name,
        features: concept.key_features,
        target_segment: concept.target_segment,
        confidence: concept.confidence / 100,
        simulation: {
          adoption_rate: `${concept.adoption_likelihood}% year1`,
          roi: `+${concept.roi_potential}%`,
          risk_level: concept.regulatory_risk
        }
      })),
      market_gaps: marketGaps.map(gap => gap.gap_name),
      recommendations: [
        'Proceed to MVP build for Green Savings Account',
        'Run pilot test for Social Investment Hub in Q2',
        'Continue research on Voice Banking market fit'
      ],
      selected_features: selectedFeatures,
      customer_insights: customerData,
      market_trends: marketTrends,
      competitor_analysis: competitorProducts
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  useEffect(() => {
    generateInnovationData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10"></div>
        <div className="relative bg-black/40 backdrop-blur-sm border-b border-cyan-500/30 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <span className="text-3xl">💡</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Smart Product Innovator
                    </h1>
                    <p className="text-gray-300 text-lg mt-2">Design the Future of Financial Services</p>
                  </div>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Our AI-powered innovation lab analyzes customer needs, market trends, and competitor gaps 
                  to generate breakthrough financial product concepts with real-time market simulation.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={generateInnovationData}
                    disabled={isSimulating}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    {isSimulating ? 'Analyzing Market...' : 'Simulate Innovation'}
                  </button>
                </div>
              </div>
              
              {/* Innovation Lab Visualization */}
              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-2xl p-8 border border-cyan-500/30 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <span className="text-6xl">🧪</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-sm">⚡</span>
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-sm">🔬</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">Innovation Lab</h3>
                    <p className="text-gray-300 mb-6">
                      AI-powered ideation, market analysis, and product simulation
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="text-sm text-gray-400">Gap Analysis</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-2xl mb-2">🔮</div>
                        <div className="text-sm text-gray-400">Market Simulation</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-2xl mb-2">💬</div>
                        <div className="text-sm text-gray-400">Customer Insights</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <div className="text-2xl mb-2">🚀</div>
                        <div className="text-sm text-gray-400">Product Launch</div>
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
          <div className="flex gap-2">
            {(['optimistic', 'neutral', 'pessimistic'] as const).map((scenarioType) => (
              <button
                key={scenarioType}
                onClick={() => setScenario(scenarioType)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  scenario === scenarioType
                    ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
                }`}
              >
                {scenarioType.charAt(0).toUpperCase() + scenarioType.slice(1)}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowGapAnalysis(!showGapAnalysis)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300"
          >
            {showGapAnalysis ? 'Hide Gap Analysis' : 'Show Market Gaps'}
          </button>
        </div>

        {/* Market Gap Analysis */}
        {showGapAnalysis && marketGaps.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Market Gap Discovery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketGaps.map((gap, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{gap.gap_name}</h3>
                    <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full font-semibold">
                      OPPORTUNITY
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Customer Demand</span>
                      <span className="text-cyan-400 font-semibold">{gap.customer_demand}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Market Size</span>
                      <span className="text-purple-400 font-semibold">${gap.market_size}B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Competition</span>
                      <span className={`font-semibold ${
                        gap.competition_level === 'low' ? 'text-green-400' :
                        gap.competition_level === 'medium' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {gap.competition_level.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Opportunity Score</span>
                      <span className="text-pink-400 font-semibold">{gap.opportunity_score}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Concepts */}
        {productConcepts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Product Ideation Engine</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {productConcepts.map((concept, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{concept.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getComplianceColor(concept.compliance_check)}`}>
                      {concept.compliance_check.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{concept.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Key Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {concept.key_features.map((feature, i) => (
                          <span key={i} className="px-2 py-1 bg-cyan-900/30 text-cyan-400 text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">{concept.confidence}%</div>
                        <div className="text-xs text-gray-400">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{concept.adoption_likelihood}%</div>
                        <div className="text-xs text-gray-400">Adoption</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Target: {concept.target_segment}</span>
                      <span className={`font-semibold ${
                        concept.regulatory_risk === 'low' ? 'text-green-400' :
                        concept.regulatory_risk === 'medium' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {concept.regulatory_risk.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature Design Simulator */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Feature Design Simulator</h2>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Available Features</h3>
                <div className="space-y-3">
                  {availableFeatures.map((feature, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                      />
                      <span className="text-gray-300">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Impact Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Market Fit Score</span>
                      <span className="text-cyan-400 font-semibold">
                        {selectedFeatures.length > 0 ? Math.min(85 + selectedFeatures.length * 2, 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{width: `${Math.min(85 + selectedFeatures.length * 2, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Development Cost</span>
                      <span className="text-purple-400 font-semibold">
                        ${(selectedFeatures.length * 1.5 + 5).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Regulatory Risk</span>
                      <span className={`font-semibold ${
                        selectedFeatures.includes('Blockchain Integration') ? 'text-red-400' :
                        selectedFeatures.includes('Biometric Authentication') ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {selectedFeatures.includes('Blockchain Integration') ? 'HIGH' :
                         selectedFeatures.includes('Biometric Authentication') ? 'MEDIUM' :
                         'LOW'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Feedback */}
        {customerFeedback.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Customer Feedback Emulator</h2>
            <div className="space-y-4">
              {customerFeedback.map((feedback, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{feedback.product}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-400">{feedback.demographic}</span>
                        <div className="flex">
                          {Array.from({length: 5}).map((_, i) => (
                            <span key={i} className={`text-lg ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      feedback.sentiment === 'positive' ? 'text-green-400 bg-green-900/30' :
                      feedback.sentiment === 'negative' ? 'text-red-400 bg-red-900/30' :
                      'text-yellow-400 bg-yellow-900/30'
                    }`}>
                      {feedback.sentiment.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 italic">"{feedback.feedback_text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Section */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white">Export Innovation Insights (n8n)</h2>
            <p className="text-gray-400">JSON payload ready for product development workflow automation</p>
          </div>
          
          <div className="p-6">
            <div className="bg-gray-900/50 rounded-xl border border-gray-600/50 overflow-hidden mb-4">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-600/50">
                <span className="text-cyan-400 text-sm font-mono">innovation_insights.json</span>
              </div>
              <pre className="p-4 text-sm text-gray-300 overflow-x-auto max-h-64">
                {exportToN8n()}
              </pre>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportToN8n());
                  alert('Innovation insights copied to clipboard!');
                }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300"
              >
                📋 Copy JSON
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([exportToN8n()], {type: 'application/json'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `product-innovation-data-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300"
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
