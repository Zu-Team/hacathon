'use client';

import { useState, useEffect } from 'react';

interface LoanProcessingData {
  stage: string;
  avgMinutes: number;
  slaMinutes: number;
  approvalRate: number;
  declineRate: number;
  reworkRate: number;
}

interface AccountOpeningData {
  step: string;
  errors: number;
  resubmissions: number;
  docMissingRate: number;
}

interface SettlementData {
  hour: number;
  volume: number;
  anomalies: number;
  peak: boolean;
}

interface ComplaintData {
  category: string;
  cases: number;
  avgResolutionHrs: number;
  csat: number;
}

interface StaffData {
  team: string;
  activeTasks: number;
  backlog: number;
  completionPerHour: number;
  skills: string[];
  shift: string;
}

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  source: string;
  timestamp: string;
}

interface Recommendation {
  id: string;
  action: string;
  expected_impact: string;
  confidence: number;
}

interface StaffAdjustment {
  team: string;
  from: string;
  to: string;
  delta_headcount: number;
}

interface KPIs {
  tat_hours: number;
  error_rate: number;
  automation_rate: number;
  sla_adherence: number;
  cost_per_case: number;
  csat: number;
}

export default function SmartEfficiencyPage() {
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [currentProcess, setCurrentProcess] = useState<'Loans' | 'Accounts' | 'Settlements' | 'Complaints' | 'Staff'>('Loans');
  const [isSimulating, setIsSimulating] = useState(false);
  const [loanData, setLoanData] = useState<LoanProcessingData[]>([]);
  const [accountData, setAccountData] = useState<AccountOpeningData[]>([]);
  const [settlementData, setSettlementData] = useState<SettlementData[]>([]);
  const [complaintData, setComplaintData] = useState<ComplaintData[]>([]);
  const [staffData, setStaffData] = useState<StaffData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [staffAdjustments, setStaffAdjustments] = useState<StaffAdjustment[]>([]);
  const [kpis, setKpis] = useState<KPIs>({
    tat_hours: 0,
    error_rate: 0,
    automation_rate: 0,
    sla_adherence: 0,
    cost_per_case: 0,
    csat: 0
  });

  const generateLoanData = () => [
    { stage: 'Intake', avgMinutes: 15, slaMinutes: 20, approvalRate: 0.95, declineRate: 0.03, reworkRate: 0.02 },
    { stage: 'KYC', avgMinutes: 25, slaMinutes: 30, approvalRate: 0.88, declineRate: 0.08, reworkRate: 0.04 },
    { stage: 'Underwriting', avgMinutes: 47, slaMinutes: 30, approvalRate: 0.62, declineRate: 0.18, reworkRate: 0.20 },
    { stage: 'Approval', avgMinutes: 12, slaMinutes: 15, approvalRate: 0.92, declineRate: 0.05, reworkRate: 0.03 }
  ];

  const generateAccountData = () => [
    { step: 'Application', errors: 0.08, resubmissions: 0.05, docMissingRate: 0.06 },
    { step: 'KYC', errors: 0.14, resubmissions: 0.09, docMissingRate: 0.11 },
    { step: 'Verification', errors: 0.12, resubmissions: 0.07, docMissingRate: 0.08 },
    { step: 'Activation', errors: 0.04, resubmissions: 0.02, docMissingRate: 0.03 }
  ];

  const generateSettlementData = () => Array.from({length: 24}, (_, i) => ({
    hour: i,
    volume: Math.floor(Math.random() * 500) + 200 + (i >= 12 && i <= 16 ? 300 : 0),
    anomalies: Math.floor(Math.random() * 15),
    peak: i >= 12 && i <= 16
  }));

  const generateComplaintData = () => [
    { category: 'Card Dispute', cases: 64, avgResolutionHrs: 36, csat: 3.8 },
    { category: 'Account Access', cases: 42, avgResolutionHrs: 24, csat: 4.2 },
    { category: 'Transaction Error', cases: 38, avgResolutionHrs: 18, csat: 4.5 },
    { category: 'Service Quality', cases: 29, avgResolutionHrs: 48, csat: 3.2 },
    { category: 'Billing Issue', cases: 55, avgResolutionHrs: 30, csat: 3.9 }
  ];

  const generateStaffData = () => [
    { team: 'Ops A', activeTasks: 42, backlog: 17, completionPerHour: 11, skills: ['KYC', 'OCR'], shift: '12–20' },
    { team: 'Ops B', activeTasks: 38, backlog: 23, completionPerHour: 9, skills: ['Underwriting', 'Risk'], shift: '08–16' },
    { team: 'Ops C', activeTasks: 35, backlog: 15, completionPerHour: 13, skills: ['Settlement', 'Compliance'], shift: '16–00' },
    { team: 'Support', activeTasks: 28, backlog: 31, completionPerHour: 7, skills: ['Customer Service', 'Resolution'], shift: '09–17' }
  ];

  const generateAlerts = (): Alert[] => [
    { id: 'a1', severity: 'high', message: 'Underwriting SLA breached - 37% backlog increase', source: 'loanProcessing.Underwriting', timestamp: new Date().toISOString() },
    { id: 'a2', severity: 'medium', message: 'Peak transaction volume forecasted 14:00-16:00', source: 'settlement.Volume', timestamp: new Date().toISOString() },
    { id: 'a3', severity: 'low', message: 'Staff Ops C completion rate above target', source: 'staff.Performance', timestamp: new Date().toISOString() }
  ];

  const generateRecommendations = (): Recommendation[] => [
    { id: 'r1', action: 'Enable OCR doc-check for loans', expected_impact: 'errors -41%, TAT -22%', confidence: 0.78 },
    { id: 'r2', action: 'Auto-triage complaints L1', expected_impact: 'TAT -28%', confidence: 0.85 },
    { id: 'r3', action: 'Shift 2 FTE to settlements 12–14pm', expected_impact: 'queue time -22%', confidence: 0.72 }
  ];

  const generateStaffAdjustments = (): StaffAdjustment[] => [
    { team: 'Ops A', from: '12:00', to: '14:00', delta_headcount: 2 },
    { team: 'Ops C', from: '16:00', to: '18:00', delta_headcount: 1 }
  ];

  const calculateKPIs = () => {
    const tat = loanData.length > 0 ? loanData.reduce((sum, item) => sum + item.avgMinutes, 0) / loanData.length / 60 : 0;
    const errorRate = accountData.length > 0 ? accountData.reduce((sum, item) => sum + item.errors, 0) / accountData.length : 0;
    const automationRate = automationEnabled ? 0.56 : 0.23;
    const slaAdherence = loanData.length > 0 ? loanData.filter(item => item.avgMinutes <= item.slaMinutes).length / loanData.length : 0;
    const costPerCase = 12.4 + (Math.random() - 0.5) * 4;
    const csat = complaintData.length > 0 ? complaintData.reduce((sum, item) => sum + item.csat, 0) / complaintData.length : 0;

    setKpis({
      tat_hours: parseFloat(tat.toFixed(1)),
      error_rate: parseFloat(errorRate.toFixed(3)),
      automation_rate: parseFloat(automationRate.toFixed(2)),
      sla_adherence: parseFloat(slaAdherence.toFixed(2)),
      cost_per_case: parseFloat(costPerCase.toFixed(1)),
      csat: parseFloat(csat.toFixed(1))
    });
  };

  const simulateOperations = async () => {
    setIsSimulating(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoanData(generateLoanData());
    setAccountData(generateAccountData());
    setSettlementData(generateSettlementData());
    setComplaintData(generateComplaintData());
    setStaffData(generateStaffData());
    setAlerts(generateAlerts());
    setRecommendations(generateRecommendations());
    setStaffAdjustments(generateStaffAdjustments());
    
    setIsSimulating(false);
  };

  useEffect(() => {
    simulateOperations();
  }, []);

  useEffect(() => {
    calculateKPIs();
  }, [loanData, accountData, automationEnabled, complaintData]);

  const exportToN8n = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      process: currentProcess,
      automation_enabled: automationEnabled,
      kpis,
      alerts,
      recommendations,
      staff_adjustments: staffAdjustments,
      process_data: {
        loans: loanData,
        accounts: accountData,
        settlements: settlementData,
        complaints: complaintData,
        staff: staffData
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'low': return 'text-green-400 bg-green-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-emerald-500/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Smart Efficiency Expert
              </h1>
              <p className="text-gray-300 mt-2">Make Operations Flow with Intelligent Automation</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAutomationEnabled(!automationEnabled)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  automationEnabled 
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg' 
                    : 'bg-gray-800 text-gray-300 border border-gray-600'
                }`}
              >
                {automationEnabled ? 'Automation ON' : 'Automation OFF'}
              </button>
              <button
                onClick={simulateOperations}
                disabled={isSimulating}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {isSimulating ? 'Simulating...' : 'Simulate Operations'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Process Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {(['Loans', 'Accounts', 'Settlements', 'Complaints', 'Staff'] as const).map((process) => (
              <button
                key={process}
                onClick={() => setCurrentProcess(process)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentProcess === process
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
                }`}
              >
                {process}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-sm text-gray-400 mb-1">Avg TAT (hrs)</div>
            <div className="text-2xl font-bold text-emerald-400">{kpis.tat_hours}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-sm text-gray-400 mb-1">Error Rate (%)</div>
            <div className="text-2xl font-bold text-red-400">{(kpis.error_rate * 100).toFixed(1)}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-sm text-gray-400 mb-1">Automation Rate (%)</div>
            <div className="text-2xl font-bold text-cyan-400">{(kpis.automation_rate * 100).toFixed(0)}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-sm text-gray-400 mb-1">SLA Adherence (%)</div>
            <div className="text-2xl font-bold text-green-400">{(kpis.sla_adherence * 100).toFixed(0)}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-sm text-gray-400 mb-1">Cost per Case ($)</div>
            <div className="text-2xl font-bold text-yellow-400">{kpis.cost_per_case}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-sm text-gray-400 mb-1">CSAT</div>
            <div className="text-2xl font-bold text-purple-400">{kpis.csat}</div>
          </div>
        </div>

        {/* Live Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Live Alerts</h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-white">{alert.message}</span>
                    </div>
                    <div className="text-sm text-gray-400">{alert.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Process Data Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Loan Processing Pipeline */}
          {currentProcess === 'Loans' && (
            <>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Loan Processing Stages</h3>
                <div className="space-y-4">
                  {loanData.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{stage.stage}</div>
                          <div className="text-sm text-gray-400">{stage.avgMinutes}min avg</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${stage.avgMinutes > stage.slaMinutes ? 'text-red-400' : 'text-green-400'}`}>
                          SLA: {stage.slaMinutes}min
                        </div>
                        <div className="text-xs text-gray-400">
                          {stage.approvalRate > 0.8 ? '✓' : '⚠'} {(stage.approvalRate * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Settlement Volume by Hour</h3>
                <div className="space-y-2">
                  {settlementData.slice(8, 20).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 text-sm text-gray-400">{item.hour}:00</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.peak ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'}`}
                          style={{width: `${(item.volume / 1000) * 100}%`}}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-300 w-16 text-right">{item.volume}</div>
                      {item.anomalies > 5 && <span className="text-xs text-red-400">⚠</span>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Account Opening */}
          {currentProcess === 'Accounts' && (
            <>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Account Opening Steps</h3>
                <div className="space-y-4">
                  {accountData.map((step, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{step.step}</div>
                        <div className="text-sm text-gray-400">Error Rate: {(step.errors * 100).toFixed(1)}%</div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="text-red-400">Resub: {(step.resubmissions * 100).toFixed(1)}%</div>
                        <div className="text-yellow-400">Missing: {(step.docMissingRate * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Complaints */}
          {currentProcess === 'Complaints' && (
            <>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Complaint Categories</h3>
                <div className="space-y-4">
                  {complaintData.map((complaint, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{complaint.category}</div>
                        <div className="text-sm text-gray-400">{complaint.cases} cases</div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="text-cyan-400">{complaint.avgResolutionHrs}h avg</div>
                        <div className="text-emerald-400">CSAT: {complaint.csat}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Staff Performance */}
          {currentProcess === 'Staff' && (
            <>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Staff Performance</h3>
                <div className="space-y-4">
                  {staffData.map((staff, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{staff.team}</div>
                        <div className="text-sm text-gray-400">{staff.shift}</div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="text-cyan-400">{staff.activeTasks} active</div>
                        <div className="text-red-400">{staff.backlog} backlog</div>
                        <div className="text-emerald-400">{staff.completionPerHour}/hr</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">AI Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <div className="text-white font-medium mb-2">{rec.action}</div>
                  <div className="text-emerald-400 text-sm mb-2">{rec.expected_impact}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">Confidence</div>
                    <div className="text-sm text-cyan-400">{(rec.confidence * 100).toFixed(0)}%</div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                      style={{width: `${rec.confidence * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Section */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white">Export to n8n</h2>
            <p className="text-gray-400">JSON payload ready for workflow automation</p>
          </div>
          
          <div className="p-6">
            <div className="bg-gray-900/50 rounded-xl border border-gray-600/50 overflow-hidden mb-4">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-600/50">
                <span className="text-emerald-400 text-sm font-mono">automation_data.json</span>
              </div>
              <pre className="p-4 text-sm text-gray-300 overflow-x-auto max-h-64">
                {exportToN8n()}
              </pre>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportToN8n());
                  alert('Data copied to clipboard!');
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300"
              >
                📋 Copy JSON
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([exportToN8n()], {type: 'application/json'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `smart-efficiency-data-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300"
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
