import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import {
    Plus, Edit3, Eye, MoreVertical, BookOpen,
    Calendar, Users, Clock
} from 'lucide-react';

const MyCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // For now, we only have one draft in localStorage
        const savedDraft = localStorage.getItem('courseDraft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                // Wrap in array since we might have multiple later
                setCourses([parsed.course]);
            } catch (e) {
                console.error("Failed to load courses", e);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex">
            <Sidebar />

            <div className="flex-1 md:ml-64 p-8">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Manage and track your curriculum
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/create-course')}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-lg shadow-teal-500/20"
                    >
                        <Plus size={18} />
                        Create New Course
                    </button>
                </header>

                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, index) => (
                            <div key={index} className="bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                                <div className="h-40 bg-gradient-to-br from-teal-500/10 to-blue-500/10 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-16 h-16 bg-white dark:bg-[#1a1c23] rounded-2xl flex items-center justify-center shadow-sm text-teal-500">
                                            <BookOpen size={32} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-lg uppercase tracking-wide ${course.status === 'PUBLISHED'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {course.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                                        {course.title || "Untitled Course"}
                                    </h3>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Users size={14} />
                                            <span>0 Students</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            <span>Draft</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => navigate('/create-course')}
                                            className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/10 hover:text-teal-600 dark:hover:text-teal-400 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Edit3 size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => navigate('/course-preview')}
                                            className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/10 hover:text-teal-600 dark:hover:text-teal-400 font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Eye size={16} />
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#1a1c23] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No courses yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first course</p>
                        <button
                            onClick={() => navigate('/create-course')}
                            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
                        >
                            Create Course
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
