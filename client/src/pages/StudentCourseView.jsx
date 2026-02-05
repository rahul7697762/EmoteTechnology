import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseDetails } from '../redux/slices/courseSlice';
import {
    ArrowLeft, ChevronDown, ChevronRight, PlayCircle, FileText, Menu, CheckCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const StudentCourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCourse: course, isFetchingDetails: loading, error } = useSelector((state) => state.course);

    const [activeModuleId, setActiveModuleId] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (id) {
            dispatch(getCourseDetails(id));
        }
    }, [dispatch, id]);

    // Set initial active lesson once course is loaded
    useEffect(() => {
        if (course?.modules?.length > 0 && !activeLesson) {
            // Find first module with lessons
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

    if (!course) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-500">
                <p>Course not found.</p>
                <button onClick={() => navigate('/student-courses')} className="ml-4 underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden">
            {/* Sidebar (Curriculum) */}
            <aside
                className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'
                    } bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 absolute md:relative z-20 h-full shadow-lg shrink-0`}
            >
                <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0 bg-white dark:bg-[#1E293B]">
                    <h2 className="font-bold text-slate-900 dark:text-white truncate">Course Content</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {course.modules?.map((module, index) => (
                        <div key={module._id} className="border-b border-slate-100 dark:border-slate-800">
                            {/* Module Header */}
                            <button
                                onClick={() => toggleModule(module._id)}
                                className={`w-full px-4 py-4 flex items-start gap-3 transition-all text-left group border-l-4
                                    ${activeModuleId === module._id
                                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'
                                    }
                                `}
                            >
                                <span className={`mt-0.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transform transition-transform duration-200 ${activeModuleId === module._id ? 'rotate-180' : ''
                                    }`}>
                                    <ChevronDown size={18} />
                                </span>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Section {index + 1}
                                    </h3>
                                    <p className={`text-sm font-medium transition-colors ${activeModuleId === module._id ? 'text-violet-600 dark:text-violet-400' : 'text-slate-900 dark:text-white'
                                        }`}>
                                        {module.title}
                                    </p>
                                </div>
                            </button>

                            {/* Lessons List */}
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeModuleId === module._id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="bg-slate-50 dark:bg-[#0a0f1c]/30 py-2">
                                    {module.subModules?.map((lesson, lessonIndex) => (
                                        <button
                                            key={lesson._id}
                                            onClick={() => setActiveLesson(lesson)}
                                            className={`w-full px-4 py-3 flex items-start gap-3 pl-10 border-l-4 transition-all relative ${activeLesson?._id === lesson._id
                                                ? 'border-violet-600 bg-white dark:bg-slate-800/50 shadow-sm'
                                                : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            <div className={`mt-0.5 shrink-0 ${activeLesson?._id === lesson._id ? 'text-violet-600' : 'text-slate-400'
                                                }`}>
                                                {/* TODO: Add completed check if available */}
                                                {lesson.type === 'VIDEO' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                            </div>
                                            <div className="text-left flex-1 min-w-0">
                                                <p className={`text-sm truncate ${activeLesson?._id === lesson._id
                                                    ? 'font-medium text-violet-700 dark:text-violet-400'
                                                    : ''
                                                    }`}>
                                                    {lessonIndex + 1}. {lesson.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wide">
                                                        {lesson.type === 'VIDEO' ? 'Video' : 'Article'}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                    {(!module.subModules || module.subModules.length === 0) && (
                                        <div className="px-10 py-3 text-xs text-slate-400 italic">
                                            No lessons in this module yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                        >
                            {isSidebarOpen ? <ArrowLeft size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="border-l border-slate-200 dark:border-slate-600 pl-4 flex-1 min-w-0">
                            <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {course.title}
                            </h1>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/student-courses')}
                        className="ml-4 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0"
                    >
                        Back to Dashboard
                    </button>
                </header>

                {/* Content Area - Fixed Flex Column */}
                <main className="flex-1 flex flex-col overflow-hidden relative font-sans bg-[#F8FAFC] dark:bg-[#0F172A]">
                    {activeLesson ? (
                        <>
                            {/* Determine Scrollable Area based on Type */}
                            {activeLesson.type === 'VIDEO' ? (
                                <div className="flex-1 bg-black flex flex-col overflow-hidden">
                                    <div className="flex-1 flex items-center justify-center relative p-4 bg-black">
                                        {activeLesson.video?.url ? (
                                            <div className="w-full max-w-4xl aspect-video max-h-[70vh] flex items-center justify-center bg-black">
                                                <video
                                                    src={activeLesson.video.url}
                                                    controls
                                                    className="w-full h-full object-contain"
                                                    controlsList="nodownload" // Prevent download for now
                                                    onContextMenu={(e) => e.preventDefault()}
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-center text-white/50">
                                                <PlayCircle size={64} className="mx-auto mb-4 opacity-50" />
                                                <p className="text-lg">Video content not available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Article Container - Independent Scroll */
                                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0F172A]">
                                    <div className="max-w-4xl mx-auto w-full px-4 py-8 md:px-8 md:py-12 min-h-full">
                                        <div className="mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                                            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-900/20 rounded-full uppercase">
                                                Article
                                            </span>
                                            <h1 className="text-3xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                                {activeLesson.title}
                                            </h1>
                                        </div>

                                        <div
                                            className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300
                                                prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                                                prose-a:text-violet-600 dark:prose-a:text-violet-400
                                                prose-img:rounded-xl prose-img:shadow-lg
                                            "
                                        >
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {activeLesson.content || "> *No content available.*"}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Persistent Footer for Lesson Navigation */}
                            <div className="bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 z-10">
                                <div className="flex flex-col flex-1 min-w-0">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate" title={activeLesson.title}>
                                        {activeLesson.title}
                                    </h2>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Module {course.modules.findIndex(m => m._id === activeModuleId) + 1}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        title="Previous Lesson"
                                    >
                                        Previous
                                    </button>
                                    <button className="px-5 py-2 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
                                        Next <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-[#F8FAFC] dark:bg-[#0F172A]">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <PlayCircle size={40} className="text-slate-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Ready to start?</h2>
                            <p className="text-slate-500 max-w-xs text-center">Select a lesson from the sidebar to begin learning.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StudentCourseView;
