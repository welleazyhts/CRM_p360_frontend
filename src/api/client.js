import axios from 'axios';

// Use environment variable for API URL, defaulting to production server
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://3.109.128.6:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;

