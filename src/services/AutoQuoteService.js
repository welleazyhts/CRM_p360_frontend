import api from './api';

const delay = (ms = 600) => new Promise(res => setTimeout(res, ms));

// In‑memory fallback data
let mockSettings = {
  enabled: true,
  frequency: 'Weekly',
  autoSendTime: '09:00',
  includeWeekends: false,
  maxQuotesPerDay: 50,
  retryFailedQuotes: true,
  retryAttempts: 3,
  enableAnalytics: true,
  requireApproval: false
};

let mockCustomers = [
  { id: 1, name: 'Rajesh Sharma', email: 'rajesh.sharma@gmail.com', phone: '+91-98765-43210', lastQuoteSent: '2024-01-15', nextScheduled: '2024-01-22', status: 'Active', productType: 'Health Insurance', premiumAmount: 25000 },
  { id: 2, name: 'Priya Patel', email: 'priya.patel@gmail.com', phone: '+91-87654-32109', lastQuoteSent: '2024-01-12', nextScheduled: '2024-01-19', status: 'Active', productType: 'Vehicle Insurance', premiumAmount: 18000 },
  { id: 3, name: 'Amit Kumar', email: 'amit.kumar@gmail.com', phone: '+91-76543-21098', lastQuoteSent: '2024-01-10', nextScheduled: '2024-01-17', status: 'Paused', productType: 'Life Insurance', premiumAmount: 35000 },
  { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@gmail.com', phone: '+91-65432-10987', lastQuoteSent: '2024-01-08', nextScheduled: '2024-01-15', status: 'Active', productType: 'Property Insurance', premiumAmount: 45000 }
];

/** Settings **/
export async function fetchSettings() {
  try {
    const response = await api.get('/auto-quote/settings');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching auto‑quote settings, using mock:', error);
    await delay();
    return { ...mockSettings };
  }
}

export async function updateSettings(updates) {
  try {
    const response = await api.put('/auto-quote/settings', updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating auto‑quote settings, using mock:', error);
    await delay();
    mockSettings = { ...mockSettings, ...updates };
    return { success: true, settings: { ...mockSettings } };
  }
}

/** Customers **/
export async function fetchCustomers() {
  try {
    const response = await api.get('/auto-quote/customers');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching auto‑quote customers, using mock:', error);
    await delay();
    return [...mockCustomers];
  }
}

export async function toggleCustomerStatus(customerId) {
  try {
    const response = await api.post(`/auto-quote/customers/${customerId}/toggle`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error toggling customer status, using mock:', error);
    await delay();
    mockCustomers = mockCustomers.map(c => c.id === customerId ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c);
    return { success: true, customers: [...mockCustomers], customer: mockCustomers.find(c => c.id === customerId) };
  }
}

function nextScheduledDate(frequency) {
  const t = new Date();
  if (!frequency) frequency = 'Weekly';
  switch (frequency) {
    case 'Daily': t.setDate(t.getDate() + 1); break;
    case 'Weekly': t.setDate(t.getDate() + 7); break;
    case 'Monthly': t.setMonth(t.getMonth() + 1); break;
    default: t.setDate(t.getDate() + 7);
  }
  return t.toISOString().split('T')[0];
}

export async function sendQuoteNow(customerId, settings = mockSettings) {
  try {
    const response = await api.post(`/auto-quote/customers/${customerId}/send`, { settings });
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error sending quote, using mock:', error);
    await delay(800 + Math.random() * 800);
    mockCustomers = mockCustomers.map(c => c.id === customerId ? { ...c, lastQuoteSent: new Date().toISOString().split('T')[0], nextScheduled: nextScheduledDate(settings.frequency) } : c);
    return { success: true, customers: [...mockCustomers], customer: mockCustomers.find(c => c.id === customerId) };
  }
}

export default {
  fetchSettings,
  updateSettings,
  fetchCustomers,
  toggleCustomerStatus,
  sendQuoteNow
};
