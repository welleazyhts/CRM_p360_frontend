import axios from 'axios';

const API_BASE_URL = 'http://65.0.124.182/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
