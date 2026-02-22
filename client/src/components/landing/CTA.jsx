import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-32 px-6 lg:px-8">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 dark:from-teal-500/20 dark:via-cyan-500/20 dark:to-blue-500/20 blur-3xl"></div>
            </div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-12 md:p-16 rounded-[2.5rem] bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl dark:shadow-none"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        Ready to Start Your{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400">
                            Journey?
                        </span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                        Join thousands of learners who are transforming their careers with EmoteTechnology.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-teal-500 to-cyan-500 rounded-2xl font-bold text-lg text-white shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 transition-all hover:scale-105"
                    >
                        Get Started for Free
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
