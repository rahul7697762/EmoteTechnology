import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated, isLoadingUser } = useSelector((state) => state.auth);

    if (isLoadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F8FF] dark:bg-[#1A1D2E]">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 border-t-[#3B4FD8] dark:border-t-[#6C7EF5] rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm uppercase tracking-[0.2em] font-bold" style={{ fontFamily: "'Space Mono', 'Courier New', monospace" }}>Loading...</p>
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
