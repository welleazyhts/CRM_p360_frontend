import React, { createContext, useState, useContext, useEffect } from 'react';
import logger from '../utils/logger';

// Create the Providers context
const ProvidersContext = createContext();

// Custom hook to use the Providers context
export const useProviders = () => useContext(ProvidersContext);

// Provider component
export const ProvidersProvider = ({ children }) => {
  // Initialize providers state with default configurations
  const [providers, setProviders] = useState({
    email: [
      {
        id: 'email-1',
        name: 'SendGrid Primary',
        type: 'sendgrid',
        isActive: true,
        isDefault: true,
        status: 'connected',
        config: {
          apiKey: '',
          fromEmail: 'noreply@company.com',
          fromName: 'Company Name',
          replyTo: 'support@company.com'
        },
        limits: {
          dailyLimit: 10000,
          monthlyLimit: 100000,
          rateLimit: 100 // per minute
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'email-2',
        name: 'AWS SES Backup',
        type: 'aws-ses',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          region: 'us-east-1',
          accessKeyId: '',
          secretAccessKey: '',
          fromEmail: 'noreply@company.com',
          fromName: 'Company Name'
        },
        limits: {
          dailyLimit: 50000,
          monthlyLimit: 1000000,
          rateLimit: 200
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      },
      {
        id: 'email-3',
        name: 'Mailgun Business',
        type: 'mailgun',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          apiKey: '',
          domain: '',
          region: 'us',
          fromEmail: 'noreply@company.com',
          fromName: 'Company Name'
        },
        limits: {
          dailyLimit: 30000,
          monthlyLimit: 500000,
          rateLimit: 300
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      }
    ],
    sms: [
      {
        id: 'sms-1',
        name: 'Twilio Primary',
        type: 'twilio',
        isActive: true,
        isDefault: true,
        status: 'connected',
        config: {
          accountSid: '',
          authToken: '',
          fromNumber: '+1234567890',
          messagingServiceSid: ''
        },
        limits: {
          dailyLimit: 1000,
          monthlyLimit: 10000,
          rateLimit: 10
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'sms-2',
        name: 'MSG91 India',
        type: 'msg91',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          apiKey: '',
          senderId: 'INTPRO',
          route: '4',
          country: 'IN'
        },
        limits: {
          dailyLimit: 5000,
          monthlyLimit: 50000,
          rateLimit: 20
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      },
      {
        id: 'sms-3',
        name: 'TextLocal SMS',
        type: 'textlocal',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          apiKey: '',
          sender: '',
          username: '',
          hash: ''
        },
        limits: {
          dailyLimit: 2500,
          monthlyLimit: 25000,
          rateLimit: 25
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      }
    ],
    whatsapp: [
      {
        id: 'whatsapp-1',
        name: 'Meta Business API',
        type: 'meta',
        isActive: true,
        isDefault: true,
        status: 'connected',
        config: {
          accessToken: '',
          phoneNumberId: '',
          businessAccountId: '',
          webhookToken: '',
          apiVersion: 'v17.0'
        },
        limits: {
          dailyLimit: 1000,
          monthlyLimit: 10000,
          rateLimit: 80
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'whatsapp-2',
        name: 'Gupshup WhatsApp',
        type: 'gupshup',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          apiKey: '',
          appName: '',
          sourceNumber: '',
          apiUrl: 'https://api.gupshup.io/sm/api/v1'
        },
        limits: {
          dailyLimit: 2000,
          monthlyLimit: 20000,
          rateLimit: 60
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      },
      {
        id: 'whatsapp-3',
        name: 'Twilio WhatsApp',
        type: 'twilio-whatsapp',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          accountSid: '',
          authToken: '',
          fromNumber: 'whatsapp:+1234567890',
          statusCallback: ''
        },
        limits: {
          dailyLimit: 1500,
          monthlyLimit: 15000,
          rateLimit: 50
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      }
    ],
    call: [
      {
        id: 'call-1',
        name: 'Twilio Voice',
        type: 'twilio-voice',
        isActive: true,
        isDefault: true,
        status: 'connected',
        config: {
          accountSid: '',
          authToken: '',
          fromNumber: '+1234567890',
          voiceUrl: '',
          statusCallback: ''
        },
        limits: {
          dailyLimit: 500,
          monthlyLimit: 5000,
          rateLimit: 5
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'call-2',
        name: 'Exotel Voice',
        type: 'exotel',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          apiKey: '',
          apiToken: '',
          accountSid: '',
          subdomain: '',
          callerId: ''
        },
        limits: {
          dailyLimit: 1000,
          monthlyLimit: 10000,
          rateLimit: 10
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      },
      {
        id: 'call-3',
        name: 'Ubona Voice',
        type: 'ubona',
        isActive: true,
        isDefault: false,
        status: 'connected',
        config: {
          apiKey: '',
          accountSid: '',
          apiUrl: 'https://api.ubona.com/v1',
          callerId: '+1234567890'
        },
        limits: {
          dailyLimit: 2000,
          monthlyLimit: 15000,
          rateLimit: 15
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      }
    ],
    'bot-calling': [
      {
        id: 'bot-call-1',
        name: 'Ubona Bot Calling',
        type: 'ubona',
        isActive: true,
        isDefault: true,
        status: 'connected',
        config: {
          apiKey: '',
          accountSid: '',
          apiUrl: 'https://api.ubona.com/v1/bot',
          callerId: '+1234567890',
          botScript: ''
        },
        limits: {
          dailyLimit: 3000,
          monthlyLimit: 20000,
          rateLimit: 20
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'bot-call-2',
        name: 'Twilio Voice Bot',
        type: 'twilio-voice',
        isActive: false,
        isDefault: false,
        status: 'disconnected',
        config: {
          accountSid: '',
          authToken: '',
          fromNumber: '+1234567890',
          voiceUrl: '',
          statusCallback: '',
          botScript: ''
        },
        limits: {
          dailyLimit: 1500,
          monthlyLimit: 12000,
          rateLimit: 12
        },
        createdAt: new Date().toISOString(),
        lastUsed: null
      }
    ]
  });

  // Provider templates for different types
  const providerTemplates = {
    email: {
      sendgrid: {
        name: 'SendGrid',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'fromEmail', label: 'From Email', type: 'email', required: true },
          { key: 'fromName', label: 'From Name', type: 'text', required: true },
          { key: 'replyTo', label: 'Reply To', type: 'email', required: false }
        ]
      },
      'aws-ses': {
        name: 'Amazon SES',
        fields: [
          { key: 'region', label: 'AWS Region', type: 'text', required: true },
          { key: 'accessKeyId', label: 'Access Key ID', type: 'password', required: true },
          { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true },
          { key: 'fromEmail', label: 'From Email', type: 'email', required: true },
          { key: 'fromName', label: 'From Name', type: 'text', required: true }
        ]
      },
      mailgun: {
        name: 'Mailgun',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'domain', label: 'Domain', type: 'text', required: true },
          { key: 'fromEmail', label: 'From Email', type: 'email', required: true },
          { key: 'fromName', label: 'From Name', type: 'text', required: true }
        ]
      },
      smtp: {
        name: 'Custom SMTP',
        fields: [
          { key: 'host', label: 'SMTP Host', type: 'text', required: true },
          { key: 'port', label: 'Port', type: 'number', required: true },
          { key: 'username', label: 'Username', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'fromEmail', label: 'From Email', type: 'email', required: true },
          { key: 'fromName', label: 'From Name', type: 'text', required: true }
        ]
      }
    },
    sms: {
      twilio: {
        name: 'Twilio SMS',
        fields: [
          { key: 'accountSid', label: 'Account SID', type: 'password', required: true },
          { key: 'authToken', label: 'Auth Token', type: 'password', required: true },
          { key: 'fromNumber', label: 'From Number', type: 'tel', required: true },
          { key: 'messagingServiceSid', label: 'Messaging Service SID', type: 'text', required: false }
        ]
      },
      msg91: {
        name: 'MSG91',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'senderId', label: 'Sender ID', type: 'text', required: true },
          { key: 'route', label: 'Route', type: 'text', required: true },
          { key: 'country', label: 'Country Code', type: 'text', required: true }
        ]
      },
      'aws-sns': {
        name: 'AWS SNS',
        fields: [
          { key: 'region', label: 'AWS Region', type: 'text', required: true },
          { key: 'accessKeyId', label: 'Access Key ID', type: 'password', required: true },
          { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true }
        ]
      },
      textlocal: {
        name: 'TextLocal',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'username', label: 'Username', type: 'text', required: true },
          { key: 'hash', label: 'Hash', type: 'password', required: true },
          { key: 'sender', label: 'Sender', type: 'text', required: true }
        ]
      }
    },
    whatsapp: {
      meta: {
        name: 'Meta Business API',
        fields: [
          { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
          { key: 'phoneNumberId', label: 'Phone Number ID', type: 'text', required: true },
          { key: 'businessAccountId', label: 'Business Account ID', type: 'text', required: true },
          { key: 'webhookToken', label: 'Webhook Token', type: 'password', required: false },
          { key: 'apiVersion', label: 'API Version', type: 'text', required: false }
        ]
      },
      gupshup: {
        name: 'Gupshup',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'appName', label: 'App Name', type: 'text', required: true },
          { key: 'sourceNumber', label: 'Source Number', type: 'tel', required: true },
          { key: 'apiUrl', label: 'API URL', type: 'url', required: true }
        ]
      },
      '360dialog': {
        name: '360Dialog',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'partnerId', label: 'Partner ID', type: 'text', required: true },
          { key: 'channelId', label: 'Channel ID', type: 'text', required: true }
        ]
      },
      'twilio-whatsapp': {
        name: 'Twilio WhatsApp',
        fields: [
          { key: 'accountSid', label: 'Account SID', type: 'password', required: true },
          { key: 'authToken', label: 'Auth Token', type: 'password', required: true },
          { key: 'fromNumber', label: 'From Number', type: 'tel', required: true },
          { key: 'statusCallback', label: 'Status Callback URL', type: 'url', required: false }
        ]
      }
    },
    call: {
      'twilio-voice': {
        name: 'Twilio Voice',
        fields: [
          { key: 'accountSid', label: 'Account SID', type: 'password', required: true },
          { key: 'authToken', label: 'Auth Token', type: 'password', required: true },
          { key: 'fromNumber', label: 'From Number', type: 'tel', required: true },
          { key: 'voiceUrl', label: 'Voice URL', type: 'url', required: false },
          { key: 'statusCallback', label: 'Status Callback URL', type: 'url', required: false }
        ]
      },
      exotel: {
        name: 'Exotel',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'apiToken', label: 'API Token', type: 'password', required: true },
          { key: 'accountSid', label: 'Account SID', type: 'text', required: true },
          { key: 'subdomain', label: 'Subdomain', type: 'text', required: true },
          { key: 'callerId', label: 'Caller ID', type: 'tel', required: true }
        ]
      },
      ubona: {
        name: 'Ubona',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'accountSid', label: 'Account SID', type: 'text', required: true },
          { key: 'apiUrl', label: 'API URL', type: 'url', required: true },
          { key: 'callerId', label: 'Caller ID', type: 'tel', required: true }
        ]
      }
    },
    'bot-calling': {
      ubona: {
        name: 'Ubona Bot Calling',
        fields: [
          { key: 'apiKey', label: 'API Key', type: 'password', required: true },
          { key: 'accountSid', label: 'Account SID', type: 'text', required: true },
          { key: 'apiUrl', label: 'API URL', type: 'url', required: true },
          { key: 'callerId', label: 'Caller ID', type: 'tel', required: true },
          { key: 'botScript', label: 'Bot Script', type: 'textarea', required: false }
        ]
      },
      'twilio-voice': {
        name: 'Twilio Voice Bot',
        fields: [
          { key: 'accountSid', label: 'Account SID', type: 'password', required: true },
          { key: 'authToken', label: 'Auth Token', type: 'password', required: true },
          { key: 'fromNumber', label: 'From Number', type: 'tel', required: true },
          { key: 'voiceUrl', label: 'Voice URL', type: 'url', required: false },
          { key: 'statusCallback', label: 'Status Callback URL', type: 'url', required: false },
          { key: 'botScript', label: 'Bot Script', type: 'textarea', required: false }
        ]
      }
    }
  };

  // Load providers from localStorage on component mount
  useEffect(() => {
    const savedProviders = localStorage.getItem('communicationProviders');
    if (savedProviders) {
      try {
        setProviders(JSON.parse(savedProviders));
      } catch (error) {
        logger.error('Failed to parse saved providers:', error);
      }
    }
  }, []);

  // Save providers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('communicationProviders', JSON.stringify(providers));
  }, [providers]);

  // Add new provider
  const addProvider = (channel, providerData) => {
    const newProvider = {
      id: `${channel}-${Date.now()}`,
      ...providerData,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      status: 'disconnected'
    };

    setProviders(prev => ({
      ...prev,
      [channel]: [...prev[channel], newProvider]
    }));

    return newProvider.id;
  };

  // Update existing provider
  const updateProvider = (channel, providerId, updates) => {
    setProviders(prev => ({
      ...prev,
      [channel]: prev[channel].map(provider => 
        provider.id === providerId 
          ? { ...provider, ...updates, updatedAt: new Date().toISOString() }
          : provider
      )
    }));
  };

  // Delete provider
  const deleteProvider = (channel, providerId) => {
    setProviders(prev => ({
      ...prev,
      [channel]: prev[channel].filter(provider => provider.id !== providerId)
    }));
  };

  // Set active provider
  const setActiveProvider = (channel, providerId) => {
    setProviders(prev => ({
      ...prev,
      [channel]: prev[channel].map(provider => ({
        ...provider,
        isActive: provider.id === providerId
      }))
    }));
  };

  // Set default provider
  const setDefaultProvider = (channel, providerId) => {
    setProviders(prev => ({
      ...prev,
      [channel]: prev[channel].map(provider => ({
        ...provider,
        isDefault: provider.id === providerId
      }))
    }));
  };

  // Test provider connection
  const testProvider = async (channel, providerId) => {
    // This would make an actual API call to test the provider
    // For now, we'll simulate the test
    updateProvider(channel, providerId, { status: 'testing' });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random success/failure
    const success = Math.random() > 0.3;
    updateProvider(channel, providerId, { 
      status: success ? 'connected' : 'error',
      lastTested: new Date().toISOString()
    });
    
    return success;
  };

  // Get active provider for a channel
  const getActiveProvider = (channel) => {
    return providers[channel]?.find(provider => provider.isActive);
  };

  // Get default provider for a channel
  const getDefaultProvider = (channel) => {
    return providers[channel]?.find(provider => provider.isDefault);
  };

  // Get all providers for a channel
  const getProviders = (channel) => {
    return providers[channel] || [];
  };

  // Get provider statistics
  const getProviderStats = () => {
    const stats = {};
    Object.keys(providers).forEach(channel => {
      const channelProviders = providers[channel];
      stats[channel] = {
        total: channelProviders.length,
        active: channelProviders.filter(p => p.isActive).length,
        connected: channelProviders.filter(p => p.status === 'connected').length,
        disconnected: channelProviders.filter(p => p.status === 'disconnected').length,
        error: channelProviders.filter(p => p.status === 'error').length
      };
    });
    return stats;
  };

  const value = {
    providers,
    providerTemplates,
    addProvider,
    updateProvider,
    deleteProvider,
    setActiveProvider,
    setDefaultProvider,
    testProvider,
    getActiveProvider,
    getDefaultProvider,
    getProviders,
    getProviderStats
  };

  return (
    <ProvidersContext.Provider value={value}>
      {children}
    </ProvidersContext.Provider>
  );
};

export default ProvidersProvider; 