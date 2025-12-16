import api from './api';

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  smsNotifications: false,
  language: 'en',
  timezone: 'IST',
  autoRefresh: true,
  showEditCaseButton: true,
  mfaEnabled: false,
  billing: {
    utilization: [
      { service: 'Email Notifications', count: 245, cost: 1850.0 },
      { service: 'SMS Notifications', count: 78, cost: 1200.0 },
      { service: 'API Calls', count: 1245, cost: 4950.0 }
    ],
    platform: [
      { service: 'Base Subscription', period: 'Monthly', cost: 15000.0 },
      { service: 'Additional Users (5)', period: 'Monthly', cost: 3750.0 },
      { service: 'Premium Support', period: 'Monthly', cost: 7500.0 }
    ],
    totalMonthly: 34250.0
  }
};

// In-memory fallback
let mockSettings = { ...DEFAULT_SETTINGS };

const delay = (ms = 150) => new Promise(res => setTimeout(res, ms));

export const fetchSettings = async () => {
  try {
    const response = await api.get('/settings');
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching settings, using mock:', error);
    await delay();
    return { ...mockSettings };
  }
};

export const saveSettings = async (partial) => {
  try {
    const response = await api.put('/settings', partial);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error saving settings, using mock:', error);
    await delay();
    mockSettings = { ...mockSettings, ...partial };

    if (partial.billing) {
      mockSettings.billing = { ...mockSettings.billing, ...partial.billing };
    }

    return { ...mockSettings };
  }
};

export const resetSettings = async (toDefaults = true) => {
  try {
    const response = await api.post('/settings/reset', { toDefaults });
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error resetting settings, using mock:', error);
    await delay();
    mockSettings = toDefaults ? { ...DEFAULT_SETTINGS } : {};
    return { ...mockSettings };
  }
};

export const recalcBillingTotal = async () => {
  try {
    const response = await api.post('/settings/recalc-billing');
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error recalculating billing, using mock:', error);
    await delay();
    const platformSum = (mockSettings.billing?.platform || []).reduce((sum, p) => sum + (p.cost || 0), 0);
    const utilizationSum = (mockSettings.billing?.utilization || []).reduce((sum, u) => sum + (u.cost || 0), 0);
    mockSettings.billing = mockSettings.billing || {};
    mockSettings.billing.totalMonthly = platformSum + utilizationSum;
    return mockSettings.billing;
  }
};
