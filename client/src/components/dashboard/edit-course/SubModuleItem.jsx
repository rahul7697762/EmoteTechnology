import React from 'react';
import { Reorder } from 'framer-motion';
import {
    GripVertical, Video, FileText, Eye, EyeOff, Settings, Trash2
} from 'lucide-react';

const SubModuleItem = ({
    subModule,
    handleTogglePublish,
    handleEdit,
    handleDelete,
    moduleId,
    onDragEnd
}) => {
    return (
        <Reorder.Item
            value={subModule}
            onDragEnd={onDragEnd}
            className="mb-2"
        >
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-violet-200 dark:hover:border-violet-800 transition-colors">
                <div className="cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing">
                    <GripVertical size={16} />
                </div>
                <div className={`p-2 rounded-lg ${subModule.type === 'VIDEO' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'}`}>
                    {subModule.type === 'VIDEO' ? <Video size={16} /> : <FileText size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-800 dark:text-white truncate">{subModule.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{subModule.type}</span>
                        {subModule.isPreview && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold">FREE</span>}
                        {subModule.status === 'DRAFT' && <span className="text-amber-500">Draft</span>}
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleTogglePublish(subModule)}
                        className={`p-1.5 rounded-md ${subModule.status === 'PUBLISHED' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'}`}
                        title={subModule.status === 'PUBLISHED' ? "Unpublish" : "Publish"}
                    >
                        {subModule.status === 'PUBLISHED' ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                        onClick={() => handleEdit(subModule)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50"
                        title="Edit"
                    >
                        <Settings size={14} />
                    </button>
                    <button
                        onClick={() => handleDelete(subModule._id, moduleId)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </Reorder.Item>
    );
};

export default SubModuleItem;
