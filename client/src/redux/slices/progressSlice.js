import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { progressAPI } from '../../utils/api';
import { submitAssessment, reviewSubmission } from './submissionSlice';

// Async Thunks

export const initProgress = createAsyncThunk(
    'progress/initProgress',
    async ({ courseId }, { rejectWithValue }) => {
        try {
            const response = await progressAPI.initializeProgress(courseId);
            return {
                progressList: response.data,
                moduleProgress: response.moduleProgress
            };
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

    // Map of moduleId -> { isCompleted }
    moduleProgress: {},

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
                const { progressList, moduleProgress } = action.payload;

                // Process Lesson Progress
                if (Array.isArray(progressList)) {
                    progressList.forEach(progress => {
                        state.lessonProgress[progress.subModuleId] = {
                            ...state.lessonProgress[progress.subModuleId],
                            ...progress
                        };
                    });
                }

                // Process Module Progress
                if (Array.isArray(moduleProgress)) {
                    moduleProgress.forEach(mp => {
                        state.moduleProgress[mp.moduleId] = {
                            isCompleted: mp.isCompleted,
                            assessmentPassed: mp.assessmentPassed
                        };
                    });
                }
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

                // Check for Module Completion
                const { isModuleCompleted, moduleId } = action.payload;
                if (isModuleCompleted && moduleId) {
                    state.moduleProgress[moduleId] = {
                        ...state.moduleProgress[moduleId],
                        isCompleted: true
                    };
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

                // Check for Module Completion
                const { isModuleCompleted, moduleId } = action.payload;
                if (isModuleCompleted && moduleId) {
                    state.moduleProgress[moduleId] = {
                        ...state.moduleProgress[moduleId],
                        isCompleted: true
                    };
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
            })

            // Listen to Submission Actions for Module Unlock
            .addCase(submitAssessment.fulfilled, (state, action) => {
                const { passed, moduleId, isModuleCompleted } = action.payload.data;
                if (passed && moduleId) {
                    state.moduleProgress[moduleId] = {
                        ...state.moduleProgress[moduleId],
                        assessmentPassed: true,
                        // Only mark as completed if server says so (all submodules done)
                        isCompleted: isModuleCompleted || state.moduleProgress[moduleId]?.isCompleted
                    };
                }
            })
            .addCase(reviewSubmission.fulfilled, (state, action) => {
                const { status, moduleId, isModuleCompleted } = action.payload.data;
                if (status === 'PASSED' && moduleId) {
                    state.moduleProgress[moduleId] = {
                        ...state.moduleProgress[moduleId],
                        assessmentPassed: true,
                        // Only mark as completed if server says so (all submodules done)
                        isCompleted: isModuleCompleted || state.moduleProgress[moduleId]?.isCompleted
                    };
                }
            });
    }
});

export const { resetProgressState } = progressSlice.actions;
export default progressSlice.reducer;
