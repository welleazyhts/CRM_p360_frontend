import api from './api';

// In-memory fallback storage (replaces localStorage for mock mode)
const DEFAULT_CONFIG = {
  enabled: true,
  apiUrl: 'https://vahan-api.parivahan.gov.in/api/v1',
  apiKey: 'test_vahan_key_***',
  apiSecret: '***hidden***',
  autoVerifyOnLeadCreation: false,
  verifyOnStatusChange: false,
  retryAttempts: 3,
  timeout: 30000,
  storeVehicleDetails: true,
  notifyOnVerification: true,
  allowManualOverride: true
};

const INITIAL_VERIFICATIONS = [
  {
    id: 'vh-001',
    leadId: '1',
    vehicleNumber: 'MH-12-AB-1234',
    status: 'verified',
    verifiedAt: '2025-01-10T10:30:00Z',
    verifiedBy: 'System',
    vehicleDetails: {
      registrationNumber: 'MH-12-AB-1234',
      ownerName: 'Rahul Sharma',
      vehicleClass: 'Motor Car',
      fuelType: 'Petrol',
      manufacturer: 'Maruti Suzuki',
      model: 'Swift',
      registrationDate: '2020-06-15',
      expiryDate: '2025-06-14',
      insuranceExpiryDate: '2025-01-20',
      rcStatus: 'Active',
      chassisNumber: 'MA3ERJF3S00******',
      engineNumber: 'K12MN******',
      color: 'Silver',
      state: 'Maharashtra'
    }
  },
  {
    id: 'vh-002',
    leadId: '2',
    vehicleNumber: 'DL-3C-AV-5678',
    status: 'failed',
    verifiedAt: '2025-01-09T14:20:00Z',
    verifiedBy: 'agent-001',
    error: 'Vehicle number not found in database',
    attempts: 2
  }
];

// In-memory storage
let mockConfig = { ...DEFAULT_CONFIG };
let mockVerifications = [...INITIAL_VERIFICATIONS];

