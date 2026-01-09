import api from './api';

const REMINDER_API_BASE = '/remainder_management/remainder-management/';

export const remainderService = {
    // List all reminders
    list: async (params = {}) => {
        try {
            const response = await api.get(REMINDER_API_BASE, { params });
            return response.data.results || response.data;
        } catch (error) {
            console.error('Error fetching reminders:', error);
            throw error;
        }
    },

    // Create a new reminder
    create: async (data) => {
        try {
            const response = await api.post(REMINDER_API_BASE, data);
            return response.data;
        } catch (error) {
            console.error('Error creating reminder:', error);
            throw error;
        }
    },

    // Get dashboard statistics
    getDashboardStats: async () => {
        try {
            const response = await api.get(`${REMINDER_API_BASE}dashboard-stats/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reminder stats:', error);
            throw error;
        }
    },

    // Mark reminder as complete
    complete: async (id) => {
        try {
            const response = await api.patch(`${REMINDER_API_BASE}${id}/complete/`);
            return response.data;
        } catch (error) {
            console.error('Error completing reminder:', error);
            throw error;
        }
    },

    // Snooze reminder
    snooze: async (id) => {
        try {
            const response = await api.patch(`${REMINDER_API_BASE}${id}/snooze/`);
            return response.data;
        } catch (error) {
            console.error('Error snoozing reminder:', error);
            throw error;
        }
    },

    // Delete reminder
    delete: async (id) => {
        try {
            await api.delete(`${REMINDER_API_BASE}${id}/`);
        } catch (error) {
            console.error('Error deleting reminder:', error);
            throw error;
        }
    }
};

export default remainderService;
