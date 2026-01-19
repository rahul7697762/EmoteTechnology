import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    return (
        <section className="relative min-h-screen flex items-center pt-20 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center justify-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 mb-8"
                    >
                        <Sparkles size={16} className="text-teal-600 dark:text-teal-400" />
                        <span className="text-sm font-medium text-teal-700 dark:text-teal-300">New: AI-Powered Learning Paths</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 text-gray-900 dark:text-white"
                    >
                        Learn. Build.{' '}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-500">
                                Transform.
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                                <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 4" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#14b8a6" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Join the next generation of developers, designers, and leaders.
                        Master cutting-edge skills with hands-on projects and expert mentorship.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl font-semibold text-lg text-white shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 transition-all hover:scale-105"
                        >
                            Start Learning Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="group flex items-center gap-3 px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl font-semibold text-lg text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all backdrop-blur-sm">
                            <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center shadow-sm dark:shadow-none group-hover:scale-110 transition-transform">
                                <Play size={18} className="text-gray-900 dark:text-white" fill="currentColor" />
                            </div>
                            Watch Demo
                        </button>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0a0a0f]"
                                    style={{ background: `hsl(${i * 40 + 180}, 70%, 60%)` }}
                                ></div>
                            ))}
                        </div>
                        <div className="text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Trusted by <span className="text-gray-900 dark:text-white font-semibold">10,000+</span> learners</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
