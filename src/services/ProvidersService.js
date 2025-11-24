import api from './api';

const DEFAULT_PROVIDERS = {
  email: [
    {
      id: 'email-1',
      name: 'SendGrid Primary',
      type: 'sendgrid',
      isActive: true,
      isDefault: true,
      status: 'connected',
      config: { apiKey: '', fromEmail: 'noreply@company.com', fromName: 'Company Name', replyTo: 'support@company.com' },
      limits: { dailyLimit: 10000, monthlyLimit: 100000, rateLimit: 100 },
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
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
      config: { accountSid: '', authToken: '', fromNumber: '+1234567890', messagingServiceSid: '' },
      limits: { dailyLimit: 1000, monthlyLimit: 10000, rateLimit: 10 },
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }
  ],
  whatsapp: [],
  call: [],
  'bot-calling': []
};

let mockProviders = JSON.parse(JSON.stringify(DEFAULT_PROVIDERS));
const wait = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchProviders = async () => {
  try {
    const response = await api.get('/providers');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching providers, using mock:', error);
    await wait();
    return JSON.parse(JSON.stringify(mockProviders));
  }
};

export const fetchProvidersByChannel = async (channel) => {
  try {
    const response = await api.get(`/providers/${channel}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching providers by channel, using mock:', error);
    await wait();
    return mockProviders[channel] || [];
  }
};

export const saveProviders = async (providers) => {
  try {
    const response = await api.put('/providers', providers);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error saving providers, using mock:', error);
    await wait();
    mockProviders = providers;
    return { success: true };
  }
};

export const addProvider = async (channel, providerData) => {
  try {
    const response = await api.post(`/providers/${channel}`, providerData);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding provider, using mock:', error);
    await wait();
    const newProvider = {
      id: `${channel}-${Date.now()}`,
      ...providerData,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      status: 'disconnected'
    };
    mockProviders[channel] = [...(mockProviders[channel] || []), newProvider];
    return newProvider;
  }
};

export const updateProvider = async (channel, providerId, updates) => {
  try {
    const response = await api.put(`/providers/${channel}/${providerId}`, updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating provider, using mock:', error);
    await wait();
    mockProviders[channel] = (mockProviders[channel] || []).map(p => p.id === providerId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
    return { success: true };
  }
};

export const deleteProvider = async (channel, providerId) => {
  try {
    const response = await api.delete(`/providers/${channel}/${providerId}`);
    return response.data || { success: true };
  } catch (error) {
    console.error('Error deleting provider, using mock:', error);
    await wait();
    mockProviders[channel] = (mockProviders[channel] || []).filter(p => p.id !== providerId);
    return { success: true };
  }
};

export const setActiveProvider = async (channel, providerId) => {
  try {
    const response = await api.post(`/providers/${channel}/${providerId}/activate`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error setting active provider, using mock:', error);
    await wait();
    mockProviders[channel] = (mockProviders[channel] || []).map(p => ({ ...p, isActive: p.id === providerId }));
    return { success: true };
  }
};

export const setDefaultProvider = async (channel, providerId) => {
  try {
    const response = await api.post(`/providers/${channel}/${providerId}/set-default`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error setting default provider, using mock:', error);
    await wait();
    mockProviders[channel] = (mockProviders[channel] || []).map(p => ({ ...p, isDefault: p.id === providerId }));
    return { success: true };
  }
};

export const testProvider = async (channel, providerId) => {
  try {
    const response = await api.post(`/providers/${channel}/${providerId}/test`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error testing provider, using mock:', error);
    await wait(1500);
    const provider = (mockProviders[channel] || []).find(p => p.id === providerId);
    if (!provider) return { success: false, error: 'Provider not found' };

    const success = Math.random() > 0.3;
    provider.status = success ? 'connected' : 'error';
    provider.lastTested = new Date().toISOString();

    return { success, status: provider.status, lastTested: provider.lastTested };
  }
};

export const getProviderStats = async () => {
  try {
    const response = await api.get('/providers/stats');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching provider stats, using mock:', error);
    await wait();
    const stats = {};
    Object.keys(mockProviders).forEach(channel => {
      const list = mockProviders[channel] || [];
      stats[channel] = {
        total: list.length,
        active: list.filter(p => p.isActive).length,
        connected: list.filter(p => p.status === 'connected').length,
        disconnected: list.filter(p => p.status === 'disconnected').length,
        error: list.filter(p => p.status === 'error').length
      };
    });
    return stats;
  }
};

export default {
  fetchProviders,
  fetchProvidersByChannel,
  saveProviders,
  addProvider,
  updateProvider,
  deleteProvider,
  setActiveProvider,
  setDefaultProvider,
  testProvider,
  getProviderStats
};
