import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyAPI } from '../../utils/api';

export const getCompanyProfile = createAsyncThunk('company/getProfile', async (_, { rejectWithValue }) => {
    try {
        const response = await companyAPI.getProfile();
        return response; // { success: true, company }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch company profile');
    }
});

export const createOrUpdateProfile = createAsyncThunk('company/createOrUpdateProfile', async (formData, { rejectWithValue }) => {
    try {
        const response = await companyAPI.updateProfile(formData);
        return response; // { success: true, company, message }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update company profile');
    }
});

export const getCompanyJobs = createAsyncThunk('company/getCompanyJobs', async (_, { rejectWithValue }) => {
    try {
        const response = await companyAPI.getCompanyJobs();
        return response; // { success: true, jobs }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch company jobs');
    }
});

export const getCompanyStats = createAsyncThunk('company/getCompanyStats', async (_, { rejectWithValue }) => {
    try {
        const response = await companyAPI.getCompanyStats();
        return response; // { success: true, stats }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch company stats');
    }
});

const initialState = {
    profile: null,
    companyJobs: [],
    stats: null,

    // Loading States
    isFetchingProfile: false,
    isUpdatingProfile: false,
    isFetchingJobs: false,
    isFetchingStats: false,

    error: null,
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        clearCompanyError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // getCompanyProfile
            .addCase(getCompanyProfile.pending, (state) => {
                state.isFetchingProfile = true;
                state.error = null;
            })
            .addCase(getCompanyProfile.fulfilled, (state, action) => {
                state.isFetchingProfile = false;
                state.profile = action.payload.company || action.payload;
            })
            .addCase(getCompanyProfile.rejected, (state, action) => {
                state.isFetchingProfile = false;
                state.error = action.payload;
            })
            // createOrUpdateProfile
            .addCase(createOrUpdateProfile.pending, (state) => {
                state.isUpdatingProfile = true;
                state.error = null;
            })
            .addCase(createOrUpdateProfile.fulfilled, (state, action) => {
                state.isUpdatingProfile = false;
                state.profile = action.payload.company || action.payload;
            })
            .addCase(createOrUpdateProfile.rejected, (state, action) => {
                state.isUpdatingProfile = false;
                state.error = action.payload;
            })
            // getCompanyJobs
            .addCase(getCompanyJobs.pending, (state) => {
                state.isFetchingJobs = true;
                state.error = null;
            })
            .addCase(getCompanyJobs.fulfilled, (state, action) => {
                state.isFetchingJobs = false;
                state.companyJobs = action.payload.jobs || action.payload;
            })
            .addCase(getCompanyJobs.rejected, (state, action) => {
                state.isFetchingJobs = false;
                state.error = action.payload;
            })
            // getCompanyStats
            .addCase(getCompanyStats.pending, (state) => {
                state.isFetchingStats = true;
                state.error = null;
            })
            .addCase(getCompanyStats.fulfilled, (state, action) => {
                state.isFetchingStats = false;
                state.stats = action.payload.stats || action.payload;
            })
            .addCase(getCompanyStats.rejected, (state, action) => {
                state.isFetchingStats = false;
                state.error = action.payload;
            });
    }
});

export const { clearCompanyError } = companySlice.actions;
export default companySlice.reducer;
