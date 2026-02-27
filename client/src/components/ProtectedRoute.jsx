import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, isLoadingUser } = useSelector((state) => state.auth);

    if (isLoadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0f]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check role if specified (case-insensitive)
    // NOTE: Roles from backend can arrive in varying case; normalize to avoid accidental redirects.
    if (allowedRoles.length > 0) {
        const userRole = (user.role || '').toUpperCase();
        const allowed = allowedRoles.map(r => (r || '').toUpperCase());
        if (!allowed.includes(userRole)) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
