import axios from 'axios';

const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const axiosInstance = axios.create({
    withCredentials: true,
});

export const getFacultyCourses = async () => {
    try {
        const response = await axiosInstance.get(`${getApiUrl()}/courses/faculty/my-courses`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDashboardStats = async () => {
    try {
        const response = await axiosInstance.get(`${getApiUrl()}/faculty/dashboard-stats`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCourse = async (courseData) => {
    try {
        // courseData should be FormData given it includes files
        const response = await axiosInstance.post(`${getApiUrl()}/courses`, courseData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCourseDetails = async (courseId) => {
    try {
        const response = await axiosInstance.get(`${getApiUrl()}/faculty/course/${courseId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const saveCourse = async (courseData) => {
    try {
        const response = await axiosInstance.post(`${getApiUrl()}/faculty/save-course`, courseData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

