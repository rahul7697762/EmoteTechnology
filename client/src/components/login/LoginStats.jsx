import React from 'react';
import { motion } from 'framer-motion';

const LoginStats = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-8"
        >
            {[
                { value: '10K+', label: 'Learners' },
                { value: '500+', label: 'Courses' },
                { value: '4.9', label: 'Rating' },
            ].map((stat, i) => (
                <div key={i}>
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-cyan-400">
                        {stat.value}
                    </div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
            ))}
        </motion.div>
    );
};

export default LoginStats;
