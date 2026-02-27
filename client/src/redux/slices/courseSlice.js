import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { courseAPI, studentAPI, reviewAPI } from '../../utils/api';
import { updateHeartbeat, completeLesson } from './progressSlice';

// Async Thunks

// --- STUDENT ACTIONS ---
export const getStudentCourses = createAsyncThunk('course/getStudentCourses', async (_, { rejectWithValue }) => {
    try {
        const response = await studentAPI.getEnrolledCourses();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrolled courses');
    }
});

export const getInProgressCourses = createAsyncThunk('course/getInProgressCourses', async (_, { rejectWithValue }) => {
    try {
        const response = await studentAPI.getInProgressCourses();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch in-progress courses');
    }
});

// --- FACULTY ACTIONS ---
export const getFacultyCourses = createAsyncThunk('course/getFacultyCourses', async (_, { rejectWithValue }) => {
    try {
        const response = await courseAPI.getMyCourses();
        return response.data;
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
    try {
        const response = await courseAPI.getFacultyDashboardStats();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
});

export const createCourse = createAsyncThunk('course/createCourse', async (courseData, { rejectWithValue }) => {
    try {
        const response = await courseAPI.createCourse(courseData);
        return response.course;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
});

export const getCourseDetails = createAsyncThunk('course/getCourseDetails', async (courseIdOrSlug, { rejectWithValue }) => {
    try {
        // Check if input is a valid MongoDB ObjectId
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(courseIdOrSlug);

        let response;
        if (isObjectId) {
            response = await courseAPI.getCourseById(courseIdOrSlug);
        } else {
            response = await courseAPI.getCourseBySlug(courseIdOrSlug);
        }

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

export const enrollInCourse = createAsyncThunk('course/enrollInCourse', async ({ courseId, courseDetails }, { rejectWithValue }) => {
    try {
        const response = await api.post('/enrollment', { courseId });
        return { ...response.data, courseDetails };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to enroll in course');
    }
});


// --- REVIEW ACTIONS ---
export const createReview = createAsyncThunk('course/createReview', async (reviewData, { rejectWithValue }) => {
    try {
        const response = await reviewAPI.createReview(reviewData);
        return response.review;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
});

export const getCourseReviews = createAsyncThunk('course/getCourseReviews', async ({ courseId, page = 1 }, { rejectWithValue }) => {
    try {
        const response = await reviewAPI.getReviewsByCourse(courseId, page);
        return response; // { reviews, pagination, count }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
});

export const checkReviewStatus = createAsyncThunk('course/checkReviewStatus', async (courseId, { rejectWithValue }) => {
    try {
        const response = await reviewAPI.checkReviewStatus(courseId);
        return response; // { hasReviewed, review }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to check review status');
    }
});

const initialState = {
    courses: [], // For all courses (future public view)
    searchQuery: '', // Store persistence
    pagination: null, // { total, page, pages }

    facultyCourses: [], // RENAMED: For faculty specific courses created by them
    studentCourses: [], // NEW: For courses likely enrolled by student
    inProgressCourses: [], // NEW: For dashboard in-progress courses

    currentCourse: null,
    currentCourse: null,
    stats: null,
    reviews: [],
    reviewPagination: null,
    userReview: null, // If user has reviewed the current course
    hasReviewed: false,

    // granular loading states
    isFetchingPublicCourses: false,
    isFetchingCourses: false, // General fetching state (often used for faculty courses)
    isFetchingStudentCourses: false, // NEW
    isCreatingCourse: false,
    isUpdatingCourse: false,
    isDeletingCourse: false,
    isFetchingDetails: false,
    isFetchingStats: false,
    isSubmittingReview: false,
    isFetchingReviews: false,

    error: null
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        resetCourseState: (state) => {
            state.currentCourse = null;
            state.courses = [];
            state.facultyCourses = [];
            state.studentCourses = [];
            state.stats = null;
            state.reviews = [];
            state.userReview = null;
            state.hasReviewed = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- STUDENT COURSES ---
            .addCase(getStudentCourses.pending, (state) => {
                state.isFetchingStudentCourses = true;
                state.error = null;
            })
            .addCase(getStudentCourses.fulfilled, (state, action) => {
                state.isFetchingStudentCourses = false;
                state.studentCourses = action.payload || [];
            })
            .addCase(getStudentCourses.rejected, (state, action) => {
                state.isFetchingStudentCourses = false;
                state.error = action.payload;
            })

            // --- IN PROGRESS COURSES ---
            .addCase(getInProgressCourses.pending, (state) => {
                state.isFetchingStudentCourses = true; // Reusing loading state or add new one
                state.error = null;
            })
            .addCase(getInProgressCourses.fulfilled, (state, action) => {
                state.isFetchingStudentCourses = false;
                state.inProgressCourses = action.payload || [];
            })
            .addCase(getInProgressCourses.rejected, (state, action) => {
                state.isFetchingStudentCourses = false;
                state.error = action.payload;
            })

            // --- PUBLIC COURSES ---
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

            // --- FACULTY COURSES ---
            .addCase(getFacultyCourses.pending, (state) => {
                state.isFetchingCourses = true;
                state.error = null;
            })
            .addCase(getFacultyCourses.fulfilled, (state, action) => {
                state.isFetchingCourses = false;
                state.facultyCourses = Array.isArray(action.payload) ? action.payload : []; // Updated target with safety check
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
                state.facultyCourses.push(action.payload); // Updated target
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
                // Update in faculty list if exists
                const index = state.facultyCourses.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.facultyCourses[index] = action.payload; // Updated target
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
                // Update in faculty list if exists
                const index = state.facultyCourses.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.facultyCourses[index] = action.payload; // Updated target
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
                state.facultyCourses = state.facultyCourses.filter(course => course._id !== action.payload);
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.isDeletingCourse = false;
                state.error = action.payload;
            })

            // Enroll In Course
            .addCase(enrollInCourse.fulfilled, (state, action) => {
                const { courseDetails, data: enrollment } = action.payload;
                if (courseDetails && enrollment) {
                    const newCourse = {
                        _id: courseDetails._id,
                        title: courseDetails.title,
                        thumbnail: courseDetails.thumbnail,
                        progress: 0,
                        status: 'ACTIVE', // Default for new enrollment
                        totalLessons: courseDetails.modules?.reduce((acc, m) => acc + (m.subModules?.length || 0), 0) || 0,
                        totalDuration: 0, // Should be calculated if data available
                        slug: courseDetails.slug,
                        lastAccessed: new Date().toISOString()
                    };
                    // Add to beginning of list
                    state.studentCourses.unshift(newCourse);
                }
            })

            // Sync Progress from Progress Slice
            .addCase(updateHeartbeat.fulfilled, (state, action) => {
                const { courseId, progressPercentage, isCourseCompleted } = action.payload;
                if (progressPercentage !== undefined && courseId) {
                    // Update Student Courses List
                    const course = state.studentCourses.find(c => c._id === courseId);
                    if (course) {
                        course.progress = progressPercentage;
                        if (isCourseCompleted) course.status = 'COMPLETED';
                    }

                    // Update In-Progress Courses List (Dashboard)
                    const inProgressCourse = state.inProgressCourses.find(c => c._id === courseId);
                    if (inProgressCourse) {
                        inProgressCourse.progress = progressPercentage;
                        if (isCourseCompleted) inProgressCourse.status = 'COMPLETED';
                    }
                }
            })
            .addCase(completeLesson.fulfilled, (state, action) => {
                const { courseId, progressPercentage, isCourseCompleted } = action.payload;
                if (progressPercentage !== undefined && courseId) {
                    // Update Student Courses List
                    const course = state.studentCourses.find(c => c._id === courseId);
                    if (course) {
                        course.progress = progressPercentage;
                        if (isCourseCompleted) course.status = 'COMPLETED';
                    }

                    // Update In-Progress Courses List (Dashboard)
                    const inProgressCourse = state.inProgressCourses.find(c => c._id === courseId);
                    if (inProgressCourse) {
                        inProgressCourse.progress = progressPercentage;
                        if (isCourseCompleted) inProgressCourse.status = 'COMPLETED';
                    }
                }
            })

            // --- REVIEW REDUCERS ---
            .addCase(createReview.pending, (state) => {
                state.isSubmittingReview = true;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.isSubmittingReview = false;
                state.hasReviewed = true;
                state.userReview = action.payload;
                // Optionally add to reviews list if it matches
                state.reviews.unshift(action.payload);
            })
            .addCase(createReview.rejected, (state, action) => {
                state.isSubmittingReview = false;
                state.error = action.payload;
            })

            .addCase(getCourseReviews.pending, (state) => {
                state.isFetchingReviews = true;
                state.error = null;
            })
            .addCase(getCourseReviews.fulfilled, (state, action) => {
                state.isFetchingReviews = false;
                state.reviews = action.payload.reviews;
                state.reviewPagination = action.payload.pagination;
            })
            .addCase(getCourseReviews.rejected, (state, action) => {
                state.isFetchingReviews = false;
                state.error = action.payload;
            })

            .addCase(checkReviewStatus.fulfilled, (state, action) => {
                state.hasReviewed = action.payload.hasReviewed;
                state.userReview = action.payload.review;
            });
    }
});

export const { resetCourseState, clearError } = courseSlice.actions;
export default courseSlice.reducer;