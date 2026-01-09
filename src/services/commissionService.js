import api from './api';

/**
 * Commission Tracking Service
 * Handles API calls for commission tracking
 */

const BASE_PATH = '/commission-tracking';

export const COMMISSION_TYPE = {
  NEW_BUSINESS: 'new_business',
  RENEWAL: 'renewal',
  REFERRAL: 'referral',
  OVERRIDE: 'override',
  BONUS: 'bonus'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled'
};

export const PRODUCT_TYPE = {
  MOTOR: 'motor',
  HEALTH: 'health',
  LIFE: 'life',
  PROPERTY: 'property',
  TRAVEL: 'travel',
  MARINE: 'marine'
};

/**
 * Fetch dashboard statistics
 */
export const fetchDashboardStats = async () => {
  try {
    const response = await api.get(`${BASE_PATH}/dashboard/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Fetch pending commissions
 * @param {string} policyType - Optional policy type filter
 */
export const fetchPendingCommissions = async (policyType = '') => {
  try {
    const url = policyType
      ? `${BASE_PATH}/pending/${encodeURIComponent(policyType)}/`
      : `${BASE_PATH}/pending/`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending commissions:', error);
    throw error;
  }
};

/**
 * Fetch approved commissions
 */
export const fetchApprovedCommissions = async () => {
  try {
    const response = await api.get(`${BASE_PATH}/approved/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching approved commissions:', error);
    throw error;
  }
};

/**
 * Fetch paid commissions
 */
export const fetchPaidCommissions = async () => {
  try {
    const response = await api.get(`${BASE_PATH}/paid/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching paid commissions:', error);
    throw error;
  }
};

/**
 * Export commissions
 */
export const exportCommissions = async () => {
  try {
    const response = await api.get(`${BASE_PATH}/export/`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting commissions:', error);
    throw error;
  }
};

/**
 * Perform action on a commission (Approve, Reject, etc.)
 * @param {string|number} id - Commission ID
 * @param {string} action - Action to perform (e.g., 'APPROVE', 'REJECT', 'PAID')
 */
export const performAction = async (id, action) => {
  try {
    // Ensure action is uppercase as per Postman example
    const response = await api.post(`${BASE_PATH}/actions/${id}/${action.toUpperCase()}/`);
    return response.data;
  } catch (error) {
    console.error(`Error performing action ${action} on commission ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new commission manually (if supported by API)
 */
export const createCommission = async (data) => {
  try {
    const response = await api.post(`${BASE_PATH}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating commission:', error);
    throw error;
  }
}

// Stub utilities to maintain import compatibility if needed, 
// though logically the context should be updated to not use them.
export const calculateCommissionBreakdown = () => ({});
export const generateCommissionStatement = () => ({});
export const getCommissionStatistics = () => ({});
export const filterCommissions = (comms) => comms;
export const sortCommissions = (comms) => comms;
export const calculateBasicCommission = () => 0;
export const getAgentTier = () => ({ multiplier: 1 });
export const calculateTieredCommission = () => 0;
export const calculatePerformanceBonus = () => 0;
export const calculateTDS = () => 0;
export const calculateNetCommission = () => ({});
export const calculateOverrideCommission = () => 0;
export const DEFAULT_COMMISSION_RATES = {};
export const COMMISSION_TIERS = {};

export default {
  fetchDashboardStats,
  fetchPendingCommissions,
  fetchApprovedCommissions,
  fetchPaidCommissions,
  exportCommissions,
  performAction,
  createCommission,
  COMMISSION_TYPE,
  PAYMENT_STATUS,
  PRODUCT_TYPE
};
