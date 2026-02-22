import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
    const { user, isLoadingUser } = useSelector((state) => state.auth);

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
