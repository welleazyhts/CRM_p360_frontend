import React, { createContext, useContext, useState, useEffect } from 'react';

const VahanContext = createContext();

export const useVahan = () => {
  const context = useContext(VahanContext);
  if (!context) {
    throw new Error('useVahan must be used within VahanProvider');
  }
  return context;
};

// Vahan API Configuration
const INITIAL_VAHAN_CONFIG = {
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

// Mock Vahan Verification Records
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

export const VahanProvider = ({ children }) => {
  const [config, setConfig] = useState(INITIAL_VAHAN_CONFIG);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('vahanConfig');
    const savedVerifications = localStorage.getItem('vahanVerifications');

    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    if (savedVerifications) {
      setVerifications(JSON.parse(savedVerifications));
    } else {
      setVerifications(INITIAL_VERIFICATIONS);
      localStorage.setItem('vahanVerifications', JSON.stringify(INITIAL_VERIFICATIONS));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (config) {
      localStorage.setItem('vahanConfig', JSON.stringify(config));
    }
  }, [config]);

  useEffect(() => {
    if (verifications.length > 0) {
      localStorage.setItem('vahanVerifications', JSON.stringify(verifications));
    }
  }, [verifications]);

  // ============ CONFIGURATION FUNCTIONS ============

  const updateConfig = (updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
    return { success: true };
  };

  const testConnection = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.2; // 80% success rate
    setLoading(false);

    if (success) {
      return { success: true, message: 'Connection successful. API is reachable.' };
    } else {
      return { success: false, error: 'Connection failed. Please check credentials.' };
    }
  };

  // ============ VERIFICATION FUNCTIONS ============

  const verifyVehicle = async (vehicleNumber, leadId, verifiedBy = 'System') => {
    setLoading(true);

    // Clean vehicle number (remove spaces, hyphens)
    const cleanNumber = vehicleNumber.toUpperCase().replace(/[\s-]/g, '');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate 70% success rate
    const isSuccess = Math.random() > 0.3;

    let verification;

    if (isSuccess) {
      // Generate mock vehicle details
      verification = {
        id: `vh-${Date.now()}`,
        leadId,
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
          state: extractStateFromVehicleNumber(vehicleNumber)
        }
      };

      setVerifications(prev => [verification, ...prev]);
      setLoading(false);

      return {
        success: true,
        verification,
        message: 'Vehicle verified successfully'
      };
    } else {
      // Failed verification
      verification = {
        id: `vh-${Date.now()}`,
        leadId,
        vehicleNumber,
        status: 'failed',
        verifiedAt: new Date().toISOString(),
        verifiedBy,
        error: ['Vehicle not found', 'Invalid vehicle number', 'Service unavailable'][Math.floor(Math.random() * 3)],
        attempts: 1
      };

      setVerifications(prev => [verification, ...prev]);
      setLoading(false);

      return {
        success: false,
        error: verification.error,
        verification
      };
    }
  };

  const bulkVerifyVehicles = async (vehicleList, verifiedBy = 'System') => {
    setLoading(true);
    const results = [];

    for (const item of vehicleList) {
      const result = await verifyVehicle(item.vehicleNumber, item.leadId, verifiedBy);
      results.push({
        leadId: item.leadId,
        vehicleNumber: item.vehicleNumber,
        ...result
      });
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setLoading(false);

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    return {
      success: true,
      results,
      summary: {
        total: vehicleList.length,
        successful: successCount,
        failed: failedCount
      }
    };
  };

  const retryVerification = async (verificationId) => {
    const verification = verifications.find(v => v.id === verificationId);
    if (!verification) {
      return { success: false, error: 'Verification record not found' };
    }

    // Retry verification
    const result = await verifyVehicle(
      verification.vehicleNumber,
      verification.leadId,
      verification.verifiedBy
    );

    // Update attempts count
    if (!result.success) {
      setVerifications(prev => prev.map(v =>
        v.id === verificationId
          ? { ...v, attempts: (v.attempts || 0) + 1 }
          : v
      ));
    }

    return result;
  };

  // ============ QUERY FUNCTIONS ============

  const getVerificationByLeadId = (leadId) => {
    return verifications.find(v => v.leadId === leadId);
  };

  const getVerificationsByStatus = (status) => {
    return verifications.filter(v => v.status === status);
  };

  const isVehicleVerified = (leadId) => {
    const verification = getVerificationByLeadId(leadId);
    return verification && verification.status === 'verified';
  };

  const getVehicleDetails = (leadId) => {
    const verification = getVerificationByLeadId(leadId);
    return verification?.vehicleDetails || null;
  };

  const deleteVerification = (verificationId) => {
    setVerifications(prev => prev.filter(v => v.id !== verificationId));
    return { success: true };
  };

  // ============ STATISTICS ============

  const getStatistics = () => {
    const total = verifications.length;
    const verified = verifications.filter(v => v.status === 'verified').length;
    const failed = verifications.filter(v => v.status === 'failed').length;
    const pending = verifications.filter(v => v.status === 'pending').length;

    return {
      total,
      verified,
      failed,
      pending,
      successRate: total > 0 ? ((verified / total) * 100).toFixed(2) : 0,
      recentVerifications: verifications.slice(0, 10)
    };
  };

  // ============ HELPER FUNCTIONS ============

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

  const value = {
    // State
    config,
    verifications,
    loading,

    // Configuration
    updateConfig,
    testConnection,

    // Verification
    verifyVehicle,
    bulkVerifyVehicles,
    retryVerification,

    // Query
    getVerificationByLeadId,
    getVerificationsByStatus,
    isVehicleVerified,
    getVehicleDetails,
    deleteVerification,

    // Statistics
    getStatistics
  };

  return (
    <VahanContext.Provider value={value}>
      {children}
    </VahanContext.Provider>
  );
};
