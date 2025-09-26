'use client';

import { useState, useRef, useEffect } from 'react';
import servicesData from '../fake-data/services.json';
import { apiService } from '@/lib/api';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(0);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const health = await apiService.checkHealth();
      if (health && health.api_key_configured) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      console.error('API health check failed:', error);
      setApiStatus('error');
    }
  };

  const generateGeminiResponse = async (userInput: string): Promise<string> => {
    try {
      const result = await apiService.generateContent(userInput);
      
      if (result.success && result.data) {
        return result.data;
      } else {
        // Fallback response if API fails
        return `I apologize, but I'm experiencing technical difficulties. However, I can help you with various banking services including:
        
- Customer 360: Complete customer insights and analytics
- Employee Management: HR and performance tracking  
- Compliance Monitoring: Risk assessment and regulatory compliance
- Hyper-personalization: AI-driven customer experience
- Smart Efficiency: Process optimization
- Predictive Market Analysis: Investment insights
- Product Innovation: New product development

What would you like to know about these services?`;
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Fallback response on error
      return `I'm currently unable to process your request, but I'm here to help with banking services. Please try asking about:
      
- Customer management and analytics
- Employee performance tracking
- Compliance and risk monitoring
- AI-powered personalization
- Process optimization
- Market analysis
- Product innovation

What interests you most?`;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageId = (messageIdCounter + 1).toString();
    setMessageIdCounter(prev => prev + 1);

    const userMessage: Message = {
      id: userMessageId,
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Generate response using Gemini API
      const geminiResponse = await generateGeminiResponse(userMessage.content);
      
      const assistantMessageId = (messageIdCounter + 1).toString();
      setMessageIdCounter(prev => prev + 1);

      const assistantMessage: Message = {
        id: assistantMessageId,
        type: 'assistant',
        content: geminiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessageId = (messageIdCounter + 1).toString();
      setMessageIdCounter(prev => prev + 1);

      const errorMessage: Message = {
        id: errorMessageId,
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-xl font-semibold mb-2">Welcome to Nexus Bank AI Brain</h2>
            <p className="mb-4">Your intelligent banking assistant powered by Gemini AI technology</p>
            <div className="mb-4 flex justify-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xs font-medium">
                🤖 Powered by Gemini API
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                apiStatus === 'connected' ? 'bg-green-600 text-white' :
                apiStatus === 'error' ? 'bg-red-600 text-white' :
                'bg-yellow-600 text-white'
              }`}>
                {apiStatus === 'connected' ? '🟢 API Connected' :
                 apiStatus === 'error' ? '🔴 API Error' :
                 '🟡 Checking...'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
              <span className="px-3 py-1 bg-gray-800/50 rounded-full text-xs">Employee Analytics</span>
              <span className="px-3 py-1 bg-gray-800/50 rounded-full text-xs">Customer Insights</span>
              <span className="px-3 py-1 bg-gray-800/50 rounded-full text-xs">Risk Management</span>
              <span className="px-3 py-1 bg-gray-800/50 rounded-full text-xs">Process Automation</span>
              <span className="px-3 py-1 bg-gray-800/50 rounded-full text-xs">Market Analysis</span>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                    : 'bg-gray-900/50 text-gray-100 border border-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 opacity-70 ${
                  message.type === 'user' ? 'text-cyan-100' : 'text-gray-400'
                }`}>
                  {isClient ? message.timestamp.toLocaleTimeString() : '--:--'}
                </div>
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-900/50 text-gray-100 border border-gray-800 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                <span>Gemini is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-black/30 backdrop-blur-sm border-t border-gray-800/50 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Send'
            )}
          </button>
          <button
            type="button"
            onClick={clearChat}
            className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Clear
          </button>
        </form>
      </div>
    </div>
  );
}
