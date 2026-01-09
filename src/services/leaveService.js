import api from './api';

// Leave Management Service
// Handles API calls for leave requests and attendance regularization

const BASE_PATH = '/leave_management/leave-management';

const leaveService = {
    /**
     * Apply for leave
     * POST /api/leave_management/leave-management/apply-leave/
     * @param {Object} leaveData - { employee_code, leave_type, start_date, end_date, reason }
     */
    applyLeave: async (leaveData) => {
        try {
            const response = await api.post(`${BASE_PATH}/apply-leave/`, leaveData);
            return response.data;
        } catch (error) {
            console.error('Error applying for leave:', error);
            throw error;
        }
    },

    /**
     * Get dashboard data
     * GET /api/leave_management/leave-management/dashboard/
     */
    getDashboardData: async () => {
        try {
            const response = await api.get(`${BASE_PATH}/dashboard/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    },

    /**
     * Apply for regularization
     * POST /api/leave_management/leave-management/apply-regularization/
     * @param {Object} regularizationData - { employee_code, regularization_date, actual_check_in, actual_check_out, reason }
     */
    applyRegularization: async (regularizationData) => {
        try {
            const response = await api.post(`${BASE_PATH}/apply-regularization/`, regularizationData);
            return response.data;
        } catch (error) {
            console.error('Error applying for regularization:', error);
            throw error;
        }
    },

    /**
     * Fetch regularization requests
     * GET /api/leave_management/leave-management/regularization-requests/
     */
    getRegularizationRequests: async () => {
        try {
            const response = await api.get(`${BASE_PATH}/regularization-requests/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching regularization requests:', error);
            throw error;
        }
    },

    /**
     * Approve regularization request
     * POST /api/leave_management/leave-management/{id}/approve/
     * @param {number} id - Regularization Request ID
     * @param {Object} data - { regularization_date, actual_check_in, actual_check_out, regularization_reason }
     */
    approveRegularization: async (id, data) => {
        try {
            const response = await api.post(`${BASE_PATH}/${id}/approve/`, data);
            return response.data;
        } catch (error) {
            console.error(`Error approving regularization ${id}:`, error);
            throw error;
        }
    },

    /**
     * Reject regularization request
     * POST /api/leave_management/leave-management/{id}/reject/
     * @param {number} id - Regularization Request ID
     * @param {Object} data - { regularization_date, actual_check_in, actual_check_out, regularization_reason }
     */
    rejectRegularization: async (id, data) => {
        try {
            const response = await api.post(`${BASE_PATH}/${id}/reject/`, data);
            return response.data;
        } catch (error) {
            console.error(`Error rejecting regularization ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get calendar data
     * GET /api/leave_management/leave-management/calendar/?month={month}&year={year}
     * @param {number} month 
     * @param {number} year 
     */
    getCalendarData: async (month, year) => {
        try {
            const response = await api.get(`${BASE_PATH}/calendar/`, {
                params: { month, year }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching calendar data:', error);
            throw error;
        }
    },

    /**
     * Get recent activity
     * GET /api/leave_management/leave-management/recent/
     */
    getRecentActivity: async () => {
        try {
            const response = await api.get(`${BASE_PATH}/recent/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recent activity:', error);
            throw error;
        }
    },

    approveLeave: async (id) => {
        try {
            // Updated to use specific action endpoint since default /{id}/approve seems linked to Regularization
            const response = await api.post(`${BASE_PATH}/approve-leave/`, { leave_id: id });
            return response.data;
        } catch (error) {
            console.error(`Error approving leave ${id}:`, error);
            throw error;
        }
    },

    /**
     * Reject leave request
     * POST /api/leave_management/leave-management/reject-leave/
     * @param {number} id - Leave Request ID
     */
    rejectLeave: async (id) => {
        try {
            const response = await api.post(`${BASE_PATH}/reject-leave/`, { leave_id: id });
            return response.data;
        } catch (error) {
            console.error(`Error rejecting leave ${id}:`, error);
            throw error;
        }
    },

    // Helper aliases to maintain potential backward compatibility with component calls (if needed)
    // or components should be updated to use the new methods.
    // Mapping old function names to new implementations where possible.

    createLeave: async (data) => {
        // Map old structure to new if necessary, or just call applyLeave
        return leaveService.applyLeave(data);
    },

    createRegularization: async (data) => {
        return leaveService.applyRegularization(data);
    },

    fetchLeaves: async () => {
        // Mapping to recent or requests, likely used for lists
        return leaveService.getRecentActivity();
    },

    getLeaveStats: async () => {
        return leaveService.getDashboardData();
    },

    fetchRegularizations: async () => {
        return leaveService.getRegularizationRequests();
    },

    updateRegularizationStatus: async (id, status, remarks) => {
        // This is a bit tricky as the new API has separate endpoints and expects data in body
        // We might need to fetch the existing request details first to pass them back if required, 
        // or the component should call approve/reject directly with necessary data.
        // For now, simpler to just error or warn, but let's try to map 'Approved' -> approveRegularization
        if (status === 'Approved') {
            return leaveService.approveRegularization(id, { regularization_reason: remarks });
        } else if (status === 'Rejected') {
            return leaveService.rejectRegularization(id, { regularization_reason: remarks });
        }
    },

    /**
     * Calculate number of days between two dates
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {number} Number of days
     */
    calculateLeaveDays: (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    },

    /**
     * Check if leave dates overlap with existing leaves
     * @param {string} startDate - Start date
     * @param {string} endDate - End date
     * @param {Array} existingLeaves - Array of existing leaves
     * @returns {boolean} True if overlap exists
     */
    checkLeaveOverlap: (startDate, endDate, existingLeaves) => {
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        return existingLeaves.some(leave => {
            const existingStart = new Date(leave.startDate);
            const existingEnd = new Date(leave.endDate);

            return (newStart <= existingEnd && newEnd >= existingStart);
        });
    }
};


export default leaveService;
