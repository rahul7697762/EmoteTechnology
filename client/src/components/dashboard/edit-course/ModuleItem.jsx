import React from 'react';
import { Reorder } from 'framer-motion';
import {
    GripVertical, Eye, EyeOff, Trash2, ChevronDown, ChevronRight, Plus
} from 'lucide-react';
import SubModuleItem from './SubModuleItem';
import AssessmentManager from '../AssessmentManager';

const ModuleItem = ({
    module,
    isActive,
    toggleActive,
    handleUpdateModuleTitle,
    handleTogglePublishModule,
    handleDeleteModule,
    handleReorderSubModules,
    handleSubModuleDragEnd,
    handleOpenAddLesson,
    handleEditSubModule,
    handleDeleteSubModule,
    handleTogglePublishSubModule
}) => {
    return (
        <Reorder.Item value={module} className="mb-4">
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all shadow-sm group">
                {/* Module Header */}
                <div
                    className={`p-4 flex items-center gap-4 cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 ${isActive ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}`}
                    onClick={() => toggleActive(module._id)}
                >
                    <div className="cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing">
                        <GripVertical size={18} />
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            defaultValue={module.title}
                            onBlur={(e) => handleUpdateModuleTitle(module._id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-transparent font-semibold text-slate-900 dark:text-white outline-none focus:text-violet-600 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => handleTogglePublishModule(module._id, module.status, e)}
                            className={`p-2 rounded-full transition-colors ${module.status === 'PUBLISHED'
                                ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            title={module.status === 'PUBLISHED' ? "Unpublish Module" : "Publish Module"}
                        >
                            {module.status === 'PUBLISHED' ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button onClick={(e) => handleDeleteModule(module._id, e)} className="text-slate-400 hover:text-red-500 p-2">
                            <Trash2 size={16} />
                        </button>
                        {isActive
                            ? <ChevronDown size={20} className="text-slate-400" />
                            : <ChevronRight size={20} className="text-slate-400" />
                        }
                    </div>
                </div>

                {/* Submodules List */}
                {isActive && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B]">
                        <div className="space-y-3">
                            {module.subModules && module.subModules.length > 0 && (
                                <Reorder.Group
                                    axis="y"
                                    values={module.subModules}
                                    onReorder={(newOrder) => handleReorderSubModules(module._id, newOrder)}
                                >
                                    {module.subModules.map((subModule, index) => (
                                        <SubModuleItem
                                            key={subModule._id || index}
                                            subModule={subModule}
                                            handleEdit={handleEditSubModule}
                                            handleDelete={handleDeleteSubModule}
                                            handleTogglePublish={handleTogglePublishSubModule}
                                            moduleId={module._id}
                                            onDragEnd={() => handleSubModuleDragEnd(module._id)}
                                        />
                                    ))}
                                </Reorder.Group>
                            )}

                            {/* Add Lesson Button */}
                            <button
                                onClick={() => handleOpenAddLesson(module._id)}
                                className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-500 hover:text-violet-600 hover:border-violet-300 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Lesson
                            </button>

                            {/* Assessment Manager */}
                            <AssessmentManager
                                moduleId={module._id}
                                courseId={module.courseId}
                                hasAssessment={module.hasAssessment}
                                onUpdate={() => {
                                    // Optionally trigger a module refetch or update local state
                                    // For now, parent might not be listening, but we can access context if needed
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Reorder.Item>
    );
};

export default ModuleItem;
