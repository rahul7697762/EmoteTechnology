import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressAPI } from '../../utils/api';

// Async Thunks

export const initProgress = createAsyncThunk(
    'progress/initProgress',
    async (data, { rejectWithValue }) => {
        try {
            const response = await progressAPI.initializeProgress(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to initialize progress');
        }
    }
);

export const updateHeartbeat = createAsyncThunk(
    'progress/updateHeartbeat',
    async (data, { rejectWithValue }) => {
        try {
            const response = await progressAPI.updateProgress(data);
            return {
                subModuleId: data.subModuleId,
                courseId: data.courseId,
                ...response.data
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update progress');
        }
    }
);

export const completeLesson = createAsyncThunk(
    'progress/completeLesson',
    async ({ subModuleId, courseId }, { rejectWithValue }) => {
        try {
            const response = await progressAPI.completeLesson(subModuleId);
            return {
                subModuleId,
                courseId,
                ...response.data
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to complete lesson');
        }
    }
);

export const fetchVideoProgress = createAsyncThunk(
    'progress/fetchVideoProgress',
    async (subModuleId, { rejectWithValue }) => {
        try {
            const response = await progressAPI.getVideoProgress(subModuleId);
            return {
                subModuleId,
                ...response.data
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch video progress');
        }
    }
);

export const fetchCourseProgress = createAsyncThunk(
    'progress/fetchCourseProgress',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await progressAPI.getCourseProgress(courseId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch course progress');
        }
    }
);

const initialState = {
    courseProgress: 0,
    completedLessonsCount: 0,
    totalLessonsCount: 0,
    isCompleted: false,
    certificate: null,

    // Map of lessonId -> { watchedDuration, lastWatchedTime, completionPercentage, isCompleted }
    lessonProgress: {},

    isLoading: false,
    error: null
};

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        resetProgressState: (state) => {
            state.courseProgress = 0;
            state.completedLessonsCount = 0;
            state.totalLessonsCount = 0;
            state.isCompleted = false;
            state.lessonProgress = {};
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Init Progress
            .addCase(initProgress.fulfilled, (state, action) => {
                const { subModuleId, ...data } = action.payload;
                state.lessonProgress[subModuleId] = {
                    ...state.lessonProgress[subModuleId],
                    ...data
                };
            })

            // Update Heartbeat
            .addCase(updateHeartbeat.fulfilled, (state, action) => {
                const {
                    subModuleId,
                    completionPercentage,
                    isCompleted,
                    progressPercentage,
                    completedLessons,
                    totalLessons,
                    isCourseCompleted
                } = action.payload;

                if (state.lessonProgress[subModuleId]) {
                    state.lessonProgress[subModuleId].completionPercentage = completionPercentage;
                    state.lessonProgress[subModuleId].isCompleted = isCompleted;
                } else {
                    state.lessonProgress[subModuleId] = { completionPercentage, isCompleted };
                }

                // Update Course Level Progress if returned (meaning lesson completion triggered it)
                if (progressPercentage !== undefined) {
                    state.totalLessonsCount = totalLessons;
                    state.isCompleted = isCourseCompleted;
                }

                if (action.payload.data?.certificate) {
                    state.certificate = action.payload.data.certificate;
                }
            })

            // Complete Lesson
            .addCase(completeLesson.fulfilled, (state, action) => {
                const {
                    subModuleId,
                    isCompleted,
                    completionPercentage,
                    progressPercentage,
                    completedLessons,
                    totalLessons,
                    isCourseCompleted
                } = action.payload;

                if (state.lessonProgress[subModuleId]) {
                    state.lessonProgress[subModuleId].isCompleted = true; // Force true
                    state.lessonProgress[subModuleId].completionPercentage = 100;
                } else {
                    state.lessonProgress[subModuleId] = { isCompleted: true, completionPercentage: 100 };
                }

                // Update Course Level Progress
                if (progressPercentage !== undefined) {
                    state.courseProgress = progressPercentage;
                    state.completedLessonsCount = completedLessons;
                    state.totalLessonsCount = totalLessons;
                    state.isCompleted = isCourseCompleted;
                }

                if (action.payload.data?.certificate) {
                    state.certificate = action.payload.data.certificate;
                }
            })

            // Fetch Video Progress (Resume data)
            .addCase(fetchVideoProgress.fulfilled, (state, action) => {
                const { subModuleId, lastWatchedTime, isCompleted, completionPercentage } = action.payload;
                state.lessonProgress[subModuleId] = {
                    ...state.lessonProgress[subModuleId],
                    lastWatchedTime,
                    isCompleted,
                    completionPercentage
                };
            })

            // Fetch Course Progress
            .addCase(fetchCourseProgress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCourseProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courseProgress = action.payload.progressPercentage;
                state.completedLessonsCount = action.payload.completedLessons;
                state.totalLessonsCount = action.payload.totalLessons;
                state.isCompleted = action.payload.isCompleted;
            })
            .addCase(fetchCourseProgress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { resetProgressState } = progressSlice.actions;
export default progressSlice.reducer;
