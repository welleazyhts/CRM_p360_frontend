// WhatsApp Bot Service - Manages executive bots and business integration
class WhatsAppBotService {
  constructor() {
    this.apiProviders = {
      twilio: {
        name: 'Twilio',
        baseUrl: 'https://api.twilio.com/2010-04-01',
        authType: 'basic',
        features: ['messaging', 'media', 'templates', 'webhooks']
      },
      '360dialog': {
        name: '360Dialog',
        baseUrl: 'https://waba.360dialog.io',
        authType: 'bearer',
        features: ['messaging', 'media', 'templates', 'analytics']
      },
      meta: {
        name: 'Meta Cloud API',
        baseUrl: 'https://graph.facebook.com',
        authType: 'bearer',
        features: ['messaging', 'media', 'templates', 'business_management']
      }
    };
    
    this.executiveBots = new Map();
    this.businessConfig = null;
  }

  // Initialize business configuration
  async initializeBusinessConfig(config) {
    try {
      this.businessConfig = {
        businessNumber: config.businessNumber,
        businessName: config.businessName,
        metaBusinessId: config.metaBusinessId,
        apiProvider: config.apiProvider,
        apiCredentials: config.apiCredentials,
        webhookUrl: config.webhookUrl,
        verificationToken: config.verificationToken,
        status: 'initializing'
      };

      // Verify business number with Meta
      const verification = await this.verifyBusinessNumber();
      
      if (verification.success) {
        this.businessConfig.status = 'verified';
        this.businessConfig.verifiedAt = new Date().toISOString();
        return { success: true, message: 'Business configuration initialized successfully' };
      } else {
        this.businessConfig.status = 'verification_failed';
        return { success: false, error: verification.error };
      }
    } catch (error) {
      console.error('Error initializing business config:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify business number with Meta Business API
  async verifyBusinessNumber() {
    try {
      // In real implementation, this would call Meta Business API
      // For demo, we'll simulate the verification process
      
      if (!this.businessConfig.metaBusinessId) {
        return { success: false, error: 'Meta Business ID is required' };
      }

      // Simulate API call to Meta
      const mockVerification = {
        success: true,
        businessId: this.businessConfig.metaBusinessId,
        phoneNumber: this.businessConfig.businessNumber,
        status: 'VERIFIED',
        displayName: this.businessConfig.businessName
      };

      return mockVerification;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create bot for executive
  async createExecutiveBot(executiveData) {
    try {
      const botId = `BOT-${executiveData.id}-${Date.now()}`;
      
      const bot = {
        id: botId,
        executiveId: executiveData.id,
        executiveName: executiveData.name,
        department: executiveData.department,
        phone: executiveData.phone,
        email: executiveData.email,
        status: 'active',
        settings: {
          autoReply: executiveData.autoReply || true,
          notifications: executiveData.notifications || true,
          workingHours: {
            start: '09:00',
            end: '18:00',
            timezone: 'Asia/Kolkata'
          },
          autoReplyMessages: this.getDefaultAutoReplyMessages(executiveData.department)
        },
        statistics: {
          messagesReceived: 0,
          messagesReplied: 0,
          averageResponseTime: 0,
          customerSatisfaction: 0
        },
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      this.executiveBots.set(botId, bot);
      
      // Register webhook for this bot
      await this.registerBotWebhook(bot);
      
      return { success: true, bot, message: 'Executive bot created successfully' };
    } catch (error) {
      console.error('Error creating executive bot:', error);
      return { success: false, error: error.message };
    }
  }

  // Get default auto-reply messages based on department
  getDefaultAutoReplyMessages(department) {
    const templates = {
      'Sales': [
        {
          trigger: 'hello|hi|hey',
          response: 'Hello! I\'m {executiveName} from Sales. How can I help you with our insurance products today?'
        },
        {
          trigger: 'quote|price|premium',
          response: 'I\'d be happy to provide you with a quote. Could you please share your requirements?'
        }
      ],
      'Customer Service': [
        {
          trigger: 'hello|hi|hey',
          response: 'Hi! I\'m {executiveName} from Customer Service. How may I assist you today?'
        },
        {
          trigger: 'help|support|issue',
          response: 'I\'m here to help! Please describe your issue and I\'ll assist you right away.'
        }
      ],
      'Claims': [
        {
          trigger: 'hello|hi|hey',
          response: 'Hello! I\'m {executiveName} from Claims Department. How can I help with your claim?'
        },
        {
          trigger: 'claim|status',
          response: 'I can help you with your claim. Please provide your policy number or claim reference.'
        }
      ],
      'Renewals': [
        {
          trigger: 'hello|hi|hey',
          response: 'Hi! I\'m {executiveName} from Renewals. How can I help with your policy renewal?'
        },
        {
          trigger: 'renewal|renew',
          response: 'I\'ll help you with your policy renewal. Please share your policy number.'
        }
      ]
    };

    return templates[department] || templates['Customer Service'];
  }

  // Register webhook for bot
  async registerBotWebhook(bot) {
    try {
      const webhookConfig = {
        url: `${this.businessConfig.webhookUrl}/bot/${bot.id}`,
        events: ['message', 'delivery', 'read'],
        executiveId: bot.executiveId
      };

      // In real implementation, register with chosen API provider
      console.log('Registering webhook for bot:', bot.id, webhookConfig);
      
      return { success: true, webhookConfig };
    } catch (error) {
      console.error('Error registering webhook:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle incoming WhatsApp message
  async handleIncomingMessage(messageData) {
    try {
      const { from, to, body, timestamp, messageId } = messageData;
      
      // Find appropriate executive bot
      const bot = await this.routeMessageToExecutive(messageData);
      
      if (!bot) {
        return { success: false, error: 'No available executive found' };
      }

      // Check if auto-reply is enabled
      if (bot.settings.autoReply) {
        const autoReply = this.generateAutoReply(body, bot);
        if (autoReply) {
          await this.sendMessage(from, autoReply, bot);
        }
      }

      // Notify executive
      if (bot.settings.notifications) {
        await this.notifyExecutive(bot, messageData);
      }

      // Update statistics
      this.updateBotStatistics(bot.id, 'messageReceived');

      return { success: true, bot: bot.id, action: 'processed' };
    } catch (error) {
      console.error('Error handling incoming message:', error);
      return { success: false, error: error.message };
    }
  }

  // Route message to appropriate executive
  async routeMessageToExecutive(messageData) {
    // Simple round-robin routing for demo
    // In real implementation, use intelligent routing based on:
    // - Department expertise
    // - Current workload
    // - Working hours
    // - Customer history
    
    const activeBots = Array.from(this.executiveBots.values())
      .filter(bot => bot.status === 'active');
    
    if (activeBots.length === 0) {
      return null;
    }

    // Return first available bot (simplified)
    return activeBots[0];
  }

  // Generate auto-reply based on message content
  generateAutoReply(messageBody, bot) {
    const autoReplyMessages = bot.settings.autoReplyMessages;
    
    for (const template of autoReplyMessages) {
      const regex = new RegExp(template.trigger, 'i');
      if (regex.test(messageBody)) {
        return template.response.replace('{executiveName}', bot.executiveName);
      }
    }

    // Default response if no trigger matches
    return `Hello! I'm ${bot.executiveName} from ${bot.department}. I'll be with you shortly to assist you.`;
  }

  // Send WhatsApp message
  async sendMessage(to, message, bot) {
    try {
      const messageData = {
        to: to,
        body: message,
        from: this.businessConfig.businessNumber,
        botId: bot.id,
        executiveId: bot.executiveId,
        timestamp: new Date().toISOString()
      };

      // In real implementation, call the chosen API provider
      switch (this.businessConfig.apiProvider) {
        case 'twilio':
          return await this.sendViaTwilio(messageData);
        case '360dialog':
          return await this.sendVia360Dialog(messageData);
        case 'meta':
          return await this.sendViaMetaAPI(messageData);
        default:
          throw new Error('No API provider configured');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  // Send via Twilio (mock implementation)
  async sendViaTwilio(messageData) {
    // Mock Twilio API call
    console.log('Sending via Twilio:', messageData);
    return { success: true, messageId: `twilio_${Date.now()}` };
  }

  // Send via 360Dialog (mock implementation)
  async sendVia360Dialog(messageData) {
    // Mock 360Dialog API call
    console.log('Sending via 360Dialog:', messageData);
    return { success: true, messageId: `360dialog_${Date.now()}` };
  }

  // Send via Meta Cloud API (mock implementation)
  async sendViaMetaAPI(messageData) {
    // Mock Meta API call
    console.log('Sending via Meta Cloud API:', messageData);
    return { success: true, messageId: `meta_${Date.now()}` };
  }

  // Notify executive of new message
  async notifyExecutive(bot, messageData) {
    try {
      const notification = {
        executiveId: bot.executiveId,
        type: 'new_whatsapp_message',
        title: 'New WhatsApp Message',
        message: `New message from ${messageData.from}`,
        data: {
          customerNumber: messageData.from,
          messageBody: messageData.body,
          botId: bot.id
        },
        timestamp: new Date().toISOString()
      };

      // In real implementation, send push notification, email, or SMS
      console.log('Notifying executive:', notification);
      
      return { success: true, notification };
    } catch (error) {
      console.error('Error notifying executive:', error);
      return { success: false, error: error.message };
    }
  }

  // Update bot statistics
  updateBotStatistics(botId, action) {
    const bot = this.executiveBots.get(botId);
    if (!bot) return;

    switch (action) {
      case 'messageReceived':
        bot.statistics.messagesReceived++;
        break;
      case 'messageReplied':
        bot.statistics.messagesReplied++;
        break;
    }

    bot.lastActive = new Date().toISOString();
    this.executiveBots.set(botId, bot);
  }

  // Get bot statistics
  getBotStatistics(botId) {
    const bot = this.executiveBots.get(botId);
    return bot ? bot.statistics : null;
  }

  // Get all executive bots
  getAllExecutiveBots() {
    return Array.from(this.executiveBots.values());
  }

  // Update bot settings
  async updateBotSettings(botId, settings) {
    try {
      const bot = this.executiveBots.get(botId);
      if (!bot) {
        return { success: false, error: 'Bot not found' };
      }

      bot.settings = { ...bot.settings, ...settings };
      this.executiveBots.set(botId, bot);

      return { success: true, bot, message: 'Bot settings updated successfully' };
    } catch (error) {
      console.error('Error updating bot settings:', error);
      return { success: false, error: error.message };
    }
  }

  // Deactivate bot
  async deactivateBot(botId) {
    try {
      const bot = this.executiveBots.get(botId);
      if (!bot) {
        return { success: false, error: 'Bot not found' };
      }

      bot.status = 'inactive';
      bot.deactivatedAt = new Date().toISOString();
      this.executiveBots.set(botId, bot);

      return { success: true, message: 'Bot deactivated successfully' };
    } catch (error) {
      console.error('Error deactivating bot:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const whatsappBotService = new WhatsAppBotService();

export default whatsappBotService;

// Export individual functions for easier importing
export const {
  initializeBusinessConfig,
  createExecutiveBot,
  handleIncomingMessage,
  sendMessage,
  updateBotSettings,
  getBotStatistics,
  getAllExecutiveBots
} = whatsappBotService;