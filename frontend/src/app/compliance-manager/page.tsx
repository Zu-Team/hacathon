'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import complianceJsonData from '../fake-data/compliance.json';

interface ComplianceData {
  id: string;
  type: 'transaction' | 'document' | 'customer' | 'communication';
  timestamp: Date;
  amount?: number;
  description: string;
  risk_score: number;
  compliance_checks: {
    aml_score: number;
    kyc_status: 'verified' | 'unverified' | 'expired';
    gdpr_compliance: boolean;
    pci_dss_flag: boolean;
    suspicious_pattern: boolean;
  };
  country?: string;
  customer_id?: string;
  entity_type: string;
  audit_status: 'clear' | 'warning' | 'violation';
}

interface FilterOptions {
  type: string;
  status: string;
  riskLevel: string;
  search: string;
}

export default function ComplianceManagerPage() {
  const [complianceData, setComplianceData] = useState<ComplianceData[]>([]);
  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'risks'>('overview');
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    status: 'all',
    riskLevel: 'all',
    search: ''
  });
  const [isClient, setIsClient] = useState(false);

  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load local data on component mount
  useEffect(() => {
    const loadLocalData = () => {
      try {
        console.log('Loading compliance data from local JSON...');
        const processedData = complianceJsonData.map(item => ({
          ...item,
          type: item.type as 'transaction' | 'document' | 'customer' | 'communication',
          timestamp: new Date(item.timestamp),
          audit_status: item.audit_status as 'clear' | 'warning' | 'violation',
          compliance_checks: {
            ...item.compliance_checks,
            kyc_status: item.compliance_checks.kyc_status as 'verified' | 'unverified' | 'expired'
          }
        }));
        setComplianceData(processedData);
        setLoading(false);
        console.log('Successfully loaded compliance data from local JSON!');
      } catch (error) {
        console.error('Error loading compliance data:', error);
        setComplianceData([]);
        setLoading(false);
      }
    };

    loadLocalData();
  }, []);

  // Filtered compliance data based on current filters
  const filteredCompliance = useMemo(() => {
    return complianceData.filter(item => {
      const matchesType = filters.type === 'all' || item.type === filters.type;
      const matchesStatus = filters.status === 'all' || item.audit_status === filters.status;
      const matchesSearch = item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                           item.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                           (item.customer_id && item.customer_id.toLowerCase().includes(filters.search.toLowerCase()));
      
      let matchesRiskLevel = true;
      if (filters.riskLevel !== 'all') {
        switch (filters.riskLevel) {
          case 'low': matchesRiskLevel = item.risk_score <= 5.0; break;
          case 'medium': matchesRiskLevel = item.risk_score > 5.0 && item.risk_score <= 7.5; break;
          case 'high': matchesRiskLevel = item.risk_score > 7.5; break;
        }
      }
      
      return matchesType && matchesStatus && matchesSearch && matchesRiskLevel;
    });
  }, [complianceData, filters]);

  // Analytics data
  const analyticsData = useMemo(() => {
    const typeStats = complianceData.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = { count: 0, avgRisk: 0, totalRisk: 0 };
      }
      acc[item.type].count++;
      acc[item.type].totalRisk += item.risk_score;
      acc[item.type].avgRisk = acc[item.type].totalRisk / acc[item.type].count;
      return acc;
    }, {} as Record<string, { count: number; avgRisk: number; totalRisk: number }>);

    const statusStats = complianceData.reduce((acc, item) => {
      acc[item.audit_status] = (acc[item.audit_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalIncidents: complianceData.length,
      avgRiskScore: complianceData.reduce((sum, item) => sum + item.risk_score, 0) / complianceData.length,
      violationsCount: complianceData.filter(item => item.audit_status === 'violation').length,
      warningsCount: complianceData.filter(item => item.audit_status === 'warning').length,
      typeStats,
      statusStats,
      riskDistribution: [
        { name: 'Low Risk (≤5.0)', value: complianceData.filter(item => item.risk_score <= 5.0).length, color: '#10B981' },
        { name: 'Medium Risk (5.1-7.5)', value: complianceData.filter(item => item.risk_score > 5.0 && item.risk_score <= 7.5).length, color: '#F59E0B' },
        { name: 'High Risk (>7.5)', value: complianceData.filter(item => item.risk_score > 7.5).length, color: '#EF4444' }
      ]
    };
  }, [complianceData]);

  const handleComplianceClick = (compliance: ComplianceData) => {
    setSelectedCompliance(compliance);
  };

  const getRiskColor = (score: number) => {
    if (score <= 5.0) return 'text-green-400';
    if (score <= 7.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score <= 5.0) return 'bg-green-900/30 border-green-700';
    if (score <= 7.5) return 'bg-yellow-900/30 border-yellow-700';
    return 'bg-red-900/30 border-red-700';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return 'text-green-400 bg-green-900/20';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20';
      case 'violation': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transaction': return '💰';
      case 'document': return '📄';
      case 'customer': return '👤';
      case 'communication': return '📞';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" suppressHydrationWarning={true}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Compliance Data</h2>
          <p className="text-gray-400">Analyzing risk metrics and compliance incidents...</p>
        </motion.div>
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
              AI-Powered Compliance Manager
            </h1>
            <p className="text-gray-300">Nexus Bank Regulatory Compliance & Risk Intelligence</p>
            <div className="mt-2 flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-300 border border-blue-700">
                Data Source: 📁 Local JSON Data
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300 border border-green-700">
                {filteredCompliance.length} of {complianceData.length} Incidents
              </span>
            </div>
          </motion.div>
          <div className="flex gap-3">
            <motion.button
              onClick={() => {
                const processedData = complianceJsonData.map(item => ({
                  ...item,
                  type: item.type as 'transaction' | 'document' | 'customer' | 'communication',
                  timestamp: new Date(item.timestamp),
                  audit_status: item.audit_status as 'clear' | 'warning' | 'violation',
                  compliance_checks: {
                    ...item.compliance_checks,
                    kyc_status: item.compliance_checks.kyc_status as 'verified' | 'unverified' | 'expired'
                  }
                }));
                setComplianceData(processedData);
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
              { id: 'overview', label: 'Overview', icon: ShieldCheckIcon },
              { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
              { id: 'risks', label: 'Risk Analysis', icon: ExclamationTriangleIcon }
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
                placeholder="Search incidents..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="transaction">Transaction</option>
              <option value="document">Document</option>
              <option value="customer">Customer</option>
              <option value="communication">Communication</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="clear">Clear</option>
              <option value="warning">Warning</option>
              <option value="violation">Violation</option>
            </select>
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk (≤5.0)</option>
              <option value="medium">Medium Risk (5.1-7.5)</option>
              <option value="high">High Risk (&gt;7.5)</option>
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
                      <p className="text-blue-100 text-sm">Total Incidents</p>
                      <p className="text-white text-3xl font-bold">{analyticsData.totalIncidents}</p>
                    </div>
                    <ShieldCheckIcon className="h-8 w-8 text-blue-200" />
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Violations</p>
                      <p className="text-white text-3xl font-bold">{analyticsData.violationsCount}</p>
                    </div>
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-200" />
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Warnings</p>
                      <p className="text-white text-3xl font-bold">{analyticsData.warningsCount}</p>
                    </div>
                    <ClockIcon className="h-8 w-8 text-yellow-200" />
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Avg Risk Score</p>
                      <p className="text-white text-3xl font-bold">{analyticsData.avgRiskScore.toFixed(1)}</p>
                    </div>
                    <ChartBarIcon className="h-8 w-8 text-purple-200" />
                  </div>
                </motion.div>
              </div>

              {/* Compliance Incidents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCompliance.map((item, index) => (
                  <motion.div
                    key={item.id}
                    onClick={() => handleComplianceClick(item)}
                    className={`${getRiskBgColor(item.risk_score)} rounded-xl p-6 border cursor-pointer hover:scale-105 transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getTypeIcon(item.type)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.id}</h3>
                          <p className="text-cyan-400 text-sm capitalize">{item.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getRiskColor(item.risk_score)}`}>
                          {item.risk_score.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-400">Risk Score</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.audit_status)}`}>
                          {item.audit_status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Entity:</span>
                        <span className="text-white">{item.entity_type}</span>
                      </div>
                      {item.amount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Amount:</span>
                          <span className="text-white">${item.amount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white">{isClient ? format(item.timestamp, 'MMM dd') : ''}</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-xs text-gray-500">Click to view details</span>
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
              {/* Risk Distribution Chart */}
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Risk Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.riskDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {analyticsData.riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Incident Types Analysis */}
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Incident Types Analysis</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(analyticsData.typeStats).map(([type, stats]) => ({
                      type: type.charAt(0).toUpperCase() + type.slice(1),
                      count: stats.count,
                      avgRisk: stats.avgRisk
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="type" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }} 
                        formatter={(value: any, name: any) => [
                          name === 'avgRisk' ? value.toFixed(1) : value,
                          name === 'count' ? 'Count' : 'Avg Risk'
                        ]}
                      />
                      <Bar dataKey="count" fill="#06B6D4" name="count" />
                      <Bar dataKey="avgRisk" fill="#EF4444" name="avgRisk" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'risks' && (
            <motion.div
              key="risks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Risk Trends */}
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Risk Score Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceData.slice(0, 8).map((item, index) => ({
                      name: item.id,
                      risk_score: item.risk_score,
                      aml_score: item.compliance_checks.aml_score
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
                        formatter={(value: any, name: any) => [value.toFixed(1), name === 'risk_score' ? 'Risk Score' : 'AML Score']}
                      />
                      <Line type="monotone" dataKey="risk_score" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="aml_score" stroke="#06B6D4" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Compliance Status Overview */}
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Compliance Status Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(analyticsData.statusStats).map(([status, count]) => (
                    <div key={status} className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${
                        status === 'clear' ? 'text-green-400' :
                        status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {count}
                      </div>
                      <div className="text-gray-400 capitalize">{status} Status</div>
                      <div className="text-sm text-gray-500">
                        {((count / analyticsData.totalIncidents) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Compliance Details */}
        {selectedCompliance && (
          <motion.div
            className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Compliance Incident Details</h2>
                <p className="text-gray-400">Detailed analysis for {selectedCompliance.id}</p>
              </div>
              <button
                onClick={() => setSelectedCompliance(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

            {/* Incident Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Incident Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID:</span>
                    <span className="text-white">{selectedCompliance.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-cyan-400 capitalize">{selectedCompliance.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCompliance.audit_status)}`}>
                      {selectedCompliance.audit_status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Score:</span>
                    <span className={`font-semibold ${getRiskColor(selectedCompliance.risk_score)}`}>
                      {selectedCompliance.risk_score}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Entity Type:</span>
                    <span className="text-white">{selectedCompliance.entity_type}</span>
                  </div>
                  {selectedCompliance.amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white">${selectedCompliance.amount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedCompliance.country && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Country:</span>
                      <span className="text-white">{selectedCompliance.country}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{isClient ? format(selectedCompliance.timestamp, 'MMM dd, yyyy HH:mm') : ''}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Compliance Checks</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">AML Score:</span>
                    <span className="text-white">{selectedCompliance.compliance_checks.aml_score}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">KYC Status:</span>
                    <span className={`${
                      selectedCompliance.compliance_checks.kyc_status === 'verified' ? 'text-green-400' :
                      selectedCompliance.compliance_checks.kyc_status === 'expired' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {selectedCompliance.compliance_checks.kyc_status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">GDPR Compliance:</span>
                    <span className={selectedCompliance.compliance_checks.gdpr_compliance ? 'text-green-400' : 'text-red-400'}>
                      {selectedCompliance.compliance_checks.gdpr_compliance ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">PCI DSS Flag:</span>
                    <span className={selectedCompliance.compliance_checks.pci_dss_flag ? 'text-red-400' : 'text-green-400'}>
                      {selectedCompliance.compliance_checks.pci_dss_flag ? 'FLAGGED' : 'CLEAR'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Suspicious Pattern:</span>
                    <span className={selectedCompliance.compliance_checks.suspicious_pattern ? 'text-red-400' : 'text-green-400'}>
                      {selectedCompliance.compliance_checks.suspicious_pattern ? 'DETECTED' : 'NONE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-300">{selectedCompliance.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
