import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFacultyCourseDetails, updateCourse, updateCourseStatus } from '../redux/slices/courseSlice';
import Sidebar from '../components/dashboard/Sidebar';
import {
    LayoutDashboard, Settings, Layers, Save, ArrowLeft, Loader2, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    getModulesByCourse, createModule, updateModule,
    deleteModule, reorderModules, publishModule, unpublishModule,
    getSubModules, createSubModule, updateSubModule, deleteSubModule,
    publishSubModule, unpublishSubModule, reorderSubModules
} from '../redux/slices/moduleSlice';
import SubModuleModal from '../components/dashboard/edit-course/SubModuleModal';

// Modular Components
import CourseSettings from '../components/dashboard/edit-course/CourseSettings';
import CurriculumTab from '../components/dashboard/edit-course/CurriculumTab';

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

    // Toggle Module expansion and fetch submodules if needed
    const handleToggleActive = (moduleId) => {
        if (activeModuleId === moduleId) {
            setActiveModuleId(null);
        } else {
            setActiveModuleId(moduleId);
            // Check if submodules already loaded
            const module = modules.find(m => m._id === moduleId);
            if (module && !module.subModulesLoaded) {
                dispatch(getSubModules(moduleId));
            }
        }
    };

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
                            onClick={() => navigate(`/preview/course/${id}`)}
                            className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                        >
                            <Eye size={18} />
                            Preview
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isUpdatingCourseStatus}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentCourse?.status === 'PUBLISHED'
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20'
                                }`}
                        >
                            {currentCourse?.status === 'PUBLISHED' ? 'Unpublish' : 'Publish Course'}
                        </button>
                        <button
                            onClick={handleUpdateCourse}
                            disabled={isUpdatingCourse || activeTab === 'curriculum'} // Disable save on curriculum tab since it's backend-first
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
                            <CurriculumTab
                                localModules={localModules}
                                handleReorder={handleReorder}
                                saveReorder={saveReorder}
                                isReordering={isReordering}
                                isReorderingModules={isReorderingModules}
                                isModalOpen={isModalOpen}
                                onCloseModal={() => setIsModalOpen(false)}
                                onConfirmAddModule={handleConfirmAddModule}
                                newModuleTitle={newModuleTitle}
                                setNewModuleTitle={setNewModuleTitle}
                                isCreatingModule={isCreatingModule}
                                handleAddModuleClick={handleAddModuleClick}
                                activeModuleId={activeModuleId}
                                toggleActive={handleToggleActive}
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
                        )}

                        {/* SubModule Modal - Kept here as it's separate from main curriculum flow, or could move inside CurriculumTab too if preferred. 
                            Since it's a global modal for the page, keeping here is fine, but CurriculumTab already has all the handlers passed if we wanted to move it. 
                            Wait, the SubModuleModal import is here. I should probably leave it here or move it. 
                            Let's keep it here for now as it's not strictly part of the "List" UI but triggered by it. 
                        */}
                        <SubModuleModal
                            isOpen={isSubModuleModalOpen}
                            onClose={() => setIsSubModuleModalOpen(false)}
                            onSubmit={handleSubModuleSubmit}
                            initialData={editingSubModule}
                            isLoading={isCreatingSubModule || isUpdatingSubModule}
                        />

                        {/* --- SETTINGS TAB --- */}
                        {activeTab === 'settings' && (
                            <CourseSettings
                                formData={formData}
                                handleInputChange={handleInputChange}
                                thumbnailPreview={thumbnailPreview}
                                handleThumbnailChange={handleThumbnailChange}
                                videoPreview={videoPreview}
                                handleVideoChange={handleVideoChange}
                                thumbnailInputRef={thumbnailInputRef}
                                videoInputRef={videoInputRef}
                            />
                        )}

                    </main>
                </div>
            </div >
        </div >
    );
};

export default EditCourse;
