import axios from 'axios';

// Get API URL from environment variable 
// Support both VITE_API_URL and VITE_BACKEND_URL to stay compatible with team conventions
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
// Exporting as named export 'api' as well to satisfy main branch usage
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear storage and redirect to login
            localStorage.removeItem('token');
            // localStorage.removeItem('user'); // Optional: clear user data too
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    signup: async (data) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    login: async (data) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

// Default export for backward compatibility with my recent changes
export default api;
