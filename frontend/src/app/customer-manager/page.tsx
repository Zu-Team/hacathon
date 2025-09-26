'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import customersData from '../fake-data/customers.json';

interface Customer {
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

interface NextBestAction {
  action: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  expected_outcome: string;
  confidence: number;
}

interface CustomerAnalysisResult {
  recommendation: string;
  rationale: string[];
  next_actions: Array<{
    action: string;
    topic: string;
    in: string;
  }>;
  confidence: number;
  requires_human_review: boolean;
  risk_score: number;
  potential: 'high' | 'medium' | 'low';
}

interface FilterOptions {
  segment: string;
  churnRisk: string;
  search: string;
}

export default function CustomerManagerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [nextBestAction, setNextBestAction] = useState<NextBestAction | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CustomerAnalysisResult | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed' | 'idle'>('idle');
  const [generatedJson, setGeneratedJson] = useState<string>('');
  const [dataSource] = useState<'fallback'>('fallback');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'spending'>('overview');
  const [filters, setFilters] = useState<FilterOptions>({
    segment: 'all',
    churnRisk: 'all',
    search: ''
  });

  // Load local data on page load
  useEffect(() => {
    const loadLocalData = () => {
      try {
        console.log('Loading customers from local JSON data...');
        setCustomers(customersData as Customer[]);
        setLoading(false);
        console.log('Successfully loaded customers from local data!');
      } catch (error) {
        console.error('Error loading customers:', error);
        setCustomers([]);
        setLoading(false);
      }
    };

    loadLocalData();
  }, []);

  // Filtered customers based on current filters
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSegment = filters.segment === 'all' || customer.segment === filters.segment;
      const matchesSearch = customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           customer.id.toLowerCase().includes(filters.search.toLowerCase());
      
      let matchesChurnRisk = true;
      if (filters.churnRisk !== 'all') {
        switch (filters.churnRisk) {
          case 'low': matchesChurnRisk = customer.churn_risk <= 0.3; break;
          case 'medium': matchesChurnRisk = customer.churn_risk > 0.3 && customer.churn_risk <= 0.7; break;
          case 'high': matchesChurnRisk = customer.churn_risk > 0.7; break;
        }
      }
      
