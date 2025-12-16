// MIS Services - API methods for Lead MIS Reports
// This service handles all MIS (Management Information System) related API calls

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetch MIS Overview - Overall metrics and statistics
 * @param {Object} params - Filter parameters (dateRange, agents, sources, statuses)
 * @returns {Promise<Object>} Overview data with metrics
 */
export const fetchMISOverview = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/mis/overview?${queryString}`);

        if (!response.ok) {
            throw new Error('Failed to fetch MIS overview');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching MIS overview:', error);

        // Return mock data as fallback
        return {
            totalLeads: 180,
            conversionRate: 34.2,
            totalRevenue: 39000000,
            lostLeads: 18,
            trends: {
                leadsChange: 12,
                conversionChange: 5.3,
                revenueChange: 18,
                lostLeadsChange: -8
            }
        };
    }
};

/**
 * Fetch Leads by Status - Distribution of leads across different statuses
 * @param {Object} params - Filter parameters
 * @returns {Promise<Array>} Array of status data with counts
 */
export const fetchLeadsByStatus = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/mis/leads-by-status?${queryString}`);

        if (!response.ok) {
            throw new Error('Failed to fetch leads by status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching leads by status:', error);

        // Return mock data as fallback
        return [
            { name: 'New Leads', value: 45, count: 45 },
            { name: 'Contacted', value: 32, count: 32 },
            { name: 'Qualified', value: 28, count: 28 },
            { name: 'Proposal Sent', value: 15, count: 15 },
            { name: 'Closed Won', value: 12, count: 12 },
            { name: 'Closed Lost', value: 18, count: 18 }
        ];
    }
};

/**
 * Fetch Leads by Source - Distribution of leads across different sources
 * @param {Object} params - Filter parameters
 * @returns {Promise<Array>} Array of source data with counts
 */
export const fetchLeadsBySource = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/mis/leads-by-source?${queryString}`);

        if (!response.ok) {
            throw new Error('Failed to fetch leads by source');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching leads by source:', error);

        // Return mock data as fallback
        return [
            { name: 'Website', value: 65, count: 65 },
            { name: 'Referral', value: 45, count: 45 },
            { name: 'Direct', value: 30, count: 30 },
            { name: 'Social Media', value: 25, count: 25 },
            { name: 'Others', value: 15, count: 15 }
        ];
    }
};

/**
 * Fetch Leads Trend - Monthly trend data for leads and conversions
 * @param {Object} params - Filter parameters
 * @returns {Promise<Array>} Array of monthly trend data
 */
export const fetchLeadsTrend = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/mis/trends?${queryString}`);

        if (!response.ok) {
            throw new Error('Failed to fetch leads trend');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching leads trend:', error);

        // Return mock data as fallback
        return [
            { month: 'Jan', leads: 45, converted: 12 },
            { month: 'Feb', leads: 52, converted: 15 },
            { month: 'Mar', leads: 48, converted: 14 },
            { month: 'Apr', leads: 61, converted: 18 },
            { month: 'May', leads: 55, converted: 16 },
            { month: 'Jun', leads: 67, converted: 22 }
        ];
    }
};

/**
 * Fetch Agent Performance - Performance metrics for all agents
 * @param {Object} params - Filter parameters
 * @returns {Promise<Array>} Array of agent performance data
 */
export const fetchAgentPerformance = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/mis/agent-performance?${queryString}`);

        if (!response.ok) {
            throw new Error('Failed to fetch agent performance');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching agent performance:', error);

        // Return mock data as fallback
        return [
            { name: 'Priya Patel', leads: 45, converted: 15, revenue: 850000, conversionRate: 33.3 },
            { name: 'Rahul Kumar', leads: 38, converted: 12, revenue: 720000, conversionRate: 31.6 },
            { name: 'Sarah Johnson', leads: 42, converted: 18, revenue: 980000, conversionRate: 42.9 },
            { name: 'Amit Sharma', leads: 35, converted: 10, revenue: 650000, conversionRate: 28.6 },
            { name: 'Kavita Reddy', leads: 30, converted: 11, revenue: 720000, conversionRate: 36.7 }
        ];
    }
};

/**
 * Fetch Duplicate Groups - Groups of duplicate leads for analysis
 * @param {Object} params - Filter parameters
 * @returns {Promise<Array>} Array of duplicate lead groups
 */
export const fetchDuplicateGroups = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/mis/duplicates?${queryString}`);

        if (!response.ok) {
            throw new Error('Failed to fetch duplicate groups');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching duplicate groups:', error);

        // Return mock data as fallback
        return [
            {
                groupId: 'DUP001',
                leads: [
                    { id: 'L001', name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phone: '+91-9876543210', source: 'Website', status: 'New Lead', createdDate: '2024-01-15' },
                    { id: 'L045', name: 'Rajesh Kumar', email: 'rajesh.k@gmail.com', phone: '+91-9876543210', source: 'Referral', status: 'Contacted', createdDate: '2024-01-18' }
                ],
                duplicateType: 'Phone',
                confidence: 95
            },
            {
                groupId: 'DUP002',
                leads: [
                    { id: 'L023', name: 'Priya Sharma', email: 'priya.sharma@company.com', phone: '+91-9123456789', source: 'Direct', status: 'Qualified', createdDate: '2024-01-10' },
                    { id: 'L067', name: 'Priya S', email: 'priya.sharma@company.com', phone: '+91-9123456780', source: 'Email', status: 'New Lead', createdDate: '2024-01-20' }
                ],
                duplicateType: 'Email',
                confidence: 98
            }
        ];
    }
};

