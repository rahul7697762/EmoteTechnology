import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyAPI } from '../../components/Job-portal/services/api';

// Async Thunks
export const getCompanyProfile = createAsyncThunk(
    'company/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await companyAPI.getProfile();
            return response.data;
        } catch (error) {
            console.error('Error fetching company profile:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch company profile');
        }
    }
);

export const updateCompanyProfile = createAsyncThunk(
    'company/updateProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await companyAPI.updateProfile(formData);
            return response.data;
        } catch (error) {
            console.error('Error updating company profile:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to update company profile');
        }
    }
);

const initialState = {
    profile: null,
    isFetchingProfile: false,
    isUpdatingProfile: false,
    error: null,
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        clearProfile: (state) => {
            state.profile = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Profile
            .addCase(getCompanyProfile.pending, (state) => {
                state.isFetchingProfile = true;
                state.error = null;
            })
            .addCase(getCompanyProfile.fulfilled, (state, action) => {
                state.isFetchingProfile = false;
                state.profile = action.payload;
            })
            .addCase(getCompanyProfile.rejected, (state, action) => {
                state.isFetchingProfile = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateCompanyProfile.pending, (state) => {
                state.isUpdatingProfile = true;
                state.error = null;
            })
            .addCase(updateCompanyProfile.fulfilled, (state, action) => {
                state.isUpdatingProfile = false;
                state.profile = action.payload;
            })
            .addCase(updateCompanyProfile.rejected, (state, action) => {
                state.isUpdatingProfile = false;
                state.error = action.payload;
            });
    }
});

export const { setProfile, clearProfile } = companySlice.actions;
export default companySlice.reducer;
