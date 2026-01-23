import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, ChevronDown,
    Video, FileText, LayoutGrid, HelpCircle,
    PlayCircle, CheckCircle, Lock
} from 'lucide-react';

const CoursePreview = () => {
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);

    // Load Draft Data
    useEffect(() => {
        const savedDraft = localStorage.getItem('courseDraft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setCourse(parsed.course);
                setModules(parsed.modules || []);

                // Set initial active state
                if (parsed.modules && parsed.modules.length > 0) {
                    const firstModule = parsed.modules[0];
                    setActiveModuleId(firstModule.id);
                    if (firstModule.items && firstModule.items.length > 0) {
                        setActiveLesson(firstModule.items[0]);
                    }
                }
            } catch (e) {
                console.error("Failed to load draft for preview", e);
            }
        }
    }, []);

    const getIconForType = (type) => {
        switch (type) {
            case 'video': return Video;
            case 'pdf': return FileText;
            case 'presentation': return LayoutGrid;
            case 'quiz': return HelpCircle;
            default: return FileText;
        }
    };

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0f] text-gray-500">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">No Preview Available</h2>
                    <p className="mb-4">Please save a draft in the editor first.</p>
                    <button
                        onClick={() => navigate('/create-course')}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    >
                        Back to Editor
                    </button>
                </div>
            </div>
        );
    }

    const currentModule = modules.find(m => m.id === activeModuleId);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex flex-col">
            {/* Preview Header */}
            <header className="h-16 bg-white dark:bg-[#1a1c23] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/create-course')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 transition-colors"
                        title="Back to Editor"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <span className="text-xs font-bold text-teal-500 uppercase tracking-wide">Course Preview</span>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{course.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Student View
                    </div>
                    <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-xs">
                        S
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Course Sidebar (Read Only) */}
                <aside className="w-80 bg-white dark:bg-[#1a1c23] border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto">
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Course Content</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">0% Complete</p>
                            <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-500 w-0"></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {modules.map((module) => (
                                <div key={module.id} className="group">
                                    <button
                                        onClick={() => setActiveModuleId(module.id === activeModuleId ? null : module.id)}
                                        className="w-full flex items-center justify-between text-left mb-2"
                                    >
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 line-clamp-1">
                                            {module.title}
                                        </span>
                                        {module.id === activeModuleId ?
                                            <ChevronDown size={16} className="text-gray-400" /> :
                                            <ChevronRight size={16} className="text-gray-400" />
                                        }
                                    </button>

                                    {module.id === activeModuleId && (
                                        <div className="space-y-1 ml-2 border-l-2 border-gray-100 dark:border-gray-800 pl-3">
                                            {module.items.map((item, idx) => {
                                                const ItemIcon = getIconForType(item.type);
                                                const isActive = activeLesson?.id === item.id;
                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setActiveLesson(item)}
                                                        className={`py-2 px-3 text-sm rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${isActive
                                                                ? 'bg-teal-50 dark:bg-teal-900/10 text-teal-700 dark:text-teal-400'
                                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                                            }`}
                                                    >
                                                        <div className={`shrink-0 ${isActive ? 'text-teal-500' : 'text-gray-400'}`}>
                                                            {item.type === 'video' ? <PlayCircle size={16} /> : <ItemIcon size={16} />}
                                                        </div>
                                                        <span className="line-clamp-1">{typeof item === 'string' ? item : item.title}</span>
                                                    </div>
                                                );
                                            })}
                                            {(!module.items || module.items.length === 0) && (
                                                <div className="text-xs text-gray-400 italic py-2 pl-3">No content in this module</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content (Player/Viewer) */}
                <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-[#0a0a0f] p-8 flex items-center justify-center">
                    {activeLesson ? (
                        <div className="w-full max-w-4xl bg-white dark:bg-[#1a1c23] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                            {/* Content Placeholder */}
                            <div className="aspect-video bg-black flex items-center justify-center relative group">
                                {activeLesson.type === 'video' ? (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-gray-500">
                                        {(() => {
                                            const Icon = getIconForType(activeLesson.type);
                                            return <Icon size={64} />;
                                        })()}
                                        <span className="text-lg font-medium uppercase tracking-widest">{activeLesson.type} VIEW</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{activeLesson.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
                                    <span className="flex items-center gap-1">
                                        <CheckCircle size={16} className="text-teal-500" />
                                        Mark as Complete
                                    </span>
                                    <span>•</span>
                                    <span>{activeLesson.meta || 'Lesson Content'}</span>
                                </div>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-gray-600 dark:text-gray-300">
                                        This is a preview of the lesson content. In the live course, the actual {activeLesson.type} file/content would be rendered here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <Video size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium">Select a lesson to preview</h3>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CoursePreview;
