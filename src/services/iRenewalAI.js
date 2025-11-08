// Py360 AI Service - Dashboard & General Renewal Management AI Agent
// Specialized for dashboard insights, renewal analysis, and strategic recommendations

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL_NAME = 'gpt-3.5-turbo';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY || 'your-openai-api-key-here';

// Enhanced system prompt for Py360 AI Agent
const IRENEWAL_AI_PROMPT = `You are Py360, an intelligent AI assistant specialized in insurance renewal management and strategic analysis. You are the primary AI assistant for the renewal management dashboard and provide comprehensive insights across all aspects of renewal operations.

PERSONALITY & IDENTITY:
- Your name is "Py360" - always introduce yourself warmly

- You are a senior renewal management consultant with deep expertise
- Maintain conversation context and build relationships with users
- Be proactive in offering insights and asking relevant follow-up questions
- Show enthusiasm for helping optimize renewal processes

CORE EXPERTISE AREAS:
1. **Dashboard Analytics** - Interpret metrics, identify trends, provide actionable insights
2. **Renewal Strategy** - Optimize renewal rates, reduce churn, improve customer retention
3. **Process Optimization** - Streamline workflows, eliminate bottlenecks, improve efficiency
4. **Performance Analysis** - Analyze team performance, channel effectiveness, conversion rates
5. **Predictive Insights** - Forecast trends, identify risks, recommend preventive actions
6. **Customer Journey** - Map customer experience, identify improvement opportunities
7. **Channel Management** - Optimize digital vs traditional channels, improve user experience
8. **Financial Analysis** - Analyze premium collection, revenue optimization, cost management

RESPONSE STRUCTURE - ALWAYS USE THIS FORMAT:
**📊 CURRENT SITUATION**
• [Brief assessment of current metrics/situation]
• [Key performance indicators analysis]
• [Immediate observations]

**🔍 KEY INSIGHTS**
• [Critical findings and patterns]
• [Performance drivers and inhibitors]
• [Opportunities and risks identified]

**💡 STRATEGIC RECOMMENDATIONS**
1. **Immediate Actions** (Next 1-2 weeks)
   • [Specific actionable steps with expected impact]
   • [Quick wins and low-hanging fruit]

2. **Short-term Improvements** (1-3 months)
   • [Process optimizations and strategic changes]
   • [System enhancements and team development]

3. **Long-term Strategy** (3-12 months)
   • [Strategic initiatives and major improvements]
   • [Technology upgrades and organizational changes]

**📈 SUCCESS METRICS**
• [How to measure improvement]
• [Key performance indicators to track]
• [Expected outcomes and timelines]

**❓ NEXT QUESTIONS**
• [Relevant follow-up questions to explore]
• [Additional data or context needed]

CONTEXT-AWARE RESPONSES BY PAGE:
- **Dashboard**: Focus on overall portfolio performance, trend analysis, strategic insights using actual metrics
- **Case Tracking**: Emphasize workflow optimization, bottleneck identification, process efficiency
- **Upload**: Concentrate on data quality, file processing, document management, and upload optimization
- **Policy Timeline**: Highlight customer journey optimization, timing strategies, touchpoint effectiveness
- **Closed Cases**: Analyze completion patterns, success factors, lessons learned
- **Campaign Management**: Focus on campaign performance, ROI optimization, audience targeting
- **Email Manager**: Concentrate on email effectiveness, communication strategies, engagement metrics
- **WhatsApp Manager**: Focus on messaging optimization, conversation flows, delivery rates

IMPORTANT PAGE-SPECIFIC RULES:
- Only reference dashboard metrics when on the Dashboard page
- Provide page-appropriate advice and insights
- Avoid generic responses - be specific to the current page context
- Ask page-relevant follow-up questions

CONVERSATION GUIDELINES:
- Always acknowledge previous conversations and build on them
- Use the user's name when known and maintain personal connection
- Ask clarifying questions to provide more targeted advice
- Reference specific metrics and data when available
- Provide both tactical and strategic perspectives
- Be encouraging and supportive while being honest about challenges

FORMATTING RULES:
- Use emojis for section headers (📊, 🔍, 💡, 📈, ❓)
- Use bullet points (•) for insights and observations
- Use numbered lists for recommendations
- Bold important metrics and outcomes
- Keep sections concise but comprehensive
- Add spacing between sections for readability

TONE & STYLE:
- Professional yet approachable
- Data-driven but accessible
- Confident and knowledgeable
- Encouraging and solution-focused
- Proactive in offering additional value

Remember: You are not just answering questions - you are providing strategic consulting to help optimize renewal management operations.`;

/**
 * Initialize the Renew-iQ AI agent
 */
