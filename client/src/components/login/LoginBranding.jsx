import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoginStats from './LoginStats';
const LoginBranding = () => {
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 dark:bg-white/5 border border-teal-500/20 dark:border-white/10 mb-8">
                    <Sparkles size={16} className="text-teal-600 dark:text-teal-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Welcome back!</span>
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                    Unlock Your
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">
                        Full Potential
                    </span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                    Access world-class courses, expert mentorship, and a thriving community of learners. Your journey to mastery starts here.
                </p>
            </motion.div>

            {/* Stats */}
            <LoginStats />
        </div>
    );
};

export default LoginBranding;
