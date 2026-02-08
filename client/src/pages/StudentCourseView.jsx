import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseDetails } from '../redux/slices/courseSlice';
import { fetchCourseProgress } from '../redux/slices/progressSlice';
import { Menu, MessageSquare, X, PlayCircle } from 'lucide-react';

// Modular Components
import VideoPlayer from '../components/student-view/VideoPlayer';
import ArticleViewer from '../components/student-view/ArticleViewer';
import CourseSidebar from '../components/student-view/CourseSidebar';

const StudentCourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCourse: course, isFetchingDetails: loading, error } = useSelector((state) => state.course);

    const [activeModuleId, setActiveModuleId] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);

    // Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive Check
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
                setIsChatOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch Course & Progress
    useEffect(() => {
        if (id) {
            dispatch(getCourseDetails(id));
            dispatch(fetchCourseProgress(id));
        }
    }, [dispatch, id]);

    // Set initial active lesson and expand first module
    useEffect(() => {
        if (course?.modules?.length > 0 && !activeLesson) {
            const firstModuleWithLessons = course.modules.find(m => m.subModules && m.subModules.length > 0);
            if (firstModuleWithLessons) {
                setActiveModuleId(firstModuleWithLessons._id);
                setActiveLesson(firstModuleWithLessons.subModules[0]);
            }
        }
    }, [course, activeLesson]);

    const toggleModule = (moduleId) => {
        setActiveModuleId(activeModuleId === moduleId ? null : moduleId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-[#0F172A]">
                <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-[#0F172A] text-red-500">
                <p>Error loading course: {error}</p>
                <button onClick={() => navigate('/student-courses')} className="ml-4 underline">Go Back</button>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden font-sans text-slate-900 dark:text-slate-100">

            {/* 1. LEFT SIDEBAR */}
            <CourseSidebar
                course={course}
                activeModuleId={activeModuleId}
                toggleModule={toggleModule}
                activeLesson={activeLesson}
                setActiveLesson={setActiveLesson}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isMobile={isMobile}
            />

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] dark:bg-[#0a0f1c] relative z-0">

                {/* Header */}
                <header className="h-16 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex flex-col min-w-0">
                            <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {course.title}
                            </h1>
                            {activeLesson && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    Current: {activeLesson.title}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        <button
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border
                                ${isChatOpen
                                    ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-[#1E293B] dark:text-slate-300 dark:border-slate-700'
                                }`}
                        >
                            <MessageSquare size={16} />
                            <span className="hidden md:inline">AI Chat</span>
                        </button>
                        <button
                            onClick={() => navigate('/student-courses')}
                            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            Exit
                        </button>
                    </div>
                </header>

                {/* Content Viewer */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    {activeLesson ? (
                        activeLesson.type === 'VIDEO' ? (
                            <VideoPlayer lesson={activeLesson} courseId={course._id || course.id} />
                        ) : (
                            <ArticleViewer lesson={activeLesson} courseId={course._id || course.id} />
                        )
                    ) : (
                        /* EMPTY STATE */
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <PlayCircle size={32} className="text-slate-400" />
                            </div>
                            <p className="font-medium">Select a lesson to start learning</p>
                        </div>
                    )}
                </div>
            </main>

            {/* 3. AI CHAT PANEL (OPTIONAL/TOGGLEABLE) */}
            <aside
                className={`
                    fixed inset-y-0 right-0 z-30 w-80 bg-white dark:bg-[#1E293B] border-l border-slate-200 dark:border-slate-800 shadow-xl
                    transform transition-transform duration-300 ease-in-out flex flex-col
                    ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}
                    lg:relative lg:shadow-none lg:z-0
                    ${!isChatOpen && 'lg:hidden'}
                `}
            >
                <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <MessageSquare size={18} className="text-violet-600 dark:text-violet-400" />
                        <h2 className="font-bold text-slate-800 dark:text-white">AI Assistant</h2>
                    </div>
                    <button
                        onClick={() => setIsChatOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                    <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Ask AI about this lesson</h3>
                    <p className="text-sm">This feature is coming soon! You'll be able to ask questions about the video or article content.</p>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]/50">
                    <div className="h-10 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg flex items-center px-3 text-sm text-slate-400 cursor-not-allowed">
                        Ask a question...
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default StudentCourseView;
