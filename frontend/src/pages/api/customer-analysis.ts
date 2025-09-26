import { NextApiRequest, NextApiResponse } from 'next';

// Define the interface for the request body
interface CustomerAnalysisRequest {
  customer_id: string;
  customer_data: {
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
  };
  analysis_type: string;
}

// Define the interface for the response
interface CustomerAnalysisResponse {
  status: string;
  message: string;
  data: {
    id: string;
    analysis_id?: string;
    customer_id?: string;
    analysis_date?: string;
    analysis_type?: string;
    recommendation?: string;
    reasoning?: string;
    priority?: string;
    expected_outcome?: string;
    confidence?: number;
    next_actions?: Array<{
      action: string;
      topic: string;
      timeline: string;
    }>;
    risk_assessment?: {
      churn_risk: string;
      financial_stability: string;
      engagement_level: string;
    };
    summary?: string;
    generated_at?: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CustomerAnalysisResponse | { error: string; message?: string; details?: string }>
) {
  console.log('🚀 Customer Analysis API endpoint called with method:', req.method);
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed. Only POST requests are accepted.' });
  }

  try {
    // Validate request body
    const requestBody: CustomerAnalysisRequest = req.body;
    
    if (!requestBody.customer_id || !requestBody.customer_data) {
      return res.status(400).json({ error: 'Missing required fields: customer_id and customer_data' });
    }

    // n8n webhook URL for customer analysis
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
          'User-Agent': 'Nexus-Bank-Customer-API/1.0',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          path: 'api/customer-manager', // This matches the Switch condition in your n8n workflow
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
      const hasN8nFields = actualData.customer_id || actualData.summary || actualData.generated_at;
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
    console.error('❌ Error processing customer analysis request:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Return a generic error response
    return res.status(500).json({ 
      error: 'Internal server error while processing customer analysis request',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
    });
  }
}
