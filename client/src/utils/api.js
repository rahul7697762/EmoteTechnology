import axios from 'axios';

// Get API URL from environment variable 
// Support both VITE_API_URL and VITE_BACKEND_URL to stay compatible with team conventions
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export { api };

// Auth API calls
export const authAPI = {
    signup: async (data) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    login: async (data) => {
        console.log('Login API called with data:', data);
        const response = await api.post('/auth/login', data);
        console.log('Login API response:', response.data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    verifyOTP: async (email, otp) => {
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    },

    resetPassword: async (password, token) => {
        const response = await api.post('/auth/reset-password', { newPassword: password, resetToken: token });
        return response.data;
    },

    verifyEmail: async (token) => {
        const response = await api.post('/auth/verify-email', { token });
        return response.data;
    }
};

// User API calls
export const userAPI = {
    updateProfile: async (formData) => {
        const config = {};
        if (formData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.put('/users/profile', formData, config);
        return response.data;
    },

    changePassword: async (data) => {
        const response = await api.put('/users/change-password', data);
        return response.data;
    },

    deleteAccount: async (password) => {
        const response = await api.delete('/users/deleteMe', { data: { password } });
        return response.data;
    }
};

// Course API calls
export const courseAPI = {
    // Create new course (metadata only)
    createCourse: async (courseData) => {
        // Handle multipart/form-data if courseData contains files
        const config = {};
        if (courseData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.post('/courses', courseData, config);
        return response.data;
    },

    // Get all courses created by the faculty
    getMyCourses: async () => {
        const response = await api.get('/courses/faculty/my-courses');
        return response.data;
    },

    // Get all public courses or search
    getAllCourses: async (endpoint = '/courses') => {
        const response = await api.get(endpoint);
        return response.data;
    },

    // Get course details by ID
    getCourseById: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },

    // Get course by ID (for Faculty - protected)
    getFacultyCourseById: async (id) => {
        const response = await api.get(`/courses/faculty/${id}`);
        return response.data;
    },

    // Get course by Slug
    getCourseBySlug: async (slug) => {
        const response = await api.get(`/courses/slug/${slug}`);
        return response.data;
    },

    // Update course (details, thumbnail, video)
    updateCourse: async (id, courseData) => {
        const config = {};
        if (courseData instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.put(`/courses/${id}`, courseData, config);
        return response.data;
    },

    // Update course status (e.g., to PUBLISHED)
    updateCourseStatus: async (id, status) => {
        const response = await api.patch(`/courses/${id}/status`, { status });
        return response.data;
    },

    // Delete course
    deleteCourse: async (id) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    }
};

// Module API calls
// Module API calls
export const moduleAPI = {
    // Create Module: /api/module/:courseId/create
    createModule: async (courseId, moduleData) => {
        const response = await api.post(`/module/${courseId}/create`, moduleData);
        return response.data;
    },

    // Get All Modules by Course: /api/module/:courseId
    getModulesByCourse: async (courseId) => {
        const response = await api.get(`/module/${courseId}`);
        return response.data;
    },

    // Get Single Module: /api/module/:id
    getModuleById: async (id) => {
        const response = await api.get(`/module/${id}`);
        return response.data;
    },

    // Update Module: /api/module/:id
    updateModule: async (id, moduleData) => {
        const response = await api.patch(`/module/${id}`, moduleData);
        return response.data;
    },

    // Publish Module: /api/module/:id/publish
    publishModule: async (id) => {
        const response = await api.patch(`/module/${id}/publish`);
        return response.data;
    },

    // Unpublish Module: /api/module/:id/unpublish
    unpublishModule: async (id) => {
        const response = await api.patch(`/module/${id}/unpublish`);
        return response.data;
    },

    // Delete Module: /api/module/:id
    deleteModule: async (id) => {
        const response = await api.delete(`/module/${id}`);
        return response.data;
    },

    // Reorder Modules: /api/module/:courseId/reorder
    reorderModules: async (courseId, modules) => {
        const response = await api.patch(`/module/${courseId}/reorder`, { modules });
        return response.data;
    }
};

// SubModule (Lesson) API calls
export const subModuleAPI = {
    // Create: /api/submodule
    // data can be JSON or FormData (if video file included)
    createSubModule: async (data) => {
        const config = {};
        if (data instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.post('/submodule', data, config);
        return response.data;
    },

    // Get All by Module: /api/submodule/module/:moduleId
    getSubModulesByModule: async (moduleId) => {
        const response = await api.get(`/submodule/module/${moduleId}`);
        return response.data;
    },

    // Get One: /api/submodule/:id
    getSubModuleById: async (id) => {
        const response = await api.get(`/submodule/${id}`);
        return response.data;
    },

    // Update: /api/submodule/:id
    updateSubModule: async (id, data) => {
        const config = {};
        if (data instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.patch(`/submodule/${id}`, data, config);
        return response.data;
    },

    // Publish: /api/submodule/:id/publish
    publishSubModule: async (id) => {
        const response = await api.patch(`/submodule/${id}/publish`);
        return response.data;
    },

    // Unpublish: /api/submodule/:id/unpublish
    unpublishSubModule: async (id) => {
        const response = await api.patch(`/submodule/${id}/unpublish`);
        return response.data;
    },

    // Delete: /api/submodule/:id
    deleteSubModule: async (id) => {
        const response = await api.delete(`/submodule/${id}`);
        return response.data;
    },

    // Reorder: /api/submodule/reorder
    reorderSubModules: async (moduleId, subModules) => {
        const response = await api.patch('/submodule/reorder', { moduleId, subModules });
        return response.data;
    }
};

// Payment API calls
export const paymentAPI = {
    // Get Razorpay Key: /api/payment/key
    getKey: async () => {
        const response = await api.get('/payment/key');
        return response.data;
    },

    // Create Order: /api/payment/create-order
    createOrder: async (courseId) => {
        const response = await api.post('/payment/create-order', { courseId });
        return response.data;
    },

    // Verify Payment: /api/payment/verify
    verifyPayment: async (paymentData) => {
        const response = await api.post('/payment/verify', paymentData);
        return response.data;
    }
};

// Default export for backward compatibility with my recent changes
// Progress API calls
export const progressAPI = {
    // Initialize Progress for Course: /api/progress/init
    initializeProgress: async (courseId) => {
        const response = await api.post('/progress/init', { courseId });
        return response.data;
    },

    // Update Progress (Heartbeat): /api/progress/update
    updateProgress: async (data) => {
        const response = await api.post('/progress/update', data);
        return response.data;
    },

    // Mark as Completed: /api/progress/complete
    completeLesson: async (subModuleId) => {
        const response = await api.post('/progress/complete', { subModuleId });
        return response.data;
    },

    // Get Video Progress: /api/progress/video/:subModuleId
    getVideoProgress: async (subModuleId) => {
        const response = await api.get(`/progress/video/${subModuleId}`);
        return response.data;
    },

    // Get Course Progress: /api/progress/course/:courseId
    getCourseProgress: async (courseId) => {
        const response = await api.get(`/progress/course/${courseId}`);
        return response.data;
    },

    // Reset Progress (Admin/Debug): /api/progress/reset
    resetProgress: async (courseId) => {
        const response = await api.post('/progress/reset', { courseId });
        return response.data;
    }
};

export const studentAPI = {
    // Get In-Progress Courses
    getInProgressCourses: async () => {
        const response = await api.get('/student/in-progress-courses');
        return response.data;
    },
    // ... existing studentAPI methods
    getUpcomingQuizzes: async () => {
        const response = await api.get('/student/upcoming-quizzes');
        return response.data;
    },

    // Get All Enrolled Courses
    getEnrolledCourses: async () => {
        const response = await api.get('/student/enrolled-courses');
        return response.data;
    },

    // Get Certificates
    getCertificates: async () => {
        const response = await api.get('/certificate/me');
        return response.data;
    },

    // Get Weekly Streak
    getWeeklyStreak: async () => {
        const response = await api.get('/student/weekly-streak');
        return response.data;
    },

    // Get Dashboard Stats
    getDashboardStats: async () => {
        const response = await api.get('/student/dashboard-stats');
        return response.data;
    }
};

export const assessmentAPI = {
    // Create Assessment
    createAssessment: async (data) => {
        const config = {};
        if (data instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.post("/assessment", data, config);
        return response.data;
    },

    // Get Assessment for Faculty
    getAssessmentForFaculty: async (moduleId) => {
        const response = await api.get(`/assessment/module/${moduleId}`);
        return response.data;
    },

    // Update Assessment
    updateAssessment: async (id, data) => {
        const config = {};
        if (data instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.put(`/assessment/${id}`, data, config);
        return response.data;
    },

    // Add Question
    addQuestion: async (assessmentId, data) => {
        const response = await api.post(`/assessment/${assessmentId}/questions`, data);
        return response.data;
    },

    // Delete Question
    deleteQuestion: async (id) => {
        const response = await api.delete(`/assessment/questions/${id}`);
        return response.data;
    },

    // Delete Assessment
    deleteAssessment: async (id) => {
        const response = await api.delete(`/assessment/${id}`);
        return response.data;
    },

    // Toggle Publish Assessment
    togglePublishAssessment: async (id) => {
        const response = await api.patch(`/assessment/${id}/publish`);
        return response.data;
    },

    // Get Assessment for Student
    getAssessmentForStudent: async (moduleId) => {
        const response = await api.get(`/assessment/module/${moduleId}/attempt`);
        return response.data;
    }
};

export const submissionAPI = {
    // Submit Assessment
    submitAssessment: async (assessmentId, data) => {
        const config = {};
        if (data instanceof FormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }
        const response = await api.post(`/submission/${assessmentId}/submit`, data, config);
        return response.data;
    },

    // Get All Submissions (Faculty)
    getSubmissions: async (assessmentId) => {
        const response = await api.get(`/submission/assessment/${assessmentId}`);
        return response.data;
    },

    // Grade Submission
    gradeSubmission: async (id, data) => {
        const response = await api.put(`/submission/${id}/grade`, data);
        return response.data;
    },

    // Get Submissions by Course (grouped by assessment)
    getSubmissionsByCourse: async (courseId) => {
        const response = await api.get(`/submission/course/${courseId}`);
        return response.data;
    },

    // Get Submissions by Assessment (with optional status filter)
    getSubmissionsByAssessment: async (assessmentId, status) => {
        const params = status ? { status } : {};
        const response = await api.get(`/submission/assessment/${assessmentId}`, { params });
        return response.data;
    },

    // Review Submission (for PDF grading)
    reviewSubmission: async (id, data) => {
        const response = await api.patch(`/submission/${id}/review`, data);
        return response.data;
    },

    // Get My Submissions (Student)
    getMySubmissions: async (assessmentId) => {
        const response = await api.get(`/submission/${assessmentId}/my-submissions`);
        return response.data;
    }
};

export default api;
