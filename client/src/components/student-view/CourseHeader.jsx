import React, { useState, useEffect } from 'react';
import { Menu, MessageSquare, Moon, Sun, ThumbsUp, ThumbsDown, MessageCircle, ChevronRight } from 'lucide-react';

const CourseHeader = ({
    course,
    activeLesson,
    activeModuleId,
    progress = 0,
    isSidebarOpen,
    setIsSidebarOpen,
    isChatOpen,
    setIsChatOpen,
    onExit,
    isPreview = false
}) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize theme based on system or existing preference
    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setIsDarkMode(true);
        }
    }, []);

    const toggleTheme = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        }
    };

    // Find active module title
    const activeModule = course?.modules?.find(m => m._id === activeModuleId);

    return (
        <header className="relative flex flex-col shrink-0 z-20 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="h-16 flex items-center justify-between px-4 lg:px-6 relative z-10">

                {/* LEFT: Sidebar Toggle & Context (Breadcrumbs) */}
                <div className="flex items-center gap-4 overflow-hidden flex-1 mr-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors shrink-0"
                        title="Toggle Sidebar"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 overflow-hidden whitespace-nowrap mask-linear-fade">
                        <span className="hidden md:inline truncate">{course?.title || 'Course'}</span>

                        {activeModule && (
                            <>
                                <ChevronRight size={14} className="mx-2 text-slate-400 shrink-0" />
                                <span className="hidden lg:inline truncate text-slate-500 dark:text-slate-400">
                                    {activeModule.title}
                                </span>
                            </>
                        )}

                        {activeLesson && (
                            <>
                                <ChevronRight size={14} className="mx-2 text-slate-400 shrink-0" />
                                <span className={`truncate ${isPreview ? 'text-slate-500' : 'text-violet-600 dark:text-violet-400 font-bold'}`}>
                                    {activeLesson.title}
                                </span>
                            </>
                        )}

                        {isPreview && (
                            <>
                                <span className="mx-2 text-slate-300">|</span>
                                <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Preview Mode</span>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT: Controls & Actions */}
                <div className="flex items-center gap-2 md:gap-3 shrink-0">

                    {/* Ask AI Button - Primary Action */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm border
                            ${isChatOpen
                                ? 'bg-violet-600 text-white border-violet-600 shadow-violet-200 dark:shadow-none'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-violet-500 dark:hover:text-violet-400'
                            }`}
                    >
                        <MessageSquare size={16} />
                        <span>Ask AI</span>
                    </button>

                    {/* Mobile Chat Toggle */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                    >
                        <MessageSquare size={20} />
                    </button>

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden md:block mx-1"></div>

                    {/* Context Actions (Feedback) - Only in Full Mode */}
                    {!isPreview && (
                        <div className="hidden md:flex items-center gap-1">
                            <button title="Helpful" className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <ThumbsUp size={18} />
                            </button>
                            <button title="Confusing" className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <ThumbsDown size={18} />
                            </button>
                            <button title="Discussion" className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <MessageCircle size={18} />
                            </button>
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        onClick={onExit}
                        className="ml-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-sm font-medium transition-colors"
                    >
                        Exit
                    </button>
                </div>
            </div>

            {/* PROGRESS BAR - Bottom of Header */}
            {!isPreview && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-100 dark:bg-slate-800">
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out"
                        style={{ width: `${Math.max(progress, 0)}%` }}
                    />
                </div>
            )}
        </header>
    );
};

export default CourseHeader;
