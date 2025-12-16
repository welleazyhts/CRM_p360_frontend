// Leave Management Service
// Handles API calls for leave requests and attendance regularization
// When backend is ready, update API_BASE_URL in .env file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const LEAVE_ENDPOINT = `${API_BASE_URL}/leaves`;
const REGULARIZATION_ENDPOINT = `${API_BASE_URL}/regularizations`;

// Helper function to simulate API delay (remove when using real backend)
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// =====================================================================================
// LEAVE MANAGEMENT FUNCTIONS
// =====================================================================================

/**
 * Fetch all leave requests
 * @param {Object} filters - Optional filters (status, employeeId, dateRange)
 * @returns {Promise<Array>} Array of leave objects
 */
const fetchLeaves = async (filters = {}) => {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${LEAVE_ENDPOINT}?${new URLSearchParams(filters)}`);
        // if (!response.ok) throw new Error('Failed to fetch leaves');
        // return await response.json();

        // Mock implementation
        await simulateDelay();

        const mockLeaves = [
            {
                id: 1,
                employee: 'Amit Patel',
                employeeId: 'EMP003',
                type: 'Casual Leave',
                startDate: '2025-01-15',
                endDate: '2025-01-16',
                days: 2,
                reason: 'Personal work',
                status: 'Approved',
                appliedDate: '2025-01-10',
            },
            {
                id: 2,
                employee: 'Priya Sharma',
                employeeId: 'EMP002',
                type: 'Sick Leave',
                startDate: '2025-01-20',
                endDate: '2025-01-20',
                days: 1,
                reason: 'Medical appointment',
                status: 'Pending',
                appliedDate: '2025-01-18',
            },
            {
                id: 3,
                employee: 'Vikram Singh',
                employeeId: 'EMP004',
                type: 'Earned Leave',
                startDate: '2025-01-25',
                endDate: '2025-01-28',
                days: 4,
                reason: 'Family vacation',
                status: 'Approved',
                appliedDate: '2025-01-12',
            },
            {
                id: 4,
                employee: 'Sneha Reddy',
                employeeId: 'EMP005',
                type: 'Casual Leave',
                startDate: '2025-02-05',
                endDate: '2025-02-06',
                days: 2,
                reason: 'Family function',
                status: 'Pending',
                appliedDate: '2025-01-28',
            },
            {
                id: 5,
                employee: 'Rahul Gupta',
                employeeId: 'EMP006',
                type: 'Work From Home',
                startDate: '2025-01-22',
                endDate: '2025-01-22',
                days: 1,
                reason: 'Home renovation work',
                status: 'Pending',
                appliedDate: '2025-01-20',
            },
        ];

        // Apply filters if provided
        let filteredLeaves = [...mockLeaves];

        if (filters.status) {
            filteredLeaves = filteredLeaves.filter(leave => leave.status === filters.status);
        }

        if (filters.employeeId) {
            filteredLeaves = filteredLeaves.filter(leave => leave.employeeId === filters.employeeId);
        }

        return filteredLeaves;
    } catch (error) {
        console.error('Error fetching leaves:', error);
        throw error;
    }
};

/**
 * Create a new leave request
 * @param {Object} leaveData - Leave request data
 * @returns {Promise<Object>} Created leave object
 */
const createLeave = async (leaveData) => {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(LEAVE_ENDPOINT, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(leaveData)
        // });
        // if (!response.ok) throw new Error('Failed to create leave request');
        // return await response.json();

        // Mock implementation
        await simulateDelay();

        const newLeave = {
            id: Date.now(),
            employee: leaveData.employee || 'Current User',
            employeeId: leaveData.employeeId || 'EMP001',
            type: leaveData.type,
            startDate: leaveData.startDate,
            endDate: leaveData.endDate,
            days: leaveData.days,
            reason: leaveData.reason,
            status: 'Pending',
            appliedDate: new Date().toISOString().split('T')[0],
        };

        return newLeave;
    } catch (error) {
        console.error('Error creating leave request:', error);
        throw error;
    }
};

/**
 * Update leave request status
 * @param {number} leaveId - ID of the leave to update
 * @param {string} status - New status (Approved/Rejected)
 * @param {string} remarks - Optional remarks
 * @returns {Promise<Object>} Updated leave object
 */
const updateLeaveStatus = async (leaveId, status, remarks = '') => {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${LEAVE_ENDPOINT}/${leaveId}/status`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ status, remarks })
        // });
        // if (!response.ok) throw new Error('Failed to update leave status');
        // return await response.json();

        // Mock implementation
        await simulateDelay();

        return {
            id: leaveId,
            status,
            remarks,
            updatedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error updating leave status:', error);
        throw error;
    }
};

