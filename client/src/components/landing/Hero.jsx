import { motion } from 'framer-motion';
import { Play, ArrowRight, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <section className="relative min-h-screen flex items-center pt-24 pb-12 px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50/50 dark:from-[#0a0a0f] dark:to-[#111116] overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-br from-teal-400/20 to-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left Column: Text Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-left"
                    >
                        <motion.h1
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                            className="text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-6 text-gray-900 dark:text-white"
                        >
                            Unlock the Future of Learning with{' '}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-400">
                                AI-Powered Education
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                            className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed"
                        >
                            Engaging AI teachers and advanced learning tools to upskill your students anywhere, anytime.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 mb-12"
                        >
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-105"
                            >
                                Start Free Trial <ArrowRight size={18} />
                            </button>
                            <button
                                className="px-8 py-3.5 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Play size={18} fill="currentColor" className="text-gray-900 dark:text-white" />
                                Watch Demo
                            </button>
                        </motion.div>

                        {/* Trusted By Strip */}
                        <motion.div
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trusted by Leading Institutions</p>
                            <div className="flex flex-wrap gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* Placeholder Logos - Replace with actual SVGs or Images */}
                                <div className="flex items-center gap-2 font-bold text-xl text-gray-600 dark:text-gray-300"><Circle size={24} fill="currentColor" textAnchor="middle" /> Stanford</div>
                                <div className="flex items-center gap-2 font-bold text-xl text-gray-600 dark:text-gray-300"><Circle size={24} fill="currentColor" /> Pearson</div>
                                <div className="flex items-center gap-2 font-bold text-xl text-gray-600 dark:text-gray-300"><Circle size={24} fill="currentColor" /> Zoom</div>
                                <div className="flex items-center gap-2 font-bold text-xl text-gray-600 dark:text-gray-300"><Circle size={24} fill="currentColor" /> OpenAI</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Laptop Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative perspective-1000"
                    >
                        {/* Abstract Shape Behind */}
                        <div className="absolute -inset-10 bg-gradient-to-tr from-teal-400/20 to-blue-500/20 blur-[80px] rounded-full pointer-events-none" />

                        {/* Laptop Container */}
                        <div className="relative w-full aspect-[16/10] mx-auto transform transition-transform duration-700 hover:scale-[1.02]">
                            {/* Lid */}
                            <div className="absolute inset-x-[4%] top-0 bottom-[6%] bg-[#1a1a1a] rounded-t-2xl p-2 shadow-2xl z-20 flex flex-col">
                                {/* Camera */}
                                <div className="h-4 flex justify-center items-center mb-1">
                                    <div className="h-1.5 w-1.5 bg-gray-600 rounded-full"></div>
                                </div>

                                {/* Screen */}
                                <div className="flex-1 bg-white dark:bg-[#0f1115] rounded overflow-hidden relative group">
                                    {/* Dashboard UI Mockup */}
                                    {/* Header */}
                                    <div className="h-10 border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-gray-50 dark:bg-white/5 text-[10px] text-gray-400 font-mono w-48 text-center">otechs.app/dashboard</div>
                                    </div>

                                    <div className="flex h-full">
                                        {/* Sidebar */}
                                        <div className="w-16 md:w-48 border-r border-gray-100 dark:border-white/5 p-4 flex flex-col gap-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 rounded bg-linear-to-br from-teal-400 to-blue-500"></div>
                                                <div className="h-3 w-20 bg-gray-100 dark:bg-white/10 rounded hidden md:block"></div>
                                            </div>
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="flex items-center gap-3 opacity-60">
                                                    <div className="w-4 h-4 rounded bg-gray-200 dark:bg-white/10"></div>
                                                    <div className="h-2 w-16 bg-gray-100 dark:bg-white/5 rounded hidden md:block"></div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Main Content */}
                                        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/50 dark:bg-[#13151a]">
                                            <div className="flex justify-between items-end mb-6">
                                                <div>
                                                    <div className="h-5 w-32 bg-gray-200 dark:bg-white/10 rounded mb-2"></div>
                                                    <div className="h-3 w-48 bg-gray-100 dark:bg-white/5 rounded"></div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold">JD</div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                                                    <div className="h-2 w-12 bg-gray-100 dark:bg-white/10 rounded mb-4"></div>
                                                    <div className="flex items-end gap-2">
                                                        <div className="h-8 w-16 bg-linear-to-r from-teal-400 to-teal-500 rounded"></div>
                                                        <div className="text-xs text-green-500 font-bold">+12%</div>
                                                    </div>
                                                </div>
                                                <div className="bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                                                    <div className="h-2 w-12 bg-gray-100 dark:bg-white/10 rounded mb-4"></div>
                                                    <div className="flex items-end gap-2">
                                                        <div className="h-8 w-12 bg-linear-to-r from-blue-400 to-blue-500 rounded"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                                                <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded mb-4"></div>
                                                <div className="space-y-3">
                                                    {[1, 2].map(i => (
                                                        <div key={i} className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-gray-100 dark:bg-white/10"></div>
                                                            <div className="flex-1">
                                                                <div className="h-2 w-24 bg-gray-100 dark:bg-white/10 rounded mb-1"></div>
                                                                <div className="h-1.5 w-16 bg-gray-50 dark:bg-white/5 rounded"></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Base */}
                            <div className="absolute inset-x-0 bottom-0 h-[6%] bg-[#e2e2e4] dark:bg-[#2d2d30] rounded-b-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] z-10">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-b from-black/10 to-transparent"></div>
                                {/* Notch for opening */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-[#d1d1d3] dark:bg-[#222] rounded-b-lg"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
