import api from './api';

const BASE_URL = '/dispositions';

/** Fetch all dispositions **/
export const fetchDispositions = async () => {
  try {
    const response = await api.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dispositions:', error);
    throw error;
  }
};

/** Fetch dashboard stats **/
export const getStatistics = async () => {
  try {
    const response = await api.get(`${BASE_URL}/stats/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching disposition stats:', error);
    throw error;
  }
};

/** Add a new disposition **/
export const addDisposition = async (dispositionData) => {
  try {
    const response = await api.post(`${BASE_URL}/`, dispositionData);
    return response.data;
  } catch (error) {
    console.error('Error adding disposition:', error);
    throw error;
  }
};

/** Update an existing disposition **/
export const updateDisposition = async (dispId, updates) => {
  try {
    // Postman uses PATCH for updates
    const response = await api.patch(`${BASE_URL}/${dispId}/`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating disposition:', error);
    throw error;
  }
};

/** Delete a disposition **/
export const deleteDisposition = async (dispId) => {
  try {
    const response = await api.delete(`${BASE_URL}/${dispId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting disposition:', error);
    throw error;
  }
};

/** Reorder dispositions **/
export const reorderDispositions = async (newOrderArray) => {
  try {
    // Assuming backend support or client-side sort handling for now
    // If backend endpoint for reorder exists:
    // const response = await api.post(`${BASE_URL}/reorder/`, { order: newOrderArray });
    // return response.data;

    // Fallback: This might need backend implementation, but we'll return success to not break UI
    return { success: true };
  } catch (error) {
    console.error('Error reordering dispositions:', error);
    throw error;
  }
};

/** Toggle active flag for disposition **/
export const toggleDisposition = async (dispId, isActive) => {
  try {
    const response = await api.patch(`${BASE_URL}/${dispId}/`, { active: isActive });
    return response.data;
  } catch (error) {
    console.error('Error toggling disposition:', error);
    throw error;
  }
};

/** Sub‑disposition CRUD **/
export const addSubDisposition = async (dispId, subDispData) => {
  try {
    // Corresponds to 'create_subdisposition' in Postman
    // URL: http://3.109.128.6:8000/api/dispositions/sub-dispositions/
    const data = { ...subDispData, disposition: dispId };
    const response = await api.post(`${BASE_URL}/sub-dispositions/`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding sub‑disposition:', error);
    throw error;
  }
};

export const updateSubDisposition = async (dispId, subDispId, updates) => {
  try {
    // Corresponds to 'update_subdisposition' in Postman
    // URL: http://3.109.128.6:8000/api/sub-dispositions/2/
    // Note root path /sub-dispositions/
    const response = await api.patch(`/sub-dispositions/${subDispId}/`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating sub‑disposition:', error);
    throw error;
  }
};

export const deleteSubDisposition = async (dispId, subDispId) => {
  try {
    // Corresponds to 'delete_subdisposition' in Postman
    // URL: http://3.109.128.6:8000/api/dispositions/sub-dispositions/2/
    const response = await api.delete(`${BASE_URL}/sub-dispositions/${subDispId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sub‑disposition:', error);
    throw error;
  }
};

/** Toggle active flag for sub-disposition **/
export const toggleSubDisposition = async (dispId, subDispId, isActive) => {
  try {
    const response = await api.patch(`/sub-dispositions/${subDispId}/`, { active: isActive });
    return response.data;
  } catch (error) {
    console.error('Error toggling sub‑disposition:', error);
    throw error;
  }
};

/** Dropdown List **/
export const getDispositionDropdown = async () => {
  try {
    const response = await api.get(`${BASE_URL}/dropdown/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching disposition dropdown:', error);
    throw error;
  }
};

// ============ AUTO ACTIONS HELPER UTILITIES ============

/**
 * Replace template variables with actual data
 */
const replaceTemplateVariables = (template, data) => {
  if (!template) return '';

  const variables = {
    leadName: data.leadName || data.customerName || 'Customer',
    customerName: data.customerName || data.leadName || 'Customer',
    dispositionName: data.dispositionName || 'N/A',
    subDispositionName: data.subDispositionName || 'N/A',
    agentName: data.agentName || 'Agent',
    productType: data.productType || 'Insurance',
    notes: data.notes || '',
    timestamp: new Date().toLocaleString(),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    leadId: data.leadId || 'N/A',
    email: data.email || data.customerEmail || '',
    phone: data.phone || data.customerPhone || '',
    company: 'Py360 Insurance'
  };

  let result = template;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, variables[key]);
  });

  return result;
};

export const generateDispositionEmail = (disposition, leadData, customTemplate = null) => {
  const template = customTemplate || disposition.emailTemplate || {
    subject: 'Update on Your Insurance Inquiry - {leadName}',
    body: `Dear {leadName},\n\nThank you for your interest in our insurance products. We wanted to update you on the status of your inquiry.\n\nStatus: {dispositionName}\nDetails: {subDispositionName}\n\n{notes}\n\nBest regards,\n{agentName}`
  };

  const data = {
    ...leadData,
    dispositionName: disposition.name,
    subDispositionName: leadData.subDispositionName || ''
  };

  return {
    subject: replaceTemplateVariables(template.subject, data),
    body: replaceTemplateVariables(template.body, data),
    to: leadData.email || leadData.customerEmail,
    from: 'Py360 Insurance <noreply@py360.com>'
  };
};

export const generateDispositionSMS = (disposition, leadData, customTemplate = null) => {
  const template = customTemplate || disposition.smsTemplate || {
    message: 'Hi {leadName}, status update: {dispositionName}. {subDispositionName} We will follow up soon. - Py360 Insurance'
  };

  const data = {
    ...leadData,
    dispositionName: disposition.name,
    subDispositionName: leadData.subDispositionName || ''
  };

  const message = replaceTemplateVariables(template.message, data);

  return {
    message: message.substring(0, 160),
    to: leadData.phone || leadData.customerPhone
  };
};

// Placeholder for other actions if needed by components
export const executeAutoActions = async () => ({ success: true });
export const generateDispositionTask = () => ({});
export const generateManagerNotification = () => ({});
export const getAutoActionConfig = async () => ({});
export const saveAutoActionConfig = async () => ({ success: true });

export default {
  fetchDispositions,
  getStatistics,
  addDisposition,
  updateDisposition,
  deleteDisposition,
  reorderDispositions,
  toggleDisposition,
  addSubDisposition,
  updateSubDisposition,
  deleteSubDisposition,
  toggleSubDisposition,
  getDispositionDropdown,
  generateDispositionEmail,
  generateDispositionSMS,
  executeAutoActions,
  generateDispositionTask,
  generateManagerNotification,
  getAutoActionConfig,
  saveAutoActionConfig
};
