import apiClient from './client';

export const authService = {
    login: async (email, password) => {
        try {
            console.log('Login Payload:', { email, password });
            const response = await apiClient.post('/auth/login/', { email, password });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    register: async (userData) => {
        try {
            const response = await apiClient.post('/auth/register/', userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
};
