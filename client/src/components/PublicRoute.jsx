import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
    const { user, isLoadingUser } = useSelector((state) => state.auth);

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

    if (user) {
        // Route authenticated users to role-appropriate dashboards.
        // Use case-insensitive matching to be resilient to backend casing.
        const role = (user.role || '').toUpperCase();
        if (['COMPANY', 'EMPLOYER'].includes(role)) {
            return <Navigate to="/company/dashboard" replace />;
        }
        if (role === 'STUDENT') {
            return <Navigate to="/student-dashboard" replace />;
        }
        if (['FACULTY', 'ADMIN'].includes(role)) {
            return <Navigate to="/dashboard" replace />;
        }
        // Unknown role -> send to public home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
