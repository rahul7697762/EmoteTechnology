import React, { useState, useEffect } from 'react';
import { Menu, MessageSquare, Moon, Sun, ThumbsUp, ThumbsDown, MessageCircle, ChevronRight, Star } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const CourseHeader = ({
    course,
    activeLesson,
    activeModuleId,
    progress = 0,
    isSidebarOpen,
    setIsSidebarOpen,
    isChatOpen,
    setIsChatOpen,
    isDiscussionOpen,
    setIsDiscussionOpen,
    onExit,
    isPreview = false,
    hasReviewed,
    onOpenReview
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
        <header className="relative flex flex-col shrink-0 z-20 bg-white dark:bg-[#1A1D2E] border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 transition-colors duration-300 rounded-none">
            <div className="h-20 flex items-center justify-between px-4 lg:px-6 relative z-10">

                {/* LEFT: Sidebar Toggle & Context (Breadcrumbs) */}
                <div className="flex items-center gap-4 overflow-hidden flex-1 mr-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 rounded-none text-[#6B7194] dark:text-[#8B90B8] transition-colors shrink-0"
                        title="Toggle Sidebar"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Breadcrumbs */}
                    <div className="flex items-center overflow-hidden whitespace-nowrap mask-linear-fade">
                        <span className="hidden md:inline truncate text-[#1A1D2E] dark:text-[#E8EAF2] font-bold text-xl" style={{ fontFamily: SERIF }}>
                            {course?.title || 'Course'}
                        </span>

                        {activeModule && (
                            <>
                                <ChevronRight size={14} className="mx-3 text-[#6B7194] dark:text-[#8B90B8] shrink-0" />
                                <span className="hidden lg:inline truncate text-[#6B7194] dark:text-[#8B90B8] text-[10px] uppercase font-bold tracking-widest" style={{ fontFamily: MONO }}>
                                    {activeModule.title}
                                </span>
                            </>
                        )}

                        {activeLesson && (
                            <>
                                <ChevronRight size={14} className="mx-3 text-[#6B7194] dark:text-[#8B90B8] shrink-0" />
                                <span className={`truncate text-[10px] uppercase font-bold tracking-widest ${isPreview ? 'text-[#6B7194] dark:text-[#8B90B8]' : 'text-[#3B4FD8] dark:text-[#6C7EF5]'}`} style={{ fontFamily: MONO }}>
                                    {activeLesson.title}
                                </span>
                            </>
                        )}

                        {isPreview && (
                            <>
                                <span className="mx-3 text-[#6B7194]/30 dark:text-[#8B90B8]/30">|</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-[#F5A623]" style={{ fontFamily: MONO }}>Preview Mode</span>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT: Controls & Actions */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0">

                    {/* Leave Review Button */}
                    {!isPreview && onOpenReview && (
                        <button
                            onClick={onOpenReview}
                            className="hidden md:flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm border bg-white dark:bg-[#252A41] text-[#1A1D2E] dark:text-[#E8EAF2] border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] rounded-none"
                            style={{ fontFamily: MONO }}
                        >
                            <Star size={14} />
                            <span>Review</span>
                        </button>
                    )}

                    {/* Ask AI Button - Primary Action */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`hidden md:flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm border rounded-none
                            ${isChatOpen
                                ? 'bg-[#3B4FD8] text-white border-[#3B4FD8] dark:bg-[#6C7EF5] dark:text-[#1A1D2E] dark:border-[#6C7EF5]'
                                : 'bg-white dark:bg-[#252A41] text-[#1A1D2E] dark:text-[#E8EAF2] border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5]'
                            }`}
                        style={{ fontFamily: MONO }}
                    >
                        <MessageSquare size={14} />
                        <span>Ask AI</span>
                    </button>

                    {/* Mobile Chat Toggle */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="md:hidden p-3 text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 rounded-none"
                    >
                        <MessageSquare size={20} />
                    </button>

                    <div className="w-px h-8 bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 hidden md:block mx-1"></div>

                    {/* Context Actions (Feedback) - Only in Full Mode */}
                    {!isPreview && (
                        <div className="hidden md:flex items-center gap-1">
                            <button title="Helpful" className="p-3 text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 rounded-none transition-colors">
                                <ThumbsUp size={18} />
                            </button>
                            <button title="Confusing" className="p-3 text-[#6B7194] dark:text-[#8B90B8] hover:text-[#F5A623] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 rounded-none transition-colors">
                                <ThumbsDown size={18} />
                            </button>
                            <button
                                onClick={() => setIsDiscussionOpen(!isDiscussionOpen)}
                                title="Discussion"
                                className={`p-3 rounded-none transition-colors ${isDiscussionOpen
                                        ? 'text-[#3B4FD8] bg-[#3B4FD8]/10 dark:text-[#6C7EF5] dark:bg-[#6C7EF5]/10'
                                        : 'text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5'
                                    }`}
                            >
                                <MessageCircle size={18} />
                            </button>
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-3 text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 rounded-none transition-colors"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        onClick={onExit}
                        className="ml-2 px-8 py-4 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] rounded-none font-bold text-[10px] uppercase tracking-widest transition-colors shadow-sm"
                        style={{ fontFamily: MONO }}
                    >
                        Exit
                    </button>
                </div>
            </div>

            {/* PROGRESS BAR - Bottom of Header */}
            {!isPreview && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F7F8FF] dark:bg-[#111827]">
                    <div
                        className="h-full bg-[#3B4FD8] dark:bg-[#6C7EF5] transition-all duration-500 ease-out"
                        style={{ width: `${Math.max(progress, 0)}%` }}
                    />
                </div>
            )}
        </header>
    );
};

export default CourseHeader;
