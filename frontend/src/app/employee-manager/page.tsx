'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
// Import the new JSON data
import employeesData from '../fake-data/employees.json';

interface Employee {
  id: string;
  personal_info: {
    first_name: string;
    last_name: string;
    national_id: string;
    date_of_birth: string;
    gender: string;
    contact: {
  email: string;
  phone: string;
      address: string;
      branch_city: string;
    };
  };
  employment_details: {
    department: string;
    position: string;
    branch_location: string;
    management_level: string;
    hire_date: string;
    employment_type: string;
    status: string;
    salary_currency: string;
    bank_account: string;
    device_id: string;
    customer_segment: string;
  };
  permissions: {
    system_access: string[];
    services_access: string[];
    approval_limits: {
      transaction_approval: number;
      loan_approval: number;
    };
  };
  performance: {
    clients_managed: number;
    portfolio_size: number;
    customer_satisfaction: number;
  };
}

interface AnalysisResult {
  recommendation: 'bonus' | 'pip' | 'training' | 'terminate_review' | 'promotion';
  rationale: string[];
  next_actions: Array<{
    action: string;
    topic?: string;
    value?: number;
    currency?: string;
    in?: string;
    goal?: string;
  }>;
  confidence: number;
  requires_human_review: boolean;
  risk_score: number;
  potential: 'high' | 'medium' | 'low';
}

interface FilterOptions {
  department: string;
  status: string;
  performance: string;
  search: string;
}

