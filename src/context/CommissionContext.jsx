import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchDashboardStats,
  fetchPendingCommissions,
  fetchApprovedCommissions,
  fetchPaidCommissions,
  performAction,
  createCommission,
  exportCommissions,
  COMMISSION_TYPE,
  PAYMENT_STATUS,
  PRODUCT_TYPE
} from '../services/commissionService';

const CommissionContext = createContext();

export const useCommission = () => {
  const context = useContext(CommissionContext);
  if (!context) {
    throw new Error('useCommission must be used within CommissionProvider');
  }
  return context;
};

export const CommissionProvider = ({ children }) => {
  // Commissions state
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({});

  const [config, setConfig] = useState({
    enabled: true,
    autoCalculate: true,
    defaultTDSRate: 10,
    overrideRate: 5,
    customRates: {},
    paymentCycle: 'monthly',
    approvalRequired: true
  });

  const [agentsData, setAgentsData] = useState({});

  // Fetch all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [pending, approved, paid, stats] = await Promise.all([
        fetchPendingCommissions(),
        fetchApprovedCommissions(),
        fetchPaidCommissions(),
        fetchDashboardStats()
      ]);

      // Normalize and merge data
      const allCommissions = [
        ...(Array.isArray(pending) ? pending : []),
        ...(Array.isArray(approved) ? approved : []),
        ...(Array.isArray(paid) ? paid : [])
      ];

      setCommissions(allCommissions);
      setDashboardStats(stats);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch commission data", err);
      setError("Failed to load commission data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const calculateCommission = useCallback((policy, agent) => {
    console.warn("Client-side calculation is deprecated in favor of backend logic.");
    return { success: true };
  }, []);

  const addCommission = useCallback(async (commissionData) => {
    try {
      await createCommission(commissionData);
      await refreshData();
      return { success: true };
    } catch (err) {
      console.error("Error adding commission", err);
      return { success: false, error: err.message };
    }
  }, [refreshData]);

  const updateCommission = useCallback((commissionId, updates) => {
    console.warn("Update commission not fully implemented in API context");
  }, []);

  const approveCommission = useCallback(async (commissionId) => {
    try {
      await performAction(commissionId, 'APPROVE');
      await refreshData();
    } catch (err) {
      console.error("Error approving commission", err);
    }
  }, [refreshData]);

  const markAsPaid = useCallback(async (commissionId, paymentDate = null) => {
    try {
      await performAction(commissionId, 'PAID');
      await refreshData();
    } catch (err) {
      console.error("Error marking commission as paid", err);
    }
  }, [refreshData]);

  const batchApprove = useCallback(async (commissionIds) => {
    try {
      await Promise.all(commissionIds.map(id => performAction(id, 'APPROVE')));
      await refreshData();
    } catch (err) {
      console.error("Error batch approving", err);
    }
  }, [refreshData]);

  const batchMarkAsPaid = useCallback(async (commissionIds, paymentDate = null) => {
    try {
      await Promise.all(commissionIds.map(id => performAction(id, 'PAID')));
      await refreshData();
    } catch (err) {
      console.error("Error batch paying", err);
    }
  }, [refreshData]);

  const deleteCommission = useCallback((commissionId) => {
    console.warn("Delete commission API not implemented");
  }, []);

  const updateAgentData = useCallback((agentId, data) => {
    setAgentsData(prev => ({ ...prev, [agentId]: { ...prev[agentId], ...data } }));
  }, []);

  const getAgentCommissions = useCallback((agentId) => {
    return commissions.filter(comm => comm.agentId === agentId);
  }, [commissions]);

  const getPendingCommissions = useCallback(() => {
    return commissions.filter(comm => comm.paymentStatus === PAYMENT_STATUS.PENDING || comm.status === 'pending');
  }, [commissions]);

  const getApprovedCommissions = useCallback(() => {
    return commissions.filter(comm => comm.paymentStatus === PAYMENT_STATUS.APPROVED || comm.status === 'approved');
  }, [commissions]);

  const getPaidCommissions = useCallback(() => {
    return commissions.filter(comm => comm.paymentStatus === PAYMENT_STATUS.PAID || comm.status === 'paid');
  }, [commissions]);

  const getFilteredCommissions = useCallback((filters = {}, sortBy = 'policyDate', order = 'desc') => {
    let filtered = [...commissions];

    if (filters.paymentStatus) {
      filtered = filtered.filter(c => c.paymentStatus === filters.paymentStatus || c.status === filters.paymentStatus);
    }

    if (filters.productType) {
      filtered = filtered.filter(c => c.productType === filters.productType);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'policyDate':
          comparison = new Date(a.policyDate || 0) - new Date(b.policyDate || 0);
          break;
        case 'premium':
          comparison = (a.premium || 0) - (b.premium || 0);
          break;
        case 'commission':
          comparison = (a.netCommission || 0) - (b.netCommission || 0);
          break;
        case 'agentName':
          comparison = (a.agentName || '').localeCompare(b.agentName || '');
          break;
        default:
          comparison = 0;
      }
      return order === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [commissions]);

  const getStatistics = useCallback(() => {
    if (Object.keys(dashboardStats).length > 0) {
      return {
        ...dashboardStats,
        total: commissions.length
      };
    }

    // Fallback
    const stats = {
      total: commissions.length,
      totalNet: commissions.reduce((sum, c) => sum + (c.netCommission || 0), 0)
    };
    return stats;

  }, [commissions, dashboardStats]);

  const exportData = useCallback(async () => {
    try {
      await exportCommissions();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getStatement = () => ({});
  const updateConfig = () => { };
  const setCustomRate = () => { };
  const importData = () => { };
  const clearAllData = () => { };

  const value = {
    commissions,
    config,
    agentsData,
    loading,
    error,
    calculateCommission,
    addCommission,
    updateCommission,
    deleteCommission,
    approveCommission,
    markAsPaid,
    batchApprove,
    batchMarkAsPaid,
    updateAgentData,
    getAgentCommissions,
    getPendingCommissions,
    getApprovedCommissions,
    getPaidCommissions,
    getFilteredCommissions,
    getStatement,
    getStatistics,
    updateConfig,
    setCustomRate,
    exportData,
    importData,
    clearAllData,
    COMMISSION_TYPE,
    PAYMENT_STATUS,
    PRODUCT_TYPE,
    DEFAULT_COMMISSION_RATES: {},
    COMMISSION_TIERS: {}
  };

  return (
    <CommissionContext.Provider value={value}>
      {children}
    </CommissionContext.Provider>
  );
};

export default CommissionContext;
