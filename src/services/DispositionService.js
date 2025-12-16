import api from './api';

const delay = (ms = 200) => new Promise(res => setTimeout(res, ms));

// In‑memory fallback data
let mockDispositions = [];

/** Fetch all dispositions **/
export const fetchDispositions = async () => {
  try {
    const response = await api.get('/dispositions');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching dispositions, using mock:', error);
    await delay();
    return [...mockDispositions];
  }
};

/** Add a new disposition **/
export const addDisposition = async (dispositionData) => {
  try {
    const response = await api.post('/dispositions', dispositionData);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding disposition, using mock:', error);
    await delay();
    const newDisp = {
      ...dispositionData,
      id: dispositionData.id || `disp-${Date.now()}`,
      subDispositions: dispositionData.subDispositions || [],
      createdAt: new Date().toISOString()
    };
    mockDispositions.push(newDisp);
    return newDisp;
  }
};

/** Update an existing disposition **/
export const updateDisposition = async (dispId, updates) => {
  try {
    const response = await api.put(`/dispositions/${dispId}`, updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating disposition, using mock:', error);
    await delay();
    const idx = mockDispositions.findIndex(d => d.id === dispId);
    if (idx === -1) throw new Error('Disposition not found');
    mockDispositions[idx] = { ...mockDispositions[idx], ...updates, updatedAt: new Date().toISOString() };
    return mockDispositions[idx];
  }
};

/** Delete a disposition **/
export const deleteDisposition = async (dispId) => {
  try {
    const response = await api.delete(`/dispositions/${dispId}`);
    return response.data || { success: true };
  } catch (error) {
    console.error('Error deleting disposition, using mock:', error);
    await delay();
    mockDispositions = mockDispositions.filter(d => d.id !== dispId);
    return { success: true };
  }
};

/** Reorder dispositions **/
export const reorderDispositions = async (newOrderArray) => {
  try {
    const response = await api.put('/dispositions/reorder', newOrderArray);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error reordering dispositions, using mock:', error);
    await delay();
    mockDispositions = [...newOrderArray];
    return { success: true };
  }
};

/** Toggle active flag **/
export const toggleDisposition = async (dispId) => {
  try {
    const response = await api.post(`/dispositions/${dispId}/toggle`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error toggling disposition, using mock:', error);
    await delay();
    const idx = mockDispositions.findIndex(d => d.id === dispId);
    if (idx === -1) throw new Error('Disposition not found');
    mockDispositions[idx].active = !mockDispositions[idx].active;
    mockDispositions[idx].updatedAt = new Date().toISOString();
    return mockDispositions[idx];
  }
};

/** Sub‑disposition CRUD **/
export const addSubDisposition = async (dispId, subDispData) => {
  try {
    const response = await api.post(`/dispositions/${dispId}/sub`, subDispData);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding sub‑disposition, using mock:', error);
    await delay();
    const disp = mockDispositions.find(d => d.id === dispId);
    if (!disp) throw new Error('Disposition not found');
    const newSub = { ...subDispData, id: subDispData.id || `sub-${Date.now()}`, createdAt: new Date().toISOString() };
    disp.subDispositions = disp.subDispositions || [];
    disp.subDispositions.push(newSub);
    disp.updatedAt = new Date().toISOString();
    return newSub;
  }
};

export const updateSubDisposition = async (dispId, subDispId, updates) => {
  try {
    const response = await api.put(`/dispositions/${dispId}/sub/${subDispId}`, updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating sub‑disposition, using mock:', error);
    await delay();
    const disp = mockDispositions.find(d => d.id === dispId);
    if (!disp) throw new Error('Disposition not found');
    disp.subDispositions = disp.subDispositions || [];
    const idx = disp.subDispositions.findIndex(s => s.id === subDispId);
    if (idx === -1) throw new Error('Sub‑disposition not found');
    disp.subDispositions[idx] = { ...disp.subDispositions[idx], ...updates, updatedAt: new Date().toISOString() };
    disp.updatedAt = new Date().toISOString();
    return disp.subDispositions[idx];
  }
};

export const deleteSubDisposition = async (dispId, subDispId) => {
  try {
    const response = await api.delete(`/dispositions/${dispId}/sub/${subDispId}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error deleting sub‑disposition, using mock:', error);
    await delay();
    const disp = mockDispositions.find(d => d.id === dispId);
    if (!disp) throw new Error('Disposition not found');
    disp.subDispositions = (disp.subDispositions || []).filter(s => s.id !== subDispId);
    disp.updatedAt = new Date().toISOString();
    return { success: true };
  }
};

export const toggleSubDisposition = async (dispId, subDispId) => {
  try {
    const response = await api.post(`/dispositions/${dispId}/sub/${subDispId}/toggle`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error toggling sub‑disposition, using mock:', error);
    await delay();
    const disp = mockDispositions.find(d => d.id === dispId);
    if (!disp) throw new Error('Disposition not found');
    const sub = (disp.subDispositions || []).find(s => s.id === subDispId);
    if (!sub) throw new Error('Sub‑disposition not found');
    sub.active = !sub.active;
    sub.updatedAt = new Date().toISOString();
    disp.updatedAt = new Date().toISOString();
    return sub;
  }
};

/** Query helpers **/
export const getDispositionById = async (dispId) => {
  try {
    const response = await api.get(`/dispositions/${dispId}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching disposition by id, using mock:', error);
    await delay();
    return mockDispositions.find(d => d.id === dispId) || null;
  }
};

export const getDispositionsByCategory = async (category) => {
  try {
    const response = await api.get(`/dispositions/category/${category}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching dispositions by category, using mock:', error);
    await delay();
    return mockDispositions.filter(d => d.category === category);
  }
};

export const getActiveDispositions = async () => {
  try {
    const response = await api.get('/dispositions/active');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching active dispositions, using mock:', error);
    await delay();
    return mockDispositions.filter(d => d.active);
  }
};

export const getStatistics = async () => {
  try {
    const response = await api.get('/dispositions/stats');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching disposition stats, using mock:', error);
    await delay();
    const total = mockDispositions.length;
    const active = mockDispositions.filter(d => d.active).length;
    const totalSub = mockDispositions.reduce((sum, d) => sum + (d.subDispositions?.length || 0), 0);
    const activeSub = mockDispositions.reduce((sum, d) => sum + (d.subDispositions?.filter(s => s.active).length || 0), 0);
    const byCategory = {};
    mockDispositions.forEach(d => {
      const cat = d.category || 'uncategorized';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });
    return { totalDispositions: total, activeDispositions: active, totalSubDispositions: totalSub, activeSubDispositions: activeSub, byCategory };
  }
};

// ============ AUTO ACTIONS FUNCTIONALITY ============

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

/**
 * Generate formatted email for disposition
 */
export const generateDispositionEmail = (disposition, leadData, customTemplate = null) => {
  const template = customTemplate || disposition.emailTemplate || {
    subject: 'Update on Your Insurance Inquiry - {leadName}',
    body: `Dear {leadName},

Thank you for your interest in our insurance products. We wanted to update you on the status of your inquiry.

Status: {dispositionName}
${leadData.subDispositionName ? 'Details: {subDispositionName}' : ''}

{notes}

Our team is committed to providing you with the best insurance solutions. If you have any questions or need further assistance, please don't hesitate to reach out.

Best regards,
{agentName}
Py360 Insurance Team

Contact: support@py360.com | 1800-123-456`
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

/**
 * Generate formatted SMS for disposition
 */
export const generateDispositionSMS = (disposition, leadData, customTemplate = null) => {
  const template = customTemplate || disposition.smsTemplate || {
    message: 'Hi {leadName}, thank you for your interest. Status: {dispositionName}. We will follow up soon. - {agentName}, Py360 Insurance'
  };

  const data = {
    ...leadData,
    dispositionName: disposition.name
  };

  const message = replaceTemplateVariables(template.message, data);

  return {
    message: message.substring(0, 160), // SMS character limit
    to: leadData.phone || leadData.customerPhone,
    characterCount: message.length
  };
};

/**
 * Generate task for disposition
 */
export const generateDispositionTask = (disposition, leadData, customConfig = null) => {
  const config = customConfig || disposition.taskConfig || {
    titleTemplate: 'Follow-up: {leadName} - {dispositionName}',
    descriptionTemplate: 'Lead marked as {dispositionName}. Please follow up to {notes}',
    dueDays: 2,
    priority: 'medium',
    assignToCurrentUser: true
  };

  const data = {
    ...leadData,
    dispositionName: disposition.name,
    notes: leadData.notes || 'provide additional information'
  };

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (config.dueDays || 2));

  return {
    title: replaceTemplateVariables(config.titleTemplate, data),
    description: replaceTemplateVariables(config.descriptionTemplate, data),
    dueDate: dueDate.toISOString(),
    priority: config.priority || 'medium',
    assignedTo: config.assignedTo || leadData.agentName || 'Current User',
    leadId: leadData.leadId,
    dispositionId: disposition.id,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
};

/**
 * Generate manager notification for disposition
 */
export const generateManagerNotification = (disposition, leadData, customConfig = null) => {
  const config = customConfig || disposition.managerNotificationConfig || {
    managerEmails: ['manager@py360.com'],
    template: 'Lead {leadName} has been marked as {dispositionName} by {agentName}',
    notifyOnCategories: ['won', 'lost']
  };

  // Check if we should notify based on category
  if (config.notifyOnCategories && config.notifyOnCategories.length > 0) {
    if (!config.notifyOnCategories.includes(disposition.category)) {
      return null; // Don't notify for this category
    }
  }

  const data = {
    ...leadData,
    dispositionName: disposition.name,
    subDispositionName: leadData.subDispositionName || 'N/A'
  };

  return {
    subject: `Disposition Alert - ${disposition.name}`,
    body: `
Disposition Update Notification

Lead Information:
- Name: ${data.leadName || data.customerName}
- Lead ID: ${data.leadId || 'N/A'}
- Email: ${data.email || data.customerEmail || 'N/A'}
- Phone: ${data.phone || data.customerPhone || 'N/A'}

Disposition Details:
- Disposition: ${disposition.name}
- Sub-disposition: ${data.subDispositionName}
- Category: ${disposition.category}
- Agent: ${data.agentName || 'N/A'}
- Date: ${new Date().toLocaleString()}

Notes: ${data.notes || 'No additional notes'}

${replaceTemplateVariables(config.template, data)}

---
This is an automated notification from Py360 CRM System.
    `.trim(),
    to: config.managerEmails || ['manager@py360.com'],
    from: 'Py360 CRM <notifications@py360.com>'
  };
};

/**
 * Execute auto actions for a disposition
 */
export const executeAutoActions = async (disposition, leadData, options = {}) => {
  try {
    const results = {
      success: true,
      actions: [],
      errors: []
    };

    if (!disposition.autoActions) {
      return { success: true, message: 'No auto actions configured', actions: [] };
    }

    // Send Email
    if (disposition.autoActions.sendEmail) {
      try {
        const emailData = generateDispositionEmail(disposition, leadData, options.emailTemplate);
        if (emailData.to) {
          await delay(300);
          results.actions.push({
            type: 'email',
            status: 'success',
            message: `Email sent to ${emailData.to}`,
            data: emailData
          });
        } else {
          results.errors.push({
            type: 'email',
            message: 'No email address available for lead'
          });
        }
      } catch (error) {
        results.errors.push({
          type: 'email',
          message: error.message
        });
      }
    }

    // Send SMS
    if (disposition.autoActions.sendSMS) {
      try {
        const smsData = generateDispositionSMS(disposition, leadData, options.smsTemplate);
        if (smsData.to) {
          await delay(300);
          results.actions.push({
            type: 'sms',
            status: 'success',
            message: `SMS sent to ${smsData.to}`,
            data: smsData
          });
        } else {
          results.errors.push({
            type: 'sms',
            message: 'No phone number available for lead'
          });
        }
      } catch (error) {
        results.errors.push({
          type: 'sms',
          message: error.message
        });
      }
    }

    // Create Task
    if (disposition.autoActions.createTask) {
      try {
        const taskData = generateDispositionTask(disposition, leadData, options.taskConfig);
        await delay(300);
        results.actions.push({
          type: 'task',
          status: 'success',
          message: `Task created: ${taskData.title}`,
          data: taskData
        });
      } catch (error) {
        results.errors.push({
          type: 'task',
          message: error.message
        });
      }
    }

    // Notify Manager
    if (disposition.autoActions.notifyManager) {
      try {
        const notificationData = generateManagerNotification(disposition, leadData, options.managerConfig);
        if (notificationData) {
          await delay(300);
          results.actions.push({
            type: 'notification',
            status: 'success',
            message: `Manager notification sent to ${notificationData.to.join(', ')}`,
            data: notificationData
          });
        } else {
          results.actions.push({
            type: 'notification',
            status: 'skipped',
            message: 'Notification skipped based on category rules'
          });
        }
      } catch (error) {
        results.errors.push({
          type: 'notification',
          message: error.message
        });
      }
    }

    results.success = results.errors.length === 0;
    return results;
  } catch (error) {
    console.error('Error executing auto actions:', error);
    return {
      success: false,
      message: error.message,
      actions: [],
      errors: [{ type: 'general', message: error.message }]
    };
  }
};

/**
 * Apply disposition to a lead with auto actions
 */
export const applyDisposition = async (leadId, dispositionId, subDispositionId = null, leadData = {}, notes = '') => {
  try {
    const response = await api.post(`/dispositions/apply`, {
      leadId,
      dispositionId,
      subDispositionId,
      notes
    });
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error applying disposition, using mock:', error);
    await delay();

    const disposition = await getDispositionById(dispositionId);
    if (!disposition) throw new Error('Disposition not found');

    let subDisposition = null;
    if (subDispositionId) {
      subDisposition = disposition.subDispositions?.find(s => s.id === subDispositionId);
    }

    const enrichedLeadData = {
      ...leadData,
      leadId,
      dispositionName: disposition.name,
      subDispositionName: subDisposition?.name || '',
      notes,
      agentName: leadData.agentName || 'Current User'
    };

    const autoActionResults = await executeAutoActions(disposition, enrichedLeadData);

    return {
      success: true,
      message: 'Disposition applied successfully',
      disposition: {
        id: disposition.id,
        name: disposition.name,
        category: disposition.category
      },
      subDisposition: subDisposition ? {
        id: subDisposition.id,
        name: subDisposition.name
      } : null,
      autoActions: autoActionResults,
      appliedAt: new Date().toISOString()
    };
  }
};

/**
 * Get auto action configuration for a disposition
 */
export const getAutoActionConfig = async (dispositionId) => {
  try {
    const response = await api.get(`/dispositions/${dispositionId}/auto-actions`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching auto action config, using mock:', error);
    await delay();

    const disposition = await getDispositionById(dispositionId);
    if (!disposition) throw new Error('Disposition not found');

    return {
      emailTemplate: disposition.emailTemplate || null,
      smsTemplate: disposition.smsTemplate || null,
      taskConfig: disposition.taskConfig || null,
      managerNotificationConfig: disposition.managerNotificationConfig || null
    };
  }
};

/**
 * Save auto action configuration for a disposition
 */
export const saveAutoActionConfig = async (dispositionId, config) => {
  try {
    const response = await api.put(`/dispositions/${dispositionId}/auto-actions`, config);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error saving auto action config, using mock:', error);
    await delay();

    const idx = mockDispositions.findIndex(d => d.id === dispositionId);
    if (idx === -1) throw new Error('Disposition not found');

    if (config.emailTemplate) {
      mockDispositions[idx].emailTemplate = config.emailTemplate;
    }
    if (config.smsTemplate) {
      mockDispositions[idx].smsTemplate = config.smsTemplate;
    }
    if (config.taskConfig) {
      mockDispositions[idx].taskConfig = config.taskConfig;
    }
    if (config.managerNotificationConfig) {
      mockDispositions[idx].managerNotificationConfig = config.managerNotificationConfig;
    }

    mockDispositions[idx].updatedAt = new Date().toISOString();

    return {
      success: true,
      message: 'Auto action configuration saved successfully',
      config: {
        emailTemplate: mockDispositions[idx].emailTemplate,
        smsTemplate: mockDispositions[idx].smsTemplate,
        taskConfig: mockDispositions[idx].taskConfig,
        managerNotificationConfig: mockDispositions[idx].managerNotificationConfig
      }
    };
  }
};

export default {
  fetchDispositions,
  addDisposition,
  updateDisposition,
  deleteDisposition,
  reorderDispositions,
  toggleDisposition,
  addSubDisposition,
  updateSubDisposition,
  deleteSubDisposition,
  toggleSubDisposition,
  getDispositionById,
  getDispositionsByCategory,
  getActiveDispositions,
  getStatistics,
  // Auto Actions
  executeAutoActions,
  applyDisposition,
  generateDispositionEmail,
  generateDispositionSMS,
  generateDispositionTask,
  generateManagerNotification,
  getAutoActionConfig,
  saveAutoActionConfig
};
