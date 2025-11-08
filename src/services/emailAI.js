// Email AI Service - Specialized AI Agent for Email Management
// Focused on email composition, sentiment analysis, communication strategies, and customer engagement

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL_NAME = 'gpt-3.5-turbo';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY || 'your-openai-api-key-here';

// Enhanced system prompt for Email AI Agent
const EMAIL_AI_PROMPT = `You are Py360 Email Assistant, an intelligent AI assistant specialized in email communication, customer engagement, and email marketing for insurance renewal management. You are the dedicated AI for the Email Manager page and focus exclusively on email-related tasks.

PERSONALITY & IDENTITY:
- Your name is "Py360 Email Assistant" - introduce yourself as the email communication specialist
- You are an expert in email marketing, customer communication, and engagement strategies
- Maintain context of ongoing email conversations and campaigns
- Be creative and strategic in email composition and optimization
- Show expertise in email analytics and performance improvement

CORE EXPERTISE AREAS:
1. **Email Composition** - Write compelling, personalized email content
2. **Sentiment Analysis** - Analyze customer email sentiment and intent
3. **Response Generation** - Create appropriate responses based on customer emotions
4. **Email Templates** - Design and optimize email templates for different scenarios
5. **Subject Line Optimization** - Create engaging, high-open-rate subject lines
6. **Customer Communication** - Craft empathetic, solution-oriented responses
7. **Email Analytics** - Interpret email performance metrics and suggest improvements
8. **Campaign Strategy** - Develop email campaign strategies for better engagement

RESPONSE STRUCTURE FOR EMAIL ANALYSIS:
**📧 EMAIL ANALYSIS**
• **Sentiment**: [Positive/Negative/Neutral] (Confidence: XX%)
• **Intent**: [Primary customer intent/goal]
• **Urgency**: [High/Medium/Low]
• **Key Points**: [Main issues or requests identified]

**💭 CUSTOMER INSIGHTS**
• **Emotional State**: [Customer's emotional condition]
• **Communication Style**: [Formal/Casual/Frustrated/Appreciative]
• **Relationship Stage**: [New customer/Long-term/At-risk]
• **Priority Level**: [How quickly this needs response]

**✍️ RESPONSE STRATEGY**
• **Recommended Tone**: [Professional/Empathetic/Reassuring/Celebratory]
• **Key Messages**: [Main points to address]
• **Call-to-Action**: [What action customer should take]
• **Follow-up Plan**: [Next steps and timing]

**📝 SMART REPLY OPTIONS**
1. **[Reply Type]**: [Brief description]
   Subject: [Suggested subject line]
   [Email content preview...]

2. **[Reply Type]**: [Brief description]
   Subject: [Suggested subject line]
   [Email content preview...]

RESPONSE STRUCTURE FOR EMAIL COMPOSITION:
**📝 EMAIL COMPOSITION ASSISTANCE**
• **Content Analysis**: [Assessment of current draft]
• **Tone Adjustment**: [Recommendations for tone improvement]
• **Structure Optimization**: [Suggestions for better organization]
• **Engagement Enhancement**: [Ways to increase engagement]

**🎯 OPTIMIZATION SUGGESTIONS**
• **Subject Line**: [Improved subject line options]
• **Opening**: [Better opening lines]
• **Body Content**: [Content improvements]
• **Closing**: [Strong closing statements]
• **Call-to-Action**: [Clear, compelling CTAs]

EMAIL SCENARIOS EXPERTISE:
- **Renewal Reminders**: Timely, personalized renewal notifications
- **Payment Issues**: Empathetic payment problem resolution
- **Policy Updates**: Clear communication of policy changes
- **Customer Complaints**: Professional complaint handling and resolution
- **Appreciation Emails**: Warm customer appreciation and retention
- **Follow-up Communications**: Strategic follow-up sequences
- **Promotional Campaigns**: Engaging promotional email content

SENTIMENT-BASED RESPONSE STRATEGIES:
- **Negative Sentiment**: Empathetic, solution-focused, immediate attention
- **Positive Sentiment**: Appreciative, relationship-building, value-reinforcing
- **Neutral Sentiment**: Professional, informative, clear call-to-action
- **Urgent Issues**: Priority handling, escalation protocols, timeline commitments

FORMATTING RULES:
- Use emojis for section headers (📧, 💭, ✍️, 📝, 🎯)
- Use bullet points (•) for insights and analysis
- Use numbered lists for reply options and suggestions
- Bold important keywords and metrics
- Keep email content concise but complete
- Use professional email formatting

TONE & STYLE:
- Expert in email communication best practices
- Creative and strategic in content creation
- Empathetic and customer-focused
- Data-driven in optimization recommendations
- Professional yet approachable in communication

Remember: You are the email specialist - focus exclusively on email-related tasks, customer communication, and email performance optimization.`;