/**
 * Fetch Pre-Expiry Renewals - Policies nearing expiry for renewal tracking
 * @param {Object} params - Filter parameters
 * @returns {Promise<Array>} Array of policies nearing expiry
 */
export const fetchPreExpiryRenewals = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/mis/pre-expiry-renewals?${queryString}`);

        if (!response.ok) {
            throw new Error('Failed to fetch pre-expiry renewals');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching pre-expiry renewals:', error);

        // Return mock data as fallback
        return [
            { id: 'POL001', customerName: 'Rajesh Kumar', policyType: 'Health', expiryDate: '2024-02-15', premium: 25000, status: 'Pending', daysToExpiry: 15, agent: 'Priya Patel', phone: '+91-9876543210', lastContact: '2024-01-28' },
            { id: 'POL002', customerName: 'Sunita Sharma', policyType: 'Motor', expiryDate: '2024-02-20', premium: 18000, status: 'Contacted', daysToExpiry: 20, agent: 'Rahul Kumar', phone: '+91-9123456789', lastContact: '2024-01-30' },
            { id: 'POL003', customerName: 'Amit Patel', policyType: 'Life', expiryDate: '2024-02-25', premium: 45000, status: 'Proposal Sent', daysToExpiry: 25, agent: 'Sarah Johnson', phone: '+91-9988776655', lastContact: '2024-02-01' }
        ];
    }
};

/**
 * Fetch Pivot Data - Pivot table data grouped by various dimensions
 * @param {Object} params - Filter parameters including groupBy (insurer/csc/tenure)
 * @returns {Promise<Array>} Array of pivot data
 */
export const fetchPivotData = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/mis/pivot?${queryString}`);

        if (!response.ok) {
            throw new Error('Failed to fetch pivot data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching pivot data:', error);

        // Return mock data as fallback based on groupBy parameter
        const groupBy = params.groupBy || 'insurer';

        if (groupBy === 'insurer') {
            return [
                { insurer: 'HDFC ERGO', policies: 145, premium: 6500000, claims: 12, claimRatio: 8.3, marketShare: 28.5 },
                { insurer: 'ICICI Lombard', policies: 132, premium: 5800000, claims: 8, claimRatio: 6.1, marketShare: 25.9 },
                { insurer: 'Bajaj Allianz', policies: 98, premium: 4200000, claims: 15, claimRatio: 15.3, marketShare: 19.2 }
            ];
        } else if (groupBy === 'csc') {
            return [
                { csc: 'Mumbai Central', policies: 185, premium: 8200000, agents: 12, avgPerAgent: 15.4, efficiency: 92.3 },
                { csc: 'Delhi North', policies: 165, premium: 7400000, agents: 10, avgPerAgent: 16.5, efficiency: 88.7 },
                { csc: 'Bangalore Tech', policies: 142, premium: 6800000, agents: 9, avgPerAgent: 15.8, efficiency: 94.1 }
            ];
        } else if (groupBy === 'tenure') {
            return [
                { tenure: '1 Year', policies: 285, premium: 8500000, renewalRate: 78.2, avgPremium: 29825, satisfaction: 4.2 },
                { tenure: '2 Years', policies: 198, premium: 7200000, renewalRate: 85.4, avgPremium: 36364, satisfaction: 4.5 },
                { tenure: '3 Years', policies: 142, premium: 6800000, renewalRate: 91.5, avgPremium: 47887, satisfaction: 4.7 }
            ];
        }

        return [];
    }
};

// Export all methods as default object
const misServices = {
    fetchMISOverview,
    fetchLeadsByStatus,
    fetchLeadsBySource,
    fetchLeadsTrend,
    fetchAgentPerformance,
    fetchDuplicateGroups,
    fetchPreExpiryRenewals,
    fetchPivotData
};

export default misServices;
