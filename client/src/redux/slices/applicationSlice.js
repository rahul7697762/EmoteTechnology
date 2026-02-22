import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationAPI } from '../../utils/api';

export const createApplication = createAsyncThunk('application/createApplication', async (data, { rejectWithValue }) => {
    try {
        const response = await applicationAPI.createApplication(data);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
    }
});

export const getMyApplications = createAsyncThunk('application/getMyApplications', async (_, { rejectWithValue }) => {
    try {
        const response = await applicationAPI.getMyApplications();
        return response; // { success: true, applications }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
});

export const withdrawApplication = createAsyncThunk('application/withdrawApplication', async (id, { rejectWithValue }) => {
    try {
        const response = await applicationAPI.withdrawApplication(id);
        return { id, message: response.message };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to withdraw application');
    }
});

export const updateApplicationStatus = createAsyncThunk('application/updateApplicationStatus', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await applicationAPI.updateApplicationStatus(id, data);
        return response; // { success: true, application }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update application status');
    }
});

const initialState = {
    myApplications: [],

    // Loading States
    isSubmitting: false,
    isFetchingApplications: false,
    isWithdrawing: false,
    isUpdatingStatus: false,

    error: null,
};

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        clearApplicationError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // createApplication
            .addCase(createApplication.pending, (state) => {
                state.isSubmitting = true;
                state.error = null;
            })
            .addCase(createApplication.fulfilled, (state, action) => {
                state.isSubmitting = false;
                if (action.payload.application) {
                    state.myApplications.unshift(action.payload.application);
                }
            })
            .addCase(createApplication.rejected, (state, action) => {
                state.isSubmitting = false;
                state.error = action.payload;
            })
            // getMyApplications
            .addCase(getMyApplications.pending, (state) => {
                state.isFetchingApplications = true;
                state.error = null;
            })
            .addCase(getMyApplications.fulfilled, (state, action) => {
                state.isFetchingApplications = false;
                state.myApplications = action.payload.applications || action.payload;
            })
            .addCase(getMyApplications.rejected, (state, action) => {
                state.isFetchingApplications = false;
                state.error = action.payload;
            })
            // withdrawApplication
            .addCase(withdrawApplication.pending, (state) => {
                state.isWithdrawing = true;
                state.error = null;
            })
            .addCase(withdrawApplication.fulfilled, (state, action) => {
                state.isWithdrawing = false;
                state.myApplications = state.myApplications.filter(app => app._id !== action.payload.id);
            })
            .addCase(withdrawApplication.rejected, (state, action) => {
                state.isWithdrawing = false;
                state.error = action.payload;
            })
            // updateApplicationStatus
            .addCase(updateApplicationStatus.pending, (state) => {
                state.isUpdatingStatus = true;
                state.error = null;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.isUpdatingStatus = false;
                // Currently only company updates status and they use a different list (companyJobs applications)
                // If we need to update a specific app in myApplications we can do it here:
                // const updatedApp = action.payload.application || action.payload;
                // const index = state.myApplications.findIndex(a => a._id === updatedApp._id);
                // if(index !== -1) state.myApplications[index] = updatedApp;
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.isUpdatingStatus = false;
                state.error = action.payload;
            });
    }
});

export const { clearApplicationError } = applicationSlice.actions;
export default applicationSlice.reducer;
