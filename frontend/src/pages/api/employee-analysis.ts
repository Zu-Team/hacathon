import { NextApiRequest, NextApiResponse } from 'next';

// Define the interface for the request body
interface EmployeeAnalysisRequest {
  employee_id: string;
  employee_data: {
    name: string;
    role: string;
    department: string;
    performance: {
      customer_satisfaction: number;
      clients_managed: number;
      portfolio_size: number;
      management_level: string;
      branch_location: string;
    };
  };
  analysis_type: string;
}

// Define the interface for the response
interface EmployeeAnalysisResponse {
  status: string;
  message: string;
  data: {
    id: string;
    analysis_id?: string;
    employee_id?: string;
    analysis_date?: string;
    analysis_type?: string;
    overall_score?: number;
    risk_level?: string;
    strengths?: string[];
    areas_for_improvement?: string[];
    recommendations?: Array<{
      type: string;
      title: string;
      priority: string;
      description: string;
    }>;
    risk_factors?: string[];
    next_review_date?: string;
    status?: string;
    info?: string;
  };
}

// Cybersecurity check function
function detectMaliciousPayload(data: any): boolean {
  const suspiciousPatterns = [
    // SQL Injection patterns (more specific)
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\s+[a-zA-Z])/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
    /(\b(OR|AND)\s+1\s*=\s*1)/i,
    /(\b(OR|AND)\s+true)/i,
    /(;\s*(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION))/i,
    
    // XSS patterns
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    
    // Command injection patterns (very specific)
    /[;&|`$]\s*(cat|ls|pwd|whoami|id|uname|ps|netstat|ifconfig)/i,
    /(cat|ls|pwd|whoami|id|uname|ps|netstat|ifconfig)\s+[a-zA-Z]/i,
    /(ping|nslookup|traceroute|telnet|ssh|ftp)\s+[a-zA-Z]/i,
    
    // Path traversal patterns
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i,
    
    // Other suspicious patterns
    /eval\s*\(/i,
    /exec\s*\(/i,
    /system\s*\(/i,
    /shell_exec\s*\(/i,
    /passthru\s*\(/i,
    /proc_open\s*\(/i,
    /popen\s*\(/i,
    /file_get_contents\s*\(/i,
    /fopen\s*\(/i,
    /fwrite\s*\(/i,
    /fputs\s*\(/i,
    /include\s*\(/i,
    /require\s*\(/i,
    /include_once\s*\(/i,
    /require_once\s*\(/i
  ];

  // Convert data to string for analysis
  const dataString = JSON.stringify(data).toLowerCase();
  
  // Check for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(dataString)) {
      console.log('🚨 Malicious payload detected:', pattern.source);
      console.log('🚨 Data that triggered detection:', dataString);
      return true;
    }
  }
  
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeAnalysisResponse | { error: string; message?: string; details?: string }>
) {
  console.log('🚀 API endpoint called with method:', req.method);
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed. Only POST requests are accepted.' });
  }

  try {
    // 🛡️ CYBERSECURITY CHECK - Detect malicious payloads
    console.log('🛡️ Running cybersecurity check...');
    if (detectMaliciousPayload(req.body)) {
      console.log('🚨 MALICIOUS PAYLOAD DETECTED! Blocking request.');
      return res.status(403).json({ 
        error: 'why you wont hack me',
        message: 'Request blocked due to security concerns'
      });
    }
    console.log('✅ Cybersecurity check passed - request is clean');

    // Validate request body
    const requestBody: EmployeeAnalysisRequest = req.body;
    
    if (!requestBody.employee_id || !requestBody.employee_data) {
      return res.status(400).json({ error: 'Missing required fields: employee_id and employee_data' });
    }

    // n8n webhook URL for employee analysis
    const n8nWebhookUrl = 'https://ahmadafaneh.app.n8n.cloud/webhook-test/test';

    console.log('🚀 Forwarding request to n8n webhook:', n8nWebhookUrl);
    console.log('📦 Request payload:', JSON.stringify({
      ...requestBody,
      timestamp: new Date().toISOString(),
      source: 'nexus-bank-frontend'
    }, null, 2));

    // Forward the request to n8n webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Nexus-Bank-API/1.0',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          path: 'api/employee-manager', // This matches the Switch condition in your n8n workflow
          body: {
            ...requestBody,
            timestamp: new Date().toISOString(),
            source: 'nexus-bank-frontend'
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📡 n8n webhook response status: ${response.status}`);
      console.log(`📡 n8n webhook response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error(`❌ n8n webhook responded with status: ${response.status}`);
        const errorText = await response.text();
        console.error(`❌ n8n webhook error response:`, errorText);
        return res.status(500).json({ 
          error: 'n8n connection failed',
          message: 'Unable to connect to n8n workflow'
        });
      }

      const responseData = await response.json();
      console.log('✅ Successfully received response from n8n webhook');
      console.log('📊 n8n response data:', JSON.stringify(responseData, null, 2));
      console.log('📊 n8n response type:', typeof responseData);
      console.log('📊 n8n response keys:', Object.keys(responseData));

      // Handle case where n8n returns an array (like in your example)
      let actualData = responseData;
      if (Array.isArray(responseData) && responseData.length > 0) {
        actualData = responseData[0];
        console.log('📊 n8n returned array, using first element:', actualData);
      }

      // Check if the response indicates fallback data
      if (actualData.message && actualData.message.includes('fake data')) {
        console.log('⚠️ n8n returned fallback data - this might indicate an issue with the workflow');
      }

      // Check if this looks like real n8n data
      const hasN8nFields = actualData.employee_id || actualData.summary || actualData.generated_at;
      console.log('📊 Has n8n fields:', hasN8nFields);

      // Return the actual data from n8n
      return res.status(200).json(actualData);

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          console.error('⏰ Request to n8n webhook timed out after 60 seconds');
        } else {
          console.error('🌐 Network error when calling n8n webhook:', fetchError.message);
          console.error('🔍 Error details:', fetchError);
        }
      } else {
        console.error('❓ Unknown error when calling n8n webhook:', fetchError);
      }
      
      // Return error response on any network error
      console.log('🔄 Returning error response due to n8n connection failure');
      return res.status(500).json({ 
        error: 'n8n connection failed',
        message: 'Network error when connecting to n8n workflow'
      });
    }

  } catch (error) {
    console.error('❌ Error processing employee analysis request:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Return a generic error response
    return res.status(500).json({ 
      error: 'Internal server error while processing employee analysis request',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
    });
  }
}

/**
 * Generates a fallback response when n8n webhook is unavailable
 * This ensures the frontend always receives a valid response for testing
 */
function getFallbackResponse(requestBody: EmployeeAnalysisRequest): EmployeeAnalysisResponse {
  const performance = requestBody.employee_data.performance;
  const avgScore = performance.customer_satisfaction;
  
  // Generate realistic fallback analysis based on performance data
  let recommendation = 'training';
  let riskLevel = 'low';
  let strengths: string[] = [];
  let areasForImprovement: string[] = [];
  
  if (avgScore >= 4.5 && performance.clients_managed > 100) {
    recommendation = 'bonus';
    strengths = [
      'Exceptional customer satisfaction scores',
      'High client management performance',
      'Strong portfolio management capabilities'
    ];
  } else if (avgScore >= 4.0) {
    recommendation = 'training';
    strengths = [
      'Good customer satisfaction with room for improvement',
      'Solid client management skills'
    ];
    areasForImprovement = [
      'Consider advanced training programs',
      'Focus on portfolio optimization'
    ];
  } else if (avgScore >= 3.0) {
    recommendation = 'pip';
    riskLevel = 'medium';
    areasForImprovement = [
      'Customer satisfaction below expectations',
      'Client management needs improvement',
      'Structured development plan needed'
    ];
  } else {
    recommendation = 'terminate_review';
    riskLevel = 'high';
    areasForImprovement = [
      'Severely underperforming in customer satisfaction',
      'High risk to client relationships'
    ];
  }

  return {
    status: 'success',
    message: 'This is fake data from local testing - n8n webhook unavailable',
    data: {
      id: `fallback-${Date.now()}`,
      analysis_id: `ANALYSIS-${Date.now()}`,
      employee_id: requestBody.employee_id,
      analysis_date: new Date().toISOString(),
      analysis_type: requestBody.analysis_type || 'performance_review',
      overall_score: avgScore,
      risk_level: riskLevel,
      strengths,
      areas_for_improvement: areasForImprovement,
      recommendations: [
        {
          type: recommendation,
          title: getRecommendationTitle(recommendation),
          priority: riskLevel === 'high' ? 'high' : 'medium',
          description: getRecommendationDescription(recommendation, avgScore)
        }
      ],
      risk_factors: performance.customer_satisfaction < 3.0 ? ['Low customer satisfaction'] : [],
      next_review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
      status: 'completed',
      info: 'Fallback analysis generated locally'
    }
  };
}

/**
 * Helper function to generate recommendation titles
 */
function getRecommendationTitle(recommendation: string): string {
  switch (recommendation) {
    case 'bonus': return 'Quarterly Bonus Recommended';
    case 'training': return 'Professional Development Plan';
    case 'pip': return 'Performance Improvement Plan';
    case 'terminate_review': return 'Termination Review Required';
    default: return 'General Review';
  }
}

/**
 * Helper function to generate recommendation descriptions
 */
function getRecommendationDescription(recommendation: string, avgScore: number): string {
  switch (recommendation) {
    case 'bonus':
      return `Employee shows exceptional performance with an average score of ${avgScore.toFixed(1)}. Recommend processing quarterly bonus.`;
    case 'training':
      return `Employee has good potential with room for improvement. Recommend enrolling in advanced training programs.`;
    case 'pip':
      return `Employee performance is below expectations. Implement structured Performance Improvement Plan.`;
    case 'terminate_review':
      return `Employee is severely underperforming. Immediate HR consultation required for termination review.`;
    default:
      return 'General performance review recommended.';
  }
}
