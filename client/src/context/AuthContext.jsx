import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const res = await authAPI.getMe();
                if (res.success) {
                    setUser(res.user);
                } else {
                    setUser(null);
                }

            } catch (error) {
                setError(error.response?.data?.message || 'Failed to load user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, []);


    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authAPI.login({ email, password });
            setUser(response.user);
            toast.success(response.message);
            return { success: true, user: response.user };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const signup = async (name, email, password, phone) => {
        try {
            setError(null);
            const response = await authAPI.signup({ name, email, password, phone });
            setUser(response.user);
            toast.success(response.message)
            return { success: true, user: response.user };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            toast.success("Logout successful")
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
        }
    };

    const forgotPassword = async (email) => {
        try {
            setError(null);
            const response = await authAPI.forgotPassword(email);
            toast.success(response.message);
            return { success: true, message: response.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            setError(null);
            const response = await authAPI.verifyOTP(email, otp);
            toast.success(response.message);
            // Assuming response contains a token for reset password
            return { success: true, token: response.resetToken };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'OTP verification failed.';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const resetPassword = async (password, token) => {
        try {
            setError(null);
            const response = await authAPI.resetPassword(password, token);
            toast.success("Password reset successful. Please login.");
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Password reset failed.';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const verifyEmail = async (token) => {
        try {
            setError(null);
            const response = await authAPI.verifyEmail(token);
            // toast.success(response.message); // Let the page handle the success message
            return { success: true, message: response.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Email verification failed.';
            // setError(errorMessage); // Don't set global error, let page handle it
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        forgotPassword,
        verifyOTP,
        resetPassword,
        verifyEmail,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
