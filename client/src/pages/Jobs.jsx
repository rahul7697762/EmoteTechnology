import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { AuthProvider } from '../components/Job-portal/context/AuthContext';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

const JobsContent = () => {
    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] transition-colors duration-300 pb-20 md:pb-0">
            <Navbar />

            {/* ── Page Header ── */}
            <div className="border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8 bg-[#F7F8FF] dark:bg-[#1A1D2E]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-12">
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>

                        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
                            <div style={{ width: 28, height: 1, background: '#3B4FD8' }} />
                            <span className="text-[10px] tracking-[0.28em] uppercase text-[#3B4FD8] dark:text-[#6C7EF5]" style={{ fontFamily: MONO }}>
                                Career Portal
                            </span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="leading-[0.93] max-w-2xl" style={{ fontFamily: SERIF, fontSize: 'clamp(2.6rem, 5vw, 4.2rem)' }}>
                            <span className="block font-semibold">Discover Your</span>
                            <span className="block font-light italic text-[#3B4FD8] dark:text-[#6C7EF5]">Next Opportunity.</span>
                        </motion.h1>

                    </motion.div>
                </div>
            </div>

            {/* ── Upcoming Banner ── */}
            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-20 min-h-[600px] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center text-center max-w-lg"
                >
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-2xl bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 flex items-center justify-center mb-8">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#3B4FD8" className="dark:fill-[#6C7EF5]"/>
                            <path d="M12 6v6l4 2" stroke="#3B4FD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#6C7EF5]"/>
                            <circle cx="12" cy="12" r="9" stroke="#3B4FD8" strokeWidth="1.5" strokeDasharray="3 2" fill="none" className="dark:stroke-[#6C7EF5]"/>
                        </svg>
                    </div>

                    {/* Badge */}
                    <span
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] tracking-[0.22em] uppercase mb-6 font-medium"
                        style={{
                            fontFamily: MONO,
                            background: 'linear-gradient(135deg, #3B4FD820, #6C7EF520)',
                            border: '1px solid #3B4FD830',
                            color: '#3B4FD8',
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3B4FD8] animate-pulse inline-block" />
                        Upcoming Feature
                    </span>

                    {/* Heading */}
                    <h2 className="mb-4" style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1 }}>
                        <span className="block font-semibold">Job Portal is</span>
                        <span className="block font-light italic text-[#3B4FD8] dark:text-[#6C7EF5]">Coming Soon.</span>
                    </h2>

                    <p className="text-sm leading-relaxed text-[#1A1D2E]/60 dark:text-[#E8EAF2]/50 max-w-sm" style={{ fontFamily: MONO }}>
                        We're building a curated career portal connecting talented learners with top companies. Stay tuned — opportunities ahead.
                    </p>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

const Jobs = () => {
    return (
        <AuthProvider>
            <JobsContent />
        </AuthProvider>
    );
};

export default Jobs;
