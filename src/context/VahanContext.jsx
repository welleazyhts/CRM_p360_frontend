import React, { createContext, useContext, useState, useEffect } from 'react';

import * as VahanService from '../services/VahanService';
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

  // Load initial config and verifications from VahanService
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const cfg = await VahanService.fetchConfig();
        const verifsResp = await VahanService.fetchVerifications();
        if (!mounted) return;
        setConfig(cfg || INITIAL_VAHAN_CONFIG);
        setVerifications(verifsResp?.data || INITIAL_VERIFICATIONS);
      } catch (err) {
        // fallback to defaults on error
        setConfig(INITIAL_VAHAN_CONFIG);
        setVerifications(INITIAL_VERIFICATIONS);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // ============ CONFIGURATION FUNCTIONS ============

  const updateConfig = (updates) => {
    // persist via service
    const merged = { ...config, ...updates };
    setConfig(merged);
    VahanService.updateConfig(merged).catch(() => {});
    return { success: true };
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const res = await VahanService.testConnection();
      return res;
    } catch (err) {
      return { success: false, error: err?.message || 'Connection failed' };
    } finally {
      setLoading(false);
    }
  };

  // ============ VERIFICATION FUNCTIONS ============

  const verifyVehicle = async (vehicleNumber, leadId, verifiedBy = 'System') => {
    setLoading(true);
    try {
      const res = await VahanService.verifyVehicle(vehicleNumber, leadId, verifiedBy);
      if (res?.verification) {
        setVerifications(prev => [res.verification, ...prev]);
      }
      return res;
    } catch (err) {
      return { success: false, error: err?.message || 'Verification failed' };
    } finally {
      setLoading(false);
    }
  };

  const bulkVerifyVehicles = async (vehicleList, verifiedBy = 'System') => {
    setLoading(true);
    try {
      const res = await VahanService.bulkVerifyVehicles(vehicleList, verifiedBy);
      // refresh verifications from service to keep state consistent
      const fresh = await VahanService.fetchVerifications();
      setVerifications(fresh?.data || []);
      return res;
    } catch (err) {
      return { success: false, error: err?.message || 'Bulk verification failed' };
    } finally {
      setLoading(false);
    }
  };

  const retryVerification = async (verificationId) => {
    try {
      const res = await VahanService.retryVerification(verificationId);
      // refresh list
      const fresh = await VahanService.fetchVerifications();
      setVerifications(fresh?.data || verifications);
      return res;
    } catch (err) {
      return { success: false, error: err?.message || 'Retry failed' };
    }
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
    // call service then update state
    VahanService.deleteVerification(verificationId).catch(() => {});
    setVerifications(prev => prev.filter(v => v.id !== verificationId));
    return { success: true };
  };

  // ============ STATISTICS ============

  const getStatistics = () => {
    return VahanService.getStatistics(verifications);
  };

  // ============ HELPER FUNCTIONS ============

  // helper functions are provided by VahanService; removed local mocks to avoid duplication

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
