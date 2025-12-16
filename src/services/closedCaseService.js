import api from './api';

// Closed Cases service: API calls for closed cases management
// These functions call backend endpoints and fall back to mock data when unavailable

export const fetchClosedCases = async (params = {}) => {
  try {
    const res = await api.get('/closed-cases', { params });
    if (res && res.data) return res.data;
  } catch (e) {
    console.error('API call failed, using mock data:', e);
  }

  // Mock closed cases data
  return [
    {
      id: 'CASE-002',
      customerName: 'Meera Kapoor',
      policyNumber: 'POL-23456',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Rajesh Kumar',
      uploadDate: '2025-04-07',
      closedDate: '2025-04-15',
      isPriority: false,
      batchId: 'BATCH-2025-04-07-B',
      nextFollowUpDate: '2025-05-07',
      nextActionPlan: 'Policy successfully renewed',
      currentWorkStep: 'Completed',
      customerProfile: 'HNI',
      customerMobile: '9876543211',
      preferredLanguage: 'English',
      assignedAgent: 'Rajesh Kumar',
      productName: 'Home Insurance Premium',
      productCategory: 'Property',
      channel: 'Branch',
      subChannel: 'Relationship Manager',
      lastActionDate: '2025-04-15',
      totalCalls: 5,
      contactInfo: {
        email: 'meera.kapoor@gmail.com',
        phone: '9876543211'
      },
      policyDetails: {
        type: 'Home',
        expiryDate: '2025-05-10',
        premium: 950.00,
        renewalDate: '2025-05-10'
      }
    }
  ];
};

export const fetchClosedCaseById = async (caseId) => {
  try {
    const res = await api.get(`/closed-cases/${caseId}`);
    if (res && res.data) return res.data;
  } catch (e) {
    console.error('API call failed, using mock data:', e);
  }

  // Mock single case data
  return {
    id: caseId,
    customerName: 'Sample Customer',
    policyNumber: 'POL-12345',
    status: 'Renewed',
    closedDate: new Date().toISOString().split('T')[0]
  };
};

export const exportClosedCases = async (params = {}) => {
  try {
    const res = await api.post('/closed-cases/export', params);
    if (res && res.data) return res.data;
  } catch (e) {
    console.error('Export failed:', e);
  }

  // Mock export response
  return {
    success: true,
    downloadUrl: '/mock-export.xlsx',
    message: 'Export completed successfully'
  };
};

export const getClosedCaseStats = async (params = {}) => {
  try {
    const res = await api.get('/closed-cases/stats', { params });
    if (res && res.data) return res.data;
  } catch (e) {
    console.error('API call failed, using mock data:', e);
  }

  // Mock stats data
  return {
    totalClosed: 156,
    renewed: 142,
    cancelled: 14,
    avgClosureTime: 8.5,
    successRate: 91.0
  };
};

export default {
  fetchClosedCases,
  fetchClosedCaseById,
  exportClosedCases,
  getClosedCaseStats
};