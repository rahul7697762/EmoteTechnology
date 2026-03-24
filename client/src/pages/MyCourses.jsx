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

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const MyCourses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { facultyCourses: courses, isFetchingCourses } = useSelector((state) => state.course);
    const { isSidebarCollapsed } = useSelector((state) => state.ui);

    useEffect(() => {
        if (courses.length === 0) {
            dispatch(getFacultyCourses());
        }
    }, [dispatch, courses.length]);

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
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] flex transition-colors duration-300">
            <Sidebar />

            <div className={`flex-1 p-8 overflow-y-auto h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-6">
                        <div>
                            <h1 className="text-4xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>My Courses</h1>
                            <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm mt-1" style={{ fontFamily: MONO }}>
                                Manage your curriculum, track performance, and update content.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/create-course')}
                            className="bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] px-6 py-3 font-semibold uppercase tracking-widest text-xs transition-colors flex items-center gap-2"
                            style={{ fontFamily: MONO }}
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            Create New Course
                        </button>
                    </header>

                    {/* Search/Filter Bar */}
                    <div className="mb-10 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50" size={18} />
                            <input
                                type="text"
                                placeholder="Search your courses..."
                                className="w-full bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 pl-12 pr-4 py-3 text-[#1A1D2E] dark:text-[#E8EAF2] placeholder-[#6B7194] dark:placeholder-[#8B90B8] focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-colors text-sm"
                                style={{ fontFamily: MONO }}
                            />
                        </div>
                    </div>

                    {isFetchingCourses && courses.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-[#3B4FD8] dark:text-[#6C7EF5]" size={40} />
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
                        <div className="text-center py-24 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm">
                            <div className="w-20 h-20 bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-center mx-auto mb-6 text-[#3B4FD8]/40 dark:text-[#6C7EF5]/40">
                                <BookOpen size={40} strokeWidth={1} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-2" style={{ fontFamily: SERIF }}>No courses created yet</h3>
                            <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm mb-8 max-w-sm mx-auto tracking-wide" style={{ fontFamily: MONO }}>
                                Start sharing your knowledge by creating your first course today.
                            </p>
                            <button
                                onClick={() => navigate('/create-course')}
                                className="bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] px-8 py-3 text-xs font-semibold uppercase tracking-widest transition-colors inline-flex items-center gap-2"
                                style={{ fontFamily: MONO }}
                            >
                                <Plus size={16} strokeWidth={2.5} />
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
