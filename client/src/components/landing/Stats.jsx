import { motion } from 'framer-motion';
import { Users, Award, BookOpen, Star } from 'lucide-react';

const Stats = () => {
    return (
        <section className="relative py-24 px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/5 to-transparent"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: '10K+', label: 'Active Learners', icon: Users },
                        { value: '200+', label: 'Expert Mentors', icon: Award },
                        { value: '500+', label: 'Premium Courses', icon: BookOpen },
                        { value: '4.9', label: 'Average Rating', icon: Star },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm dark:shadow-none">
                                <stat.icon size={28} className="text-teal-600 dark:text-teal-400" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-gray-400 dark:bg-clip-text mb-2">
                                {stat.value}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
