import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../utils/api';

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
    } finally {
        localStorage.removeItem('token');
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
            });
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
