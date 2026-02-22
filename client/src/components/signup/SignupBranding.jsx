import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoginStats from '../login/LoginStats';

const SignupBranding = () => {
    const navigate = useNavigate();

    return (
        <div className="hidden lg:flex flex-1 relative z-10 flex-col justify-between p-12">


            {/* Hero Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-lg"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                    <Rocket size={16} className="text-teal-400" />
                    <span className="text-sm text-gray-300">Start your journey today!</span>
                </div>
                <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                    Join the
                    <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 via-cyan-400 to-blue-500">
                        Future of Learning
                    </span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Create an account to access personalised learning paths, live sessions, and a supportive community.
                </p>
            </motion.div>

            {/* Stats */}
            <LoginStats />
        </div>
    );
};

export default SignupBranding;
