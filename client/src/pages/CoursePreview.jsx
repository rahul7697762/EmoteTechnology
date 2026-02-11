import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFacultyCourseDetails } from '../redux/slices/courseSlice';
import {
    ChevronDown, PlayCircle, FileText,
    MessageSquare, X, MonitorPlay, BookOpen
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AIChat from '../components/student-view/AIChat';
import CourseHeader from '../components/student-view/CourseHeader';
import StudentAssessmentView from '../components/student-view/StudentAssessmentView';

const CoursePreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCourse: course, isFetchingCourse } = useSelector((state) => state.course);

    const [activeModuleId, setActiveModuleId] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);

    // Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Resizing State
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [chatWidth, setChatWidth] = useState(320);
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

    useEffect(() => {
        if (id) {
            dispatch(getFacultyCourseDetails(id));
        }
    }, [dispatch, id]);

    // Set initial active lesson on load
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

    if (isFetchingCourse || !course) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-[#0F172A]">
                <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden font-sans text-slate-900 dark:text-slate-100 select-none">

            {/* 1. FULL WIDTH HEADER */}
            <CourseHeader
                course={course}
                activeLesson={activeLesson}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
                onExit={() => navigate(`/edit-course/${id}`)}
                isPreview={true}
            />

            {/* 2. MAIN BODY CONTAINER */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* 1. LEFT SIDEBAR - COURSE NAVIGATION */}
                <div className="relative flex shrink-0 h-full">
                    <aside
                        className={`
                            fixed inset-y-0 left-0 z-30 bg-slate-50 dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800
                            transform transition-transform duration-300 ease-in-out flex flex-col
                            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                            lg:relative lg:shadow-none lg:z-0 lg:transition-none
                            ${!isSidebarOpen && 'lg:hidden'} 
                        `}
                        style={{ width: isMobile ? '80%' : sidebarWidth }}
                    >
                        <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                            <h2 className="font-bold text-slate-800 dark:text-white truncate flex-1">
                                Content Preview
                            </h2>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {course.modules?.map((module, index) => (
                                <div key={module._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    {/* Module Header */}
                                    <button
                                        onClick={() => toggleModule(module._id)}
                                        className={`w-full px-4 py-4 flex items-start gap-3 transition-colors text-left group
                                        ${activeModuleId === module._id ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}
                                    `}
                                    >
                                        <span className={`mt-0.5 text-slate-400 transition-transform duration-200 ${activeModuleId === module._id ? 'rotate-180' : ''}`}>
                                            <ChevronDown size={18} />
                                        </span>
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                Module {index + 1}
                                            </h3>
                                            <p className={`text-sm font-semibold transition-colors ${activeModuleId === module._id ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                                {module.title}
                                            </p>
                                        </div>
                                    </button>

                                    {/* SubModules List */}
                                    <div className={`overflow-hidden transition-all duration-300 ${activeModuleId === module._id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="bg-slate-50/50 dark:bg-[#0F172A]/50 pb-2">
                                            {module.subModules?.map((lesson, idx) => (
                                                <button
                                                    key={lesson._id}
                                                    onClick={() => {
                                                        setActiveLesson(lesson);
                                                        if (isMobile) setIsSidebarOpen(false);
                                                    }}
                                                    className={`w-full pl-10 pr-4 py-3 flex items-start gap-3 text-left transition-all border-l-4
                                                    ${activeLesson?._id === lesson._id
                                                            ? 'border-violet-600 bg-white dark:bg-[#1E293B] shadow-sm'
                                                            : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500'
                                                        }
                                                `}
                                                >
                                                    <div className={`mt-0.5 ${activeLesson?._id === lesson._id ? 'text-violet-600' : 'text-slate-400'}`}>
                                                        {lesson.type === 'VIDEO' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className={`text-sm leading-tight ${activeLesson?._id === lesson._id ? 'font-medium text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                {lesson.title}
                                                            </p>
                                                            {lesson.isPreview && (
                                                                <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded">
                                                                    FREE
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] font-medium text-slate-400 uppercase">
                                                                {lesson.type} • {lesson.type === 'VIDEO' && lesson.video?.duration ? `${Math.floor(lesson.video.duration / 60)}:${String(lesson.video.duration % 60).padStart(2, '0')}` : '5 min read'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}

                                            {/* Assessment Item */}
                                            {module.hasAssessment && (
                                                <button
                                                    onClick={() => {
                                                        setActiveLesson({ type: 'ASSESSMENT', module, _id: `assessment-${module._id}`, title: "Module Assessment" });
                                                        if (isMobile) setIsSidebarOpen(false);
                                                    }}
                                                    className={`w-full pl-10 pr-4 py-3 flex items-start gap-3 text-left transition-all border-l-4
                                                        ${activeLesson?.type === 'ASSESSMENT' && activeLesson?.module?._id === module._id
                                                            ? 'border-violet-600 bg-white dark:bg-[#1E293B] shadow-sm'
                                                            : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500'
                                                        }
                                                    `}
                                                >
                                                    <div className={`mt-0.5 ${activeLesson?.type === 'ASSESSMENT' && activeLesson?.module?._id === module._id ? 'text-violet-600' : 'text-slate-400'}`}>
                                                        <FileText size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium ${activeLesson?.type === 'ASSESSMENT' && activeLesson?.module?._id === module._id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                            Module Assessment
                                                        </p>
                                                        <span className="text-[10px] font-medium text-slate-400 uppercase">
                                                            Quiz / Assignment
                                                        </span>
                                                    </div>
                                                </button>
                                            )}
                                            {(!module.subModules || module.subModules.length === 0) && (
                                                <div className="px-10 py-3 text-xs text-slate-400 italic">
                                                    No lessons in this module.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
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

                {/* 2. MAIN CONTENT AREA */}
                <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0f172a] relative z-0">

                    {/* Content Viewer */}
                    <div className="flex-1 relative overflow-hidden flex flex-col">
                        {activeLesson ? (
                            <>
                                {activeLesson.type === 'VIDEO' ? (
                                    /* VIDEO PLAYER VIEW */
                                    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0f1c] overflow-y-auto custom-scrollbar">
                                        {/* Video Container - No longer sticky */}
                                        <div className="w-full bg-black shadow-lg shrink-0">
                                            <div className="max-w-6xl mx-auto w-full aspect-video bg-black relative">
                                                {activeLesson.video?.url ? (
                                                    <video
                                                        src={activeLesson.video.url}
                                                        controls
                                                        className="w-full h-full"
                                                        controlsList="nodownload"
                                                        onContextMenu={(e) => e.preventDefault()}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/50 flex-col gap-4">
                                                        <MonitorPlay size={64} className="opacity-50" />
                                                        <p>Video source unavailable</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Video Context/Description */}
                                        <div className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-8">
                                            <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                                                <div className="border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
                                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                                        {activeLesson.title}
                                                    </h1>
                                                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                        <span className="flex items-center gap-1.5">
                                                            <PlayCircle size={16} className="text-violet-600 dark:text-violet-400" />
                                                            Preview Lesson
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {activeLesson.video?.duration ? `${Math.floor(activeLesson.video.duration / 60)} min ${String(activeLesson.video.duration % 60).padStart(2, '0')} sec` : 'Duration N/A'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {activeLesson.description ? (
                                                    <div className="prose prose-slate dark:prose-invert max-w-none 
                                                        prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                                                        prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                                                        prose-a:text-violet-600 dark:prose-a:text-violet-400
                                                    ">
                                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Description</h3>
                                                        <p>{activeLesson.description}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-500 dark:text-slate-400 italic">No description available for this lesson.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : activeLesson.type === 'ASSESSMENT' ? (
                                    /* ASSESSMENT PREVIEW */
                                    <StudentAssessmentView
                                        moduleId={activeLesson.module._id}
                                        courseId={course._id}
                                        previewMode={true}
                                    />
                                ) : (
                                    /* ARTICLE VIEW */
                                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0F172A]">
                                        <div className="max-w-3xl mx-auto px-6 py-10 lg:py-16">
                                            <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-4">
                                                    <BookOpen size={20} />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Reading Material</span>
                                                </div>
                                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                                    {activeLesson.title}
                                                </h1>
                                            </div>

                                            <div className="prose prose-lg dark:prose-invert max-w-none 
                                                prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                                                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                                                prose-a:text-violet-600 dark:prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
                                                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                                                prose-code:text-violet-600 dark:prose-code:text-violet-400 prose-code:bg-violet-50 dark:prose-code:bg-violet-900/20 prose-code:px-1 prose-code:rounded
                                                prose-pre:bg-slate-900 dark:prose-pre:bg-[#1E293B] prose-pre:text-slate-50
                                            ">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {activeLesson.content || "> *No content available for this lesson.*"}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* EMPTY STATE */
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <PlayCircle size={32} className="text-slate-400" />
                                </div>
                                <p className="font-medium">Select a lesson to start previewing</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* 3. AI CHAT PANEL */}
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

export default CoursePreview;
