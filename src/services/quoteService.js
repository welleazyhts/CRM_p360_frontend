import api from './api';

const BASE_PATH = '/quote_management/quotes';

// Helper: Convert frontend camelCase to backend snake_case
const toApiPayload = (data) => {
    const payload = {};
    const map = {
        // Basic Info
        id: 'id',
        quoteCode: 'quote_code',
        customerName: 'customer_name',
        customerEmail: 'customer_email',
        customerPhone: 'customer_phone',
        leadId: 'lead_id',

        // Product Info
        productType: 'product_type',
        productPlan: 'product_plan',
        tenure: 'policy_tenure', // '1 Year' or number?

        // Financials
        coverageAmount: 'coverage_amount',
        sumInsured: 'sum_insured',
        premium: 'premium_annual',
        quoteAmount: 'total_quote_amount',

        // Other
        validityPeriod: 'quote_validity_period',
        ageOfInsured: 'age_of_insured',
        notes: 'notes',
        remarks: 'notes', // map remarks to notes
    };

    Object.keys(data).forEach(key => {
        const apiKey = map[key];
        if (apiKey) {
            let value = data[key];

            // Clean up currency strings if needed (e.g. "₹12,000" -> 12000)
            if (['coverage_amount', 'sum_insured', 'premium_annual', 'total_quote_amount'].includes(apiKey)) {
                if (typeof value === 'string') {
                    value = parseFloat(value.replace(/[₹,]/g, ''));
                }
            }

            // Ensure age is integer
            if (apiKey === 'age_of_insured' && value) {
                value = parseInt(value, 10);
            }

            payload[apiKey] = value;
        } else {
            // Pass through other keys if they match backend expected keys not mapped (dangerous? maybe just strict mapping)
            // For now, only mapped keys + explicit passthroughs
        }
    });

    return payload;
};

// Helper: Convert backend snake_case to frontend camelCase
const fromApiResponse = (item) => {
    if (!item) return item;

    const map = {
        id: 'id',
        quote_code: 'quoteCode',
        customer_name: 'customerName',
        customer_email: 'customerEmail',
        customer_phone: 'customerPhone',
        lead_id: 'leadId',
        product_type: 'productType',
        product_plan: 'productPlan',
        policy_tenure: 'tenure',
        coverage_amount: 'coverageAmount',
        sum_insured: 'sumInsured',
        premium_annual: 'premium',
        total_quote_amount: 'quoteAmount',
        quote_validity_period: 'validityPeriod',
        age_of_insured: 'ageOfInsured',
        notes: 'remarks', // map notes to remarks
        status: 'status',
        created_at: 'raisedDate', // or use created_at directly
        updated_at: 'lastUpdated',
        // Activity/Timeline might need special handling if returned in detail view
    };

    const newData = {};
    Object.keys(item).forEach(key => {
        const newKey = map[key] || key;
        newData[newKey] = item[key];
    });

    // formatting currency for display? Frontend likely expects formatted strings or raw numbers
    // Frontend seems to handle "₹" prefix. Let's keep it raw if it's a number, frontend adds symbol. 
    // But if backend sends string "15000.00", that's fine.

    // Ensure status is Title Case if needed (frontend uses 'Draft', 'Pending')
    if (newData.status) {
        // normalize? Backend might send 'draft', 'pending'
        newData.status = newData.status.charAt(0).toUpperCase() + newData.status.slice(1).toLowerCase();
    }

    return newData;
};

