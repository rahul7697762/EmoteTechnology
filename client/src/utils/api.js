import axios from "axios";

export const api = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
    withCredentials:true
});


// auth apis 
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

export default api;
