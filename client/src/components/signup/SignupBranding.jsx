import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoginStats from '../login/LoginStats';

const SignupBranding = () => {
    const navigate = useNavigate();

    return (
        <div className="hidden lg:flex flex-1 relative z-10 flex-col justify-between p-12">
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/')}
            >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                    <Zap size={26} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                    Emote<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Technology</span>
                </span>
            </motion.div>

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
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">
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
