import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, userAPI } from '../../utils/api';

// Async Thunks
// Async Thunks
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await authAPI.login(credentials);
        return response; // Return full response to get user + token
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
    try {
        const response = await authAPI.signup(userData);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await authAPI.logout();
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
    try {
        const response = await authAPI.getMe();
        return response.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
    try {
        const response = await authAPI.forgotPassword(email);
        return response.message;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ email, otp }, { rejectWithValue }) => {
    try {
        const response = await authAPI.verifyOTP(email, otp);
        return response.resetToken;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ password, token }, { rejectWithValue }) => {
    try {
        const response = await authAPI.resetPassword(password, token);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (token, { rejectWithValue }) => {
    try {
        const response = await authAPI.verifyEmail(token);
        return response.message;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Email verification failed');
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, { rejectWithValue }) => {
    try {
        const response = await userAPI.updateProfile(formData);
        return response.user; // Assuming backend returns { success: true, user: ... }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (passwords, { rejectWithValue }) => {
    try {
        const response = await userAPI.changePassword(passwords);
        return response.message;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
});

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async (password, { rejectWithValue }) => {
    try {
        await userAPI.deleteAccount(password);
        return;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
});

const initialState = {
    user: null, // User is not persisted in localStorage anymore, solely depends on getMe
    isLoggingIn: false,
    isSigningUp: false,
    isLoggingOut: false,
    isLoadingUser: false, // for getMe
    isForgotPasswordLoading: false,
    isVerifyOTPLoading: false,
    isResetPasswordLoading: false,
    isVerifyEmailLoading: false,

    // Granular loading states for Settings
    isUpdatingProfile: false,
    isChangingPassword: false,
    isDeletingAccount: false,

    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoggingIn = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggingIn = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggingIn = false;
                state.isAuthenticated = false;
            })
            // Signup
            .addCase(signup.pending, (state) => {
                state.isSigningUp = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isSigningUp = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isSigningUp = false;
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.isLoggingOut = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggingOut = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoggingOut = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            // GetMe
            .addCase(getMe.pending, (state) => {
                state.isLoadingUser = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoadingUser = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getMe.rejected, (state) => {
                state.isLoadingUser = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.isForgotPasswordLoading = true;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isForgotPasswordLoading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isForgotPasswordLoading = false;
            })
            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.isVerifyOTPLoading = true;
            })
            .addCase(verifyOTP.fulfilled, (state) => {
                state.isVerifyOTPLoading = false;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.isVerifyOTPLoading = false;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.isResetPasswordLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isResetPasswordLoading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isResetPasswordLoading = false;
            })
            // Verify Email
            .addCase(verifyEmail.pending, (state) => {
                state.isVerifyEmailLoading = true;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.isVerifyEmailLoading = false;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.isVerifyEmailLoading = false;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isUpdatingProfile = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isUpdatingProfile = false;
                state.user = action.payload; // Update local user state with fresh data
            })
            .addCase(updateProfile.rejected, (state) => {
                state.isUpdatingProfile = false;
            })
            // Change Password
            .addCase(changePassword.pending, (state) => {
                state.isChangingPassword = true;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isChangingPassword = false;
            })
            .addCase(changePassword.rejected, (state) => {
                state.isChangingPassword = false;
            })
            // Delete Account
            .addCase(deleteAccount.pending, (state) => {
                state.isDeletingAccount = true;
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.isDeletingAccount = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(deleteAccount.rejected, (state) => {
                state.isDeletingAccount = false;
            });
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;