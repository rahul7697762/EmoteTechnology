import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFacultyCourses, deleteCourse } from '../redux/slices/courseSlice';
import Sidebar from '../components/dashboard/Sidebar';
import {
    Plus, BookOpen, Loader2, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import CourseCard from '../components/dashboard/CourseCard';

const MyCourses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { myCourses: courses, isFetchingCourses } = useSelector((state) => state.course);
    const { isSidebarCollapsed } = useSelector((state) => state.ui);

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
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex transition-colors duration-300">
            <Sidebar />

            <div className={`flex-1 p-8 overflow-y-auto h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
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
                                <CourseCard
                                    key={course._id}
                                    course={course}
                                    handleDelete={handleDelete}
                                />
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
