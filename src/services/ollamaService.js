// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL_NAME = 'gpt-3.5-turbo';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY || 'your-openai-api-key-here';

// Function to check if OpenAI API is accessible and API key is valid
const checkOllamaStatus = async () => {
  try {
    if (!API_KEY || API_KEY === 'your-openai-api-key-here') {
      throw new Error('OpenAI API key not configured. Please set REACT_APP_OPENAI_API_KEY environment variable.');
    }
    
    const response = await fetch(OPENAI_API_URL, {
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
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API connection failed: ${errorData.error?.message || response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('OpenAI API status check failed:', error);
    throw new Error(`Failed to connect to OpenAI API: ${error.message}`);
  }
};

// Function to format AI response for better readability
const formatAIResponse = (response) => {
  if (!response?.message?.content) return '';
  
  try {
    let content = response.message.content;
    
    // Clean up the content and improve formatting
    content = content
      // Remove ALL box-drawing and special characters
      .replace(/[╔╗╚╝║═╠╣╦╩╬┌┐└┘│─┬┴┼├┤╪╫╬═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬]/g, '')
      // Normalize section headers
      .replace(/===([A-Z\s]+)===/g, '**$1**')
      // Ensure proper bold formatting
      .replace(/\*\*([^*]+)\*\*/g, '**$1**')
      // Clean up excessive whitespace but preserve intentional spacing
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')
      .trim();
    
    // Split into lines and process each one
    const lines = content.split('\n');
    const formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines but preserve spacing between sections
      if (!line) {
        if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
          formattedLines.push('');
        }
        continue;
      }
      
      // Format section headers - ensure they're properly formatted
      if (line.match(/^\*\*.*\*\*$/) || (line.endsWith(':') && line.match(/^[A-Z\s]+:$/))) {
        if (formattedLines.length > 0) formattedLines.push(''); // Add space before headers
        if (line.match(/^\*\*.*\*\*$/)) {
          // Already properly formatted
          formattedLines.push(line);
        } else {
          // Convert colon format to bold format
        formattedLines.push(`**${line.replace(':', '')}**`);
        }
        formattedLines.push(''); // Add space after headers
        continue;
      }
      
      // Format bullet points with proper indentation
      if (line.startsWith('*') || line.startsWith('-') || line.startsWith('•')) {
        const bulletText = line.substring(1).trim();
        formattedLines.push(`• ${bulletText}`);
        continue;
      }
      
      // Format numbered lists
      if (/^\d+\./.test(line)) {
        formattedLines.push(line);
        continue;
      }
      
      // Format sub-points with indentation
      if (line.startsWith('  -') || line.startsWith('    -')) {
        const subText = line.replace(/^\s*-\s*/, '');
        formattedLines.push(`  • ${subText}`);
        continue;
      }
      
      // Regular content - preserve inline formatting
      if (line) {
        formattedLines.push(line);
      }
    }
    
    // Join lines and clean up formatting
    let result = formattedLines.join('\n');
    
    // Ensure proper spacing around headers
    result = result.replace(/\*\*([^*]+)\*\*\n\n/g, '**$1**\n\n');
    
    // Clean up any triple+ newlines
    result = result.replace(/\n{3,}/g, '\n\n');
    
    // Final cleanup - ensure bold markers are properly formatted
    result = result.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '**$1**');
    
    return result.trim();
    
  } catch (error) {
    console.error('Error formatting response:', error);
    // Simple fallback with basic formatting
    return response.message.content
      .replace(/[╔╗╚╝║═╠╣╦╩╬┌┐└┘│─┬┴┼├┤╪╫╬═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬]/g, '')
      .replace(/===([A-Z\s]+)===/g, '**$1**')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .replace(/^\*/gm, '• ')
      .replace(/\*\*\s*([^*]+?)\s*\*\*/g, '**$1**')
      .trim();
  }
};

