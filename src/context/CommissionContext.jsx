import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  COMMISSION_TYPE,
  PAYMENT_STATUS,
  PRODUCT_TYPE,
  DEFAULT_COMMISSION_RATES,
  COMMISSION_TIERS,
  calculateCommissionBreakdown,
  generateCommissionStatement,
  getCommissionStatistics,
  filterCommissions,
  sortCommissions
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
  const [commissions, setCommissions] = useState(() => {
    const saved = localStorage.getItem('commissions');
    return saved ? JSON.parse(saved) : [];
  });

  // Configuration
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('commissionConfig');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      autoCalculate: true,
      defaultTDSRate: 10,
      overrideRate: 5,
      customRates: {},
      paymentCycle: 'monthly', // monthly, quarterly
      approvalRequired: true
    };
  });

  // Agents data for commission tracking
  const [agentsData, setAgentsData] = useState(() => {
    const saved = localStorage.getItem('commissionAgentsData');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('commissions', JSON.stringify(commissions));
  }, [commissions]);

  useEffect(() => {
    localStorage.setItem('commissionConfig', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('commissionAgentsData', JSON.stringify(agentsData));
  }, [agentsData]);

  /**
   * Calculate and record commission for a policy
   */
  const calculateCommission = useCallback((policy, agent) => {
    if (!config.enabled) {
      return { success: false, error: 'Commission calculation is disabled' };
    }

    // Get agent data
    const agentInfo = agentsData[agent.id] || {
      totalPremiumYTD: 0,
      targetPremium: 0,
      tdsRate: config.defaultTDSRate,
      overrideManager: null
    };

    // Calculate commission
    const breakdown = calculateCommissionBreakdown(policy, { ...agent, ...agentInfo }, config);

    // Create commission record
    const commissionRecord = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      agentId: agent.id,
      agentName: agent.name,
      productType: policy.productType,
      commissionType: policy.commissionType || COMMISSION_TYPE.NEW_BUSINESS,
      ...breakdown,
      paymentStatus: config.approvalRequired ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.APPROVED,
      policyDate: policy.policyDate || new Date().toISOString(),
      calculatedAt: new Date().toISOString(),
      paymentDate: null,
      notes: ''
    };

    // Add to commissions
    setCommissions(prev => [commissionRecord, ...prev]);

    // Update agent YTD data
    updateAgentData(agent.id, {
      totalPremiumYTD: agentInfo.totalPremiumYTD + policy.premium
    });

    return { success: true, commission: commissionRecord };
  }, [config, agentsData]);

  /**
   * Update commission record
   */
  /**
   * Add a manual commission record
   */
  const addCommission = useCallback((commission) => {
    setCommissions(prev => [commission, ...prev]);
  }, []);

  /**
   * Update commission record
   */
  const updateCommission = useCallback((commissionId, updates) => {
    setCommissions(prev => prev.map(comm =>
      comm.id === commissionId ? { ...comm, ...updates, updatedAt: new Date().toISOString() } : comm
    ));
  }, []);

  /**
   * Approve commission payment
   */
  const approveCommission = useCallback((commissionId) => {
    updateCommission(commissionId, {
      paymentStatus: PAYMENT_STATUS.APPROVED,
      approvedAt: new Date().toISOString()
    });
  }, [updateCommission]);

  /**
   * Mark commission as paid
   */
  const markAsPaid = useCallback((commissionId, paymentDate = null) => {
    updateCommission(commissionId, {
      paymentStatus: PAYMENT_STATUS.PAID,
      paymentDate: paymentDate || new Date().toISOString()
    });
  }, [updateCommission]);

  /**
   * Batch approve commissions
   */
  const batchApprove = useCallback((commissionIds) => {
    commissionIds.forEach(id => approveCommission(id));
  }, [approveCommission]);

  /**
   * Batch mark as paid
   */
  const batchMarkAsPaid = useCallback((commissionIds, paymentDate = null) => {
    commissionIds.forEach(id => markAsPaid(id, paymentDate));
  }, [markAsPaid]);

  /**
   * Delete commission
   */
  const deleteCommission = useCallback((commissionId) => {
    setCommissions(prev => prev.filter(comm => comm.id !== commissionId));
  }, []);

  /**
   * Update agent data
   */
  const updateAgentData = useCallback((agentId, data) => {
    setAgentsData(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        ...data
      }
    }));
  }, []);

  /**
   * Get commissions for agent
   */
  const getAgentCommissions = useCallback((agentId) => {
    return commissions.filter(comm => comm.agentId === agentId);
  }, [commissions]);

  /**
   * Get pending commissions
   */
  const getPendingCommissions = useCallback(() => {
    return commissions.filter(comm => comm.paymentStatus === PAYMENT_STATUS.PENDING);
  }, [commissions]);

  /**
   * Get approved but unpaid commissions
   */
  const getApprovedCommissions = useCallback(() => {
    return commissions.filter(comm => comm.paymentStatus === PAYMENT_STATUS.APPROVED);
  }, [commissions]);

  /**
   * Get paid commissions
   */
  const getPaidCommissions = useCallback(() => {
    return commissions.filter(comm => comm.paymentStatus === PAYMENT_STATUS.PAID);
  }, [commissions]);

  /**
   * Generate statement for period
   */
  const getStatement = useCallback((agentId, startDate, endDate) => {
    const agentComms = agentId ? getAgentCommissions(agentId) : commissions;
    return generateCommissionStatement(agentComms, startDate, endDate);
  }, [commissions, getAgentCommissions]);

  /**
   * Get filtered and sorted commissions
   */
  const getFilteredCommissions = useCallback((filters = {}, sortBy = 'policyDate', order = 'desc') => {
    const filtered = filterCommissions(commissions, filters);
    return sortCommissions(filtered, sortBy, order);
  }, [commissions]);

  /**
   * Get statistics
   */
  const getStatistics = useCallback(() => {
    return getCommissionStatistics(commissions);
  }, [commissions]);

  /**
   * Update configuration
   */
  const updateConfig = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Set custom rate for product/type combination
   */
  const setCustomRate = useCallback((productType, commissionType, rate) => {
    setConfig(prev => ({
      ...prev,
      customRates: {
        ...prev.customRates,
        [`${productType}_${commissionType}`]: rate
      }
    }));
  }, []);

  /**
   * Export data
   */
  const exportData = useCallback(() => {
    return {
      commissions,
      config,
      agentsData,
      exportDate: new Date().toISOString()
    };
  }, [commissions, config, agentsData]);

  /**
   * Import data
   */
  const importData = useCallback((data) => {
    if (data.commissions) setCommissions(data.commissions);
    if (data.config) setConfig(data.config);
    if (data.agentsData) setAgentsData(data.agentsData);
  }, []);

  /**
   * Clear all data
   */
  const clearAllData = useCallback(() => {
    if (window.confirm('Are you sure? This will delete all commission records.')) {
      setCommissions([]);
      localStorage.removeItem('commissions');
    }
  }, []);

  const value = {
    // State
    commissions,
    config,
    agentsData,

    // Commission Operations
    calculateCommission,
    addCommission,
    updateCommission,
    deleteCommission,
    approveCommission,
    markAsPaid,
    batchApprove,
    batchMarkAsPaid,

    // Agent Operations
    updateAgentData,
    getAgentCommissions,

    // Query Operations
    getPendingCommissions,
    getApprovedCommissions,
    getPaidCommissions,
    getFilteredCommissions,
    getStatement,
    getStatistics,

    // Configuration
    updateConfig,
    setCustomRate,

    // Data Management
    exportData,
    importData,
    clearAllData,

    // Constants
    COMMISSION_TYPE,
    PAYMENT_STATUS,
    PRODUCT_TYPE,
    DEFAULT_COMMISSION_RATES,
    COMMISSION_TIERS
  };

  return (
    <CommissionContext.Provider value={value}>
      {children}
    </CommissionContext.Provider>
  );
};

export default CommissionContext;
