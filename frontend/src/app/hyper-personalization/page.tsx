'use client';

import { useState, useEffect, useRef } from 'react';
import customersData from '../fake-data/customers.json';

interface CustomerProfile {
  id: string;
  name: string;
  segment: string;
  consent: boolean;
  account_balance: number;
  monthly_income: number;
  spend_categories: {
    travel: number;
    shopping: number;
      groceries: number;
    bills: number;
      entertainment: number;
  };
  digital_usage: {
    app_logins: number;
    notifications_enabled: boolean;
  };
  complaints: number;
  nps: number;
  churn_risk: number;
  missed_payments: number;
}

interface PersonalizedRecommendation {
  customer_id: string;
  recommended_product: {
    type: 'savings_account' | 'investment_portfolio' | 'loan' | 'credit_card' | 'insurance' | 'financial_advice';
    name: string;
    description: string;
    benefits: string[];
    estimated_return?: number;
    interest_rate?: number;
  };
  communication_channel: 'app' | 'sms' | 'email' | 'phone' | 'branch';
  personalized_message: {
    subject: string;
    content: string;
    call_to_action: string;
    urgency_level: 'low' | 'medium' | 'high';
  };
  proactive_advice: {
    spending_alert?: string;
    savings_tip?: string;
    investment_opportunity?: string;
    risk_warning?: string;
  };
  predicted_satisfaction: number;
  confidence_score: number;
  next_best_action: string;
}

export default function HyperPersonalizationPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [exportData, setExportData] = useState<any>(null);
  const [dataSource, setDataSource] = useState<'gemini' | 'simulated'>('simulated');
  const [filterType, setFilterType] = useState<'all' | 'high_spender' | 'low_engagement' | 'high_engagement'>('all');
  const [showLifeEventSimulator, setShowLifeEventSimulator] = useState(false);

  // Load local data on component mount
  useEffect(() => {
    const loadLocalData = () => {
      try {
        console.log('Loading customers from local JSON data...');
        setCustomers(customersData as unknown as CustomerProfile[]);
        setDataSource('simulated');
        console.log('Successfully loaded customers from local data!');
      } catch (error) {
        console.error('Error loading customers:', error);
        setCustomers([]);
      }
    };

    loadLocalData();
  }, []);

  const generateCustomerData = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate exactly 12 diverse customer profiles for a hyper-personalization banking system. Return ONLY a valid JSON array with this exact structure:

[
  {
    "id": "CUST-2025-001",
    "name": "Sarah Johnson",
    "age": 28,
    "occupation": "Software Engineer",
    "income": 75000,
    "spending_behavior": {
      "categories": {
        "groceries": 800,
        "dining": 600,
        "shopping": 400,
        "entertainment": 300,
        "travel": 500,
        "bills": 1200
      },
      "frequency": "medium",
      "average_monthly_spend": 3800
    },
    "financial_goals": {
      "primary_goal": "home_purchase",
      "target_amount": 50000,
      "timeline_months": 24,
      "current_progress": 35
    },
    "life_events": {
      "recent_event": "marriage",
      "event_date": "2024-10-15T00:00:00Z",
      "impact_level": "high"
    },
    "channel_preferences": {
      "preferred_channel": "app",
      "engagement_score": 85,
      "response_rate": 0.75
    },
    "interaction_history": {
      "app_logins": 45,
      "branch_visits": 2,
      "campaign_responses": 8,
      "customer_service_calls": 1,
      "last_interaction": "2025-01-25T14:30:00Z"
    },
    "risk_profile": "moderate",
    "engagement_level": "high"
  }
]

Create diverse profiles including:
- Different ages (25-65), occupations, income levels
- Various spending behaviors and financial goals
- Different life events (marriage, new job, new child, graduation, relocation, none)
- Mix of channel preferences (app, sms, email, phone, branch)
- Various engagement levels and risk profiles
- Realistic interaction histories

