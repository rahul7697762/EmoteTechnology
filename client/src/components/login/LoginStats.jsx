import React from 'react';
import { motion } from 'framer-motion';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const LoginStats = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-12"
        >
            {[
                { value: '10K+', label: 'Learners' },
                { value: '500+', label: 'Courses' },
                { value: '4.9', label: 'Rating' },
            ].map((stat, i) => (
                <div key={i}>
                    <div className="text-4xl font-bold text-[#3B4FD8] dark:text-[#6C7EF5] mb-1" style={{ fontFamily: SERIF }}>
                        {stat.value}
                    </div>
                    <div className="text-[#6B7194] dark:text-[#8B90B8] text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: MONO }}>{stat.label}</div>
                </div>
            ))}
        </motion.div>
    );
};

export default LoginStats;
