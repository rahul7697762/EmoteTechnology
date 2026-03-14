import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { AuthProvider } from '../components/Job-portal/context/AuthContext';
import JobDetailPage from '../components/Job-portal/pages/JobDetailPage';
import JobListing from '../components/Job-portal/components/JobListing';
import ApplicationForm from '../components/Job-portal/components/ApplicationForm';

const JobsContent = () => {
    const { user: authUser } = useSelector((state) => state.auth);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    // Sync selectedJobId with URL param
    React.useEffect(() => {
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
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-24 pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                        Browse Jobs
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Find your dream job from top companies.
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 min-h-[600px]">
                    {selectedJobId ? (
                        isApplying ? (
                            <ApplicationForm
                                jobId={selectedJobId}
                                onSuccess={() => {
                                    handleBack();
                                }}
                                onCancel={() => {
                                    handleBack();
                                }}
                            />
                        ) : (
                            <JobDetailPage jobId={selectedJobId} onApply={openApply} onBack={handleBack} />
                        )
                    ) : (
                        <JobListing onViewJob={openJobDetail} />
                    )}
                </div>
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