export default function EmployeeManagerPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [rawN8nData, setRawN8nData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'failed' | 'idle' | 'blocked'>('idle');
  const [securityTestResult, setSecurityTestResult] = useState<{
    status: 'idle' | 'testing' | 'blocked' | 'failed' | 'disconnected';
    message: string;
  }>({ status: 'idle', message: '' });
  // const [dataSource] = useState<'local'>('local'); // Removed unused variable
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'performance'>('overview');
  const [filters, setFilters] = useState<FilterOptions>({
    department: 'all',
    status: 'all',
    performance: 'all',
    search: ''
  });
  const [isClient, setIsClient] = useState(false);

  // Load employees from local JSON data
  useEffect(() => {
    setIsClient(true);
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    setLoading(true);
    try {
      console.log('Loading employees from new JSON data...');
      // The new data structure has employees array inside the JSON
      const employeesArray = employeesData.employees || employeesData;
      setEmployees(employeesArray as Employee[]);
      console.log('Successfully loaded employees from new data!', employeesArray.length);
    } catch (error) {
      console.error('Error loading employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };


  // Filtered employees based on current filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const fullName = `${employee.personal_info.first_name} ${employee.personal_info.last_name}`;
      const matchesDepartment = filters.department === 'all' || employee.employment_details.department === filters.department;
      const matchesStatus = filters.status === 'all' || employee.employment_details.status === filters.status;
      const matchesSearch = fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
                           employee.employment_details.position.toLowerCase().includes(filters.search.toLowerCase()) ||
                           employee.personal_info.contact.email.toLowerCase().includes(filters.search.toLowerCase());
      
      let matchesPerformance = true;
      if (filters.performance !== 'all') {
        const score = employee.performance.customer_satisfaction;
        switch (filters.performance) {
          case 'excellent': matchesPerformance = score >= 4.5; break;
          case 'good': matchesPerformance = score >= 4.0 && score < 4.5; break;
          case 'average': matchesPerformance = score >= 3.0 && score < 4.0; break;
          case 'poor': matchesPerformance = score < 3.0; break;
        }
      }
      
      return matchesDepartment && matchesStatus && matchesSearch && matchesPerformance;
    });
  }, [employees, filters]);

  // Analytics data
  const analyticsData = useMemo(() => {
    const departmentStats = employees.reduce((acc, emp) => {
      const dept = emp.employment_details.department;
      if (!acc[dept]) {
        acc[dept] = { count: 0, avgPerformance: 0, totalPerformance: 0 };
      }
      acc[dept].count++;
      acc[dept].totalPerformance += emp.performance.customer_satisfaction;
      acc[dept].avgPerformance = acc[dept].totalPerformance / acc[dept].count;
      return acc;
    }, {} as Record<string, { count: number; avgPerformance: number; totalPerformance: number }>);

    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.employment_details.status === 'نشط').length,
      avgPerformance: employees.reduce((sum, e) => sum + e.performance.customer_satisfaction, 0) / employees.length,
      departmentStats,
      performanceDistribution: [
        { name: 'Excellent (4.5+)', value: employees.filter(e => e.performance.customer_satisfaction >= 4.5).length, color: '#10B981' },
        { name: 'Good (4.0-4.4)', value: employees.filter(e => e.performance.customer_satisfaction >= 4.0 && e.performance.customer_satisfaction < 4.5).length, color: '#3B82F6' },
        { name: 'Average (3.0-3.9)', value: employees.filter(e => e.performance.customer_satisfaction >= 3.0 && e.performance.customer_satisfaction < 4.0).length, color: '#F59E0B' },
        { name: 'Poor (&lt;3.0)', value: employees.filter(e => e.performance.customer_satisfaction < 3.0).length, color: '#EF4444' }
      ]
    };
  }, [employees]);

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setAnalysisResult(null);
  };

  const handleTestHack = async () => {
    if (!selectedEmployee) return;
    
    setAnalyzing(true);
    setSecurityTestResult({ status: 'testing', message: 'Testing n8n Cyber-Sentinel...' });
    setAnalysisResult(null);
    setRawN8nData(null);
    
    try {
      console.log('🛡️ Testing n8n Cyber-Sentinel with SQL injection payload...');
      console.log('🚨 WARNING: This is a SECURITY TEST with malicious SQL injection payload!');
      
      // Create a simple malicious payload - just the SQL injection string
      const maliciousPayload = "admin' OR 1=1 --";
      
      console.log('🚨 Sending simple malicious payload to n8n Cyber-Sentinel:', maliciousPayload);
      console.log('🚨 PAYLOAD CONTENT:');
      console.log('   - SQL Injection String:', maliciousPayload);
      
      // Use the new security test API endpoint that bypasses local checks
      const response = await fetch('/api/test-security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maliciousPayload)
      });

      const responseData = await response.json();
      console.log('🛡️ n8n Cyber-Sentinel response:', responseData);

      if (responseData.success && responseData.security_test === 'passed') {
        console.log('✅ n8n Cyber-Sentinel successfully blocked the malicious payload!');
        setSecurityTestResult({ 
          status: 'blocked', 
          message: 'why you wont hack me' 
        });
        
        // Disconnect from n8n after successful block
        setTimeout(() => {
          setSecurityTestResult({ 
            status: 'disconnected', 
            message: 'Disconnected from n8n after security test' 
          });
        }, 3000);
        
      } else if (responseData.success === false && responseData.security_test === 'failed') {
        console.log('❌ n8n Cyber-Sentinel failed to block the malicious payload!');
        setSecurityTestResult({ 
          status: 'failed', 
          message: 'Security test failed - n8n did not block malicious payload' 
        });
        
        // Disconnect from n8n after failed test
        setTimeout(() => {
          setSecurityTestResult({ 
            status: 'disconnected', 
            message: 'Disconnected from n8n after failed security test' 
          });
        }, 3000);
        
      } else {
        console.log('❌ Unexpected response from n8n Cyber-Sentinel');
        setSecurityTestResult({ 
          status: 'failed', 
          message: 'Unexpected response from n8n Cyber-Sentinel' 
        });
        
        // Disconnect from n8n after unexpected response
        setTimeout(() => {
          setSecurityTestResult({ 
            status: 'disconnected', 
            message: 'Disconnected from n8n after unexpected response' 
          });
        }, 3000);
      }
      
    } catch (error) {
      console.error('❌ Error in n8n Cyber-Sentinel test:', error);
      setSecurityTestResult({ 
        status: 'failed', 
        message: 'Error connecting to n8n Cyber-Sentinel' 
      });
      
      // Disconnect from n8n after error
      setTimeout(() => {
        setSecurityTestResult({ 
          status: 'disconnected', 
          message: 'Disconnected from n8n after connection error' 
        });
      }, 3000);
      
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedEmployee) return;
    
    setAnalyzing(true);
    setConnectionStatus('connecting');
    setAnalysisResult(null);
    setRawN8nData(null);
    
    try {
      console.log('🚀 Starting AI Analysis with n8n integration...');
      console.log('📡 Connecting to n8n webhook...');
      
      // Call the API route for employee analysis
      const response = await fetch('/api/employee-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: selectedEmployee.id,
          employee_data: {
            name: `${selectedEmployee.personal_info.first_name} ${selectedEmployee.personal_info.last_name}`,
            role: selectedEmployee.employment_details.position,
            department: selectedEmployee.employment_details.department,
            performance: {
              customer_satisfaction: selectedEmployee.performance.customer_satisfaction,
              clients_managed: selectedEmployee.performance.clients_managed,
              portfolio_size: selectedEmployee.performance.portfolio_size,
              management_level: selectedEmployee.employment_details.management_level,
              branch_location: selectedEmployee.employment_details.branch_location
            }
          },
          analysis_type: 'performance_review'
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
        
        // Check if this is a cybersecurity block
        if (response.status === 403 && errorData.error === 'why you wont hack me') {
          console.log('🛡️ Cybersecurity block detected');
          setConnectionStatus('blocked');
          return;
        }
        
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
      // n8n response has: employee_id, summary, strengths, areas_for_improvement, recommendations, risk_level, generated_at
      // Fallback data has: message with "fake data"
      const isFallbackData = apiResult.message && apiResult.message.includes('fake data');
      const isN8nData = apiResult.employee_id || apiResult.summary || apiResult.generated_at;
      
      console.log('🔍 Checking response type...');
      console.log('📋 API Result:', apiResult);
      console.log('📋 Message:', apiResult.message);
      console.log('📋 Employee ID:', apiResult.employee_id);
      console.log('📋 Summary:', apiResult.summary);
      console.log('📋 Generated At:', apiResult.generated_at);
      console.log('📋 Is fallback data:', isFallbackData);
      console.log('📋 Is n8n data:', isN8nData);
      console.log('📋 Response keys:', Object.keys(apiResult));
      
      if (isFallbackData) {
        console.log('⚠️ Using fallback data - n8n connection failed');
        setConnectionStatus('failed');
      } else if (isN8nData) {
        console.log('✅ Successfully connected to n8n and received real analysis!');
        setConnectionStatus('connected');
      } else {
        console.log('❓ Unknown response format');
        setConnectionStatus('failed');
      }

      // Convert API response to the expected format
      // n8n returns the data directly, not wrapped in a 'data' property
      const apiData = apiResult.data || apiResult;
      
      console.log('🔍 API Data structure:', apiData);
      console.log('🔍 Recommendations type:', typeof apiData.recommendations);
      console.log('🔍 Recommendations value:', apiData.recommendations);
      console.log('🔍 Strengths:', apiData.strengths);
      console.log('🔍 Risk level:', apiData.risk_level);
      
      // Map API response to our AnalysisResult interface
      // n8n returns: { employee_id, summary, strengths, areas_for_improvement, recommendations, risk_level, generated_at }
      const analysis: AnalysisResult = {
        recommendation: getRecommendationFromRiskLevel(apiData.risk_level),
        rationale: Array.isArray(apiData.strengths) ? apiData.strengths.map((item: any) => String(item || '')) : [],
        next_actions: apiData.recommendations?.map((rec: any) => {
          // Handle both string and object formats
          if (typeof rec === 'string') {
            return {
              action: rec,
              topic: 'AI Recommendation',
          in: '30 days'
            };
          } else if (rec && typeof rec === 'object') {
            return {
              action: rec.title || rec.action || 'Recommendation',
              topic: rec.description || rec.topic || 'AI Recommendation',
              in: '30 days'
            };
          } else {
            return {
              action: 'Recommendation',
              topic: 'AI Recommendation',
              in: '30 days'
            };
          }
        }) || [],
        confidence: 0.85, // Default confidence for n8n analysis
        requires_human_review: apiData.risk_level === 'High',
        risk_score: apiData.risk_level === 'High' ? 0.8 : apiData.risk_level === 'Medium' ? 0.5 : 0.2,
        potential: apiData.risk_level === 'Low' ? 'high' : apiData.risk_level === 'Medium' ? 'medium' : 'low'
      };
      
      console.log('🎯 Final analysis object:', analysis);

      setAnalysisResult(analysis);
      setRawN8nData(apiData);
    } catch (error) {
      console.error('❌ Error in analysis:', error);
      setConnectionStatus('failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'bonus': return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'promotion': return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case 'training': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'pip': return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case 'terminate_review': return 'text-red-400 bg-red-900/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getRecommendationLabel = (recommendation: string) => {
    switch (recommendation) {
      case 'bonus': return 'Bonus Recommended';
      case 'promotion': return 'Promotion Recommended';
      case 'training': return 'Training Required';
      case 'pip': return 'Performance Improvement Plan';
      case 'terminate_review': return 'Termination Review';
      default: return recommendation;
    }
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 4.5) return { color: 'bg-green-500', label: 'Excellent' };
    if (score >= 4.0) return { color: 'bg-blue-500', label: 'Good' };
    if (score >= 3.0) return { color: 'bg-yellow-500', label: 'Average' };
    return { color: 'bg-red-500', label: 'Poor' };
  };

  const getRecommendationFromRiskLevel = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'bonus';
      case 'Medium': return 'training';
      case 'High': return 'pip';
      default: return 'training';
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
          <h2 className="text-xl text-white mb-2">Loading Employee Data</h2>
          <p className="text-gray-400">Using AI to create realistic employee profiles...</p>
        </motion.div>
      </div>
    );
  }

  if (selectedEmployee) {
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
              <h1 className="text-3xl font-bold text-white mb-2">Employee Analysis Panel</h1>
              <p className="text-gray-400">AI-Powered Performance Analysis</p>
            </motion.div>
            <motion.button
              onClick={() => setSelectedEmployee(null)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Employees
            </motion.button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Employee Details */}
          <motion.div 
            className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {isClient ? `${selectedEmployee.personal_info.first_name[0]}${selectedEmployee.personal_info.last_name[0]}` : ''}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedEmployee.personal_info.first_name} {selectedEmployee.personal_info.last_name}</h2>
                  <p className="text-cyan-400 text-xl">{selectedEmployee.employment_details.position}</p>
                  <p className="text-gray-400">{selectedEmployee.employment_details.department} • {selectedEmployee.employment_details.status}</p>
                  <p className="text-gray-500 text-sm">{selectedEmployee.personal_info.contact.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Employee ID</div>
                <div className="text-lg font-mono text-white">{selectedEmployee.id}</div>
                <div className="text-sm text-gray-400 mt-2">Hire Date</div>
                <div className="text-sm text-white">{isClient ? format(new Date(selectedEmployee.employment_details.hire_date), 'MMM dd, yyyy') : ''}</div>
              </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {Object.entries(selectedEmployee.performance).map(([key, value]) => (
                <motion.div 
                  key={key}
                  className="bg-gray-800/50 rounded-lg p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-2xl font-bold text-white">
                    {typeof value === 'number' && key.includes('satisfaction') ? value.toFixed(1) :
                     typeof value === 'number' && key.includes('size') ? `${(value / 1000000).toFixed(1)}M` :
                     typeof value === 'number' ? value.toLocaleString() :
                     value}
                  </div>
                  <div className="text-sm text-gray-400 capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Analysis Buttons */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  onClick={handleRunAnalysis}
                  disabled={analyzing}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Connecting to n8n...
                    </>
                  ) : (
                    <>
                      <ChartBarIcon className="h-5 w-5" />
                      Run AI Analysis with n8n
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={handleTestHack}
                  disabled={analyzing}
                  className={`px-6 py-4 font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2 ${
                    securityTestResult.status === 'idle' 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                      : securityTestResult.status === 'testing'
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white'
                      : securityTestResult.status === 'blocked'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                      : securityTestResult.status === 'failed'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                      : securityTestResult.status === 'disconnected'
                      ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                  }`}
                  whileHover={{ scale: securityTestResult.status === 'idle' ? 1.05 : 1 }}
                  whileTap={{ scale: securityTestResult.status === 'idle' ? 0.95 : 1 }}
                  title="Test n8n Cyber-Sentinel by sending SQL injection payload"
                >
                  <span className="text-lg">
                    {securityTestResult.status === 'idle' ? '🛡️' :
                     securityTestResult.status === 'testing' ? '⏳' :
                     securityTestResult.status === 'blocked' ? '✅' :
                     securityTestResult.status === 'failed' ? '❌' :
                     securityTestResult.status === 'disconnected' ? '🔌' : '🛡️'}
                  </span>
                  {securityTestResult.status === 'idle' ? 'Test Security' :
                   securityTestResult.status === 'testing' ? 'Testing...' :
                   securityTestResult.status === 'blocked' ? 'Blocked!' :
                   securityTestResult.status === 'failed' ? 'Failed!' :
                   securityTestResult.status === 'disconnected' ? 'Disconnected' : 'Test Security'}
                </motion.button>
              </div>
              
              {/* Button Descriptions */}
              <div className="text-center text-xs text-gray-400 space-y-1">
                <p>Left: Run real AI analysis with n8n workflow</p>
                <p>Right: Test n8n Cyber-Sentinel with SQL injection payload</p>
              </div>
              
              {/* Security Test Result Display */}
              {securityTestResult.status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border text-center ${
                    securityTestResult.status === 'testing'
                      ? 'bg-yellow-900/30 border-yellow-500/30 text-yellow-400'
                      : securityTestResult.status === 'blocked'
                      ? 'bg-green-900/30 border-green-500/30 text-green-400'
                      : securityTestResult.status === 'failed'
                      ? 'bg-red-900/30 border-red-500/30 text-red-400'
                      : securityTestResult.status === 'disconnected'
                      ? 'bg-gray-900/30 border-gray-500/30 text-gray-400'
                      : 'bg-gray-900/30 border-gray-500/30 text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">
                      {securityTestResult.status === 'testing' ? '⏳' :
                       securityTestResult.status === 'blocked' ? '✅' :
                       securityTestResult.status === 'failed' ? '❌' :
                       securityTestResult.status === 'disconnected' ? '🔌' : '🛡️'}
                    </span>
                    <span className="font-semibold">
                      {securityTestResult.status === 'testing' ? 'Testing n8n Cyber-Sentinel...' :
                       securityTestResult.status === 'blocked' ? 'Security Test Passed!' :
                       securityTestResult.status === 'failed' ? 'Security Test Failed!' :
                       securityTestResult.status === 'disconnected' ? 'Disconnected from n8n' : 'Security Test'}
                    </span>
                  </div>
                  <p className="text-sm">{securityTestResult.message}</p>
                </motion.div>
              )}
              
              {/* Connection Status Display */}
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  connectionStatus === 'connected' ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                  connectionStatus === 'failed' ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
                  connectionStatus === 'blocked' ? 'bg-red-900/40 text-red-400 border border-red-500/40' :
                  connectionStatus === 'connecting' ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' :
                  'bg-gray-900/30 text-gray-400 border border-gray-500/30'
                }`}>
                  {connectionStatus === 'connected' && (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      n8n Connected Successfully
                    </>
                  )}
                  {connectionStatus === 'failed' && (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      n8n Connection Failed
                    </>
                  )}
                  {connectionStatus === 'blocked' && (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      🛡️ Security Blocked
                    </>
                  )}
                  {connectionStatus === 'connecting' && (
                    <>
                      <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-blue-400"></div>
                      Connecting to n8n...
                    </>
                  )}
                  {connectionStatus === 'idle' && (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      Ready to connect to n8n
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cybersecurity Block Message */}
          <AnimatePresence>
            {connectionStatus === 'blocked' && (
              <motion.div 
                className="bg-red-900/30 backdrop-blur-sm border border-red-500/50 rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-red-400 text-4xl">🛡️</span>
                  </div>
                  <h3 className="text-3xl font-bold text-red-400 mb-4">why you wont hack me</h3>
                  <p className="text-red-300 text-lg mb-6">
                    Malicious payload detected in request
                  </p>
                  <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30 max-w-md mx-auto">
                    <p className="text-red-200 text-sm">
                      🚨 Security Alert: Suspicious activity detected
                    </p>
                    <p className="text-red-300 text-xs mt-2">
                      Request blocked by cybersecurity system
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Connection Failed Error Message */}
          <AnimatePresence>
            {connectionStatus === 'failed' && (
              <motion.div 
                className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-400 text-2xl">❌</span>
                  </div>
                  <h3 className="text-2xl font-bold text-red-400 mb-4">n8n Connection Failed</h3>
                  <p className="text-red-300 mb-6">
                    Unable to connect to the n8n workflow. Please check:
                  </p>
                  <ul className="text-red-200 text-left max-w-md mx-auto space-y-2 mb-6">
                    <li>• n8n workflow is active and running</li>
                    <li>• Webhook URL is correct</li>
                    <li>• Network connection is stable</li>
                    <li>• n8n service is accessible</li>
                  </ul>
                  <div className="text-xs text-red-400">
                    n8n Webhook: <code className="bg-red-900/30 px-2 py-1 rounded">https://ahmadafaneh.app.n8n.cloud/webhook-test/test</code>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Analysis Result */}
          <AnimatePresence>
            {analysisResult && connectionStatus === 'connected' && (
              <motion.div 
                className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">AI Analysis Result</h3>
                
                {/* n8n Connection Status */}
                <div className="mb-8">
                  <div className="p-4 rounded-lg border bg-green-900/20 border-green-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-semibold">✅ Connected to n8n</span>
                      <span className="text-green-300 text-sm">Real AI analysis received from n8n workflow</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      n8n Webhook: <code className="bg-gray-800 px-2 py-1 rounded">https://ahmadafaneh.app.n8n.cloud/webhook-test/test</code>
                    </div>
                    {rawN8nData?.generated_at && (
                      <div className="mt-2 text-xs text-gray-400">
                        Analysis ID: <code className="bg-gray-800 px-2 py-1 rounded">{rawN8nData.employee_id}</code>
                        <span className="ml-2">Generated: {new Date(rawN8nData.generated_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analysis Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Recommendation</h4>
                    <div className={`text-2xl font-bold mb-4 px-4 py-3 rounded-lg border ${getRecommendationColor(analysisResult.recommendation)}`}>
                      {getRecommendationLabel(analysisResult.recommendation)}
                    </div>
                    
                    {/* n8n Summary */}
                    {rawN8nData?.summary && (
                    <div className="mb-6">
                        <h5 className="text-md font-semibold text-white mb-2">AI Summary</h5>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                          <p className="text-gray-300 leading-relaxed">{rawN8nData.summary}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h5 className="text-md font-semibold text-white mb-2">Strengths</h5>
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
                    
                    {/* Areas for Improvement */}
                    {rawN8nData?.areas_for_improvement && rawN8nData.areas_for_improvement.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-md font-semibold text-white mb-2">Areas for Improvement</h5>
                        <ul className="space-y-2">
                          {rawN8nData.areas_for_improvement.map((area: any, index: number) => {
                            const areaText = String(area || '');
                            return (
                              <li key={`improvement-${index}-${areaText.substring(0, 20)}`} className="text-gray-300 flex items-start gap-2">
                                <span className="text-yellow-400 font-bold text-sm mt-1">⚠</span>
                                <span>{areaText}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Next Actions</h4>
                    <ul className="space-y-3 mb-6">
                      {analysisResult.next_actions.map((action, index) => (
                        <li key={`action-${index}-${action.action}`} className="text-gray-300 flex items-start gap-2">
                          <span className="text-green-400 font-bold text-sm mt-1">✓</span>
                          <span>
                            <strong>{String(action.action || 'Action')}</strong>
                            {action.topic && ` - ${String(action.topic)}`}
                            {action.value && ` (${String(action.value)} ${String(action.currency || '')})`}
                            {action.in && ` in ${String(action.in)}`}
                            {action.goal && ` - ${String(action.goal)}`}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                        <div className="text-lg font-bold text-white">{(analysisResult.confidence * 100).toFixed(0)}%</div>
                        <div className="text-sm text-gray-400">Confidence</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                        <div className={`text-lg font-bold ${analysisResult.requires_human_review ? 'text-orange-400' : 'text-green-400'}`}>
                          {analysisResult.requires_human_review ? 'Required' : 'Not Required'}
                        </div>
                        <div className="text-sm text-gray-400">Human Review</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                        <div className={`text-lg font-bold ${
                          analysisResult.potential === 'high' ? 'text-green-400' : 
                          analysisResult.potential === 'medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {analysisResult.potential.charAt(0).toUpperCase() + analysisResult.potential.slice(1)}
                        </div>
                        <div className="text-sm text-gray-400">Potential</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                        <div className={`text-lg font-bold ${
                          analysisResult.potential === 'high' ? 'text-green-400' : 
                          analysisResult.potential === 'medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {selectedEmployee?.performance.customer_satisfaction ? 
                            `${selectedEmployee.performance.customer_satisfaction.toFixed(1)}/5` : 
                            'N/A'
                          }
                        </div>
                        <div className="text-sm text-gray-400">Avg Score</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              AI-Powered Employee Manager
            </h1>
            <p className="text-gray-300">Nexus Bank HR Intelligence Dashboard</p>
            <div className="mt-2 flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-300 border border-blue-700">
                Data Source: 📁 Local JSON Data
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-300 border border-blue-700">
                {filteredEmployees.length} of {employees.length} Employees
              </span>
            </div>
          </motion.div>
          <div className="flex gap-3">
            <motion.button
              onClick={loadEmployees}
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

      {/* Tabs and Filters */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: UserGroupIcon },
              { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
              { id: 'performance', label: 'Performance', icon: StarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'analytics' | 'performance')}
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
                placeholder="Search employees..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="إدارة الفروع">إدارة الفروع</option>
              <option value="العمليات المصرفية">العمليات المصرفية</option>
              <option value="الخدمات المصرفية للشركات">الخدمات المصرفية للشركات</option>
              <option value="خدمة العملاء">خدمة العملاء</option>
            </select>
            <select
              value={filters.performance}
              onChange={(e) => setFilters(prev => ({ ...prev, performance: e.target.value }))}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Performance</option>
              <option value="excellent">Excellent (4.5+)</option>
              <option value="good">Good (4.0-4.4)</option>
              <option value="average">Average (3.0-3.9)</option>
              <option value="poor">Poor (&lt;3.0)</option>
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
                      <p className="text-blue-100 text-sm">Total Employees</p>
                      <p className="text-white text-3xl font-bold">{analyticsData.totalEmployees}</p>
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
                      <p className="text-green-100 text-sm">Active Employees</p>
                      <p className="text-white text-3xl font-bold">{analyticsData.activeEmployees}</p>
                    </div>
                    <CheckCircleIcon className="h-8 w-8 text-green-200" />
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Avg Performance</p>
                      <p className="text-white text-3xl font-bold">{analyticsData.avgPerformance.toFixed(1)}</p>
                    </div>
                    <StarIcon className="h-8 w-8 text-yellow-200" />
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Departments</p>
                      <p className="text-white text-3xl font-bold">{Object.keys(analyticsData.departmentStats).length}</p>
                    </div>
                    <ChartBarIcon className="h-8 w-8 text-purple-200" />
                  </div>
                </motion.div>
              </div>

              {/* Employee Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEmployees.map((employee, index) => {
                  const performanceBadge = getPerformanceBadge(employee.performance.customer_satisfaction);
                  const fullName = `${employee.personal_info.first_name} ${employee.personal_info.last_name}`;
                  return (
                    <motion.div
                      key={employee.id}
                      onClick={() => handleEmployeeClick(employee)}
                      className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {isClient ? `${employee.personal_info.first_name[0]}${employee.personal_info.last_name[0]}` : ''}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{fullName}</h3>
                          <p className="text-cyan-400 text-sm">{employee.employment_details.position}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${performanceBadge.color}`}>
                          {performanceBadge.label}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Department:</span>
                          <span className="text-white">{employee.employment_details.department}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Status:</span>
                          <span className={`${employee.employment_details.status === 'نشط' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {employee.employment_details.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Performance:</span>
                          <span className="text-white">{employee.performance.customer_satisfaction}/5.0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Clients:</span>
                          <span className="text-white">{employee.performance.clients_managed}</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="text-xs text-gray-500">Click to analyze</span>
                      </div>
                    </motion.div>
                  );
                })}
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
              {/* Performance Distribution Chart */}
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Performance Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.performanceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {analyticsData.performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Performance */}
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Department Performance</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(analyticsData.departmentStats).map(([dept, stats]) => ({
                      department: dept,
                      avgPerformance: stats.avgPerformance,
                      count: stats.count
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="department" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }} 
                      />
                      <Bar dataKey="avgPerformance" fill="#06B6D4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Performance Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={employees.slice(0, 10).map((emp) => ({
                      name: emp.personal_info.first_name,
                      satisfaction: emp.performance.customer_satisfaction,
                      clients: emp.performance.clients_managed,
                      portfolio: emp.performance.portfolio_size / 1000000
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
                      />
                      <Line type="monotone" dataKey="satisfaction" stroke="#06B6D4" strokeWidth={2} />
                      <Line type="monotone" dataKey="clients" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="portfolio" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
