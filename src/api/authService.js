import apiClient from './client';

export const authService = {
    login: async (email, password) => {
        try {
            // Backend returned "email field required" error, so we must use 'email'
            console.log('Login Payload:', { email, password });
            const response = await apiClient.post('/auth/login/', { email, password });
            return response.data;
        } catch (error) {
            console.error('Login Service Error:', error);
            if (error.response) {
                console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
                throw error.response.data;
            }
            throw error;
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