      return matchesSegment && matchesSearch && matchesChurnRisk;
    });
  }, [customers, filters]);

  // Analytics data
  const analyticsData = useMemo(() => {
    const segmentStats = customers.reduce((acc, customer) => {
      if (!acc[customer.segment]) {
        acc[customer.segment] = { count: 0, avgBalance: 0, totalBalance: 0, avgChurnRisk: 0, totalChurnRisk: 0 };
      }
      acc[customer.segment].count++;
      acc[customer.segment].totalBalance += customer.account_balance;
      acc[customer.segment].avgBalance = acc[customer.segment].totalBalance / acc[customer.segment].count;
      acc[customer.segment].totalChurnRisk += customer.churn_risk;
      acc[customer.segment].avgChurnRisk = acc[customer.segment].totalChurnRisk / acc[customer.segment].count;
      return acc;
    }, {} as Record<string, { count: number; avgBalance: number; totalBalance: number; avgChurnRisk: number; totalChurnRisk: number }>);

    return {
      totalCustomers: customers.length,
      totalBalance: customers.reduce((sum, c) => sum + c.account_balance, 0),
      avgChurnRisk: customers.reduce((sum, c) => sum + c.churn_risk, 0) / customers.length,
      avgNPS: customers.reduce((sum, c) => sum + c.nps, 0) / customers.length,
      segmentStats,
      churnDistribution: [
        { name: 'Low Risk (≤30%)', value: customers.filter(c => c.churn_risk <= 0.3).length, color: '#10B981' },
        { name: 'Medium Risk (31-70%)', value: customers.filter(c => c.churn_risk > 0.3 && c.churn_risk <= 0.7).length, color: '#F59E0B' },
        { name: 'High Risk (>70%)', value: customers.filter(c => c.churn_risk > 0.7).length, color: '#EF4444' }
      ]
    };
  }, [customers]);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNextBestAction(null);
    setAnalysisResult(null);
    setAnalysisData(null);
    setGeneratedJson('');
    setConnectionStatus('idle');
  };

  const getRecommendationFromRiskLevel = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'low': return 'bonus';
      case 'medium': return 'training';
      case 'high': return 'pip';
      default: return 'review';
    }
  };

  const handleRunNextBestAction = async () => {
    if (!selectedCustomer) return;
    
    setAnalyzing(true);
    setConnectionStatus('connecting');
    setAnalysisResult(null);
    setAnalysisData(null);
    setGeneratedJson('');
    
    try {
      console.log('🚀 Running customer analysis with n8n...');
      
      const response = await fetch('/api/customer-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: selectedCustomer.id,
          customer_data: {
            name: selectedCustomer.name,
            segment: selectedCustomer.segment,
            consent: selectedCustomer.consent,
            account_balance: selectedCustomer.account_balance,
            monthly_income: selectedCustomer.monthly_income,
            spend_categories: selectedCustomer.spend_categories,
            digital_usage: selectedCustomer.digital_usage,
            complaints: selectedCustomer.complaints,
            nps: selectedCustomer.nps,
            churn_risk: selectedCustomer.churn_risk,
            missed_payments: selectedCustomer.missed_payments
          },
          analysis_type: 'next_best_action'
        })
      });

      if (!response.ok) {
        let errorData;
        try {
          const responseText = await response.text();
          console.log('❌ Raw error response:', responseText);
          
          if (responseText) {
            errorData = JSON.parse(responseText);
          } else {
            errorData = { error: 'Empty response from server' };
          }
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorData = { 
            error: 'Invalid response format',
            message: `API request failed with status: ${response.status}` 
          };
        }
        
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.message || errorData.error || `API request failed with status: ${response.status}`);
      }

      let apiResult;
      try {
        const responseText = await response.text();
        console.log('📊 Raw API response:', responseText);
        
        if (responseText) {
          apiResult = JSON.parse(responseText);
        } else {
          throw new Error('Empty response from API');
        }
      } catch (parseError) {
        console.error('❌ Failed to parse API response:', parseError);
        throw new Error('Invalid response format from API');
      }
      
      console.log('📊 Parsed analysis from API:', apiResult);

      // Check if this is fallback data or real n8n data
      const isFallbackData = apiResult.message && apiResult.message.includes('fake data');
      const isN8nData = apiResult.customer_id || apiResult.summary || apiResult.generated_at;
      
      if (isFallbackData) {
        setConnectionStatus('failed');
      } else if (isN8nData) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('failed'); // Unknown format
      }

      const apiData = apiResult.data || apiResult; // Handle direct object or 'data' property
      setAnalysisData(apiData); // Store analysis data for display
      
      // Transform n8n response to our analysis format
      const analysis: CustomerAnalysisResult = {
        recommendation: getRecommendationFromRiskLevel(apiData.risk_level || 'medium'),
        rationale: apiData.strengths || [apiData.reasoning || 'Customer analysis completed'],
        next_actions: apiData.recommendations?.map((rec: any) => {
          if (typeof rec === 'string') {
            return { action: rec, topic: 'Customer Action', in: '30 days' };
          } else if (rec && typeof rec === 'object') {
            return { 
              action: rec.action || rec.title || 'Recommendation', 
              topic: rec.topic || rec.description || 'Customer Action', 
              in: rec.timeline || '30 days' 
            };
          } else {
            return { action: 'Recommendation', topic: 'Customer Action', in: '30 days' };
          }
        }) || [],
        confidence: apiData.confidence || 0.85,
        requires_human_review: apiData.risk_level === 'high',
        risk_score: apiData.churn_risk || selectedCustomer.churn_risk,
        potential: apiData.risk_level === 'low' ? 'high' : apiData.risk_level === 'medium' ? 'medium' : 'low'
      };
      
      setAnalysisResult(analysis);
      
      // Also set the legacy nextBestAction for backward compatibility
      if (apiData.recommendations && apiData.recommendations.length > 0) {
        const firstRec = apiData.recommendations[0];
        setNextBestAction({
          action: typeof firstRec === 'string' ? firstRec : (firstRec.action || firstRec.title || 'Recommendation'),
          reasoning: apiData.reasoning || 'AI-generated recommendation',
          priority: apiData.priority || (apiData.risk_level === 'high' ? 'high' : 'medium') as 'high' | 'medium' | 'low',
          expected_outcome: apiData.expected_outcome || 'Improved customer engagement',
          confidence: apiData.confidence || 0.85
        });
      }
      
    } catch (error) {
      console.error('❌ Error in customer analysis:', error);
      setConnectionStatus('failed');
    } finally {
      setAnalyzing(false);
    }
  };


  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Premium': return 'text-green-400';
      case 'Standard': return 'text-blue-400';
      case 'At-risk': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSegmentBgColor = (segment: string) => {
    switch (segment) {
      case 'Premium': return 'bg-green-900/30 border-green-700';
      case 'Standard': return 'bg-blue-900/30 border-blue-700';
      case 'At-risk': return 'bg-red-900/30 border-red-700';
      default: return 'bg-gray-900/30 border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" suppressHydrationWarning={true}>
        <div className="text-center" suppressHydrationWarning={true}>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Customer Data</h2>
          <p className="text-gray-400">Using local JSON data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto" suppressHydrationWarning={true}>
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-gray-800/50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              AI-Powered Customer Manager
            </h1>
            <p className="text-gray-300">Nexus Bank Customer Intelligence Dashboard</p>
            <div className="mt-2 flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-300 border border-blue-700">
                Data Source: 📁 Local JSON Data
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300 border border-green-700">
                {filteredCustomers.length} of {customers.length} Customers
              </span>
            </div>
          </motion.div>
          <div className="flex gap-3">
            <motion.button
              onClick={() => {
                setCustomers(customersData as Customer[]);
                setLoading(false);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowPathIcon className="h-4 w-4" />
              Reload Data
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: UserGroupIcon },
              { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
              { id: 'spending', label: 'Spending', icon: StarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <select
              value={filters.segment}
              onChange={(e) => setFilters(prev => ({ ...prev, segment: e.target.value }))}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Segments</option>
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
              <option value="At-risk">At-risk</option>
            </select>
            <select
              value={filters.churnRisk}
              onChange={(e) => setFilters(prev => ({ ...prev, churnRisk: e.target.value }))}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk (≤30%)</option>
              <option value="medium">Medium Risk (31-70%)</option>
              <option value="high">High Risk (&gt;70%)</option>
            </select>
          </div>
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Customers</p>
                      <p className="text-white text-3xl font-bold">{analyticsData.totalCustomers}</p>
                    </div>
                    <UserGroupIcon className="h-8 w-8 text-blue-200" />
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Balance</p>
                      <p className="text-white text-3xl font-bold">${(analyticsData.totalBalance / 1000000).toFixed(1)}M</p>
                    </div>
                    <ChartBarIcon className="h-8 w-8 text-green-200" />
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Avg NPS Score</p>
                      <p className="text-white text-3xl font-bold">{analyticsData.avgNPS.toFixed(1)}</p>
                    </div>
                    <StarIcon className="h-8 w-8 text-yellow-200" />
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Avg Churn Risk</p>
                      <p className="text-white text-3xl font-bold">{(analyticsData.avgChurnRisk * 100).toFixed(0)}%</p>
                    </div>
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-200" />
                  </div>
                </motion.div>
              </div>

              {/* Customer Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              onClick={() => handleCustomerClick(customer)}
              className={`${getSegmentBgColor(customer.segment)} rounded-xl p-6 border cursor-pointer hover:scale-105 transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{customer.name}</h3>
                  <p className={`${getSegmentColor(customer.segment)} font-medium`}>{customer.segment}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${customer.account_balance.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Balance</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Monthly Income:</span>
                  <span className="text-white">${customer.monthly_income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Churn Risk:</span>
                  <span className={`font-semibold ${
                    customer.churn_risk > 0.7 ? 'text-red-400' : 
                    customer.churn_risk > 0.4 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {(customer.churn_risk * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">NPS Score:</span>
                  <span className="text-white">{customer.nps}/10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Complaints:</span>
                  <span className="text-white">{customer.complaints}</span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs text-gray-500">Click to analyze</span>
              </div>
            </motion.div>
          ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Churn Risk Distribution Chart */}
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Churn Risk Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.churnDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {analyticsData.churnDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Segment Performance */}
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Segment Performance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(analyticsData.segmentStats).map(([segment, stats]) => ({
                      segment: segment,
                      avgBalance: stats.avgBalance / 1000,
                      avgChurnRisk: stats.avgChurnRisk * 100,
                      count: stats.count
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="segment" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }} 
                        formatter={(value: any, name: any) => [
                          name === 'avgBalance' ? `$${value.toFixed(0)}K` : 
                          name === 'avgChurnRisk' ? `${value.toFixed(1)}%` : value,
                          name === 'avgBalance' ? 'Avg Balance' :
                          name === 'avgChurnRisk' ? 'Avg Churn Risk' : 'Count'
                        ]}
                      />
                      <Bar dataKey="avgBalance" fill="#06B6D4" name="avgBalance" />
                      <Bar dataKey="avgChurnRisk" fill="#EF4444" name="avgChurnRisk" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'spending' && (
            <motion.div
              key="spending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Spending Categories Analysis */}
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Spending Categories Analysis</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customers.slice(0, 6).map(customer => ({
                      name: customer.name.split(' ')[0],
                      travel: customer.spend_categories.travel,
                      shopping: customer.spend_categories.shopping,
                      groceries: customer.spend_categories.groceries,
                      bills: customer.spend_categories.bills,
                      entertainment: customer.spend_categories.entertainment
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }} 
                        formatter={(value: any) => [`$${value}`, 'Amount']}
                      />
                      <Bar dataKey="travel" stackId="a" fill="#06B6D4" />
                      <Bar dataKey="shopping" stackId="a" fill="#10B981" />
                      <Bar dataKey="groceries" stackId="a" fill="#F59E0B" />
                      <Bar dataKey="bills" stackId="a" fill="#EF4444" />
                      <Bar dataKey="entertainment" stackId="a" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Digital Usage Trends */}
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Digital Usage Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customers.slice(0, 8).map((customer, index) => ({
                      name: customer.name.split(' ')[0],
                      app_logins: customer.digital_usage.app_logins,
                      nps: customer.nps,
                      churn_risk: customer.churn_risk * 100
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }} 
                        formatter={(value: any, name: any) => [
                          name === 'churn_risk' ? `${value.toFixed(1)}%` : value,
                          name === 'app_logins' ? 'App Logins' :
                          name === 'nps' ? 'NPS Score' : 'Churn Risk'
                        ]}
                      />
                      <Line type="monotone" dataKey="app_logins" stroke="#06B6D4" strokeWidth={2} />
                      <Line type="monotone" dataKey="nps" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="churn_risk" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Customer Analysis */}
        {selectedCustomer && (
          <motion.div
            className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Customer Analysis</h2>
                <p className="text-gray-400">AI-powered insights for {selectedCustomer.name}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Customer Profile</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID:</span>
                    <span className="text-white">{selectedCustomer.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Segment:</span>
                    <span className={getSegmentColor(selectedCustomer.segment)}>{selectedCustomer.segment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Consent:</span>
                    <span className={selectedCustomer.consent ? 'text-green-400' : 'text-red-400'}>
                      {selectedCustomer.consent ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Balance:</span>
                    <span className="text-white">${selectedCustomer.account_balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Income:</span>
                    <span className="text-white">${selectedCustomer.monthly_income.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Churn Risk:</span>
                    <span className={`font-semibold ${
                      selectedCustomer.churn_risk > 0.7 ? 'text-red-400' : 
                      selectedCustomer.churn_risk > 0.4 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {(selectedCustomer.churn_risk * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">NPS Score:</span>
                    <span className="text-white">{selectedCustomer.nps}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Complaints:</span>
                    <span className="text-white">{selectedCustomer.complaints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Missed Payments:</span>
                    <span className="text-white">{selectedCustomer.missed_payments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">App Logins:</span>
                    <span className="text-white">{selectedCustomer.digital_usage.app_logins}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Best Action */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Next Best Action</h3>
                <motion.button
                  onClick={handleRunNextBestAction}
                  disabled={analyzing}
                  className={`px-6 py-2 font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2 ${
                    connectionStatus === 'idle' 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                      : connectionStatus === 'connecting'
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white'
                      : connectionStatus === 'connected'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                      : connectionStatus === 'failed'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                  }`}
                  whileHover={{ scale: connectionStatus === 'idle' ? 1.05 : 1 }}
                  whileTap={{ scale: connectionStatus === 'idle' ? 0.95 : 1 }}
                  title="Generate AI-powered next best action with n8n"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {connectionStatus === 'connecting' ? 'Connecting to n8n...' : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      <span className="text-lg">
                        {connectionStatus === 'idle' ? '🤖' :
                         connectionStatus === 'connecting' ? '⏳' :
                         connectionStatus === 'connected' ? '✅' :
                         connectionStatus === 'failed' ? '❌' : '🤖'}
                      </span>
                      {connectionStatus === 'idle' ? 'Generate Next Best Action' :
                       connectionStatus === 'connecting' ? 'Connecting...' :
                       connectionStatus === 'connected' ? 'Connected!' :
                       connectionStatus === 'failed' ? 'Failed!' : 'Generate Next Best Action'}
                    </>
                  )}
                </motion.button>
              </div>

              {/* Connection Status Display */}
              <div className="text-center mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  connectionStatus === 'connected' ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                  connectionStatus === 'connecting' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
                  connectionStatus === 'failed' ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
                  'bg-gray-900/30 text-gray-400 border border-gray-500/30'
                }`}>
                  <span>
                    {connectionStatus === 'connected' ? '✅' :
                     connectionStatus === 'connecting' ? '⏳' :
                     connectionStatus === 'failed' ? '❌' : '⚪'}
                  </span>
                  {connectionStatus === 'connected' ? 'Connected to n8n' :
                   connectionStatus === 'connecting' ? 'Connecting to n8n...' :
                   connectionStatus === 'failed' ? 'n8n Connection Failed' : 'Ready for analysis'}
                </div>
              </div>

              {/* Analysis Result Display */}
              <AnimatePresence>
                {connectionStatus === 'failed' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-6"
                  >
                    <h3 className="text-2xl font-bold text-red-400 mb-4">n8n Connection Failed</h3>
                    <p className="text-red-300 text-lg mb-4">Unable to connect to n8n workflow for customer analysis</p>
                    <div className="text-sm text-red-200">
                      <p>• Check n8n webhook URL configuration</p>
                      <p>• Verify n8n workflow is running</p>
                      <p>• Check network connectivity</p>
                    </div>
                  </motion.div>
                )}

                {analysisResult && connectionStatus === 'connected' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-800/50 rounded-xl p-6 mb-6"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6">AI Analysis Result</h3>
                    
                    {/* AI Summary */}
                    {analysisData?.summary && (
                      <div className="mb-6">
                        <h5 className="text-md font-semibold text-white mb-2">AI Summary</h5>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                          <p className="text-gray-300 leading-relaxed">{analysisData.summary}</p>
                        </div>
                      </div>
                    )}

                    {/* Customer Strengths */}
                    <div className="mb-6">
                      <h5 className="text-md font-semibold text-white mb-2">Customer Strengths</h5>
                      <ul className="space-y-2">
                        {analysisResult.rationale.map((reason, index) => {
                          const reasonText = String(reason || '');
                          return (
                            <li key={`rationale-${index}-${reasonText.substring(0, 20)}`} className="text-gray-300 flex items-start gap-2">
                              <span className="text-green-400 font-bold text-sm mt-1">✓</span>
                              <span>{reasonText}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Next Actions */}
                    {analysisResult.next_actions.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-md font-semibold text-white mb-2">Recommended Actions</h5>
                        <div className="space-y-3">
                          {analysisResult.next_actions.map((action, index) => (
                            <div key={`action-${index}`} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h6 className="text-white font-medium mb-1">{String(action.action || '')}</h6>
                                  <p className="text-gray-400 text-sm">{String(action.topic || '')}</p>
                                </div>
                                <span className="text-cyan-400 text-sm font-medium">{String(action.in || '')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Analysis Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                        <h6 className="text-white font-medium mb-2">Confidence Score</h6>
                        <p className="text-2xl font-bold text-green-400">{(analysisResult.confidence * 100).toFixed(0)}%</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                        <h6 className="text-white font-medium mb-2">Risk Score</h6>
                        <p className="text-2xl font-bold text-red-400">{(analysisResult.risk_score * 100).toFixed(0)}%</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                        <h6 className="text-white font-medium mb-2">Potential</h6>
                        <p className={`text-2xl font-bold ${
                          analysisResult.potential === 'high' ? 'text-green-400' :
                          analysisResult.potential === 'medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {analysisResult.potential.toUpperCase()}
                        </p>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

              {nextBestAction && (
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Recommended Action</h4>
                      <p className="text-cyan-400 font-semibold text-lg">{nextBestAction.action}</p>
                      <p className="text-gray-300 text-sm mt-2">{nextBestAction.reasoning}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-white mb-2">Action Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Priority:</span>
                          <span className={`font-semibold ${
                            nextBestAction.priority === 'high' ? 'text-red-400' : 
                            nextBestAction.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {nextBestAction.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Expected Outcome:</span>
                          <span className="text-white">{nextBestAction.expected_outcome}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Confidence:</span>
                          <span className="text-white">{(nextBestAction.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generated JSON Display */}
            {generatedJson && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Customer Data Snapshot (Ready for n8n)</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {generatedJson}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