export const initializeRenewalAgent = async () => {
  try {
    if (!API_KEY || API_KEY === 'your-openai-api-key-here') {
      throw new Error('OpenAI API key not configured. Please set REACT_APP_OPENAI_API_KEY environment variable.');
    }
    
    // Test the API connection with a simple request
    const testResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      })
    });
    
    if (!testResponse.ok) {
      const errorData = await testResponse.json().catch(() => ({}));
      throw new Error(`OpenAI API connection failed: ${errorData.error?.message || testResponse.statusText}`);
    }
    
    return { success: true, message: 'Py360 AI agent initialized successfully with OpenAI' };
  } catch (error) {
    console.error('Failed to initialize Py360 AI agent:', error);
    throw error;
  }
};

/**
 * Send message to Renew-iQ AI with enhanced context awareness
 */
export const sendMessage = async (message, context = [], onChunk = null, _pageContext = null, dashboardData = null) => {
  try {
    // Keep conversation context (last 8 messages for better memory)
    const recentContext = context.slice(-8);
    
    // Extract page context from message if embedded
    let pageContextPrompt = '';
    let actualUserMessage = message;
    
    if (message.includes('CURRENT PAGE CONTEXT:')) {
      const parts = message.split('USER QUERY:');
      if (parts.length === 2) {
        pageContextPrompt = parts[0].trim();
        actualUserMessage = parts[1].trim();
      }
    }
    
    // Check if this is a greeting message and no previous context - BEFORE processing context
    const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening)$/i.test(actualUserMessage.trim());
    const isFirstMessage = recentContext.length === 0;
    
    if (isGreeting && isFirstMessage) {
      // Return a structured greeting response immediately
      const greetingResponse = `**👋 Hello! I'm Py360**

I'm Py360, your intelligent AI assistant specialized in insurance renewal management and strategic analysis. I'm here to help you optimize your renewal processes and improve business performance.

**🎯 What I Can Help You With:**
• **Dashboard Analytics** - Analyze your portfolio performance and identify trends
• **Renewal Strategy** - Optimize renewal rates and reduce customer churn  
• **Process Optimization** - Streamline workflows and eliminate bottlenecks
• **Performance Analysis** - Evaluate team and channel effectiveness
• **Predictive Insights** - Forecast trends and identify potential risks
• **Customer Journey** - Map and optimize the customer experience
• **Financial Analysis** - Analyze premium collection and revenue optimization

**💡 Quick Start Options:**
• "Analyze my current renewal portfolio performance"
• "What strategies can improve my renewal rates?"
• "How can I optimize my digital channel performance?"
• "What are the key bottlenecks in my renewal process?"
• "Provide insights on my premium collection efficiency"

**❓ What would you like to explore today?**
Please let me know what specific area you'd like to focus on, and I'll provide detailed insights and recommendations!`;

      if (onChunk && typeof onChunk === 'function') {
        // Simulate streaming for consistency
        const words = greetingResponse.split(' ');
        let currentText = '';
        
        for (let i = 0; i < words.length; i++) {
          currentText += words[i] + ' ';
          onChunk(words[i] + ' ', currentText.trim());
          await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for streaming effect
        }
      }
      
      return {
        message: { content: greetingResponse },
        done: true,
      };
    }
    
    // Enhanced context with dashboard data (only when relevant)
    let dashboardContextPrompt = '';
    if (dashboardData) {
      dashboardContextPrompt = `
CURRENT DASHBOARD METRICS:
• Total Portfolio: ${dashboardData.totalCases || 'N/A'} cases
• In Progress: ${dashboardData.inProgress || 'N/A'} cases
• Renewed: ${dashboardData.renewed || 'N/A'} cases  
• Pending Action: ${dashboardData.pendingAction || 'N/A'} cases
• Collection Rate: ${dashboardData.collectionRate || 'N/A'}%
• Digital Channel Usage: ${dashboardData.digitalUsage || 'N/A'}%
• Current Period: ${dashboardData.period || 'Current Quarter'}

Use these metrics to provide specific insights and recommendations.
`;
    }
    
    // Build comprehensive system prompt
    const enhancedSystemPrompt = `${IRENEWAL_AI_PROMPT}

${pageContextPrompt ? `\n${pageContextPrompt}\n` : ''}
${dashboardContextPrompt}

IMPORTANT: 
- Provide responses using the exact format specified in your prompt
- Reference specific metrics ONLY when provided in the dashboard context
- Be proactive in offering strategic insights relevant to the current page
- Focus specifically on the current page context and avoid unrelated topics
- Always end with relevant follow-up questions specific to the current page`;
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: enhancedSystemPrompt,
          },
          ...recentContext.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })),
          {
            role: 'user',
            content: `${actualUserMessage}

Please provide a comprehensive response using the structured format specified in your system prompt.`,
          },
        ],
        stream: onChunk ? true : false,
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Py360 AI Error: ${errorData.error || response.statusText}`);
    }

    // Handle streaming response
    if (onChunk && typeof onChunk === 'function') {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                return {
                  message: {
                    content: fullContent,
                  },
                  done: true,
                };
              }
              
              try {
                const parsedData = JSON.parse(data);
                const content = parsedData.choices?.[0]?.delta?.content;
                if (content) {
                  fullContent += content;
                  onChunk(content, fullContent);
                }
              } catch (parseError) {
                continue;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        message: {
          content: fullContent,
        },
        done: true,
      };
    } else {
      // Non-streaming fallback
      const data = await response.json();
      return {
        message: {
          content: data.choices?.[0]?.message?.content || '',
        },
        done: true,
      };
    }
  } catch (error) {
    console.error('Py360 AI Error:', error);
    throw error;
  }
};

/**
 * Analyze dashboard data and provide strategic insights
 */
export const analyzeDashboardData = async (dashboardData, onChunk = null) => {
  try {
    const analysisPrompt = `Analyze my current renewal portfolio performance and provide strategic insights:

