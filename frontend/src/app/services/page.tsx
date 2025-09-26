'use client';

import { useState } from 'react';

interface Service {
  id: string;
  title: string;
  summary: string;
  howItWorks: string[];
  businessImpact: string[];
  icon: string;
  category: string;
}

const services: Service[] = [
  {
    id: 'employee-360',
    title: 'Employee 360 & Decisions',
    summary: 'Comprehensive employee performance analytics with AI-driven insights for talent management and strategic HR decisions.',
    howItWorks: [
      'Aggregates data from performance reviews, project outcomes, and engagement metrics',
      'Analyzes patterns across skills, productivity, and team dynamics',
      'Generates predictive insights for career development and retention',
      'Provides actionable recommendations for managers and HR teams'
    ],
    businessImpact: [
      'Reduces employee turnover by 25-40% through proactive intervention',
      'Improves promotion accuracy and reduces bias in performance evaluations',
      'Enables data-driven talent acquisition and succession planning',
      'Increases employee satisfaction through personalized development paths'
    ],
    icon: '👥',
    category: 'HR & Talent Management'
  },
  {
    id: 'customer-360',
    title: 'Customer 360 & Next Best Action',
    summary: 'Unified customer intelligence platform that predicts customer needs and recommends optimal engagement strategies.',
    howItWorks: [
      'Integrates customer data from all touchpoints and interactions',
      'Analyzes behavioral patterns, preferences, and transaction history',
      'Predicts customer lifetime value and churn risk in real-time',
      'Recommends personalized next best actions for sales and support teams'
    ],
    businessImpact: [
      'Increases customer lifetime value by 30-50% through targeted engagement',
      'Reduces customer churn by 20-35% with proactive intervention',
      'Improves cross-sell and up-sell success rates by 40-60%',
      'Enhances customer satisfaction through personalized experiences'
    ],
    icon: '🎯',
    category: 'Customer Experience'
  },
  {
    id: 'compliance-risk',
    title: 'Intelligent Compliance & Risk Management',
    summary: 'Automated regulatory compliance monitoring and risk assessment with real-time alerts and mitigation strategies.',
    howItWorks: [
      'Continuously monitors transactions and activities for compliance violations',
      'Analyzes patterns to identify potential risks before they materialize',
      'Automatically generates compliance reports and audit trails',
      'Provides real-time alerts and recommended corrective actions'
    ],
    businessImpact: [
      'Reduces compliance costs by 40-60% through automation',
      'Minimizes regulatory fines and penalties through proactive monitoring',
      'Improves audit efficiency and reduces manual review time by 70%',
      'Enhances risk visibility and enables faster decision-making'
    ],
    icon: '🛡️',
    category: 'Risk & Compliance'
  },
  {
    id: 'personalized-products',
    title: 'Hyper-Personalized Financial Products & Engagement',
    summary: 'AI-powered product recommendations and personalized financial solutions tailored to individual customer profiles.',
    howItWorks: [
      'Analyzes customer financial behavior, goals, and risk tolerance',
      'Matches customers with optimal products and services',
      'Creates personalized pricing and terms based on risk assessment',
      'Delivers targeted offers through preferred communication channels'
    ],
    businessImpact: [
      'Increases product adoption rates by 35-55% through better matching',
      'Improves customer engagement and loyalty through relevant offers',
      'Reduces default rates by 20-30% through better risk assessment',
      'Enhances revenue per customer through optimized product mix'
    ],
    icon: '💎',
    category: 'Product Development'
  },
  {
    id: 'operational-optimization',
    title: 'Intelligent Operational Optimization & Task Automation',
    summary: 'Smart automation of routine processes and optimization of operational workflows for maximum efficiency.',
    howItWorks: [
      'Identifies repetitive tasks and process bottlenecks automatically',
      'Deploys intelligent automation for document processing and approvals',
      'Optimizes resource allocation and workflow scheduling',
      'Provides continuous improvement recommendations based on performance data'
    ],
    businessImpact: [
      'Reduces operational costs by 25-45% through automation',
      'Improves process efficiency and reduces processing time by 50-70%',
      'Eliminates human errors in routine tasks by 90%+',
      'Enables staff to focus on high-value strategic activities'
    ],
    icon: '⚙️',
    category: 'Operations'
  },
  {
    id: 'market-analysis',
    title: 'Predictive Market Analysis & Investment Opportunities',
    summary: 'Advanced market intelligence and investment opportunity identification using real-time data and predictive analytics.',
    howItWorks: [
      'Analyzes market trends, economic indicators, and sentiment data',
      'Identifies emerging opportunities and potential risks',
      'Provides investment recommendations based on client profiles',
      'Monitors portfolio performance and suggests rebalancing strategies'
    ],
    businessImpact: [
      'Improves investment returns by 15-25% through better timing',
      'Reduces portfolio risk through diversified and optimized allocation',
      'Enables faster identification of market opportunities',
      'Provides competitive advantage through superior market intelligence'
    ],
    icon: '📈',
    category: 'Investment & Trading'
  },
  {
    id: 'product-development',
    title: 'AI-Driven Financial Product Development',
    summary: 'Intelligent product innovation and development using customer insights and market analysis to create winning financial solutions.',
    howItWorks: [
      'Analyzes customer needs and market gaps through data insights',
      'Simulates product performance and customer adoption scenarios',
      'Optimizes product features and pricing strategies',
      'Accelerates time-to-market through automated testing and validation'
    ],
    businessImpact: [
      'Reduces product development time by 40-60%',
      'Increases product success rates by 30-50% through better market fit',
      'Enhances competitive positioning with innovative solutions',
      'Improves customer satisfaction through products that meet real needs'
    ],
    icon: '🚀',
    category: 'Innovation'
  }
];

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
              Nexus Bank AI Brain
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI-powered banking solutions that transform customer experience, employee management, and operational efficiency.
            </p>
          </div>
        </div>
      </div>


      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Service Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{service.icon}</div>
                <div className="flex-1">
                  <div className="text-sm text-cyan-400 font-medium mb-2">{service.category}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{service.summary}</p>
                </div>
              </div>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                className="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 mb-6"
              >
                {expandedService === service.id ? 'Show Less' : 'Learn More'}
              </button>

              {/* Expanded Content */}
              {expandedService === service.id && (
                <div className="space-y-6 animate-fadeIn">
                  {/* How It Works */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                      How It Works
                    </h4>
                    <ul className="space-y-2">
                      {service.howItWorks.map((step, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start gap-3">
                          <span className="text-cyan-400 font-bold text-xs mt-1">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Business Impact */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Business Impact
                    </h4>
                    <ul className="space-y-2">
                      {service.businessImpact.map((impact, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start gap-3">
                          <span className="text-green-400 font-bold text-xs mt-1">✓</span>
                          <span>{impact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
