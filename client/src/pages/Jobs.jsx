import React, { useState, useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import CompanyProfile from '../components/Job-portal/pages/CompanyProfile';
import PostJob from '../components/Job-portal/pages/PostJob';
import JobDetailPage from '../components/Job-portal/pages/JobDetailPage';
import MyApplications from '../components/Job-portal/pages/MyApplications';
import ManageApplicants from '../components/Job-portal/pages/ManageApplicants';
import JobDashboard from '../components/Job-portal/components/JobDashboard';
import JobListing from '../components/Job-portal/components/JobListing';
import JobDetail from '../components/Job-portal/components/JobDetail';
import ApplicationForm from '../components/Job-portal/components/ApplicationForm';
import ApplicantList from '../components/Job-portal/components/ApplicantList';
import CompanyOnboarding from '../components/Job-portal/components/CompanyOnboarding';
import { Briefcase, Building, FileText, UserCheck, PlusCircle, LayoutDashboard } from 'lucide-react';

const Jobs = () => {
const [userType, setUserType] = useState('jobSeeker'); // 'jobSeeker' or 'employer'
const [activeTab, setActiveTab] = useState('dashboard');
const [selectedJobId, setSelectedJobId] = useState(null);



  useEffect(() => {
    const userRole = localStorage.getItem('userRole') || 'jobSeeker';
    setUserType(userRole);
}, []);

const toggleUserType = () => {
    const newType = userType === 'jobSeeker' ? 'employer' : 'jobSeeker';
    setUserType(newType);
    localStorage.setItem('userRole', newType);
    setActiveTab('dashboard');
    setSelectedJobId(null);
};

const openJobDetail = (id) => {
    setSelectedJobId(id);
    setActiveTab('job-detail');
};

const openApply = (id) => {
    setSelectedJobId(id);
    setActiveTab('apply');
};

const renderMainContent = () => {
    // Execution order consideration:
    // 1. Company profile
    // 2. Post job
    // 3. List jobs
    // 4. Apply to job
    // 5. View applicants
    if (userType === 'employer') {
        switch (activeTab) {
            case 'company-profile':
                return <CompanyProfile />;
            case 'post-job':
                return <PostJob />;
            case 'applicants':
                return <ManageApplicants />;
            case 'dashboard':
                return <JobDashboard />;
            case 'job-detail':
                return selectedJobId ? <JobDetail jobId={selectedJobId} onApply={openApply} /> : <JobDashboard />;
            case 'apply':
                return selectedJobId ? <ApplicationForm jobId={selectedJobId} /> : <JobDashboard />;
            default:
                return <JobDashboard />;
        }
    } else {
        // job seeker
        switch (activeTab) {
            case 'browse-jobs':
            case 'dashboard':
                // show listing for both dashboard and browse
                return <JobListing onViewJob={openJobDetail} />;
            case 'my-applications':
                return <MyApplications />;
            case 'job-detail':
                return selectedJobId ? <JobDetailPage jobId={selectedJobId} onApply={openApply} /> : <JobListing onViewJob={openJobDetail} />;
            case 'apply':
                return selectedJobId ? <ApplicationForm jobId={selectedJobId} /> : <JobListing onViewJob={openJobDetail} />;
            default:
                return <JobListing onViewJob={openJobDetail} />;
        }
    }
};

return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar />

        <main className="pt-24 pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8 p-4 bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                            {userType === 'employer' ? 'Employer Portal' : 'Job Portal'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {userType === 'employer'
                                ? 'Manage your company, post jobs, and review applicants'
                                : 'Find your dream job from top companies'}
                        </p>
                    </div>
                    <button
                        onClick={toggleUserType}
                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        {userType === 'employer' ? (
                            <>
                                <Briefcase size={20} />
                                Switch to Job Seeker
                            </>
                        ) : (
                            <>
                                <Building size={20} />
                                Switch to Employer
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                    <div className="sticky top-32 bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <nav className="space-y-2">
                            {userType === 'employer' ? (
                                <>
                                    <button
                                        onClick={() => { setActiveTab('dashboard'); setSelectedJobId(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        <LayoutDashboard size={20} />
                                        <span className="font-medium">Dashboard</span>
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('company-profile'); setSelectedJobId(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'company-profile' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        <Building size={20} />
                                        <span className="font-medium">Company Profile</span>
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('post-job'); setSelectedJobId(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'post-job' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        <PlusCircle size={20} />
                                        <span className="font-medium">Post a Job</span>
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('applicants'); setSelectedJobId(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'applicants' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        <UserCheck size={20} />
                                        <span className="font-medium">Manage Applicants</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => { setActiveTab('dashboard'); setSelectedJobId(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        <LayoutDashboard size={20} />
                                        <span className="font-medium">Job Dashboard</span>
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('browse-jobs'); setSelectedJobId(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'browse-jobs' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        <Briefcase size={20} />
                                        <span className="font-medium">Browse Jobs</span>
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('my-applications'); setSelectedJobId(null); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'my-applications' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        <FileText size={20} />
                                        <span className="font-medium">My Applications</span>
                                    </button>
                                </>
                            )}
                        </nav>

                        {userType === 'employer' && (
                            <div className="mt-8 p-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl border border-teal-500/20">
                                <h4 className="font-bold text-teal-600 dark:text-teal-400 mb-2">New to the portal?</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Complete your company profile to start posting jobs.
                                </p>
                                <button
                                    onClick={() => { setActiveTab('company-profile'); setSelectedJobId(null); }}
                                    className="w-full px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
                                >
                                    Get Started
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:w-3/4">
                    <div className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        {renderMainContent()}

                        {/* Default guidance when nothing specific */}
                        {!activeTab && (
                            <div className="text-center py-12">
                                <h3 className="text-2xl font-bold mb-4">Welcome to the Job Portal</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {userType === 'employer'
                                        ? 'Select an option from the sidebar to get started with hiring.'
                                        : 'Browse available jobs or check your applications.'}
                                </p>
                                {userType === 'employer' && <CompanyOnboarding />}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>

        <Footer />
    </div>
);
};

export default Jobs;