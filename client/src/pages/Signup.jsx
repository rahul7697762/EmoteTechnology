import React from 'react';
import LoginBackground from '../components/login/LoginBackground';
import SignupBranding from '../components/signup/SignupBranding';
import SignupForm from '../components/signup/SignupForm';

const Signup = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex overflow-hidden">
            {/* Animated Background */}
            <LoginBackground />

            {/* Left Panel - Branding */}
            <SignupBranding />

            {/* Right Panel - Signup Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <SignupForm />
            </div>
        </div>
    );
};

export default Signup;
