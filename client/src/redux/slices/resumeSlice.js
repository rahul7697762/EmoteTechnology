import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeAPI } from '../../utils/api';

export const uploadResume = createAsyncThunk('resume/uploadResume', async (data, { rejectWithValue }) => {
    try {
        const response = await resumeAPI.uploadResume(data);
        return response; // { success: true, resume }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to upload resume');
    }
});

export const getMyResumes = createAsyncThunk('resume/getMyResumes', async (_, { rejectWithValue }) => {
    try {
        const response = await resumeAPI.getMyResumes();
        return response; // { success: true, resumes }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch resumes');
    }
});

export const deleteResume = createAsyncThunk('resume/deleteResume', async (id, { rejectWithValue }) => {
    try {
        const response = await resumeAPI.deleteResume(id);
        return { id, message: response.message };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete resume');
    }
});

const initialState = {
    myResumes: [],

    // Loading States
    isUploading: false,
    isFetchingResumes: false,
    isDeletingResume: false,

    error: null,
};

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        clearResumeError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // uploadResume
            .addCase(uploadResume.pending, (state) => {
                state.isUploading = true;
                state.error = null;
            })
            .addCase(uploadResume.fulfilled, (state, action) => {
                state.isUploading = false;
                if (action.payload.resume) {
                    state.myResumes.unshift(action.payload.resume);
                }
            })
            .addCase(uploadResume.rejected, (state, action) => {
                state.isUploading = false;
                state.error = action.payload;
            })
            // getMyResumes
            .addCase(getMyResumes.pending, (state) => {
                state.isFetchingResumes = true;
                state.error = null;
            })
            .addCase(getMyResumes.fulfilled, (state, action) => {
                state.isFetchingResumes = false;
                state.myResumes = action.payload.resumes || action.payload;
            })
            .addCase(getMyResumes.rejected, (state, action) => {
                state.isFetchingResumes = false;
                state.error = action.payload;
            })
            // deleteResume
            .addCase(deleteResume.pending, (state) => {
                state.isDeletingResume = true;
                state.error = null;
            })
            .addCase(deleteResume.fulfilled, (state, action) => {
                state.isDeletingResume = false;
                state.myResumes = state.myResumes.filter(r => r._id !== action.payload.id);
            })
            .addCase(deleteResume.rejected, (state, action) => {
                state.isDeletingResume = false;
                state.error = action.payload;
            });
    }
});

export const { clearResumeError } = resumeSlice.actions;
export default resumeSlice.reducer;
