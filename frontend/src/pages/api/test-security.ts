import { NextApiRequest, NextApiResponse } from 'next';

// Simple string payload for security testing
type SecurityTestRequest = string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST requests are accepted.' });
  }

  try {
    // Get the simple string payload
    const requestBody: SecurityTestRequest = req.body;
    
    if (!requestBody || typeof requestBody !== 'string') {
      return res.status(400).json({ error: 'Invalid payload: expected simple string' });
    }

    // n8n webhook URL for security testing
    const n8nWebhookUrl = 'https://ahmadafaneh.app.n8n.cloud/webhook-test/test';

    console.log('🛡️ Testing n8n Cyber-Sentinel with simple malicious payload...');
    console.log('🚨 WARNING: This is a SECURITY TEST with SQL injection payload!');
    console.log('🚀 Sending request to n8n webhook:', n8nWebhookUrl);
    console.log('📦 Simple malicious payload:', requestBody);
    console.log('🚨 PAYLOAD TO N8N:');
    console.log('   - SQL Injection String:', requestBody);

    // Forward the request to n8n webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Nexus-Bank-Security-Test/1.0',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          payload: requestBody,
          timestamp: new Date().toISOString(),
          source: 'nexus-bank-security-test'
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
        
        // Check if this is a security block from n8n
        if (response.status === 403) {
          console.log('🛡️ n8n Cyber-Sentinel blocked the malicious payload!');
          return res.status(200).json({
            success: true,
            security_test: 'passed',
            message: 'why you wont hack me',
            n8n_response: errorText,
            status: 'blocked_by_n8n_cyber_sentinel'
          });
        }
        
        return res.status(500).json({ 
          error: 'n8n connection failed',
          message: 'Unable to connect to n8n workflow'
        });
      }

      const responseData = await response.json();
      console.log('✅ n8n processed the request (this should not happen with malicious payload)');
      console.log('📊 n8n response data:', JSON.stringify(responseData, null, 2));

      // If we get here, n8n didn't block the malicious payload (security test failed)
      return res.status(200).json({
        success: false,
        security_test: 'failed',
        message: 'n8n did not block the malicious payload',
        n8n_response: responseData,
        status: 'not_blocked_by_n8n'
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          console.error('⏰ Request to n8n webhook timed out after 60 seconds');
        } else {
          console.error('🌐 Network error when calling n8n webhook:', fetchError.message);
        }
      } else {
        console.error('❓ Unknown error when calling n8n webhook:', fetchError);
      }
      
      return res.status(500).json({ 
        error: 'n8n connection failed',
        message: 'Network error when connecting to n8n workflow'
      });
    }

  } catch (error) {
    console.error('Error processing security test request:', error);
    
    return res.status(500).json({ 
      error: 'Internal server error while processing security test request' 
    });
  }
}
