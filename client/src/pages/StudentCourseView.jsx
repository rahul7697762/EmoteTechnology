import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseDetails } from '../redux/slices/courseSlice';
import { fetchCourseProgress } from '../redux/slices/progressSlice';
import { MessageSquare, X, PlayCircle } from 'lucide-react';

// Modular Components
import VideoPlayer from '../components/student-view/VideoPlayer';
import ArticleViewer from '../components/student-view/ArticleViewer';
import CourseSidebar from '../components/student-view/CourseSidebar';
import AIChat from '../components/student-view/AIChat';
import CourseHeader from '../components/student-view/CourseHeader';

const StudentCourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCourse: course, isFetchingDetails: loading, error } = useSelector((state) => state.course);
    const { courseProgress } = useSelector((state) => state.progress);

    const [activeModuleId, setActiveModuleId] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);

    // Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Resizing State
    const [sidebarWidth, setSidebarWidth] = useState(320); // Default 320px
    const [chatWidth, setChatWidth] = useState(320); // Default 320px
    const [isResizingSidebar, setIsResizingSidebar] = useState(false);
    const [isResizingChat, setIsResizingChat] = useState(false);

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
                // Chat usually closed by default or persisted
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Resizing Handlers
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isResizingSidebar) {
                const newWidth = e.clientX;
                if (newWidth > 200 && newWidth < 600) {
                    setSidebarWidth(newWidth);
                }
            }
            if (isResizingChat) {
                const newWidth = window.innerWidth - e.clientX;
                if (newWidth > 250 && newWidth < 600) {
                    setChatWidth(newWidth);
                }
            }
        };

        const handleMouseUp = () => {
            if (isResizingSidebar) setIsResizingSidebar(false);
            if (isResizingChat) setIsResizingChat(false);
            document.body.style.cursor = 'default';
        };

        if (isResizingSidebar || isResizingChat) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = isResizingSidebar || isResizingChat ? 'col-resize' : 'default';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, [isResizingSidebar, isResizingChat]);

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
        <div className="flex flex-col h-screen bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden font-sans text-slate-900 dark:text-slate-100 select-none">

            {/* 1. FULL WIDTH HEADER */}
            <CourseHeader
                course={course}
                activeLesson={activeLesson}
                activeModuleId={activeModuleId}
                progress={courseProgress}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
                onExit={() => navigate('/student-courses')}
            />

            {/* 2. MAIN BODY CONTAINER */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* LEFT SIDEBAR */}
                <div className="relative flex shrink-0 h-full">
                    <CourseSidebar
                        course={course}
                        activeModuleId={activeModuleId}
                        toggleModule={toggleModule}
                        activeLesson={activeLesson}
                        setActiveLesson={setActiveLesson}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        isMobile={isMobile}
                        width={sidebarWidth}
                    />

                    {/* Drag Handle - Sidebar */}
                    {isSidebarOpen && !isMobile && (
                        <div
                            className="w-1 hover:w-1.5 h-full cursor-col-resize hover:bg-violet-500/50 active:bg-violet-600 transition-all z-40 absolute right-0 translate-x-1/2"
                            onMouseDown={() => setIsResizingSidebar(true)}
                        />
                    )}
                </div>

                {/* Sidebar Overlay for Mobile */}
                {isSidebarOpen && isMobile && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0f172a] relative z-0">
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

                {/* AI CHAT PANEL */}
                <div className="relative flex shrink-0 h-full">
                    {/* Drag Handle - Chat */}
                    {isChatOpen && !isMobile && (
                        <div
                            className="w-1 hover:w-1.5 h-full cursor-col-resize hover:bg-violet-500/50 active:bg-violet-600 transition-all z-40 absolute left-0 -translate-x-1/2"
                            onMouseDown={() => setIsResizingChat(true)}
                        />
                    )}

                    <AIChat
                        isOpen={isChatOpen}
                        onClose={() => setIsChatOpen(false)}
                        width={chatWidth}
                        isMobile={isMobile}
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentCourseView;