/**
 * Delete a leave request
 * @param {number} leaveId - ID of the leave to delete
 * @returns {Promise<Object>} Success response
 */
const deleteLeave = async (leaveId) => {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${LEAVE_ENDPOINT}/${leaveId}`, {
        //   method: 'DELETE'
        // });
        // if (!response.ok) throw new Error('Failed to delete leave request');
        // return await response.json();

        // Mock implementation
        await simulateDelay();

        return {
            success: true,
            message: 'Leave request deleted successfully',
            id: leaveId,
        };
    } catch (error) {
        console.error('Error deleting leave request:', error);
        throw error;
    }
};

/**
 * Get leave balance for an employee
 * @param {string} employeeId - Employee ID
 * @returns {Promise<Object>} Leave balance object
 */
const getLeaveBalance = async (employeeId) => {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${LEAVE_ENDPOINT}/balance/${employeeId}`);
        // if (!response.ok) throw new Error('Failed to fetch leave balance');
        // return await response.json();

        // Mock implementation
        await simulateDelay();

        return {
            employeeId,
            totalLeaves: 12,
            availableLeaves: 8,
            usedLeaves: 4,
            pendingLeaves: 2,
            leaveTypes: {
                'Casual Leave': { total: 6, available: 4, used: 2 },
                'Sick Leave': { total: 3, available: 2, used: 1 },
                'Earned Leave': { total: 3, available: 2, used: 1 },
            },
        };
    } catch (error) {
        console.error('Error fetching leave balance:', error);
        throw error;
    }
};

/**
 * Get leave statistics
 * @returns {Promise<Object>} Statistics object
 */
const getLeaveStats = async () => {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${LEAVE_ENDPOINT}/stats`);
        // if (!response.ok) throw new Error('Failed to fetch leave statistics');
        // return await response.json();

        // Mock implementation
        await simulateDelay();

        return {
            totalRequests: 15,
            pendingRequests: 5,
            approvedRequests: 8,
            rejectedRequests: 2,
            upcomingLeaves: 3,
        };
    } catch (error) {
        console.error('Error fetching leave statistics:', error);
        throw error;
    }
};

// =====================================================================================
// ATTENDANCE REGULARIZATION FUNCTIONS
// =====================================================================================

/**
 * Fetch all regularization requests
 * @param {Object} filters - Optional filters (status, employeeId, dateRange)
 * @returns {Promise<Array>} Array of regularization objects
 */
const fetchRegularizations = async (filters = {}) => {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${REGULARIZATION_ENDPOINT}?${new URLSearchParams(filters)}`);
        // if (!response.ok) throw new Error('Failed to fetch regularizations');
        // return await response.json();

        // Mock implementation
        await simulateDelay();

        const mockRegularizations = [
            {
                id: 1,
                employee: 'Amit Patel',
                employeeId: 'EMP003',
                date: '2025-01-18',
                scheduledCheckIn: '09:00',
                actualCheckIn: '10:30',
                scheduledCheckOut: '18:00',
                actualCheckOut: '18:00',
                reason: 'Traffic jam on highway',
                status: 'Pending',
                appliedDate: '2025-01-18',
            },
            {
                id: 2,
                employee: 'Meera Joshi',
                employeeId: 'EMP007',
                date: '2025-01-17',
                scheduledCheckIn: '09:00',
                actualCheckIn: '09:00',
                scheduledCheckOut: '18:00',
                actualCheckOut: '16:30',
                reason: 'Urgent family matter',
                status: 'Approved',
                appliedDate: '2025-01-17',
            },
            {
                id: 3,
                employee: 'Kavya Nair',
                employeeId: 'EMP008',
                date: '2025-01-19',
                scheduledCheckIn: '09:00',
                actualCheckIn: '11:00',
                scheduledCheckOut: '18:00',
                actualCheckOut: '20:00',
                reason: 'Client meeting ran late',
                status: 'Pending',
                appliedDate: '2025-01-19',
            },
            {
                id: 4,
                employee: 'Sanjay Kumar',
                employeeId: 'EMP009',
                date: '2025-01-16',
                scheduledCheckIn: '09:00',
                actualCheckIn: '09:00',
                scheduledCheckOut: '18:00',
                actualCheckOut: '15:00',
                reason: 'Feeling unwell',
                status: 'Rejected',
                appliedDate: '2025-01-16',
                rejectionReason: 'Insufficient sick leave balance',
            },
        ];

        // Apply filters if provided
        let filteredRegularizations = [...mockRegularizations];

        if (filters.status) {
            filteredRegularizations = filteredRegularizations.filter(reg => reg.status === filters.status);
        }

        if (filters.employeeId) {
            filteredRegularizations = filteredRegularizations.filter(reg => reg.employeeId === filters.employeeId);
        }

        return filteredRegularizations;
    } catch (error) {
        console.error('Error fetching regularizations:', error);
        throw error;
    }
};