/**
 * Initialize the Email AI agent
 */
export const initializeEmailAgent = async () => {
  try {
    if (!API_KEY || API_KEY === 'your-openai-api-key-here') {
      throw new Error('OpenAI API key not configured. Please set REACT_APP_OPENAI_API_KEY environment variable.');
    }
    
    // Test the API connection
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
    
    return { success: true, message: 'Email AI agent initialized successfully with OpenAI' };
  } catch (error) {
    console.error('Failed to initialize Email AI agent:', error);
    throw error;
  }
};

/**
 * Analyze email content and generate insights - Ultra-fast version
 */
export const analyzeEmail = async (emailData, onChunk = null) => {
  try {
    // Ultra-compact prompt for maximum speed
    const analysisPrompt = `Quick email analysis:

FROM: ${emailData.from || 'Customer'}
SUBJECT: ${emailData.subject || 'No Subject'}
BODY: ${(emailData.body || emailData.content || 'No content').substring(0, 150)}

Output format:
Sentiment: [Positive/Negative/Neutral] (confidence %)
Intent: [main request in 5 words]
Urgency: [High/Medium/Low] (confidence %)
Key Points: [2-3 bullet points max]
Tone: [Professional/Empathetic/Urgent]`;

    const result = await sendEmailMessage(analysisPrompt, [], onChunk, {
      temperature: 0.3,  // Lower temperature for faster, more consistent responses
      num_predict: 200,  // Limit tokens for speed (Ollama parameter name)
      top_p: 0.8        // Reduce randomness for speed
    });

    return result.message.content;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate smart email replies based on analysis - Ultra-fast version
 */
export const generateSmartReplies = async (emailData, analysisData, onChunk = null) => {
  try {
    // Ultra-compact prompt for clean email responses
    const replyPrompt = `Generate 3 complete email replies for this customer:

EMAIL: "${emailData.subject}" from ${emailData.from}
CONTENT: ${(emailData.body || emailData.content || '').substring(0, 100)}
SENTIMENT: ${analysisData.sentiment}, URGENCY: ${analysisData.urgency}
CUSTOMER: ${analysisData.contextualInfo?.customerName || 'Customer'}

IMPORTANT: Provide ONLY the email content, no explanations or summaries.

Format each reply as:

REPLY 1:
[Complete professional email response]

REPLY 2:
[Complete detailed email response]

REPLY 3:
[Complete empathetic email response]

Each reply must be a complete, ready-to-send email with proper greeting, body, and closing.`;

    const result = await sendEmailMessage(replyPrompt, [], onChunk, {
      temperature: 0.4,  // Slightly higher for variety but still fast
      num_predict: 400,  // Increased for complete emails (Ollama parameter name)
      top_p: 0.9
    });

    return result.message.content;
  } catch (error) {
    console.error('Smart replies generation failed:', error);
    throw error;
  }
};

/**
 * Enhance email content with AI suggestions - Ultra-fast version
 */
export const enhanceEmailContent = async (emailDraft, onChunk = null) => {
  try {
    // Minimal prompt for maximum speed
    const enhancementPrompt = `Improve this email quickly:

SUBJECT: ${emailDraft.subject || 'Re: Your Policy'}
TO: ${emailDraft.renewalContext?.customerName || 'Customer'}
CONTENT: ${emailDraft.body || 'No content'}

Output:
Subject: [improved subject line]
Body: [enhanced professional content - 100 words max]`;

    const result = await sendEmailMessage(enhancementPrompt, [], onChunk, {
      temperature: 0.2,  // Very low for consistent improvements
      num_predict: 250,  // Limited for speed (Ollama parameter name)
      top_p: 0.7
    });

    return result.message.content;
  } catch (error) {
    console.error('Email enhancement failed:', error);
    throw error;
  }
};

/**
 * Generate subject line suggestions
 */
export const generateSubjectSuggestions = async (emailContent, context = {}, onChunk = null) => {
  try {
    const subjectPrompt = `Generate compelling subject line options for this email:

EMAIL CONTENT PREVIEW:
${emailContent.substring(0, 300)}...

CONTEXT:
• Email Type: ${context.type || 'General Communication'}
• Customer Name: ${context.customerName || 'Customer'}
• Policy Number: ${context.policyNumber || 'N/A'}
• Urgency: ${context.urgency || 'Normal'}
• Campaign Type: ${context.campaignType || 'Individual Email'}

Generate 8-10 subject line options with different approaches:
- Personalized options
- Urgency-driven options  
- Benefit-focused options
- Question-based options
- Action-oriented options

Include open rate optimization tips for each suggestion.`;

    return await sendEmailMessage(subjectPrompt, [], onChunk);
  } catch (error) {
    console.error('Subject line generation failed:', error);
    throw error;
  }
};

/**
 * Analyze email campaign performance
 */
export const analyzeCampaignPerformance = async (campaignData, onChunk = null) => {
  try {
    const performancePrompt = `Analyze this email campaign performance and provide optimization recommendations:

CAMPAIGN METRICS:
• Campaign Name: ${campaignData.name || 'Email Campaign'}
• Emails Sent: ${campaignData.sent || 0}
• Delivered: ${campaignData.delivered || 0} (${campaignData.deliveryRate || 0}%)
• Opened: ${campaignData.opened || 0} (${campaignData.openRate || 0}%)
• Clicked: ${campaignData.clicked || 0} (${campaignData.clickRate || 0}%)
• Responses: ${campaignData.responses || 0}
• Unsubscribes: ${campaignData.unsubscribes || 0}

CAMPAIGN DETAILS:
• Subject Line: ${campaignData.subject || 'Not specified'}
• Send Date: ${campaignData.sendDate || 'Recent'}
• Target Audience: ${campaignData.audience || 'General'}
• Campaign Type: ${campaignData.type || 'Renewal'}

Provide detailed analysis with specific recommendations for improving performance.`;

    return await sendEmailMessage(performancePrompt, [], onChunk);
  } catch (error) {
    console.error('Campaign analysis failed:', error);
    throw error;
  }
};

/**
 * Core message sending function for Email AI
 */
const sendEmailMessage = async (message, context = [], onChunk = null, modelOptions = {}) => {
  try {
    const recentContext = context.slice(-6);
    
    const requestBody = {
      model: MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: EMAIL_AI_PROMPT,
        },
        ...recentContext.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
        {
          role: 'user',
          content: `${message}

Please provide a comprehensive response using the structured format specified in your system prompt for email-related tasks.`,
        },
      ],
      stream: onChunk ? true : false,
      temperature: modelOptions.temperature || 0.4,
      max_tokens: 2000,
    };
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Email AI Error: ${errorData.error || response.statusText}`);
    }

    // Handle streaming response
    if (onChunk && typeof onChunk === 'function') {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.message && data.message.content) {
                fullContent += data.message.content;
                onChunk(data.message.content, fullContent);
              }
              
              if (data.done) {
                return {
                  message: {
                    content: fullContent,
                  },
                  done: true,
                };
              }
            } catch (parseError) {
              continue;
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
      return data;
    }
  } catch (error) {
    console.error('Email AI Error:', error);
    throw error;
  }
};

/**
 * Test Ollama connection and model availability
 */
const testOllamaConnection = async () => {
  try {
    if (!API_KEY || API_KEY === 'your-openai-api-key-here') {
      return { connected: false, modelAvailable: false, error: 'OpenAI API key not configured' };
    }
    
    // Test OpenAI API connection
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
      return { connected: false, modelAvailable: false, error: errorData.error?.message || testResponse.statusText };
    }
    
    return { connected: true, modelAvailable: true, models: [MODEL_NAME] };
    
  } catch (error) {
    return { connected: false, modelAvailable: false, error: error.message };
  }
};

const emailAI = {
  initializeEmailAgent,
  analyzeEmail,
  generateSmartReplies,
  enhanceEmailContent,
  generateSubjectSuggestions,
  analyzeCampaignPerformance,
  sendEmailMessage,
  testOllamaConnection
};

// Named exports for direct import
export { testOllamaConnection };

export default emailAI; 