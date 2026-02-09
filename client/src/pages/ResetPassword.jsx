import React from 'react';
import LoginBackground from '../components/login/LoginBackground';
import Navbar from '../components/landing/Navbar';
import LoginBranding from '../components/login/LoginBranding';
import ResetPasswordForm from '../components/forgot-password/ResetPasswordForm';

const ResetPassword = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex overflow-hidden pt-20">
            <Navbar />
            <div className="dark:block hidden">
                <LoginBackground />
            </div>

            <LoginBranding />

            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <ResetPasswordForm />
            </div>
        </div>
    );
};

export default ResetPassword;
