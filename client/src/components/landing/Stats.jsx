import { motion } from 'framer-motion';
import { Users, Award, BookOpen, Star } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const Stats = () => {
    return (
        <section className="relative py-24 px-6 lg:px-8 bg-white dark:bg-[#1A1D2E] border-y border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
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
                            className="text-center group"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 bg-[#F7F8FF] dark:bg-[#252A41] border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 flex items-center justify-center group-hover:bg-[#3B4FD8]/5 dark:group-hover:bg-[#6C7EF5]/5 transition-colors">
                                <stat.icon size={28} className="text-[#3B4FD8] dark:text-[#6C7EF5]" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3" style={{ fontFamily: SERIF }}>
                                {stat.value}
                            </h3>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
