import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseDetails, updateCourse, updateCourseStatus, getFacultyCourseDetails } from '../redux/slices/courseSlice';
import Sidebar from '../components/dashboard/Sidebar';
import {
    LayoutDashboard, Settings, Layers, Video, FileText,
    Plus, Trash2, Save, ChevronDown, ChevronRight,
    GripVertical, Upload, Globe, DollarSign, Tag,
    Image as ImageIcon, MoreVertical, X, Loader2, ArrowLeft,
    CheckCircle, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Reorder, useDragControls } from 'framer-motion';
import {
    getModulesByCourse, createModule, updateModule,
    deleteModule, reorderModules, publishModule, unpublishModule,
    getSubModules, createSubModule, updateSubModule, deleteSubModule,
    publishSubModule, unpublishSubModule, reorderSubModules
} from '../redux/slices/moduleSlice';
import SubModuleModal from '../components/dashboard/SubModuleModal';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        currentCourse,
        isUpdatingCourse,
        isUpdatingCourseStatus
    } = useSelector((state) => state.course);

    const {
        modules,
        isFetchingModules,
        isCreatingModule,
        isReorderingModules,
        isCreatingSubModule,
        isUpdatingSubModule
    } = useSelector((state) => state.module);

    const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' | 'settings'

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        language: 'English',
        price: '0',
        currency: 'INR',
        discount: '0',
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    // Module State
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [isReordering, setIsReordering] = useState(false);
    const [localModules, setLocalModules] = useState([]); // For optimistic DnD update
    const localModulesRef = useRef(localModules);

    // Sync ref
    useEffect(() => {
        localModulesRef.current = localModules;
    }, [localModules]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');



    // Sync local modules with Redux modules
    useEffect(() => {
        setLocalModules(modules);
    }, [modules]);


    const thumbnailInputRef = useRef(null);
    const videoInputRef = useRef(null);

    // Initial Load
    useEffect(() => {
        if (id) {
            dispatch(getFacultyCourseDetails(id));
            dispatch(getModulesByCourse(id));
        }
    }, [dispatch, id]);

    // Populate Data
    useEffect(() => {
        if (currentCourse && (currentCourse._id === id || currentCourse._id === String(id))) {
            setFormData({
                title: currentCourse.title || '',
                description: currentCourse.description || '',
                category: currentCourse.category || 'TECH',
                level: currentCourse.level || 'BEGINNER',
                language: currentCourse.language || 'English',
                price: currentCourse.price || 0,
                currency: currentCourse.currency || 'INR',
                discount: currentCourse.discount || 0,
            });
            setThumbnailPreview(currentCourse.thumbnail);
            setVideoPreview(currentCourse.previewVideo);
        }
    }, [currentCourse, id]);


    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateCourse = async () => {
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (thumbnail) data.append('thumbnail', thumbnail);
        if (previewVideo) data.append('previewVideo', previewVideo);

        try {
            await dispatch(updateCourse({ id, courseData: data })).unwrap();
            toast.success('Course updated successfully');
        } catch (error) {
            toast.error('Failed to update course');
        }
    };

    const handlePublish = async () => {
        if (window.confirm(`Are you sure you want to ${currentCourse?.status === 'PUBLISHED' ? 'unpublish' : 'publish'} this course?`)) {
            const newStatus = currentCourse?.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
            try {
                await dispatch(updateCourseStatus({ id, status: newStatus })).unwrap();
                toast.success(`Course ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'} successfully`);
            } catch (error) {
                toast.error('Failed to update status');
            }
        }
    };

    // --- Module Handlers ---
    const handleAddModuleClick = () => {
        setIsModalOpen(true);
        setNewModuleTitle('');
    };

    const handleConfirmAddModule = async () => {
        if (newModuleTitle.trim()) {
            try {
                // Determine next order
                const maxOrder = modules.length > 0 ? Math.max(...modules.map(m => m.order)) : 0;
                await dispatch(createModule({ courseId: id, title: newModuleTitle, order: maxOrder + 1 })).unwrap();
                setIsModalOpen(false);
            } catch (error) {
                console.error("Failed to add module:", error);
            }
        }
    };


    const handleDeleteModule = async (moduleId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
            try {
                await dispatch(deleteModule(moduleId)).unwrap();
            } catch (error) {
                console.error("Failed to delete module:", error);
            }
        }
    };

    const handleUpdateModuleTitle = async (moduleId, newTitle) => {
        if (!newTitle.trim()) return;
        try {
            await dispatch(updateModule({ id: moduleId, data: { title: newTitle } })).unwrap();
        } catch (error) {
            console.error("Failed to update module:", error);
        }
    };

    // Toggle Module Publish Status
    const handleTogglePublishModule = async (moduleId, currentStatus, e) => {
        e.stopPropagation();
        try {
            if (currentStatus === 'PUBLISHED') {
                await dispatch(unpublishModule(moduleId)).unwrap();
            } else {
                await dispatch(publishModule(moduleId)).unwrap();
            }
        } catch (error) {
            console.error("Failed to toggle module status:", error);
        }
    };

    const handleReorder = (newOrder) => {
        setLocalModules(newOrder);
        setIsReordering(true);
    };

    const saveReorder = async () => {
        const reorderedData = localModules.map((m, index) => ({
            moduleId: m._id,
            order: index + 1
        }));
        try {
            await dispatch(reorderModules({ courseId: id, modules: reorderedData })).unwrap();
            setIsReordering(false);
            // Verify correct order from backend (optional, but good practice)
            dispatch(getModulesByCourse(id));
        } catch (error) {
            console.error("Failed to save reorder", error);
        }
    };

    const [isSubModuleModalOpen, setIsSubModuleModalOpen] = useState(false);
    const [currentModuleForLesson, setCurrentModuleForLesson] = useState(null);
    const [editingSubModule, setEditingSubModule] = useState(null);

    // Fetch submodules when expanding a module
    useEffect(() => {
        if (activeModuleId) {
            // Check if submodules already loaded or forced refresh needed?
            // For simplicity, fetch on expand. Optimally check if module.subModules exists.
            dispatch(getSubModules(activeModuleId));
        }
    }, [activeModuleId, dispatch]);

    const handleOpenAddLesson = (moduleId) => {
        setCurrentModuleForLesson(moduleId);
        setEditingSubModule(null);
        setIsSubModuleModalOpen(true);
    };

    const handleEditSubModule = (subModule) => {
        setEditingSubModule(subModule);
        setIsSubModuleModalOpen(true);
    };

    const handleSubModuleSubmit = async (formData) => {
        try {
            if (editingSubModule) {
                // Update
                await dispatch(updateSubModule({ id: editingSubModule._id, data: formData })).unwrap();
            } else {
                // Create
                // Append courseId and moduleId
                formData.append('courseId', id);
                formData.append('moduleId', currentModuleForLesson);
                await dispatch(createSubModule(formData)).unwrap();
            }
            setIsSubModuleModalOpen(false);
        } catch (error) {
            console.error("Failed to save lesson:", error);
        }
    };

    const handleDeleteSubModule = async (subModuleId, moduleId) => {
        if (window.confirm("Delete this lesson?")) {
            try {
                await dispatch(deleteSubModule({ subModuleId, moduleId })).unwrap();
            } catch (error) {
                console.error("Failed to delete lesson:", error);
            }
        }
    };

    const handleTogglePublishSubModule = async (subModule) => {
        try {
            if (subModule.status === 'PUBLISHED') {
                await dispatch(unpublishSubModule(subModule._id)).unwrap();
            } else {
                await dispatch(publishSubModule(subModule._id)).unwrap();
            }
        } catch (error) {
            console.error("Failed to toggle status:", error);
        }
    };

    const handleReorderSubModules = (moduleId, newSubModules) => {
        // console.log("handleReorderSubModules - newSubModules:", JSON.stringify(newSubModules, null, 2));
        setLocalModules(prev => prev.map(m =>
            m._id === moduleId ? { ...m, subModules: newSubModules } : m
        ));
    };

    const handleSubModuleDragEnd = async (moduleId) => {
        // Find the module in the CURRENT localModules state via REF to avoid stale closures
        const module = localModulesRef.current.find(m => m._id === moduleId);

        if (!module || !module.subModules) {
            return;
        }

        const reorderedData = module.subModules.map((sm, index) => ({
            subModuleId: sm._id || sm.id,
            order: index + 1
        }));

        try {
            await dispatch(reorderSubModules({ moduleId, subModules: reorderedData })).unwrap();
        } catch (error) {
            console.error("Failed to save lesson order:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/my-courses')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-md">
                            {formData.title || "Untitled Course"}
                        </h1>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-md uppercase ${currentCourse?.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                            }`}>
                            {currentCourse?.status || 'DRAFT'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePublish}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentCourse?.status === 'PUBLISHED'
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20'
                                }`}
                        >
                            {currentCourse?.status === 'PUBLISHED' ? 'Unpublish' : 'Publish Course'}
                        </button>
                        <button
                            onClick={handleUpdateCourse}
                            disabled={isUpdatingCourse || activeTab === 'curriculum'} // Disable save on curriculum tab since it's frontend only
                            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-violet-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdatingCourse ? <Loader2 className="animate-spin" size={16} /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                </header>

                {/* Tabs & Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar Tabs */}
                    <aside className="w-64 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-700 flex flex-col">
                        <div className="p-4 space-y-1">
                            <button
                                onClick={() => setActiveTab('curriculum')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'curriculum'
                                    ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <Layers size={20} />
                                Curriculum
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings'
                                    ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <Settings size={20} />
                                Course Settings
                            </button>
                        </div>
                    </aside>

                    {/* Main Area */}
                    <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0F172A] p-8">

                        {/* --- CURRICULUM TAB --- */}
                        {activeTab === 'curriculum' && (
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

                                {isModalOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Module</h3>
                                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                    <X size={20} />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Module Title</label>
                                                    <input
                                                        type="text"
                                                        value={newModuleTitle}
                                                        onChange={(e) => setNewModuleTitle(e.target.value)}
                                                        placeholder="e.g. Introduction to React"
                                                        autoFocus
                                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                                                        onKeyDown={(e) => e.key === 'Enter' && handleConfirmAddModule()}
                                                    />
                                                </div>

                                                <div className="flex items-center justify-end gap-3 pt-2">
                                                    <button
                                                        onClick={() => setIsModalOpen(false)}
                                                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleConfirmAddModule}
                                                        disabled={!newModuleTitle.trim() || isCreatingModule}
                                                        className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 flex items-center gap-2"
                                                    >
                                                        {isCreatingModule && <Loader2 className="animate-spin" size={16} />}
                                                        Add Module
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                                <Reorder.Item key={module._id} value={module} className="mb-4">
                                                    <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all shadow-sm group">
                                                        <div
                                                            className={`p-4 flex items-center gap-4 cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 ${activeModuleId === module._id ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}`}
                                                            onClick={() => setActiveModuleId(activeModuleId === module._id ? null : module._id)}
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
                                                                <button onClick={(e) => handleDeleteModule(module._id, e)} className="text-slate-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                                                                {activeModuleId === module._id
                                                                    ? <ChevronDown size={20} className="text-slate-400" />
                                                                    : <ChevronRight size={20} className="text-slate-400" />
                                                                }
                                                            </div>
                                                        </div>

                                                        {activeModuleId === module._id && (
                                                            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B]">
                                                                {/* Submodules List */}
                                                                <div className="space-y-3">
                                                                    {module.subModules && module.subModules.length > 0 && (
                                                                        <Reorder.Group
                                                                            axis="y"
                                                                            values={module.subModules}
                                                                            onReorder={(newOrder) => handleReorderSubModules(module._id, newOrder)}
                                                                        >
                                                                            {module.subModules.map((subModule, index) => (
                                                                                <Reorder.Item
                                                                                    key={subModule._id || index}
                                                                                    value={subModule}
                                                                                    onDragEnd={() => handleSubModuleDragEnd(module._id)}
                                                                                >
                                                                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-violet-200 dark:hover:border-violet-800 transition-colors mb-2">
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
                                                                                                onClick={() => handleTogglePublishSubModule(subModule)}
                                                                                                className={`p-1.5 rounded-md ${subModule.status === 'PUBLISHED' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'}`}
                                                                                                title={subModule.status === 'PUBLISHED' ? "Unpublish" : "Publish"}
                                                                                            >
                                                                                                {subModule.status === 'PUBLISHED' ? <Eye size={14} /> : <EyeOff size={14} />}
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => handleEditSubModule(subModule)}
                                                                                                className="p-1.5 rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50"
                                                                                                title="Edit"
                                                                                            >
                                                                                                <Settings size={14} />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => handleDeleteSubModule(subModule._id, module._id)}
                                                                                                className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                                                                title="Delete"
                                                                                            >
                                                                                                <Trash2 size={14} />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </Reorder.Item>
                                                                            ))}
                                                                        </Reorder.Group>
                                                                    )}

                                                                    {/* Add Lesson Button at Bottom */}
                                                                    <button
                                                                        onClick={() => handleOpenAddLesson(module._id)}
                                                                        className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-500 hover:text-violet-600 hover:border-violet-300 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all flex items-center justify-center gap-2"
                                                                    >
                                                                        <Plus size={16} /> Add Lesson
                                                                    </button>
                                                                </div>
                                                            </div>

                                                        )}
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SubModule Modal */}
                        <SubModuleModal
                            isOpen={isSubModuleModalOpen}
                            onClose={() => setIsSubModuleModalOpen(false)}
                            onSubmit={handleSubModuleSubmit}
                            initialData={editingSubModule}
                            isLoading={isCreatingSubModule || isUpdatingSubModule}
                        />

                        {/* --- SETTINGS TAB --- */}
                        {activeTab === 'settings' && (
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Course Settings</h2>

                                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">

                                        {/* Basic Info */}
                                        <div className="grid grid-cols-1 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
                                                <input
                                                    type="text" name="title" value={formData.title} onChange={handleInputChange}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                                                <textarea
                                                    name="description" value={formData.description} onChange={handleInputChange} rows="4"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                                                <div className="relative">
                                                    <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                                    <select
                                                        name="category" value={formData.category} onChange={handleInputChange}
                                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none appearance-none text-sm"
                                                    >
                                                        <option value="TECH" className="dark:bg-slate-800">Technology</option>
                                                        <option value="NON-TECH" className="dark:bg-slate-800">Non-Technology</option>
                                                        <option value="ASSESSMENT" className="dark:bg-slate-800">Assessment</option>
                                                        <option value="SOFT-SKILLS" className="dark:bg-slate-800">Soft Skills</option>
                                                        <option value="LANGUAGES" className="dark:bg-slate-800">Languages</option>
                                                        <option value="BUSINESS" className="dark:bg-slate-800">Business</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Level</label>
                                                <div className="relative">
                                                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                                    <select
                                                        name="level" value={formData.level} onChange={handleInputChange}
                                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none appearance-none text-sm"
                                                    >
                                                        <option value="BEGINNER" className="dark:bg-slate-800">Beginner</option>
                                                        <option value="INTERMEDIATE" className="dark:bg-slate-800">Intermediate</option>
                                                        <option value="ADVANCED" className="dark:bg-slate-800">Advanced</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                                    <select
                                                        name="currency" value={formData.currency} onChange={handleInputChange}
                                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none appearance-none text-sm"
                                                    >
                                                        <option value="INR" className="dark:bg-slate-800">INR (₹)</option>
                                                        <option value="USD" className="dark:bg-slate-800">USD ($)</option>
                                                        <option value="EUR" className="dark:bg-slate-800">EUR (€)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Price</label>
                                                <input
                                                    type="number" name="price" value={formData.price} onChange={handleInputChange}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Discount (%)</label>
                                                <input
                                                    type="number" name="discount" value={formData.discount} onChange={handleInputChange}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Media Update Section */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Course Thumbnail</label>
                                                <div
                                                    onClick={() => thumbnailInputRef.current?.click()}
                                                    className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-violet-500 cursor-pointer overflow-hidden relative group"
                                                >
                                                    {thumbnailPreview ? (
                                                        <>
                                                            <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                                Change Image
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                                            <ImageIcon size={32} />
                                                            <span className="text-xs mt-2">Upload Image</span>
                                                        </div>
                                                    )}
                                                    <input type="file" ref={thumbnailInputRef} onChange={handleThumbnailChange} className="hidden" accept="image/*" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Preview Video</label>
                                                <div
                                                    onClick={() => videoInputRef.current?.click()}
                                                    className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-violet-500 cursor-pointer overflow-hidden relative group"
                                                >
                                                    {videoPreview ? (
                                                        <video src={videoPreview} className="w-full h-full object-cover" controls />
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                                            <Video size={32} />
                                                            <span className="text-xs mt-2">Upload Video</span>
                                                        </div>
                                                    )}
                                                    <input type="file" ref={videoInputRef} onChange={handleVideoChange} className="hidden" accept="video/*" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div >
        </div >
    );
};

export default EditCourse;