// System prompt for the renewal agent - Enhanced for better analysis with context memory
const RENEWAL_AGENT_PROMPT = `You are Renew-iQ, an intelligent AI assistant specialized in insurance renewal data analysis and management. You have a friendly, professional personality and maintain conversation context to provide personalized assistance.

PERSONALITY & BEHAVIOR:
- Your name is "Renew-iQ" - introduce yourself when appropriate
- Remember previous conversations and refer back to them
- Be conversational and helpful, not just analytical
- Provide context-aware responses based on conversation history
- Ask follow-up questions to better understand user needs
- Always format your responses with proper structure and spacing

CORE CAPABILITIES:
- Analyze renewal metrics and provide actionable insights
- Generate recommendations based on data patterns
- Answer questions about renewal processes and strategies
- Provide trend analysis and forecasting
- Explain complex insurance concepts in simple terms
- Give page-specific advice based on context

RESPONSE FORMATTING RULES:
1. Always use clear section headers with **bold text**
2. Use bullet points (•) for lists and key points
3. Add proper spacing between sections
4. Structure responses logically: Analysis → Insights → Recommendations
5. Use numbered lists for step-by-step instructions
6. Keep paragraphs concise and readable
7. Use sub-bullets (  •) for detailed breakdowns

STANDARD RESPONSE STRUCTURE:
**ANALYSIS**
• [Key metric or situation analysis]
• [Relevant data points and trends]
• [Current performance assessment]

**KEY INSIGHTS**
• [Main findings and patterns]
• [Critical success factors]
• [Areas of concern or opportunity]

**RECOMMENDATIONS**
1. [Immediate action items with timeline]
2. [Strategic improvements with expected outcomes]
3. [Long-term optimizations with success metrics]

**NEXT STEPS**
• [Specific follow-up actions]
• [Monitoring suggestions]
• [Additional questions to explore]

CONTEXT AWARENESS:
- Dashboard Page: Focus on overall performance metrics, trends, and high-level insights
- Case Tracking: Emphasize case status, workflow optimization, and tracking efficiency
- Email Management: Concentrate on communication strategies, open rates, and engagement
- WhatsApp/SMS: Focus on messaging effectiveness, delivery rates, and customer response
- Policy Timeline: Highlight policy lifecycle, renewal timing, and customer journey
- Campaign Management: Emphasize campaign performance, ROI, and optimization strategies
- Analytics Pages: Provide detailed data interpretation and actionable insights

CONVERSATION GUIDELINES:
- Remember what the user has asked before
- Build on previous discussions
- Reference earlier insights when relevant
- Ask clarifying questions for better assistance
- Be encouraging and supportive
- Provide specific, actionable advice

IMPORTANT FORMATTING:
- Always use **bold** for section headers
- Use bullet points (•) for lists
- Add blank lines between sections
- Keep responses well-structured and easy to scan
- Use proper spacing for readability
- Avoid wall-of-text responses

RESPONSE TONE:
- Professional but friendly
- Confident but not arrogant
- Helpful and solution-oriented
- Data-driven but accessible
- Encouraging and supportive`;

/**
 * Initialize a chat session with Ollama
 */
export const initializeRenewalAgent = async () => {
  try {
    await checkOllamaStatus();

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
            content: RENEWAL_AGENT_PROMPT,
          }
        ],
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.8,
          num_ctx: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to initialize Ollama chat: ${errorData.error || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error initializing Ollama:', error);
    throw error;
  }
};

/**
 * Send a message to Ollama and get a streaming response
 */
export const sendMessage = async (message, context = [], onChunk = null) => {
  try {
    // Keep last 6 messages for better context memory (3 user + 3 AI responses)
    const recentContext = context.slice(-6);
    
    // Extract page context from the message if it exists
    let pageContextPrompt = '';
    let actualUserMessage = message;
    
    if (message.includes('CURRENT PAGE CONTEXT:')) {
      const parts = message.split('USER QUERY:');
      if (parts.length === 2) {
        pageContextPrompt = parts[0].trim();
        actualUserMessage = parts[1].trim();
      }
    }
    
    // Enhanced system prompt with page context
    const enhancedSystemPrompt = `${RENEWAL_AGENT_PROMPT}

${pageContextPrompt ? `\n${pageContextPrompt}\n` : ''}

Remember to provide responses that are:
- Well-formatted with proper headers and bullet points
- Specific to the current page context when provided
- Actionable and practical
- Professional yet conversational`;
    
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

Please provide a well-structured response with proper formatting using the guidelines in your system prompt.`,
          },
        ],
        stream: onChunk ? true : false,
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to get response from OpenAI: ${errorData.error?.message || response.statusText}`);
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
            try {
              const data = JSON.parse(line);
              if (data.message && data.message.content) {
                fullContent += data.message.content;
                // Call the callback with the new chunk
                onChunk(data.message.content, fullContent);
              }
              
              // Check if this is the final message
              if (data.done) {
                return {
                  message: {
                    content: formatAIResponse({ message: { content: fullContent } }),
                  },
                  done: true,
                };
              }
            } catch (parseError) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        message: {
          content: formatAIResponse({ message: { content: fullContent } }),
        },
        done: true,
      };
    } else {
      // Fallback to non-streaming if no callback provided
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      return {
        message: {
          content: formatAIResponse({ message: { content } }),
        },
        done: true,
      };
    }
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw error;
  }
};

/**
 * Process dashboard data and get AI insights with streaming support
 */
