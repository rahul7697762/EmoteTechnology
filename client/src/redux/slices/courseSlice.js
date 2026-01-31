import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as courseService from '../../services/courseService';

// Async Thunks
export const getFacultyCourses = createAsyncThunk('course/getFacultyCourses', async (_, { rejectWithValue }) => {
    try {
        const response = await courseService.getFacultyCourses();
        return response.courses; // Assuming response has courses property, otherwise just response
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
});

export const getDashboardStats = createAsyncThunk('course/getDashboardStats', async (_, { rejectWithValue }) => {
    try {
        const response = await courseService.getDashboardStats();
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
});

export const createCourse = createAsyncThunk('course/createCourse', async (courseData, { rejectWithValue }) => {
    try {
        const response = await courseService.createCourse(courseData);
        return response.course;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
});

export const getCourseDetails = createAsyncThunk('course/getCourseDetails', async (courseId, { rejectWithValue }) => {
    try {
        const response = await courseService.getCourseDetails(courseId);
        return response.course;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch course details');
    }
});

export const saveCourse = createAsyncThunk('course/saveCourse', async (courseData, { rejectWithValue }) => {
    try {
        const response = await courseService.saveCourse(courseData);
        return response.course;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to save course');
    }
});

const initialState = {
    courses: [],
    currentCourse: null,
    stats: null,
    loading: false,
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        resetCourseState: (state) => {
            state.currentCourse = null;
            state.courses = [];
            state.stats = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Faculty Courses
            .addCase(getFacultyCourses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFacultyCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(getFacultyCourses.rejected, (state, action) => {
                state.loading = false;
            })
            // Get Dashboard Stats
            .addCase(getDashboardStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.loading = false;
            })
            // Create Course
            .addCase(createCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courses.push(action.payload);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading = false;
            })
            // Get Course Details
            .addCase(getCourseDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCourseDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload;
            })
            .addCase(getCourseDetails.rejected, (state, action) => {
                state.loading = false;
            })
            // Save Course
            .addCase(saveCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveCourse.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(saveCourse.rejected, (state, action) => {
                state.loading = false;
            });
    }
});

export const { resetCourseState } = courseSlice.actions;
export default courseSlice.reducer;