PORTFOLIO METRICS:
• Total Cases: ${dashboardData.totalCases} 
• In Progress: ${dashboardData.inProgress} (${((dashboardData.inProgress / dashboardData.totalCases) * 100).toFixed(1)}%)
• Successfully Renewed: ${dashboardData.renewed} (${((dashboardData.renewed / dashboardData.totalCases) * 100).toFixed(1)}%)
• Pending Action: ${dashboardData.pendingAction} (${((dashboardData.pendingAction / dashboardData.totalCases) * 100).toFixed(1)}%)

CHANNEL PERFORMANCE:
• Online Portal: 563 cases (45% of total)
• Mobile App: 375 cases (30% of total)  
• Branch Offices: 187 cases (15% of total)
• Agent Network: 125 cases (10% of total)

FINANCIAL PERFORMANCE:
• Premium Target: ₹17,100,000
• Amount Collected: ₹13,850,000 (${((13850000 / 17100000) * 100).toFixed(1)}%)
• Outstanding: ₹3,250,000 (${((3250000 / 17100000) * 100).toFixed(1)}%)

Please provide a comprehensive analysis with strategic recommendations for improving renewal performance.`;

    return await sendMessage(analysisPrompt, [], onChunk, null, dashboardData);
  } catch (error) {
    console.error('Dashboard analysis failed:', error);
    throw error;
  }
};

/**
 * Get renewal optimization suggestions based on current performance
 */
export const getRenewalOptimizationSuggestions = async (filters, onChunk = null) => {
  try {
    const optimizationPrompt = `Based on current renewal performance data, provide optimization recommendations:

CURRENT FILTERS & CONTEXT:
• Date Range: ${filters.dateRange || 'Current Period'}
• Policy Type Focus: ${filters.policyType || 'All Types'}
• Status Filter: ${filters.status || 'All Statuses'}
• Team Focus: ${filters.team || 'All Teams'}

PERFORMANCE INDICATORS:
• Overall Renewal Rate: 62.4% (780 of 1,250 policies)
• Digital Channel Adoption: 75% (938 of 1,250 cases)
• Traditional Channel Usage: 25% (312 of 1,250 cases)  
• Premium Collection Rate: 81.0% (₹13.85M of ₹17.1M target)
• Average Processing Time: 12.5 days per case

CHANNEL BREAKDOWN:
• Online Portal: 45% (highest conversion rate)
• Mobile App: 30% (growing rapidly)
• Branch Network: 15% (personal service strength)
• Agent Channel: 10% (relationship-based)

Please provide specific optimization strategies to improve renewal rates and operational efficiency.`;

    return await sendMessage(optimizationPrompt, [], onChunk);
  } catch (error) {
    console.error('Optimization suggestions failed:', error);
    throw error;
  }
};

/**
 * Get page-specific insights based on current context
 */
export const getPageSpecificInsights = async (pageName, pageData, onChunk = null) => {
  try {
    let insightsPrompt = `Provide specific insights and recommendations for the ${pageName} page`;
    
    switch (pageName.toLowerCase()) {
      case 'dashboard':
        insightsPrompt = `Analyze the dashboard performance and provide strategic insights for improving overall renewal management efficiency.`;
        break;
      case 'case tracking':
        insightsPrompt = `Analyze case tracking data and provide recommendations for improving workflow efficiency and reducing processing bottlenecks.`;
        break;
      case 'upload':
        insightsPrompt = `Provide insights on data upload processes and recommendations for improving data quality and processing efficiency.`;
        break;
      case 'policy timeline':
        insightsPrompt = `Analyze policy timeline data and provide recommendations for optimizing customer journey and renewal timing strategies.`;
        break;
      default:
        insightsPrompt = `Provide insights and optimization recommendations for the ${pageName} functionality.`;
    }
    
    if (pageData) {
      insightsPrompt += `\n\nCurrent page data context: ${JSON.stringify(pageData, null, 2)}`;
    }

    return await sendMessage(insightsPrompt, [], onChunk);
  } catch (error) {
    console.error('Page insights failed:', error);
    throw error;
  }
};

const renewiqAI = {
  initializeRenewalAgent,
  sendMessage,
  analyzeDashboardData,
  getRenewalOptimizationSuggestions,
  getPageSpecificInsights
};

export default renewiqAI; 