const quoteService = {
    /**
     * List all quotes
     * GET /api/quote_management/quotes/
     */
    listQuotes: async (params = {}) => {
        try {
            const response = await api.get(`${BASE_PATH}/`, { params });
            const data = response.data;
            if (Array.isArray(data)) {
                return data.map(fromApiResponse);
            } else if (data && Array.isArray(data.items)) {
                return data.items.map(fromApiResponse);
            }
            return [];
        } catch (error) {
            console.error('Error fetching quotes list:', error);
            throw error;
        }
    },

    /**
     * Create a new quote
     * POST /api/quote_management/quotes/
     */
    createQuote: async (data) => {
        try {
            const payload = toApiPayload(data);
            const response = await api.post(`${BASE_PATH}/`, payload);
            return fromApiResponse(response.data);
        } catch (error) {
            console.error('Error creating quote:', error);
            throw error;
        }
    },

    /**
     * Update a quote (Full update)
     * PUT /api/quote_management/quotes/{id}/
     */
    updateQuote: async (id, data) => {
        try {
            const payload = toApiPayload(data);
            // Ensure ID is not in body if not required, but strict mapping handles mostly
            const response = await api.put(`${BASE_PATH}/${id}/`, payload);
            return fromApiResponse(response.data);
        } catch (error) {
            console.error(`Error updating quote ${id}:`, error);
            throw error;
        }
    },

    /**
     * Partial Update a quote
     * PATCH /api/quote_management/quotes/{id}/
     */
    patchQuote: async (id, data) => {
        try {
            const payload = toApiPayload(data);
            const response = await api.patch(`${BASE_PATH}/${id}/`, payload);
            return fromApiResponse(response.data);
        } catch (error) {
            console.error(`Error patching quote ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get Quote Details
     * GET /api/quote_management/quotes/{id}/view_details/
     */
    getQuote: async (id) => {
        try {
            const response = await api.get(`${BASE_PATH}/${id}/view_details/`);
            return fromApiResponse(response.data);
        } catch (error) {
            console.error(`Error fetching quote details ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get Dashboard Stats
     * GET /api/quote_management/quotes/dashboard_stats/
     */
    getDashboardStats: async () => {
        try {
            const response = await api.get(`${BASE_PATH}/dashboard_stats/`);
            return response.data; // likely { totalQuotes: 10, ... }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    /**
     * Submit for Approval
     * POST /api/quote_management/quotes/{id}/submit_for_approval/
     */
    submitForApproval: async (id) => {
        try {
            const response = await api.post(`${BASE_PATH}/${id}/submit_for_approval/`, {});
            return fromApiResponse(response.data);
        } catch (error) {
            console.error(`Error submitting quote ${id} for approval:`, error);
            throw error;
        }
    },

    /**
     * Approve Quote
     * POST /api/quote_management/quotes/{id}/approve/
     */
    approveQuote: async (id) => {
        try {
            const response = await api.post(`${BASE_PATH}/${id}/approve/`, {});
            return fromApiResponse(response.data);
        } catch (error) {
            console.error(`Error approving quote ${id}:`, error);
            throw error;
        }
    },

    /**
     * Reject Quote
     * POST /api/quote_management/quotes/{id}/reject/
     */
    rejectQuote: async (id) => {
        try {
            const response = await api.post(`${BASE_PATH}/${id}/reject/`, {});
            return fromApiResponse(response.data);
        } catch (error) {
            console.error(`Error rejecting quote ${id}:`, error);
            throw error;
        }
    },

    /**
     * Convert Quote
     * POST /api/quote_management/quotes/{id}/convert/
     */
    convertQuote: async (id, policyId) => {
        try {
            const payload = {};
            if (policyId) payload.policy_id = policyId;
            const response = await api.post(`${BASE_PATH}/${id}/convert/`, payload);
            return fromApiResponse(response.data);
        } catch (error) {
            console.error(`Error converting quote ${id}:`, error);
            throw error;
        }
    },

    /**
     * Mark Lost
     * POST /api/quote_management/quotes/{id}/mark_lost/
     */
    markLost: async (id) => {
        try {
            const response = await api.post(`${BASE_PATH}/${id}/mark_lost/`, {});
            return fromApiResponse(response.data);
        } catch (error) {
            console.error(`Error marking quote ${id} as lost:`, error);
            throw error;
        }
    },

    /**
     * Duplicate Quote
     * POST /api/quote_management/quotes/{id}/duplicate/
     */
    duplicateQuote: async (id) => {
        try {
            const response = await api.post(`${BASE_PATH}/${id}/duplicate/`, {});
            return fromApiResponse(response.data);
        } catch (error) {
            console.error(`Error duplicating quote ${id}:`, error);
            throw error;
        }
    },

    /**
     * Send Email to Customer
     * POST /api/quote_management/quotes/{id}/send_to_customer/
     */
    sendQuote: async (id, options = {}) => {
        try {
            // options might contain channel, custom email etc. 
            // API endpoint seems generic 'send_to_customer', might accept body overrides
            const response = await api.post(`${BASE_PATH}/${id}/send_to_customer/`, options);
            return response.data;
        } catch (error) {
            console.error(`Error sending email for quote ${id}:`, error);
            throw error;
        }
    },

    /**
     * Download PDF
     * GET /api/quote_management/quotes/{id}/view_details_download_pdf/
     */
    downloadQuotePDF: async (id) => {
        try {
            const response = await api.get(`${BASE_PATH}/${id}/view_details_download_pdf/`, { responseType: 'blob' });
            return response.data;
        } catch (error) {
            console.error(`Error downloading PDF for quote ${id}:`, error);
            throw error;
        }
    },

    /**
     * Activity History
     * GET /api/quote_management/quotes/activity_history/
     */
    listHistory: async (params = {}) => {
        try {
            const response = await api.get(`${BASE_PATH}/activity_history/`, { params });
            return response.data; // likely array
        } catch (error) {
            console.error('Error fetching activity history:', error);
            return []; // fallback empty
        }
    },

    /**
     * Delete Quote
     * DELETE /api/quote_management/quotes/{id}/delete_quote/
     */
    deleteQuote: async (id) => {
        try {
            const response = await api.delete(`${BASE_PATH}/${id}/delete_quote/`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting quote ${id}:`, error);
            throw error;
        }
    },

    // Helper alias to match existing code calling `changeStatus`
    changeStatus: async (id, status, note) => {
        // Map frontend status change to specific backend endpoints
        const s = status.toLowerCase();
        if (s === 'approved') return quoteService.approveQuote(id);
        if (s === 'rejected') return quoteService.rejectQuote(id);
        if (s === 'converted') return quoteService.convertQuote(id);
        if (s === 'lost') return quoteService.markLost(id);
        if (s === 'pending') return quoteService.submitForApproval(id); // Maybe?

        // Fallback or generic status update if standard endpoint
        // Assuming 'Draft' doesn't have an endpoint, or normal update can handle it?
        // Since no generic "change_status" endpoint exists in the new collection, 
        // we might just log error or try patch if status is a field.
        // But based on endpoints, status transitions are explicit.
        return quoteService.patchQuote(id, { status: status, notes: note });
    }
};

export default quoteService;
