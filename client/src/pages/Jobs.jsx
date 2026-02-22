import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import JobDetailPage from './job-portal/JobDetailPage';
import JobListing from '../components/Job-portal/components/JobListing';
import ApplicationForm from '../components/Job-portal/components/ApplicationForm';

const Jobs = () => {
    const { user: authUser } = useSelector((state) => state.auth);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isJobDetail, setIsJobDetail] = useState(false);
    const [isApplyPage, setIsApplyPage] = useState(false);

    // Sync selectedJobId with URL param
    useEffect(() => {
        if (id) {
            setIsJobDetail(true);
            // Check if action is apply
            const queryParams = new URLSearchParams(location.search);
            if (queryParams.get('action') === 'apply') {
                setIsApplyPage(true);
            } else {
                setIsApplyPage(false);
            }
        } else {
            setIsJobDetail(false);
            setIsApplyPage(false);
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

            {isJobDetail ? (
                isApplyPage ? (
                    <main className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
                        <ApplicationForm
                            jobId={id}
                            onSuccess={() => {
                                handleBack();
                            }}
                            onCancel={() => {
                                handleBack();
                            }}
                        />
                    </main>
                ) : (
                    <JobDetailPage jobId={id} onApply={openApply} onBack={handleBack} />
                )
            ) : (
                <main className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
                    <JobListing onViewJob={openJobDetail} />
                </main>
            )}

            <Footer />
        </div>
    );
};

export default Jobs;
