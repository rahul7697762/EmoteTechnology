// job-portal/services/api.js
import axios from 'axios';

// Support both Node-style env (for CRA) and Vite's import.meta.env in the browser
const API_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL)
  || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Company Profile APIs
export const companyAPI = {
  createProfile: (data) => api.post('/companies/profile', data),
  getProfile: () => api.get('/companies/me'),
  updateProfile: (data) => api.put('/companies/me', data),
};

// Job APIs
export const jobAPI = {
  createJob: (data) => api.post('/jobs', data),
  getCompanyJobs: () => api.get('/jobs/company'),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  closeJob: (id) => api.patch(`/jobs/${id}/close`),
  getAllJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getJobApplications: (id) => api.get(`/jobs/${id}/applications`),
};

// Application APIs
export const applicationAPI = {
  createApplication: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),
  updateApplicationStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
};

// Resume APIs
export const resumeAPI = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getResume: (id) => api.get(`/resumes/${id}`),
};

export default api;