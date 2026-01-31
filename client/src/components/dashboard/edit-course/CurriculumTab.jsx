import React from 'react';
import { Reorder } from 'framer-motion';
import { Layers, Plus, Loader2 } from 'lucide-react';
import ModuleItem from './ModuleItem';
import AddModuleModal from './AddModuleModal';

const CurriculumTab = ({
    // List Data
    localModules,
    handleReorder,
    saveReorder,

    // UI States
    isReordering,
    isReorderingModules,

    // Modal Props
    isModalOpen,
    onCloseModal,
    onConfirmAddModule,
    newModuleTitle,
    setNewModuleTitle,
    isCreatingModule,
    handleAddModuleClick,

    // Module Item Handlers
    activeModuleId,
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
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Curriculum</h2>
                <div className="flex items-center gap-3">
                    {isReordering && (
                        <button
                            onClick={saveReorder}
                            disabled={isReorderingModules}
                            className="text-sm bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-200 transition-colors font-medium flex items-center gap-2"
                        >
                            {isReorderingModules && <Loader2 className="animate-spin" size={14} />}
                            Save Order
                        </button>
                    )}
                    <button
                        onClick={handleAddModuleClick}
                        className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                    >
                        <Plus size={18} /> Add Module
                    </button>
                </div>
            </div>

            <AddModuleModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                onConfirm={onConfirmAddModule}
                title={newModuleTitle}
                setTitle={setNewModuleTitle}
                isLoading={isCreatingModule}
            />

            <div className="space-y-4">
                {localModules.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl">
                        <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Layers size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Modules Yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6">Create your first module to start organizing your course curriculum.</p>
                        <button
                            onClick={handleAddModuleClick}
                            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center gap-2 mx-auto"
                        >
                            <Plus size={20} /> Create Module
                        </button>
                    </div>
                ) : (
                    <Reorder.Group axis="y" values={localModules} onReorder={handleReorder}>
                        {localModules.map((module) => (
                            <ModuleItem
                                key={module._id}
                                module={module}
                                isActive={activeModuleId === module._id}
                                toggleActive={toggleActive}
                                handleUpdateModuleTitle={handleUpdateModuleTitle}
                                handleTogglePublishModule={handleTogglePublishModule}
                                handleDeleteModule={handleDeleteModule}
                                handleReorderSubModules={handleReorderSubModules}
                                handleSubModuleDragEnd={handleSubModuleDragEnd}
                                handleOpenAddLesson={handleOpenAddLesson}
                                handleEditSubModule={handleEditSubModule}
                                handleDeleteSubModule={handleDeleteSubModule}
                                handleTogglePublishSubModule={handleTogglePublishSubModule}
                            />
                        ))}
                    </Reorder.Group>
                )}
            </div>
        </div>
    );
};

export default CurriculumTab;
