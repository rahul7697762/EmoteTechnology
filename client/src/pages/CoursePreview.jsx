import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFacultyCourseDetails } from '../redux/slices/courseSlice';
import {
    ChevronDown, PlayCircle, FileText, Menu,
    MessageSquare, X, MonitorPlay, BookOpen
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden font-sans text-slate-900 dark:text-slate-100">

            {/* 1. LEFT SIDEBAR - COURSE NAVIGATION */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-80 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-800
                    transform transition-transform duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0
                    ${!isSidebarOpen && 'lg:hidden'} 
                `}
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
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate uppercase tracking-widest font-semibold">
                                PREVIEW MODE
                            </p>
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
                            onClick={() => navigate(`/edit-course/${id}`)}
                            className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-sm active:scale-95"
                        >
                            Back to Edit
                        </button>
                    </div>
                </header>

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

export default CoursePreview;
