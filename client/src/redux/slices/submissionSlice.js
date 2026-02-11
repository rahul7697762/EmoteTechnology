import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { submissionAPI } from "../../utils/api";
import { toast } from "react-hot-toast";

// Student: Submit
export const submitAssessment = createAsyncThunk(
    "submission/submit",
    async ({ assessmentId, data }, { rejectWithValue }) => {
        try {
            const response = await submissionAPI.submitAssessment(assessmentId, data);
            toast.success("Submitted successfully!");
            // Return processed result
            return { data: response.data }; // Maintain consistent payload structure
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed");
            return rejectWithValue(error.response?.data);
        }
    }
);

// Faculty: Get Submissions
export const getSubmissions = createAsyncThunk(
    "submission/getAll",
    async (assessmentId, { rejectWithValue }) => {
        try {
            const response = await submissionAPI.getSubmissions(assessmentId);
            return { data: response.data }; // Maintain consistent payload structure
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Faculty: Grade
export const gradeSubmission = createAsyncThunk(
    "submission/grade",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await submissionAPI.gradeSubmission(id, data);
            toast.success("Graded successfully");
            return { data: response.data }; // Maintain consistent payload structure
        } catch (error) {
            toast.error("Failed to grade");
            return rejectWithValue(error.response?.data);
        }
    }
);

// Faculty: Get Submissions by Course
export const getSubmissionsByCourse = createAsyncThunk(
    "submission/getByCourse",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await submissionAPI.getSubmissionsByCourse(courseId);
            return { data: response.data };
        } catch (error) {
            toast.error("Failed to load submissions");
            return rejectWithValue(error.response?.data);
        }
    }
);

// Faculty: Get Submissions by Assessment
export const getSubmissionsByAssessment = createAsyncThunk(
    "submission/getByAssessment",
    async ({ assessmentId, status }, { rejectWithValue }) => {
        try {
            const response = await submissionAPI.getSubmissionsByAssessment(assessmentId, status);
            return { data: response.data };
        } catch (error) {
            toast.error("Failed to load submissions");
            return rejectWithValue(error.response?.data);
        }
    }
);

// Faculty: Review Submission (for PDF grading)
export const reviewSubmission = createAsyncThunk(
    "submission/review",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await submissionAPI.reviewSubmission(id, data);
            toast.success(response.message || "Submission reviewed successfully");
            return { data: response.data };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to review submission");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getMySubmissions = createAsyncThunk(
    "submission/getMySubmissions",
    async (assessmentId, { rejectWithValue }) => {
        try {
            const response = await submissionAPI.getMySubmissions(assessmentId);
            return { data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const submissionSlice = createSlice({
    name: "submission",
    initialState: {
        submissions: [],
        courseSubmissions: [], // Grouped by assessment for course management
        currentSubmission: null, // For student result view or faculty detail view
        loading: false,
        isReviewing: false,
        error: null
    },
    reducers: {
        resetSubmissionState: (state) => {
            state.currentSubmission = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Submit
            .addCase(submitAssessment.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitAssessment.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSubmission = action.payload.data;
            })
            .addCase(submitAssessment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get All
            .addCase(getSubmissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload.data;
            })
            // Grade
            .addCase(gradeSubmission.fulfilled, (state, action) => {
                // Update in list
                const index = state.submissions.findIndex(s => s._id === action.payload.data._id);
                if (index !== -1) {
                    state.submissions[index] = action.payload.data;
                }
            })
            // Get Submissions by Course
            .addCase(getSubmissionsByCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubmissionsByCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courseSubmissions = action.payload.data;
            })
            .addCase(getSubmissionsByCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Submissions by Assessment
            .addCase(getSubmissionsByAssessment.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubmissionsByAssessment.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload.data;
            })
            .addCase(getSubmissionsByAssessment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Review Submission
            .addCase(reviewSubmission.pending, (state) => {
                state.isReviewing = true;
            })
            .addCase(reviewSubmission.fulfilled, (state, action) => {
                state.isReviewing = false;
                // Update or remove from submissions list
                const index = state.submissions.findIndex(s => s._id === action.payload.data._id);
                if (index !== -1) {
                    const updatedSubmission = action.payload.data;
                    // If the submission is no longer PENDING_REVIEW, remove it from the list
                    // (assuming we're viewing PENDING_REVIEW filtered list)
                    if (updatedSubmission.status !== 'PENDING_REVIEW') {
                        state.submissions.splice(index, 1);
                    } else {
                        state.submissions[index] = updatedSubmission;
                    }
                }
            })
            .addCase(reviewSubmission.rejected, (state, action) => {
                state.isReviewing = false;
                state.error = action.payload;
            })
            // Get My Submissions
            .addCase(getMySubmissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMySubmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload.data;
            })
            .addCase(getMySubmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetSubmissionState } = submissionSlice.actions;
export default submissionSlice.reducer;
