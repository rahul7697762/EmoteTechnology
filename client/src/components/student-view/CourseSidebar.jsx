import React from 'react';
import { ChevronDown, PlayCircle, FileText, CheckCircle, Lock, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
                fixed inset-y-0 left-0 z-30 bg-[#F7F8FF] dark:bg-[#0A0B10] border-r border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10
                transform transition-transform duration-300 ease-in-out flex flex-col rounded-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:shadow-none lg:z-0 lg:transition-none
                ${!isSidebarOpen && 'lg:hidden'} 
            `}
            style={{ width: isMobile ? '80%' : width }}
        >
            <div className="h-20 px-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-between shrink-0">
                <h2 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] truncate flex-1" style={{ fontFamily: SERIF }}>
                    Course Content
                </h2>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-2 hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 rounded-none text-[#6B7194] dark:text-[#8B90B8]"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {course.modules?.map((module, index) => (
                    <div key={module._id} className="border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 last:border-0">
                        {/* Module Header */}
                        <button
                            onClick={() => !module.isLocked && toggleModule(module._id)}
                            disabled={module.isLocked}
                            className={`w-full px-6 py-6 flex items-start gap-4 transition-colors text-left group rounded-none
                                ${activeModuleId === module._id ? 'bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5' : 'hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5'}
                                ${module.isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <span className={`mt-0.5 text-[#3B4FD8] dark:text-[#6C7EF5] transition-transform duration-200 ${activeModuleId === module._id ? 'rotate-180' : ''}`}>
                                {module.isLocked ? <Lock size={18} /> : <ChevronDown size={18} />}
                            </span>
                            <div>
                                <h3 className="text-[10px] font-bold text-[#3B4FD8] dark:text-[#6C7EF5] uppercase tracking-[0.2em] mb-2" style={{ fontFamily: MONO }}>
                                    Module {index + 1}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <p className={`text-xl font-bold transition-colors ${activeModuleId === module._id ? 'text-[#3B4FD8] dark:text-[#6C7EF5]' : 'text-[#1A1D2E] dark:text-[#E8EAF2]'}`} style={{ fontFamily: SERIF }}>
                                        {module.title}
                                    </p>
                                    {module.isCompleted && <CheckCircle size={16} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />}
                                </div>
                            </div>
                        </button>

                        {/* SubModules List */}
                        <div className={`overflow-hidden transition-all duration-300 ${activeModuleId === module._id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-white dark:bg-[#1A1D2E] py-2">
                                {module.subModules?.map((lesson, idx) => {
                                    const isCompleted = lessonProgress[lesson._id]?.isCompleted;

                                    return (
                                        <button
                                            key={lesson._id}
                                            onClick={() => {
                                                setActiveLesson(lesson);
                                                if (isMobile) setIsSidebarOpen(false);
                                            }}
                                            className={`w-full pl-12 pr-6 py-4 flex items-start gap-4 text-left transition-all border-l-[3px] rounded-none
                                                ${activeLesson?._id === lesson._id
                                                    ? 'border-[#3B4FD8] dark:border-[#6C7EF5] bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 shadow-sm'
                                                    : 'border-transparent hover:bg-[#F7F8FF] dark:hover:bg-[#252A41]'
                                                }
                                            `}
                                        >
                                            <div className="mt-1 relative">
                                                {isCompleted ? (
                                                    <CheckCircle size={18} className="text-[#3B4FD8] dark:text-[#6C7EF5] shrink-0" />
                                                ) : (
                                                    <div className={`${activeLesson?._id === lesson._id ? 'text-[#3B4FD8] dark:text-[#6C7EF5]' : 'text-[#6B7194] dark:text-[#8B90B8]'} shrink-0`}>
                                                        {lesson.type === 'VIDEO' ? <PlayCircle size={18} /> : <FileText size={18} />}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-lg transition-colors ${activeLesson?._id === lesson._id ? 'font-bold text-[#1A1D2E] dark:text-[#E8EAF2]' : 'text-[#1A1D2E] dark:text-[#E8EAF2]'} ${isCompleted ? 'opacity-60' : ''}`} style={{ fontFamily: SERIF }}>
                                                    {lesson.title}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>
                                                        {lesson.type} • {lesson.type === 'VIDEO' && lesson.video?.duration ? `${Math.floor(lesson.video.duration / 60)}:${String(lesson.video.duration % 60).padStart(2, '0')}` : '5 MIN READ'}
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
                                        className={`w-full pl-12 pr-6 py-4 flex items-start gap-4 text-left transition-all border-l-[3px] rounded-none
                                            ${activeLesson?.type === 'ASSESSMENT' && activeLesson?.module?._id === module._id
                                                ? 'border-[#F5A623] bg-[#F5A623]/10 shadow-sm'
                                                : 'border-transparent hover:bg-[#F7F8FF] dark:hover:bg-[#252A41]'
                                            }
                                        `}
                                    >
                                        <div className="mt-1 shrink-0">
                                            {/* Icon for Assessment */}
                                            <FileText size={18} className={module.isCompleted ? "text-[#3B4FD8] dark:text-[#6C7EF5]" : "text-[#F5A623]"} />
                                        </div>
                                        <div>
                                            <p className={`text-lg transition-colors ${activeLesson?.type === 'ASSESSMENT' && activeLesson?.module?._id === module._id ? 'font-bold text-[#1A1D2E] dark:text-[#E8EAF2]' : 'text-[#1A1D2E] dark:text-[#E8EAF2]'}`} style={{ fontFamily: SERIF }}>
                                                Module Assessment
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>
                                                    QUIZ / ASSIGNMENT
                                                </span>
                                            </div>
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
