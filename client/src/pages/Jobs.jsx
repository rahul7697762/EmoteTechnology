import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { AuthProvider } from '../components/Job-portal/context/AuthContext';
import JobDetailPage from '../components/Job-portal/pages/JobDetailPage';
import JobListing from '../components/Job-portal/components/JobListing';
import ApplicationForm from '../components/Job-portal/components/ApplicationForm';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

const JobsContent = () => {
    const { user: authUser } = useSelector((state) => state.auth);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    // Sync selectedJobId with URL param
    useEffect(() => {
        if (id) {
            setSelectedJobId(id);
            // Check if action is apply
            const queryParams = new URLSearchParams(location.search);
            if (queryParams.get('action') === 'apply') {
                setIsApplying(true);
            } else {
                setIsApplying(false);
            }
        } else {
            setSelectedJobId(null);
            setIsApplying(false);
        }
    }, [id, location.search]);

    const openJobDetail = (jobId) => {
        navigate(`/jobs/${jobId}`);
    };

    const openApply = (jobId) => {
        if (!authUser) {
            navigate(`/signup?redirect=/jobs/${jobId}?action=apply`);
            return;
        }
        navigate(`/jobs/${jobId}?action=apply`);
    };

    const handleBack = () => {
        navigate('/jobs');
    };

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

            {/* ── Main Content Area ── */}
            <main className="max-w-7xl mx-auto px-4 lg:px-8 py-12 min-h-[600px]">
                {/* The inner job components (JobListing, JobDetailPage, ApplicationForm) will need their internal styles updated, but this wraps them in the correct layout container */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {selectedJobId ? (
                        isApplying ? (
                            <ApplicationForm
                                jobId={selectedJobId}
                                onSuccess={() => handleBack()}
                                onCancel={() => handleBack()}
                            />
                        ) : (
                            <JobDetailPage jobId={selectedJobId} onApply={openApply} onBack={handleBack} />
                        )
                    ) : (
                        <JobListing onViewJob={openJobDetail} />
                    )}
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
