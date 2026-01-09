import api from './api';

const MIS_API_BASE = '/lead_mis_reports';

export const misServices = {
    fetchAgentPerformance: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/performance-analysis/agent-performance-summary/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching agent performance:', error);
            return [];
        }
    },

    fetchConversionByPolicyType: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/performance-analysis/conversion-by-policy-type/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching conversion by policy type:', error);
            return [];
        }
    },

    fetchDuplicateAnalysis: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/duplicate-analysis/duplicate-analysis-dashboard-summary/`, { params });
            // API returns straight object/array usually, but let's stick to returning data
            return response.data;
        } catch (error) {
            console.error('Error fetching duplicate analysis:', error);
            return [];
        }
    },

    fetchPreExpiryRenewals: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/pre-expiry-renewal/pre-expiry-list/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching pre-expiry renewals:', error);
            return [];
        }
    },

    fetchCscProductivity: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/csc-productivity/csc-productivity-report/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching csc productivity:', error);
            return [];
        }
    },

    fetchLostReasonAnalysis: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/lost-reason-analysis/lost-reason-analysis-dashboard-summary/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching lost reason analysis:', error);
            return {};
        }
    },

    fetchConversionPercentage: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/conversion-percentage-reports/conversion-dashboard-summary/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching conversion percentage:', error);
            return {};
        }
    },

    fetchPivotData: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/pivot-reports/tenure-wise-pivot-analysis/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching pivot data:', error);
            return [];
        }
    },

    fetchPremiumRegisters: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/premium-registers/premium-registers/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching premium registers:', error);
            return [];
        }
    },

    fetchDailyInsurerMis: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/daily-insurer-mis/daily-insurer-mis-summary/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching daily insurer mis:', error);
            return [];
        }
    },

    fetchCscLoadTracking: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/csc-load-tracking/csc-load-tracking-report/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching csc load tracking:', error);
            return [];
        }
    },

    fetchWorkloadDistribution: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/workload-distribution/workload-distribution-dashboard-stats/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching workload distribution:', error);
            return [];
        }
    },

    fetchCapacityPlanning: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/capacity-planning/capacity-planning-report/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching capacity planning:', error);
            return [];
        }
    },

    fetchDashboardStats: async (params = {}) => {
        try {
            const response = await api.get(`${MIS_API_BASE}/lead-mis-reports-dashboard/lead-mis-reports-dashboard-stats/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {};
        }
    },

};

export const {
    fetchAgentPerformance,
    fetchConversionByPolicyType,
    fetchDuplicateAnalysis,
    fetchPreExpiryRenewals,
    fetchCscProductivity,
    fetchLostReasonAnalysis,
    fetchConversionPercentage,
    fetchPivotData,
    fetchPremiumRegisters,
    fetchDailyInsurerMis,
    fetchCscLoadTracking,
    fetchWorkloadDistribution,
    fetchCapacityPlanning,
    fetchDashboardStats
} = misServices;

export default misServices;
