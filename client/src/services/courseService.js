import axios from 'axios';

const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const axiosInstance = axios.create({
    withCredentials: true,
});

export const getFacultyCourses = async () => {
    const response = await axiosInstance.get(`${getApiUrl()}/courses/faculty/my-courses`);
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await axiosInstance.get(`${getApiUrl()}/faculty/dashboard-stats`);
    return response.data;
};

export const createCourse = async (courseData) => {
    // courseData should be FormData given it includes files
    const response = await axiosInstance.post(`${getApiUrl()}/courses`, courseData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getCourseDetails = async (courseId) => {
    const response = await axiosInstance.get(`${getApiUrl()}/faculty/course/${courseId}`);
    return response.data;
};

export const saveCourse = async (courseData) => {
    const response = await axiosInstance.post(`${getApiUrl()}/faculty/save-course`, courseData);
    return response.data;
};

