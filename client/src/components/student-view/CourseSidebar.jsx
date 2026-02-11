
import React from 'react';
import { ChevronDown, PlayCircle, FileText, CheckCircle, Lock, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const CourseSidebar = ({
    course,
    activeModuleId,
    toggleModule,
    activeLesson,
    setActiveLesson,
    isSidebarOpen,
    setIsSidebarOpen,
    isMobile,
    width
}) => {

    // Get progress map from Redux
    const { lessonProgress } = useSelector((state) => state.progress);

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-30 bg-slate-50 dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:shadow-none lg:z-0 lg:transition-none
                ${!isSidebarOpen && 'lg:hidden'} 
            `}
            style={{ width: isMobile ? '80%' : width }}
        >
            <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <h2 className="font-bold text-slate-800 dark:text-white truncate flex-1">
                    Course Content
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
                            onClick={() => !module.isLocked && toggleModule(module._id)}
                            disabled={module.isLocked}
                            className={`w-full px-4 py-4 flex items-start gap-3 transition-colors text-left group
                                ${activeModuleId === module._id ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}
                                ${module.isLocked ? 'opacity-60 cursor-not-allowed' : ''}
                            `}
                        >
                            <span className={`mt-0.5 text-slate-400 transition-transform duration-200 ${activeModuleId === module._id ? 'rotate-180' : ''}`}>
                                {module.isLocked ? <Lock size={18} /> : <ChevronDown size={18} />}
                            </span>
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Module {index + 1}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <p className={`text-sm font-semibold transition-colors ${activeModuleId === module._id ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {module.title}
                                    </p>
                                    {module.isCompleted && <CheckCircle size={14} className="text-green-500" />}
                                </div>
                            </div>
                        </button>

                        {/* SubModules List */}
                        <div className={`overflow-hidden transition-all duration-300 ${activeModuleId === module._id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-slate-50/50 dark:bg-[#0F172A]/50 pb-2">
                                {module.subModules?.map((lesson, idx) => {
                                    const isCompleted = lessonProgress[lesson._id]?.isCompleted;

                                    return (
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
                                            <div className="mt-0.5 relative">
                                                {isCompleted ? (
                                                    <CheckCircle size={16} className="text-green-500" />
                                                ) : (
                                                    <div className={`${activeLesson?._id === lesson._id ? 'text-violet-600' : 'text-slate-400'}`}>
                                                        {lesson.type === 'VIDEO' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${activeLesson?._id === lesson._id ? 'font-medium text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'} ${isCompleted ? 'line-through opacity-70' : ''}`}>
                                                    {lesson.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-medium text-slate-400 uppercase">
                                                        {lesson.type} • {lesson.type === 'VIDEO' && lesson.video?.duration ? `${Math.floor(lesson.video.duration / 60)}:${String(lesson.video.duration % 60).padStart(2, '0')}` : '5 min read'}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}

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
                                        <div className="mt-0.5 text-violet-500">
                                            {/* Icon for Assessment */}
                                            <FileText size={16} className={module.isCompleted ? "text-green-500" : "text-violet-500"} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${activeLesson?.type === 'ASSESSMENT' && activeLesson?.module?._id === module._id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                Module Assessment
                                            </p>
                                            <span className="text-[10px] font-medium text-slate-400 uppercase">
                                                Quiz / Assignment
                                            </span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default CourseSidebar;
