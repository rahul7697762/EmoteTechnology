import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFacultyCourses, deleteCourse } from '../redux/slices/courseSlice';
import Sidebar from '../components/dashboard/Sidebar';
import {
    Plus, Edit3, Trash2, Eye, BookOpen,
    Users, Clock, MoreVertical, Loader2, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyCourses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { myCourses: courses, isFetchingCourses } = useSelector((state) => state.course);

    useEffect(() => {
        dispatch(getFacultyCourses());
    }, [dispatch]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            try {
                await dispatch(deleteCourse(id)).unwrap();
                toast.success("Course deleted successfully");
            } catch (error) {
                toast.error("Failed to delete course");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex">
            <Sidebar />

            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Courses</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Manage your curriculum, track performance, and update content.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/create-course')}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-violet-500/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create New Course
                        </button>
                    </header>

                    {/* Search/Filter Bar (Visual only for now) */}
                    <div className="mb-8 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search your courses..."
                                className="w-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {isFetchingCourses && courses.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-violet-600" size={40} />
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map((course) => (
                                <div key={course._id} className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">

                                    {/* Thumbnail Section */}
                                    <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                        {course.thumbnail ? (
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                                <BookOpen size={40} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-md ${course.status === 'PUBLISHED'
                                                ? 'bg-emerald-500/90 text-white'
                                                : 'bg-amber-500/90 text-white'
                                                }`}>
                                                {course.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-violet-500 transition-colors">
                                                {course.title || "Untitled Course"}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    {course.enrolledCount || 0} Students
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {new Date(course.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-3">
                                            <div className="flex gap-2 w-full">
                                                <button
                                                    onClick={() => navigate(`/edit-course/${course._id}`)}
                                                    className="flex-1 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                                                >
                                                    <Edit3 size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(course._id, e)}
                                                    className="p-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white dark:bg-[#1E293B] rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <BookOpen size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No courses created yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                Start sharing your knowledge by creating your first course today.
                            </p>
                            <button
                                onClick={() => navigate('/create-course')}
                                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-violet-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Create Course
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;