Make sure all data is realistic and diverse. Return ONLY the JSON array, no other text.`;

      console.log('Using local customer data...');
      setCustomers(customersData as unknown as CustomerProfile[]);
      setDataSource('simulated');
      
    } catch (error) {
      console.error('Error loading customer data:', error);
      setCustomers([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSimulatedCustomers = () => {
    const names = [
      'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'Jessica Brown',
      'Robert Wilson', 'Amanda Davis', 'Christopher Lee', 'Michelle Taylor', 'James Anderson',
      'Ashley Martinez', 'Daniel Thompson'
    ];
    
    const occupations = [
      'Software Engineer', 'Marketing Manager', 'Teacher', 'Doctor', 'Lawyer',
      'Accountant', 'Sales Representative', 'Nurse', 'Engineer', 'Consultant',
      'Graphic Designer', 'Project Manager'
    ];

    const lifeEvents = ['marriage', 'new_job', 'new_child', 'graduation', 'relocation', 'none'] as const;
    const channels = ['app', 'sms', 'email', 'phone', 'branch'] as const;
    const riskProfiles = ['conservative', 'moderate', 'aggressive'] as const;
    const engagementLevels = ['low', 'medium', 'high'] as const;
    const primaryGoals = ['savings', 'investment', 'home_purchase', 'debt_payment', 'retirement'] as const;

    const generateRandomCustomer = (): CustomerProfile => {
      const age = Math.floor(Math.random() * 40) + 25;
      const monthly_income = Math.floor(Math.random() * 100000) + 30000;
      const eventDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      
      return {
        id: `CUST-2025-${String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0')}`,
        name: names[Math.floor(Math.random() * names.length)],
        segment: ['Premium', 'Standard', 'At-risk'][Math.floor(Math.random() * 3)],
        consent: Math.random() > 0.3,
        account_balance: Math.floor(Math.random() * 500000) + 10000,
        monthly_income,
        spend_categories: {
          travel: Math.floor(Math.random() * 3000) + 200,
          shopping: Math.floor(Math.random() * 2000) + 400,
          groceries: Math.floor(Math.random() * 800) + 300,
          bills: Math.floor(Math.random() * 1500) + 800,
          entertainment: Math.floor(Math.random() * 1000) + 150
        },
        digital_usage: {
          app_logins: Math.floor(Math.random() * 80) + 10,
          notifications_enabled: Math.random() > 0.4
        },
        complaints: Math.floor(Math.random() * 5),
        nps: Math.floor(Math.random() * 10) + 1,
        churn_risk: Math.random(),
        missed_payments: Math.floor(Math.random() * 3)
      };
    };

    const simulatedCustomers = Array.from({length: 12}, generateRandomCustomer);
    setCustomers(simulatedCustomers);
  };

  const generatePersonalizedRecommendations = async () => {
    setIsAnalyzing(true);
    try {
      if (customers.length === 0) {
      }

      const newRecommendations: PersonalizedRecommendation[] = [];
      
      customers.forEach(customer => {
        const recommendation = createPersonalizedRecommendation(customer);
        newRecommendations.push(recommendation);
      });

      setRecommendations(newRecommendations);
      
      // Prepare export data
      const exportPayload = {
        timestamp: new Date().toISOString(),
        total_customers: customers.length,
        recommendations: newRecommendations,
        data_source: dataSource,
        personalization_summary: {
          high_engagement_customers: customers.filter(c => c.digital_usage.app_logins > 50).length,
          app_preferred_customers: customers.filter(c => c.digital_usage.notifications_enabled).length,
          life_event_customers: customers.filter(c => c.complaints > 0).length,
          average_satisfaction: newRecommendations.reduce((sum, r) => sum + r.predicted_satisfaction, 0) / newRecommendations.length
        }
      };
      
      setExportData(exportPayload);
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createPersonalizedRecommendation = (customer: CustomerProfile): PersonalizedRecommendation => {
    // AI Decision Engine Logic
    let recommendedProduct, personalizedMessage, proactiveAdvice, communicationChannel;
    
    // Determine product recommendation based on customer profile
    if (customer.segment === 'Premium' && customer.monthly_income > 60000) {
      recommendedProduct = {
        type: 'savings_account' as const,
        name: 'Home Savings Accelerator',
        description: 'High-yield savings account designed for home buyers',
        benefits: ['2.5% APY', 'No monthly fees', 'Goal tracking tools'],
        interest_rate: 2.5
      };
    } else if (customer.segment === 'Premium' && customer.churn_risk < 0.2) {
      recommendedProduct = {
        type: 'investment_portfolio' as const,
        name: 'Growth Investment Portfolio',
        description: 'Diversified portfolio for long-term wealth building',
        benefits: ['Professional management', 'Diversified assets', 'Low fees'],
        estimated_return: 8.5
      };
    } else if (customer.missed_payments > 0) {
      recommendedProduct = {
        type: 'financial_advice' as const,
        name: 'Spending Optimization Plan',
        description: 'Personalized budgeting and spending analysis',
        benefits: ['Expense tracking', 'Budget recommendations', 'Savings tips'],
      };
    } else if (customer.segment === 'At-risk') {
      recommendedProduct = {
        type: 'insurance' as const,
        name: 'Family Protection Insurance',
        description: 'Comprehensive life and health insurance for growing families',
        benefits: ['Life coverage', 'Health benefits', 'Child protection'],
      };
    } else {
      recommendedProduct = {
        type: 'credit_card' as const,
        name: 'Rewards Credit Card',
        description: 'Cashback rewards card matching your spending patterns',
        benefits: ['3% cashback on top categories', 'No annual fee', 'Travel rewards'],
      };
    }

    // Determine communication channel
    communicationChannel = customer.digital_usage.notifications_enabled ? 'app' : 'email';

    // Create personalized message
    const urgencyLevel = customer.churn_risk > 0.5 ? 'high' : 
                        customer.complaints > 0 ? 'high' : 'medium';

    personalizedMessage = {
      subject: `Hi ${customer.name.split(' ')[0]}, we have something special for you!`,
      content: `Based on your ${customer.segment} segment and account activity, we believe our ${recommendedProduct.name} is perfect for you.`,
      call_to_action: 'Learn More',
      urgency_level: urgencyLevel as 'low' | 'medium' | 'high'
    };

    // Generate proactive advice
    const adviceTypes = [];
    if (customer.spend_categories.travel > customer.spend_categories.groceries) {
      adviceTypes.push({
        spending_alert: `You're spending $${customer.spend_categories.travel} on travel vs $${customer.spend_categories.groceries} on groceries. Consider budgeting your travel expenses.`
      });
    }
    if (customer.account_balance < customer.monthly_income * 3) {
      adviceTypes.push({
        savings_tip: `Your account balance is ${(customer.account_balance / customer.monthly_income).toFixed(1)} months of income. Consider building an emergency fund.`
      });
    }
    if (customer.segment === 'Premium' && customer.churn_risk < 0.2) {
      adviceTypes.push({
        investment_opportunity: `As a Premium customer with low churn risk, consider our investment opportunities for better returns.`
      });
    }

    proactiveAdvice = adviceTypes[Math.floor(Math.random() * adviceTypes.length)] || {};

    // Calculate predicted satisfaction
    const satisfactionFactors = [
      customer.nps / 10,
      customer.digital_usage.app_logins / 100,
      customer.churn_risk < 0.3 ? 0.9 : 0.7,
      customer.complaints === 0 ? 0.9 : 0.6
    ];
    
    const predictedSatisfaction = Math.round(satisfactionFactors.reduce((sum, factor) => sum + factor, 0) / satisfactionFactors.length * 100);
    const confidenceScore = Math.round(Math.random() * 20 + 75);

    return {
      customer_id: customer.id,
      recommended_product: recommendedProduct,
      communication_channel: communicationChannel as 'app' | 'sms' | 'email' | 'phone' | 'branch',
      personalized_message: personalizedMessage,
      proactive_advice: proactiveAdvice,
      predicted_satisfaction: predictedSatisfaction,
      confidence_score: confidenceScore,
      next_best_action: 'Schedule follow-up call within 48 hours'
    };
  };

  const filteredCustomers = filterType === 'all' ? customers : customers.filter(customer => {
    switch (filterType) {
      case 'high_spender':
        return customer.account_balance > 100000;
      case 'low_engagement':
        return customer.digital_usage.app_logins < 20;
      case 'high_engagement':
        return customer.digital_usage.app_logins > 50;
      default:
        return true;
    }
  });

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-400 bg-green-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'low': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'low': return 'text-blue-400 bg-blue-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-gray-800/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Hyper-Personalization of Products & Customer Engagement
              </h1>
              <p className="text-gray-300 mt-2">
                AI-powered customer insights and personalized recommendations
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  dataSource === 'gemini' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'
                }`}>
                  {dataSource === 'gemini' ? 'AI Generated Data' : 'Simulated Data'}
                </span>
                <span className="text-xs text-gray-400">
                  {customers.length} customers • {recommendations.length} recommendations
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generatePersonalizedRecommendations}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Generate Recommendations'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { key: 'all', label: 'All Customers' },
            { key: 'high_spender', label: 'High Spenders' },
            { key: 'low_engagement', label: 'Low Engagement' },
            { key: 'high_engagement', label: 'High Engagement' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterType(filter.key as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                filterType === filter.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Profiles */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">Customer Profiles</h2>
                <p className="text-gray-400 text-sm">Individual customer insights and behaviors</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredCustomers.length > 0 ? (
                  <div className="divide-y divide-gray-700/50">
                    {filteredCustomers.map((customer) => (
                      <div 
                        key={customer.id} 
                        className={`p-4 hover:bg-gray-700/30 transition-colors cursor-pointer ${
                          selectedCustomer?.id === customer.id ? 'bg-purple-900/30 border-l-4 border-purple-500' : ''
                        }`}
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                              <p className="text-sm text-gray-400">{customer.segment} • Balance: ${customer.account_balance.toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEngagementColor(customer.digital_usage.app_logins > 30 ? 'high' : customer.digital_usage.app_logins > 15 ? 'medium' : 'low')}`}>
                                  {customer.digital_usage.app_logins > 30 ? 'high' : customer.digital_usage.app_logins > 15 ? 'medium' : 'low'} engagement
                                </span>
                                <span className="text-xs text-gray-500">
                                  ${customer.monthly_income.toLocaleString()} income
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              Segment: {customer.segment}
                            </div>
                            <div className="text-xs text-gray-500">
                              NPS: {customer.nps}/10
                            </div>
                            {customer.churn_risk > 0.5 && (
                              <div className="text-xs text-red-400 mt-1">
                                High Churn Risk: {(customer.churn_risk * 100).toFixed(0)}%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <div className="text-4xl mb-4">👥</div>
                    <p>No customer profiles available</p>
                    <p className="text-sm">Click "Generate Recommendations" to start</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personalized Recommendations */}
          <div>
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">Personalized Recommendations</h2>
                <p className="text-gray-400 text-sm">AI-generated personalized offers</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {selectedCustomer && recommendations.length > 0 ? (
                  <div className="p-4">
                    {(() => {
                      const recommendation = recommendations.find(r => r.customer_id === selectedCustomer.id);
                      return recommendation ? (
                        <div className="space-y-4">
                          {/* Product Recommendation */}
                          <div className="bg-purple-900/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {recommendation.recommended_product.name}
                            </h3>
                            <p className="text-sm text-gray-300 mb-3">
                              {recommendation.recommended_product.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {recommendation.recommended_product.benefits.map((benefit, index) => (
                                <span key={index} className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">
                                  {benefit}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">
                                Channel: {recommendation.communication_channel}
                              </span>
                              <span className="text-sm font-semibold text-purple-400">
                                {recommendation.predicted_satisfaction}% satisfaction
                              </span>
                            </div>
                          </div>

                          {/* Personalized Message */}
                          <div className="bg-gray-700/30 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-white mb-2">Personalized Message</h4>
                            <div className="text-xs text-gray-400 mb-1">
                              Subject: {recommendation.personalized_message.subject}
                            </div>
                            <div className="text-sm text-gray-300 mb-2">
                              {recommendation.personalized_message.content}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(recommendation.personalized_message.urgency_level)}`}>
                                {recommendation.personalized_message.urgency_level} priority
                              </span>
                              <span className="text-xs text-cyan-400">
                                {recommendation.personalized_message.call_to_action}
                              </span>
                            </div>
                          </div>

                          {/* Proactive Advice */}
                          {Object.keys(recommendation.proactive_advice).length > 0 && (
                            <div className="bg-blue-900/30 rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-white mb-2">Proactive Advice</h4>
                              {recommendation.proactive_advice.spending_alert && (
                                <p className="text-sm text-blue-300 mb-1">
                                  💰 {recommendation.proactive_advice.spending_alert}
                                </p>
                              )}
                              {recommendation.proactive_advice.savings_tip && (
                                <p className="text-sm text-green-300 mb-1">
                                  💡 {recommendation.proactive_advice.savings_tip}
                                </p>
                              )}
                              {recommendation.proactive_advice.investment_opportunity && (
                                <p className="text-sm text-purple-300">
                                  📈 {recommendation.proactive_advice.investment_opportunity}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Next Action */}
                          <div className="bg-gray-700/30 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-white mb-2">Next Best Action</h4>
                            <p className="text-sm text-gray-300">
                              {recommendation.next_best_action}
                            </p>
                            <div className="text-xs text-gray-500 mt-2">
                              Confidence: {recommendation.confidence_score}%
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 py-8">
                          <div className="text-4xl mb-4">🤖</div>
                          <p>No recommendation available</p>
                          <p className="text-sm">Generate recommendations first</p>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <div className="text-4xl mb-4">🎯</div>
                    <p>Select a customer to view recommendations</p>
                    <p className="text-sm">Generate recommendations first</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Export Data */}
        {exportData && (
          <div className="mt-8 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            <div className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-white">Export Data for Automation (n8n)</h2>
              <p className="text-gray-400 text-sm">JSON payload ready for hyper-personalization workflows</p>
            </div>
            <div className="p-6">
              <pre className="bg-gray-900/50 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(exportData, null, 2)}
              </pre>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
                    alert('Data copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `hyper-personalization-data-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Download JSON
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