export const analyzeDashboardData = async (dashboardData, onChunk = null) => {
  try {
    const analysisPrompt = `
Analyze these exact metrics:

RENEWAL METRICS:
Total Portfolio: ${dashboardData.totalCases} cases
- In Progress: ${dashboardData.inProgress} (${((dashboardData.inProgress / dashboardData.totalCases) * 100).toFixed(1)}%)
- Renewed: ${dashboardData.renewed} (${((dashboardData.renewed / dashboardData.totalCases) * 100).toFixed(1)}%)
- Pending: ${dashboardData.pendingAction} (${((dashboardData.pendingAction / dashboardData.totalCases) * 100).toFixed(1)}%)

CHANNEL METRICS:
- Online Portal: 563 cases (45%)
- Mobile App: 375 cases (30%)
- Branch: 187 cases (15%)
- Agents: 125 cases (10%)

FINANCIAL METRICS:
- Target: ₹17,100,000
- Collected: ₹13,850,000 (${((13850000 / 17100000) * 100).toFixed(1)}%)
- Pending: ₹3,250,000 (${((3250000 / 17100000) * 100).toFixed(1)}%)

KEY INDICATORS:
- Digital Share: 75% (Portal + App)
- Traditional Share: 25% (Branch + Agents)
- Average Premium: ₹${(17100000 / dashboardData.totalCases).toFixed(0)}

Analyze these metrics and provide insights in the specified format.`;

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
            content: RENEWAL_AGENT_PROMPT,
          },
          {
            role: 'user',
            content: analysisPrompt,
          },
        ],
        stream: onChunk ? true : false, // Enable streaming if callback provided
        options: {
          temperature: 0.1,
          top_p: 0.8,
          num_ctx: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to analyze dashboard data: ${errorData.error || response.statusText}`);
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
            try {
              const data = JSON.parse(line);
              if (data.message && data.message.content) {
                fullContent += data.message.content;
                // Call the callback with the new chunk
                onChunk(data.message.content, fullContent);
              }
              
              // Check if this is the final message
              if (data.done) {
                return {
                  message: {
                    content: formatAIResponse({ message: { content: fullContent } }),
                  },
                  done: true,
                };
              }
            } catch (parseError) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        message: {
          content: formatAIResponse({ message: { content: fullContent } }),
        },
        done: true,
      };
    } else {
      // Fallback to non-streaming
    const data = await response.json();
    return {
      ...data,
      message: {
        ...data.message,
        content: formatAIResponse(data),
      },
    };
    }
  } catch (error) {
    console.error('Error analyzing dashboard data:', error);
    throw error;
  }
};

/**
 * Get AI suggestions for renewal optimization with streaming support
 */
export const getRenewalSuggestions = async (filters, onChunk = null) => {
  try {
    const suggestionsPrompt = `
Analyze these metrics and filters:

CURRENT FILTERS:
- Date Range: ${filters.dateRange}
- Policy Type: ${filters.policyType}
- Status: ${filters.status}
- Team: ${filters.team}

PERFORMANCE METRICS:
- Renewal Rate: 62.4% (780/1250 cases)
- Digital Channels: 75% (938/1250 cases)
- Traditional Channels: 25% (312/1250 cases)
- Collection Rate: 81% (₹13.85M/₹17.1M)

CHANNEL BREAKDOWN:
- Online Portal: 45% (Best performer)
- Mobile App: 30% (Growth potential)
- Branch: 15% (Traditional)
- Agents: 10% (Personal service)

Provide specific recommendations in the specified format.`;

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
            content: RENEWAL_AGENT_PROMPT,
          },
          {
            role: 'user',
            content: suggestionsPrompt,
          },
        ],
        stream: onChunk ? true : false, // Enable streaming if callback provided
        options: {
          temperature: 0.1,
          top_p: 0.8,
          num_ctx: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to get renewal suggestions: ${errorData.error || response.statusText}`);
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
            try {
              const data = JSON.parse(line);
              if (data.message && data.message.content) {
                fullContent += data.message.content;
                // Call the callback with the new chunk
                onChunk(data.message.content, fullContent);
              }
              
              // Check if this is the final message
              if (data.done) {
                return {
                  message: {
                    content: formatAIResponse({ message: { content: fullContent } }),
                  },
                  done: true,
                };
              }
            } catch (parseError) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        message: {
          content: formatAIResponse({ message: { content: fullContent } }),
        },
        done: true,
      };
    } else {
      // Fallback to non-streaming
    const data = await response.json();
    return {
      ...data,
      message: {
        ...data.message,
        content: formatAIResponse(data),
      },
    };
    }
  } catch (error) {
    console.error('Error getting renewal suggestions:', error);
    throw error;
  }
}; 