import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFacultyCourseDetails } from '../redux/slices/courseSlice';
import { getSubmissionsByCourse } from '../redux/slices/submissionSlice';
import Sidebar from '../components/dashboard/Sidebar';
import { Sidebar as LucideSidebar, MessageSquare } from 'lucide-react';
import { ArrowLeft, FileText, Users } from 'lucide-react';
import SubmissionsTab from '../components/dashboard/manage-course/SubmissionsTab';
import DiscussionFullPage from '../components/student-view/DiscussionFullPage';

import DiscussionSidebar from '../components/student-view/DiscussionSidebar';

const ManageCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('submissions');

    const { isSidebarCollapsed } = useSelector((state) => state.ui);
    const { currentCourse, isFetchingDetails } = useSelector((state) => state.course);
    const { courseSubmissions, loading } = useSelector((state) => state.submission);

    useEffect(() => {
        if (courseId) {
            console.log('ManageCourse: Loading data for course ID:', courseId);
            dispatch(getFacultyCourseDetails(courseId));
            dispatch(getSubmissionsByCourse(courseId));
        }
    }, [courseId, dispatch]);

    // Debug logging
    useEffect(() => {
        console.log('ManageCourse State:', {
            currentCourse,
            courseSubmissions,
            loading,
            isFetchingDetails
        });
    }, [currentCourse, courseSubmissions, loading, isFetchingDetails]);

    const tabs = [
        { id: 'submissions', label: 'Submissions', icon: FileText },
        { id: 'discussions', label: 'Discussions', icon: MessageSquare },
        { id: 'applicants', label: 'Applicants', icon: Users, disabled: true }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex transition-colors duration-300">
            <Sidebar />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Top Bar with Back Button and Title */}
                <div className="bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-700 px-8 py-4 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/my-courses')}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                        </button>
                        <div className="flex-1">
                            {isFetchingDetails ? (
                                <div className="h-7 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            ) : (
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {currentCourse?.title || 'Manage Course'}
                                    </h1>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Course Management
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area with Sidebar */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar Navigation */}
                    <div className="w-64 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                        <nav className="p-4 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => !tab.disabled && setActiveTab(tab.id)}
                                    disabled={tab.disabled}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                                        : tab.disabled
                                            ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    <span className="flex-1 text-left">{tab.label}</span>
                                    {tab.disabled && (
                                        <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                                            Soon
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto relative">
                        <div className="p-8 h-full">
                            {activeTab === 'submissions' && (
                                <SubmissionsTab
                                    courseId={courseId}
                                    submissions={courseSubmissions}
                                    loading={loading}
                                />
                            )}
                            {activeTab === 'discussions' && (
                                <div className="h-[calc(100vh-140px)] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative flex">
                                    <DiscussionSidebar
                                        courseId={courseId}
                                        width="100%"
                                        isMobile={false}
                                        isEmbedded={true}
                                    />
                                    {/* Overlay component is rendered here but will be fixed/absolute controlled by its own internal state/styles */}
                                    <DiscussionFullPage
                                        courseId={courseId}
                                        isFaculty={true}
                                    />
                                </div>
                            )}
                            {activeTab === 'applicants' && (
                                <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <Users size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                        Applicants Management
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        This feature is coming soon!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ManageCourse;