// Helper functions
const uid = (prefix = 'vh') => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateMockName = () => {
  const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Rajesh', 'Anita', 'Vikram', 'Pooja'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Verma', 'Desai', 'Reddy', 'Nair'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const generateRandomDate = (startYear, endYear) => {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const extractStateFromVehicleNumber = (vehicleNumber) => {
  if (!vehicleNumber || vehicleNumber.length < 2) return 'Unknown';
  const stateCode = vehicleNumber.substring(0, 2).toUpperCase();
  const stateCodes = {
    'MH': 'Maharashtra',
    'DL': 'Delhi',
    'KA': 'Karnataka',
    'TN': 'Tamil Nadu',
    'GJ': 'Gujarat',
    'RJ': 'Rajasthan',
    'UP': 'Uttar Pradesh',
    'WB': 'West Bengal',
    'HR': 'Haryana',
    'PB': 'Punjab'
  };
  return stateCodes[stateCode] || 'Unknown';
};

// Exported API
export const fetchConfig = async () => {
  try {
    const response = await api.get('/vahan/config');
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching Vahan config, using mock:', error);
    await sleep(200);
    return mockConfig;
  }
};

export const updateConfig = async (newConfig) => {
  try {
    const response = await api.put('/vahan/config', newConfig);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating Vahan config, using mock:', error);
    await sleep(200);
    mockConfig = { ...mockConfig, ...newConfig };
    return { success: true, config: mockConfig };
  }
};

export const testConnection = async () => {
  try {
    const response = await api.get('/vahan/test-connection');
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error testing Vahan connection, using mock:', error);
    await sleep(1200);
    const success = Math.random() > 0.2;
    if (success) return { success: true, message: 'Connection successful' };
    return { success: false, error: 'Connection failed (mock)' };
  }
};

export const fetchVerifications = async (page = 1, pageSize = 50) => {
  try {
    const response = await api.get('/vahan/verifications', { params: { page, pageSize } });
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching verifications, using mock:', error);
    await sleep(200);
    const start = (page - 1) * pageSize;
    const data = mockVerifications.slice(start, start + pageSize);
    return { data, total: mockVerifications.length };
  }
};

export const verifyVehicle = async (vehicleNumber, leadId, verifiedBy = 'System') => {
  try {
    const response = await api.post('/vahan/verify', { vehicleNumber, leadId, verifiedBy });
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error verifying vehicle, using mock:', error);
    await sleep(800 + Math.random() * 800);

    const cleanNumber = (vehicleNumber || '').toUpperCase().replace(/[-\s]/g, '');
    const isSuccess = Math.random() > 0.3; // 70% success

    const verification = isSuccess ? {
      id: uid('vh'),
      leadId: String(leadId || ''),
      vehicleNumber,
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy,
      vehicleDetails: {
        registrationNumber: vehicleNumber,
        ownerName: generateMockName(),
        vehicleClass: ['Motor Car', 'Motor Cycle', 'Goods Vehicle'][Math.floor(Math.random() * 3)],
        fuelType: ['Petrol', 'Diesel', 'Electric', 'CNG'][Math.floor(Math.random() * 4)],
        manufacturer: ['Maruti Suzuki', 'Hyundai', 'Honda', 'Tata', 'Mahindra'][Math.floor(Math.random() * 5)],
        model: ['Swift', 'i20', 'City', 'Nexon', 'XUV700'][Math.floor(Math.random() * 5)],
        registrationDate: generateRandomDate(2015, 2023),
        expiryDate: generateRandomDate(2025, 2028),
        insuranceExpiryDate: generateRandomDate(2025, 2026),
        rcStatus: 'Active',
        chassisNumber: `MA3ERJF3S00${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        engineNumber: `K12MN${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        color: ['Silver', 'White', 'Black', 'Red', 'Blue'][Math.floor(Math.random() * 5)],
        state: extractStateFromVehicleNumber(cleanNumber)
      }
    } : {
      id: uid('vh'),
      leadId: String(leadId || ''),
      vehicleNumber,
      status: 'failed',
      verifiedAt: new Date().toISOString(),
      verifiedBy,
      error: ['Vehicle not found', 'Invalid vehicle number', 'Service unavailable'][Math.floor(Math.random() * 3)],
      attempts: 1
    };

    mockVerifications = [verification, ...mockVerifications];

    return isSuccess ? { success: true, verification } : { success: false, error: verification.error, verification };
  }
};

export const bulkVerifyVehicles = async (vehicleList = [], verifiedBy = 'System') => {
  try {
    const response = await api.post('/vahan/bulk-verify', { vehicles: vehicleList, verifiedBy });
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error bulk verifying vehicles, using mock:', error);
    const results = [];
    for (const item of vehicleList) {
      // eslint-disable-next-line no-await-in-loop
      const res = await verifyVehicle(item.vehicleNumber, item.leadId, verifiedBy);
      results.push({ vehicleNumber: item.vehicleNumber, leadId: item.leadId, ...res });
      // eslint-disable-next-line no-await-in-loop
      await sleep(200);
    }

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.length - successCount;

    return { success: true, results, summary: { total: results.length, successful: successCount, failed: failedCount } };
  }
};

export const retryVerification = async (verificationId) => {
  try {
    const response = await api.post(`/vahan/verifications/${verificationId}/retry`);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error retrying verification, using mock:', error);
    const found = mockVerifications.find(v => v.id === verificationId);
    if (!found) return { success: false, error: 'Verification not found' };

    const res = await verifyVehicle(found.vehicleNumber, found.leadId, found.verifiedBy || 'System');

    if (!res.success) {
      mockVerifications = mockVerifications.map(v => v.id === verificationId ? { ...v, attempts: (v.attempts || 0) + 1 } : v);
    }

    return res;
  }
};

export const deleteVerification = async (verificationId) => {
  try {
    const response = await api.delete(`/vahan/verifications/${verificationId}`);
    return response.data || { success: true };
  } catch (error) {
    console.error('Error deleting verification, using mock:', error);
    mockVerifications = mockVerifications.filter(v => v.id !== verificationId);
    return { success: true };
  }
};

export const getStatistics = (verificationsList) => {
  const list = Array.isArray(verificationsList) ? verificationsList : mockVerifications;
  const total = list.length;
  const verified = list.filter(v => v.status === 'verified').length;
  const failed = list.filter(v => v.status === 'failed').length;
  const pending = list.filter(v => v.status === 'pending').length;

  return {
    total,
    verified,
    failed,
    pending,
    successRate: total > 0 ? Number(((verified / total) * 100).toFixed(2)) : 0,
    recentVerifications: list.slice(0, 10)
  };
};

export default {
  fetchConfig,
  updateConfig,
  testConnection,
  fetchVerifications,
  verifyVehicle,
  bulkVerifyVehicles,
  retryVerification,
  deleteVerification,
  getStatistics
};
