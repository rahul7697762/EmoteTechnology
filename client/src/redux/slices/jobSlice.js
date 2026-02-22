import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobAPI } from '../../utils/api';

export const createJob = createAsyncThunk('job/createJob', async (jobData, { rejectWithValue }) => {
    try {
        const response = await jobAPI.createJob(jobData);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
});

export const updateJob = createAsyncThunk('job/updateJob', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await jobAPI.updateJob(id, data);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
});

export const closeJob = createAsyncThunk('job/closeJob', async (id, { rejectWithValue }) => {
    try {
        const response = await jobAPI.closeJob(id);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to close job');
    }
});

export const getAllJobs = createAsyncThunk('job/getAllJobs', async (params, { rejectWithValue }) => {
    try {
        const response = await jobAPI.getAllJobs(params);
        return response; // e.g. { jobs, total, totalPages, currentPage }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
});

export const getJobById = createAsyncThunk('job/getJobById', async (id, { rejectWithValue }) => {
    try {
        const response = await jobAPI.getJobById(id);
        return response; // Could be { success: true, job } or just job
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
    }
});

export const getJobApplications = createAsyncThunk('job/getJobApplications', async ({ id, params }, { rejectWithValue }) => {
    try {
        const response = await jobAPI.getJobApplications(id, params);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
});

const initialState = {
    jobsList: { jobs: [], total: 0, totalPages: 1, currentPage: 1 },
    currentJob: null,
    jobApplications: [],

    // Loading States
    isFetchingJobs: false,
    isFetchingJob: false,
    isCreatingJob: false,
    isUpdatingJob: false,
    isClosingJob: false,
    isFetchingApplications: false,

    error: null,
};

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        clearCurrentJob: (state) => {
            state.currentJob = null;
        },
        clearJobError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // getAllJobs
            .addCase(getAllJobs.pending, (state) => {
                state.isFetchingJobs = true;
                state.error = null;
            })
            .addCase(getAllJobs.fulfilled, (state, action) => {
                state.isFetchingJobs = false;
                state.jobsList = action.payload.jobs !== undefined ? action.payload : { ...state.jobsList, jobs: action.payload }; // Account for wrapper
            })
            .addCase(getAllJobs.rejected, (state, action) => {
                state.isFetchingJobs = false;
                state.error = action.payload;
            })
            // getJobById
            .addCase(getJobById.pending, (state) => {
                state.isFetchingJob = true;
                state.error = null;
            })
            .addCase(getJobById.fulfilled, (state, action) => {
                state.isFetchingJob = false;
                state.currentJob = action.payload.job || action.payload;
            })
            .addCase(getJobById.rejected, (state, action) => {
                state.isFetchingJob = false;
                state.error = action.payload;
            })
            // createJob
            .addCase(createJob.pending, (state) => {
                state.isCreatingJob = true;
                state.error = null;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.isCreatingJob = false;
                if (action.payload.job) {
                    state.jobsList.jobs.unshift(action.payload.job);
                }
            })
            .addCase(createJob.rejected, (state, action) => {
                state.isCreatingJob = false;
                state.error = action.payload;
            })
            // updateJob
            .addCase(updateJob.pending, (state) => {
                state.isUpdatingJob = true;
                state.error = null;
            })
            .addCase(updateJob.fulfilled, (state, action) => {
                state.isUpdatingJob = false;
                const updatedJob = action.payload.job || action.payload;
                if (state.currentJob?._id === updatedJob._id) {
                    state.currentJob = updatedJob;
                }
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.isUpdatingJob = false;
                state.error = action.payload;
            })
            // getJobApplications
            .addCase(getJobApplications.pending, (state) => {
                state.isFetchingApplications = true;
                state.error = null;
            })
            .addCase(getJobApplications.fulfilled, (state, action) => {
                state.isFetchingApplications = false;
                state.jobApplications = action.payload.applications || action.payload;
            })
            .addCase(getJobApplications.rejected, (state, action) => {
                state.isFetchingApplications = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentJob, clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
