import api from './api';

/** Settings **/
export const fetchSettings = async () => {
  const response = await api.get('/auto-quote/settings/');
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await api.put('/auto-quote/settings/', settingsData);
  return response.data;
};

/** Customers **/
export const fetchCustomers = async () => {
  const response = await api.get('/auto-quote/customers/');
  return response.data;
};

export const toggleCustomerStatus = async (customerId, status) => {
  const response = await api.post(`/auto-quote/customers/${customerId}/toggle-status/`, { status });
  return response.data;
};

export const sendQuoteNow = async (customerId) => {
  const response = await api.post(`/auto-quote/customers/${customerId}/send-now/`);
  return response.data;
};

export const refreshCustomers = async () => {
  const response = await api.post('/auto-quote/customers/refresh/');
  return response.data;
};

/** Analytics **/
export const fetchAnalytics = async () => {
  const response = await api.get('/auto-quote/customers/analytics/');
  return response.data;
};

/** Notifications **/
export const fetchNotifications = async () => {
  const response = await api.get('/auto-quote/notifications/');
  return response.data;
};

export const toggleNotification = async (notificationType) => {
  const response = await api.post(`/auto-quote/notifications/toggle/${notificationType}/`);
  return response.data;
};

export default {
  fetchSettings,
  updateSettings,
  fetchCustomers,
  toggleCustomerStatus,
  sendQuoteNow,
  refreshCustomers,
  fetchAnalytics,
  fetchNotifications,
  toggleNotification
};

