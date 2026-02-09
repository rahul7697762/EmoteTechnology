import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentAPI } from '../../utils/api';
import { updateHeartbeat, completeLesson } from './progressSlice';
import { logout } from './authSlice';

// Async Thunks
export const fetchMyCertificates = createAsyncThunk(
    'certificate/fetchMyCertificates',
    async ({ force = false } = {}, { getState, rejectWithValue }) => {
        try {
            const { certificate } = getState();
            if (!force && certificate.loaded && certificate.certificates.length > 0) {
                return certificate.certificates;
            }

            const response = await studentAPI.getCertificates();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch certificates');
        }
    }
);

const initialState = {
    certificates: [],
    loading: false,
    loaded: false,
    error: null,
    latestCertificate: null // For showing immediate feedback
};

const certificateSlice = createSlice({
    name: 'certificate',
    initialState,
    reducers: {
        clearCertificateError: (state) => {
            state.error = null;
        },
        resetCertificateState: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Certificates
            .addCase(fetchMyCertificates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyCertificates.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                state.certificates = action.payload;
            })
            .addCase(fetchMyCertificates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Listen to Progress Updates (for immediate issuance)
            .addCase(updateHeartbeat.fulfilled, (state, action) => {
                const cert = action.payload.data?.certificate;
                if (cert) {
                    state.latestCertificate = cert;
                    // Add to list if not already present
                    if (!state.certificates.some(c => c._id === cert._id)) {
                        state.certificates.unshift(cert);
                    }
                }
            })
            .addCase(completeLesson.fulfilled, (state, action) => {
                const cert = action.payload.data?.certificate;
                if (cert) {
                    state.latestCertificate = cert;
                    // Add to list if not already present
                    if (!state.certificates.some(c => c._id === cert._id)) {
                        state.certificates.unshift(cert);
                    }
                }
            })

            // Reset state on logout
            .addCase(logout.fulfilled, () => {
                return initialState;
            });
    }
});

export const { clearCertificateError, resetCertificateState } = certificateSlice.actions;
export default certificateSlice.reducer;
