import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveCourse, getCourseDetails } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import {
    Save, Eye, ChevronRight, MoreVertical, Plus,
    Video, FileText, HelpCircle, Upload, GripVertical,
    Filter, ChevronDown, LayoutGrid, List, Trash2, Image as ImageIcon
} from 'lucide-react';

const CreateCourse = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { state: navState } = useLocation();
    const existingCourseId = navState?.courseId;

    // Dummy Data
    const [course, setCourse] = useState({
        _id: 'new',
        title: "Course Title",
        status: "DRAFT",
        thumbnail: null,
        description: "",
        price: 0
    });

    const getIconForType = (type) => {
        switch (type) {
            case 'video': return Video;
            case 'pdf': return FileText;
            case 'presentation': return LayoutGrid;
            case 'quiz': return HelpCircle;
            default: return FileText;
        }
    };

    const handleCourseTitleChange = (e) => {
        setCourse({ ...course, title: e.target.value });
    };

    const [modules, setModules] = useState([
        {
            id: 1,
            title: "Module 1: Foundations",
            active: true,
            prerequisite: null,
            description: "This module covers the fundamental principles of UI design including typography, spacing, and grid systems.",
            items: [
                { id: 1, type: "video", title: "1.1 Introduction to Visual Hierarchy", meta: "VIDEO LESSON • 12:45 min", color: "blue" },
                { id: 2, type: "pdf", title: "The Psychology of Color Theory", meta: "READING MATERIAL • 2.4 MB", color: "red" },
                { id: 3, type: "quiz", title: "Foundations Knowledge Check", meta: "ASSESSMENT • 10 Questions", color: "amber" },
            ]
        },
        { id: 2, title: "Module 2: Layout Systems", active: false, prerequisite: 1, description: "Description for Module 2", items: [] },
        { id: 3, title: "Module 3: Advanced Patterns", active: false, prerequisite: 2, description: "Description for Module 3", items: [] },
    ]);

    const activeModule = modules.find(m => m.active) || modules[0];

    // Debugging: Log active module
    useEffect(() => {
        console.log("Current Active Module:", activeModule);
    }, [activeModule]);

    if (!activeModule && modules.length > 0) {
        // Fallback if something weird happens
        console.warn("No active module found, defaulting to first");
    }

    const handleModuleTitleChange = (e) => {
        const newTitle = e.target.value;
        setModules(modules.map(m =>
            m.id === activeModule.id ? { ...m, title: newTitle } : m
        ));
    };

    const handleModuleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setModules(modules.map(m =>
            m.id === activeModule.id ? { ...m, description: newDescription } : m
        ));
    };

    const handleModuleClick = (moduleId) => {
        setModules(modules.map(m => ({
            ...m,
            active: m.id === moduleId
        })));
    };

    const handlePrerequisiteToggle = () => {
        if (activeModule.prerequisite) {
            // Turn off
            setModules(modules.map(m =>
                m.id === activeModule.id ? { ...m, prerequisite: null } : m
            ));
        } else {
            // Turn on - default to previous module if exists
            const currentIndex = modules.findIndex(m => m.id === activeModule.id);
            if (currentIndex > 0) {
                setModules(modules.map(m =>
                    m.id === activeModule.id ? { ...m, prerequisite: modules[currentIndex - 1].id } : m
                ));
            } else {
                alert("No previous module available to set as prerequisite.");
            }
        }
    };

    const handlePrerequisiteChange = (prevModuleId) => {
        setModules(modules.map(m =>
            m.id === activeModule.id ? { ...m, prerequisite: Number(prevModuleId) } : m
        ));
    };

    const addNewModule = () => {
        const newId = modules.length + 1;
        const newModule = {
            id: newId,
            title: `Module ${newId}: New Module`,
            active: true, // Make the new module active
            prerequisite: modules.length > 0 ? modules[modules.length - 1].id : null,
            items: []
        };

        // Deactivate other modules and add the new one
        const updatedModules = modules.map(m => ({ ...m, active: false }));
        setModules([...updatedModules, newModule]);
    };

    const deleteModule = (moduleId, e) => {
        e.stopPropagation(); // Prevent activating the module while deleting
        if (!window.confirm("Are you sure you want to delete this module? All lessons within it will be lost.")) {
            return;
        }

        const newModules = modules.filter(m => m.id !== moduleId);

        // Cleanup prerequisites that pointed to this module
        const cleanedModules = newModules.map(m => ({
            ...m,
            prerequisite: m.prerequisite === moduleId ? null : m.prerequisite
        }));

        // If we deleted the active module, set a new active one
        if (activeModule.id === moduleId) {
            if (cleanedModules.length > 0) {
                cleanedModules[0].active = true;
            }
        }

        setModules(cleanedModules);
    };

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCourse(prev => ({ ...prev, thumbnail: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newItems = files.map((file, index) => {
            const fileType = file.name.split('.').pop().toLowerCase();
            let type = "other";
            let color = "gray";
            let meta = "FILE";

            if (['mp4', 'mov', 'avi'].includes(fileType)) {
                type = "video";
                color = "blue";
                meta = "VIDEO LESSON";
            } else if (['pdf', 'doc', 'docx'].includes(fileType)) {
                type = "pdf";
                color = "red";
                meta = "READING MATERIAL";
            } else if (['ppt', 'pptx'].includes(fileType)) {
                type = "presentation";
                color = "orange";
                meta = "PRESENTATION";
            }

            return {
                id: Date.now() + index,
                type,
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                meta: `${meta} • ${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                color
            };
        });

        setModules(modules.map(m =>
            m.id === activeModule.id
                ? { ...m, items: [...m.items, ...newItems] }
                : m
        ));

        // Reset input
        e.target.value = null;
    };

    const handleItemTitleChange = (e, itemId) => {
        const newTitle = e.target.value;
        const updatedItems = activeModule.items.map(item =>
            item.id === itemId ? { ...item, title: newTitle } : item
        );

        setModules(modules.map(m =>
            m.id === activeModule.id ? { ...m, items: updatedItems } : m
        ));
    };

    const deleteItem = (itemId) => {
        const updatedItems = activeModule.items.filter(item => item.id !== itemId);
        setModules(modules.map(m =>
            m.id === activeModule.id ? { ...m, items: updatedItems } : m
        ));
    };

    // Save/Load Logic
    const [isSaving, setIsSaving] = useState(false);
    const [isUnsaved, setIsUnsaved] = useState(false); // Track if there are unsaved changes

    // Mark as unsaved on changes
    useEffect(() => {
        // Simple dirtiness check or just set true on setters (omitted for brevity, can be refined)
    }, [course, modules]);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Initial Load
    useEffect(() => {
        const loadCourse = async () => {
            if (existingCourseId) {
                try {
                    console.log("Fetching course:", existingCourseId);
                    console.log("Fetching course:", existingCourseId);
                    const res = await getCourseDetails(existingCourseId);
                    if (res.success) {
                        const { course: fetchedCourse, modules: fetchedModules } = res.data;

                        // Merge fetched data
                        setCourse({
                            _id: fetchedCourse._id,
                            title: fetchedCourse.title,
                            status: fetchedCourse.status,
                            thumbnail: fetchedCourse.thumbnail,
                            description: fetchedCourse.description || "",
                            price: fetchedCourse.price || 0,
                            category: fetchedCourse.category,
                            difficulty: fetchedCourse.level
                        });

                        // Map backend modules to frontend structure if not already matched
                        // The backend `getCourseDetails` already tries to match structure, 
                        // but let's ensure 'active' state is handled (first module active)
                        const mappedModules = fetchedModules.map((m, idx) => ({
                            ...m,
                            active: idx === 0,
                            // Ensure items array exists
                            items: m.items || []
                        }));
                        setModules(mappedModules.length > 0 ? mappedModules : [
                            { id: 1, title: "Module 1", active: true, items: [] }
                        ]);
                    }
                } catch (error) {
                    console.error("Failed to fetch course:", error);
                    alert("Failed to load course details.");
                }
            } else {
                // Try Local Draft
                const savedDraft = localStorage.getItem('courseDraft');
                if (savedDraft) {
                    // logic to load draft
                    try {
                        const parsed = JSON.parse(savedDraft);
                        // Optional: Prompt user if they want to load draft? 
                        // For now just load it if we are in "Create New" mode
                        if (parsed.course) setCourse({ ...parsed.course, _id: 'new' });
                        if (parsed.modules) setModules(parsed.modules);
                    } catch (e) { }
                }
            }
        };
        loadCourse();
    }, [existingCourseId]);


    const saveCourseToBackend = async (statusOverride = null) => {
        setIsSaving(true);
        try {
            const payload = {
                course: {
                    ...course,
                    status: statusOverride || course.status
                },
                modules: modules.map((m, i) => ({
                    title: m.title,
                    description: m.description,
                    items: m.items.map(item => ({
                        title: item.title,
                        type: item.type,
                        // Basic mapping, file uploads would need separate handling usually
                        // treating 'file' as text/placeholder for now as per previous impl
                    }))
                }))
            };

            const res = await saveCourse(payload);

            if (res.success) {
                const savedId = res.data.courseId;
                setCourse(prev => ({ ...prev, _id: savedId, status: statusOverride || prev.status }));

                // Clear local draft to avoid confusion? 
                // localStorage.removeItem('courseDraft');

                // Update URL if it was new
                if (course._id === 'new' && savedId) {
                    // Could replace URL but might be disruptive, 
                    // users often stay on page to continue editing
                }

                return true;
            }
        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to save course: " + (error.response?.data?.message || error.message));
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveDraft = async () => {
        await saveCourseToBackend("DRAFT");
    };




    const handlePreview = () => {
        saveCourseToBackend();
        alert("Preview feature coming soon!");
    };

    const handlePublish = async () => {
        if (window.confirm("Are you sure you want to publish this course?")) {
            const success = await saveCourseToBackend("PUBLISHED");
            if (success) {
                alert("Success! Your course has been published.");
                navigate('/dashboard');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex">
            {/* Main App Sidebar */}
            <Sidebar />

            {/* Course Builder Content - offset by main sidebar width */}
            <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">

                {/* Top Header */}
                <header className="h-16 bg-white dark:bg-[#1a1c23] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Courses</span>
                        <ChevronRight size={16} className="mx-2 text-gray-400" />
                        <div className="relative group">
                            <input
                                type="text"
                                value={course.title}
                                onChange={handleCourseTitleChange}
                                className="font-bold text-lg text-gray-900 dark:text-white mr-3 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-teal-500 focus:ring-0 transition-all px-1 py-0.5 w-[300px]"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 pointer-events-none">
                                ✎
                            </span>
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${course.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                            {course.status}
                        </span>

                        {/* Premium Thumbnail Trigger */}
                        <div className="relative ml-4 group/image">
                            <input
                                type="file"
                                ref={imageInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />

                            <div
                                onClick={() => imageInputRef.current.click()}
                                className={`w-16 h-10 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer relative transition-all hover:ring-2 hover:ring-teal-500 hover:ring-offset-1 dark:ring-offset-[#1a1c23] ${!course.thumbnail ? 'bg-gray-100 dark:bg-gray-800 flex items-center justify-center' : ''}`}
                            >
                                {course.thumbnail ? (
                                    <>
                                        <img src={course.thumbnail} alt="Cover" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                            <ImageIcon size={14} className="text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-gray-400 group-hover/image:text-teal-500 transition-colors">
                                        <ImageIcon size={18} />
                                    </div>
                                )}
                            </div>

                            {/* Tooltip */}
                            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/image:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                {course.thumbnail ? 'Change Cover' : 'Add Cover'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSaveDraft}
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <span className="animate-spin">↻</span> Saving...
                                </>
                            ) : (
                                "Save Draft"
                            )}
                        </button>
                        <button
                            onClick={handlePreview}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <Eye size={18} />
                            Preview
                        </button>
                        <button
                            onClick={handlePublish}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-lg ${course.status === 'PUBLISHED'
                                ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20 text-white cursor-default'
                                : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/20 text-white'
                                }`}
                        >
                            {course.status === 'PUBLISHED' ? 'Published' : 'Publish Course'}
                        </button>
                    </div>
                </header>

                {/* Builder Layout */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Internal Sidebar - Course Structure */}
                    <aside className="w-80 bg-white dark:bg-[#1a1c23]/50 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Course Structure</h2>
                        </div>

                        <div className="flex-1 p-4 space-y-4">
                            {modules.map((module) => (
                                <div key={module.id} className="group">
                                    <div
                                        onClick={() => handleModuleClick(module.id)}
                                        className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ${module.active
                                            ? 'bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-900/20 border-l-4 border-teal-500 shadow-sm pl-2'
                                            : 'hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent pl-3'
                                            }`}>
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                                                <GripVertical size={16} />
                                            </div>
                                            <span className={`text-sm font-medium truncate ${module.active ? 'text-teal-700 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                {module.title}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => deleteModule(module.id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-all"
                                                title="Delete Module"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            {module.active ? <ChevronDown size={16} className="text-teal-500" /> : <ChevronRight size={16} className="text-gray-400" />}
                                        </div>
                                    </div>

                                    {/* Lessons List (Only if active for demo) */}
                                    {module.active && (
                                        <div className="mt-2 ml-8 space-y-1 relative border-l-2 border-gray-100 dark:border-gray-800 pl-4">
                                            {module.items.map((item, idx) => (
                                                <div key={idx} className="py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 cursor-pointer flex items-center justify-between group/item">
                                                    <span>{typeof item === 'string' ? item : item.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={addNewModule}
                                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl hover:border-teal-500 hover:text-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all flex items-center justify-center gap-2 text-sm font-medium group"
                            >
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 transition-colors">
                                    <Plus size={16} />
                                </div>
                                Add New Module
                            </button>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-[#0a0a0f]">
                        <div className="max-w-4xl mx-auto space-y-8">

                            {/* Module Header Section */}
                            {!activeModule ? (
                                <div className="text-center p-10 text-gray-500">Select or create a module to start editing.</div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2 bg-white dark:bg-[#1a1c23] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                            <span className="text-xs font-bold text-teal-500 uppercase tracking-wide">Module Title</span>
                                            <input
                                                type="text"
                                                value={activeModule.title}
                                                onChange={handleModuleTitleChange}
                                                className="w-full text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-teal-500 focus:ring-0 transition-all px-0 py-1"
                                                placeholder="Enter module title..."
                                            />
                                            <textarea
                                                value={activeModule.description || ''}
                                                onChange={handleModuleDescriptionChange}
                                                className="w-full text-gray-600 dark:text-gray-400 text-sm leading-relaxed bg-transparent border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-0 transition-colors resize-none overflow-hidden"
                                                placeholder="Add a brief description for this module..."
                                                rows={3}
                                            />
                                        </div>

                                        <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-center">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-gray-900 dark:text-white">Prerequisites</span>
                                                <div
                                                    onClick={handlePrerequisiteToggle}
                                                    className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors ${activeModule.prerequisite ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                                                        }`}
                                                >
                                                    <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${activeModule.prerequisite ? 'left-1 translate-x-6' : 'left-1'
                                                        }`}></span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                Require students to complete a previous module before starting this one.
                                            </p>

                                            {activeModule.prerequisite ? (
                                                <div className="relative">
                                                    <select
                                                        value={activeModule.prerequisite}
                                                        onChange={(e) => handlePrerequisiteChange(e.target.value)}
                                                        className="w-full appearance-none bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    >
                                                        {modules
                                                            .filter(m => m.id !== activeModule.id) // Can't require itself
                                                            .map(m => (
                                                                <option key={m.id} value={m.id}>{m.title}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between text-sm bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 opacity-50 cursor-not-allowed">
                                                    <span className="text-gray-600 dark:text-gray-300">None required</span>
                                                    <ChevronRight size={16} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Items */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <List size={20} className="text-teal-500" />
                                                Content Items
                                            </h2>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                                <Filter size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {activeModule.items.map((item) => {
                                                const ItemIcon = getIconForType(item.type);
                                                return (
                                                    <div key={item.id} className="bg-white dark:bg-[#1e2028] p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all duration-200 group flex items-center gap-4 transform hover:-translate-y-0.5">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${item.color}-500/10 text-${item.color}-500 shrink-0`}>
                                                            <ItemIcon size={24} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className={`text-xs font-bold text-${item.color}-500 mb-0.5 uppercase tracking-wide`}>
                                                                {item.meta}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={item.title}
                                                                onChange={(e) => handleItemTitleChange(e, item.id)}
                                                                className="w-full font-semibold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-200 focus:border-teal-500 focus:ring-0 p-0 truncate transition-colors"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => deleteItem(item.id)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                                                title="Delete Lesson"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                            <div className="p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                                                                <GripVertical size={20} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Upload Area */}
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div className="w-16 h-16 bg-white dark:bg-[#1a1c23] rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <Upload size={32} className="text-teal-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            Drop content to upload
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
                                            Support for MP4, PDF, PPTX, and SCORM files. Up to 500MB per file.
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                multiple
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current.click()}
                                                className="px-6 py-2.5 bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                                            >
                                                <Plus size={18} />
                                                New Lesson
                                            </button>
                                            <button
                                                onClick={() => fileInputRef.current.click()}
                                                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-teal-500/20"
                                            >
                                                <Upload size={18} />
                                                Bulk Upload
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};


export default CreateCourse;