/**
 * Create a new regularization request
 * @param {Object} regularizationData - Regularization request data
 * @returns {Promise<Object>} Created regularization object
 */
const createRegularization = async (regularizationData) => {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(REGULARIZATION_ENDPOINT, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(regularizationData)
        // });
        // if (!response.ok) throw new Error('Failed to create regularization request');
        // return await response.json();

        // Mock implementation
        await simulateDelay();

        const newRegularization = {
            id: Date.now(),
            employee: regularizationData.employee || 'Current User',
            employeeId: regularizationData.employeeId || 'EMP001',
            date: regularizationData.date,
            scheduledCheckIn: regularizationData.scheduledCheckIn || '09:00',
            actualCheckIn: regularizationData.actualCheckIn,
            scheduledCheckOut: regularizationData.scheduledCheckOut || '18:00',
            actualCheckOut: regularizationData.actualCheckOut,
            reason: regularizationData.reason,
            status: 'Pending',
            appliedDate: new Date().toISOString().split('T')[0],
        };

        return newRegularization;
    } catch (error) {
        console.error('Error creating regularization request:', error);
        throw error;
    }
};

/**
 * Update regularization request status
 * @param {number} regularizationId - ID of the regularization to update
 * @param {string} status - New status (Approved/Rejected)
 * @param {string} remarks - Optional remarks
 * @returns {Promise<Object>} Updated regularization object
 */
const updateRegularizationStatus = async (regularizationId, status, remarks = '') => {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${REGULARIZATION_ENDPOINT}/${regularizationId}/status`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ status, remarks })
        // });
        // if (!response.ok) throw new Error('Failed to update regularization status');
        // return await response.json();

        // Mock implementation
        await simulateDelay();

        return {
            id: regularizationId,
            status,
            remarks,
            updatedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error updating regularization status:', error);
        throw error;
    }
};

/**
 * Delete a regularization request
 * @param {number} regularizationId - ID of the regularization to delete
 * @returns {Promise<Object>} Success response
 */
const deleteRegularization = async (regularizationId) => {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${REGULARIZATION_ENDPOINT}/${regularizationId}`, {
        //   method: 'DELETE'
        // });
        // if (!response.ok) throw new Error('Failed to delete regularization request');
        // return await response.json();

        // Mock implementation
        await simulateDelay();

        return {
            success: true,
            message: 'Regularization request deleted successfully',
            id: regularizationId,
        };
    } catch (error) {
        console.error('Error deleting regularization request:', error);
        throw error;
    }
};

// =====================================================================================
// UTILITY FUNCTIONS
// =====================================================================================

/**
 * Calculate number of days between two dates
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {number} Number of days
 */
const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
};

/**
 * Check if leave dates overlap with existing leaves
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @param {Array} existingLeaves - Array of existing leaves
 * @returns {boolean} True if overlap exists
 */
const checkLeaveOverlap = (startDate, endDate, existingLeaves) => {
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    return existingLeaves.some(leave => {
        const existingStart = new Date(leave.startDate);
        const existingEnd = new Date(leave.endDate);

        return (newStart <= existingEnd && newEnd >= existingStart);
    });
};

// Export all methods as default object
const leaveService = {
    // Leave management
    fetchLeaves,
    createLeave,
    updateLeaveStatus,
    deleteLeave,
    getLeaveBalance,
    getLeaveStats,

    // Regularization management
    fetchRegularizations,
    createRegularization,
    updateRegularizationStatus,
    deleteRegularization,

    // Utilities
    calculateLeaveDays,
    checkLeaveOverlap,
};

export default leaveService;
