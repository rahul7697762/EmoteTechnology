import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoginStats from '../login/LoginStats';

const SERIF = "'Cormorant Garamond', Georgia, serif";

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
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-[#1A1D2E] border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 mb-8 text-[#3B4FD8] dark:text-[#6C7EF5]">
                    <Rocket size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Start your journey today!</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2] leading-tight mb-6" style={{ fontFamily: SERIF }}>
                    Join the
                    <br />
                    <span className="italic text-[#3B4FD8] dark:text-[#6C7EF5]">
                        Future of Learning
                    </span>
                </h1>
                <p className="text-[#6B7194] dark:text-[#8B90B8] text-lg leading-relaxed">
                    Create an account to access personalised learning paths, live sessions, and a supportive community.
                </p>
            </motion.div>

            {/* Stats */}
            <LoginStats />
        </div>
    );
};

export default SignupBranding;
