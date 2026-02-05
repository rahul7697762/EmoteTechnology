import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { courseAPI } from '../../utils/api';

// Async Thunks
export const getFacultyCourses = createAsyncThunk('course/getFacultyCourses', async (_, { rejectWithValue }) => {
    try {
        const response = await courseAPI.getMyCourses();
        return response.courses;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
});

export const fetchCourses = createAsyncThunk('course/fetchCourses', async ({ searchQuery = '', page = 1 } = {}, { rejectWithValue }) => {
    try {
        let endpoint = `/courses?page=${page}`;
        if (searchQuery.trim()) {
            endpoint = `/courses/search?query=${encodeURIComponent(searchQuery)}&page=${page}`;
        }
        const response = await courseAPI.getAllCourses(endpoint);
        return response; // { success: true, courses: [...], pagination: {...} }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
});

export const getDashboardStats = createAsyncThunk('course/getDashboardStats', async (_, { rejectWithValue }) => {
    // Mock Data for Demo
    return {
        totalRevenue: 12500,
        totalStudents: 154,
        totalCourses: 12,
        averageRating: 4.8
    };
});

export const createCourse = createAsyncThunk('course/createCourse', async (courseData, { rejectWithValue }) => {
    try {
        const response = await courseAPI.createCourse(courseData);
        return response.course;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
});

export const getCourseDetails = createAsyncThunk('course/getCourseDetails', async (courseId, { rejectWithValue }) => {
    try {
        const response = await courseAPI.getCourseById(courseId);
        return response.course;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch course details');
    }
});

export const getFacultyCourseDetails = createAsyncThunk('course/getFacultyCourseDetails', async (courseId, { rejectWithValue }) => {
    try {
        const response = await courseAPI.getFacultyCourseById(courseId);
        return response.course;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch course details');
    }
});

export const updateCourse = createAsyncThunk('course/updateCourse', async ({ id, courseData }, { rejectWithValue }) => {
    try {
        const response = await courseAPI.updateCourse(id, courseData);
        return response.course;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
});

export const updateCourseStatus = createAsyncThunk('course/updateCourseStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const response = await courseAPI.updateCourseStatus(id, status);
        return response.course;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update course status');
    }
});

export const deleteCourse = createAsyncThunk('course/deleteCourse', async (courseId, { rejectWithValue }) => {
    try {
        await courseAPI.deleteCourse(courseId);
        return courseId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
    }
});

export const enrollInCourse = createAsyncThunk('course/enrollInCourse', async (courseId, { rejectWithValue }) => {
    try {
        const response = await api.post('/enrollment', { courseId });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to enroll in course');
    }
});

const initialState = {
    courses: [], // For all courses (future public view)
    searchQuery: '', // Store persistence
    pagination: null, // { total, page, pages }
    myCourses: [], // For faculty specific courses
    currentCourse: null,
    stats: null,

    // granular loading states
    isFetchingPublicCourses: false,
    isFetchingCourses: false,
    isCreatingCourse: false,
    isUpdatingCourse: false,
    isDeletingCourse: false,
    isFetchingDetails: false,
    isFetchingStats: false,

    error: null
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        resetCourseState: (state) => {
            state.currentCourse = null;
            state.courses = [];
            state.myCourses = [];
            state.stats = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Public Courses
            .addCase(fetchCourses.pending, (state) => {
                state.isFetchingPublicCourses = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.isFetchingPublicCourses = false;
                state.courses = action.payload.courses || [];
                state.pagination = action.payload.pagination || null;
                // Store the query used
                state.searchQuery = action.meta.arg.searchQuery || '';
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.isFetchingPublicCourses = false;
                state.error = action.payload;
            })
            // Get Faculty Courses
            .addCase(getFacultyCourses.pending, (state) => {
                state.isFetchingCourses = true;
                state.error = null;
            })
            .addCase(getFacultyCourses.fulfilled, (state, action) => {
                state.isFetchingCourses = false;
                state.myCourses = action.payload;
            })
            .addCase(getFacultyCourses.rejected, (state, action) => {
                state.isFetchingCourses = false;
                state.error = action.payload;
            })
            // Get Dashboard Stats (Mock)
            .addCase(getDashboardStats.pending, (state) => {
                state.isFetchingStats = true;
                state.error = null;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.isFetchingStats = false;
                state.stats = action.payload;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.isFetchingStats = false;
                state.error = action.payload;
            })
            // Create Course
            .addCase(createCourse.pending, (state) => {
                state.isCreatingCourse = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.isCreatingCourse = false;
                state.myCourses.push(action.payload);
                state.currentCourse = action.payload;
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.isCreatingCourse = false;
                state.error = action.payload;
            })
            // Get Course Details
            .addCase(getCourseDetails.pending, (state) => {
                state.isFetchingDetails = true;
                state.error = null;
            })
            .addCase(getCourseDetails.fulfilled, (state, action) => {
                state.isFetchingDetails = false;
                state.currentCourse = action.payload;
            })
            .addCase(getCourseDetails.rejected, (state, action) => {
                state.isFetchingDetails = false;
                state.error = action.payload;
            })
            // Get Faculty Course Details
            .addCase(getFacultyCourseDetails.pending, (state) => {
                state.isFetchingDetails = true;
                state.error = null;
            })
            .addCase(getFacultyCourseDetails.fulfilled, (state, action) => {
                state.isFetchingDetails = false;
                state.currentCourse = action.payload;
            })
            .addCase(getFacultyCourseDetails.rejected, (state, action) => {
                state.isFetchingDetails = false;
                state.error = action.payload;
            })
            // Update Course
            .addCase(updateCourse.pending, (state) => {
                state.isUpdatingCourse = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.isUpdatingCourse = false;
                state.currentCourse = action.payload;
                // Update in list if exists
                const index = state.myCourses.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.myCourses[index] = action.payload;
                }
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.isUpdatingCourse = false;
                state.error = action.payload;
            })
            // Update Course Status
            .addCase(updateCourseStatus.pending, (state) => {
                state.isUpdatingCourse = true;
                state.error = null;
            })
            .addCase(updateCourseStatus.fulfilled, (state, action) => {
                state.isUpdatingCourse = false;
                state.currentCourse = action.payload;
                // Update in list if exists
                const index = state.myCourses.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.myCourses[index] = action.payload;
                }
            })
            .addCase(updateCourseStatus.rejected, (state, action) => {
                state.isUpdatingCourse = false;
                state.error = action.payload;
            })
            // Delete Course
            .addCase(deleteCourse.pending, (state) => {
                state.isDeletingCourse = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.isDeletingCourse = false;
                state.myCourses = state.myCourses.filter(course => course._id !== action.payload);
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.isDeletingCourse = false;
                state.error = action.payload;
            });
    }
});

export const { resetCourseState, clearError } = courseSlice.actions;
export default courseSlice.reducer;
