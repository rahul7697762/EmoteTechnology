import React from 'react';
import LoginBackground from '../components/login/LoginBackground';
import Navbar from '../components/landing/Navbar';
import LoginBranding from '../components/login/LoginBranding';
import ForgotPasswordForm from '../components/forgot-password/ForgotPasswordForm';

const ForgotPassword = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex overflow-hidden pt-20">
            <Navbar />
            {/* Animated Background - Only viewable in dark mode or subtle in light */}
            <div className="dark:block hidden">
                <LoginBackground />
            </div>

            {/* Left Panel - Branding */}
            <LoginBranding />

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <ForgotPasswordForm />
            </div>
        </div>
    );
};

export default ForgotPassword;
