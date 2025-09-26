# n8n Integration for Employee Analysis

## 🎯 Overview
The employee analysis feature now connects directly to your n8n webhook for AI-powered analysis.

## 🔗 Webhook Configuration
- **URL**: `https://ahmadafaneh.app.n8n.cloud/webhook-test/test`
- **Method**: POST
- **Content-Type**: application/json

## 📡 Data Flow
```
Employee Manager Page → /api/employee-analysis → n8n Webhook → AI Analysis → Response
```

## 📦 Request Format
When you click "Run AI Analysis" on any employee, the following data is sent to n8n:

```json
{
  "employee_id": "EMP001",
  "employee_data": {
    "name": "Sarah Johnson",
    "role": "Senior Developer",
    "department": "IT",
    "performance": {
      "peer_review_score": 4.2,
      "productivity_score": 4.3,
      "team_collaboration": 4.1,
      "policy_violations": 0,
      "security_incidents": 0,
      "csat": 4.5,
      "tickets_closed": 42,
      "bug_rate": 0.03
    }
  },
  "analysis_type": "performance_review"
}
```

## 📋 Expected Response Format
Your n8n workflow should return:

```json
{
  "status": "success",
  "message": "Analysis completed successfully",
  "data": {
    "analysis_id": "ANALYSIS-123456",
    "employee_id": "EMP001",
    "overall_score": 4.2,
    "risk_level": "low",
    "strengths": ["High performance", "Team collaboration"],
    "recommendations": [
      {
        "type": "bonus",
        "title": "Quarterly Bonus Recommended",
        "priority": "high",
        "description": "Employee shows exceptional performance"
      }
    ]
  }
}
```

## 🛡️ Fallback System
If the n8n webhook is unavailable:
- ✅ **Graceful fallback** with realistic analysis
- ✅ **No errors** - always returns 200 status
- ✅ **Smart analysis** based on actual performance data
- ✅ **Perfect for testing** without n8n dependency

## 🔧 Configuration
The webhook URL is hardcoded in:
- **File**: `frontend/src/pages/api/employee-analysis.ts`
- **Line**: 69
- **Variable**: `n8nWebhookUrl`

To change the webhook URL, edit this file directly.

## 🎯 Testing
1. **Go to**: Employee Manager page
2. **Click any employee** to select them
3. **Click "Run AI Analysis"**
4. **Watch the magic happen** - real n8n analysis!

## 🐛 Troubleshooting
- **No response**: Check if n8n workflow is active
- **Timeout errors**: n8n has 60-second timeout limit
- **Fallback mode**: If n8n fails, you'll get realistic mock analysis
- **Console logs**: Check browser console for detailed error messages

## 🚀 Ready to Use!
Your employee analysis now connects to real n8n AI processing! 🎉
