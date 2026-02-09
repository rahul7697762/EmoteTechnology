import React, { useEffect, useState } from 'react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentCourses } from '../redux/slices/courseSlice';
import { Search, BookOpen, ChevronRight, Clock, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentCourses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { isSidebarCollapsed } = useSelector((state) => state.ui);
    const { studentCourses: courses, isFetchingStudentCourses: loading } = useSelector((state) => state.course);

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, COMPLETED

    useEffect(() => {
        if (courses.length === 0) {
            dispatch(getStudentCourses());
        }
    }, [dispatch, courses.length]);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'ALL' || course.status === filter;
        return matchesSearch && matchesFilter;
    });

    // Stats calculation
    const inProgressCount = courses.filter(c => c.status === 'ACTIVE').length;
    const completedCount = courses.filter(c => c.status === 'COMPLETED').length;
    const totalHours = courses.reduce((acc, curr) => acc + (curr.totalDuration || 0), 0); // Assuming totalDuration is in hours or available

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white font-sans flex transition-colors duration-300">
            <StudentSidebar />

            <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>

                {/* Hero / Welcome Section */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 bg-white dark:bg-[#1a1c23] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2 text-teal-500 font-semibold tracking-wide uppercase text-xs">
                            <Clock size={14} />
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                            Welcome back, <span className="text-teal-500">{user?.name?.split(' ')[0] || 'Student'}</span>! 👋
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg">
                            You've made great progress this week. Pick up right where you left off and keep learning!
                        </p>
                    </div>

                    {/* Visual Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    {/* Stats Cards Row */}
                    <div className="flex gap-4 relative z-10">
                        <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl min-w-[140px] border border-teal-100 dark:border-teal-900/30">
                            <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">In Progress</h4>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{inProgressCount}</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl min-w-[140px] border border-purple-100 dark:border-purple-900/30">
                            <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Completed</h4>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{completedCount}</p>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                    <div className="flex bg-gray-100 dark:bg-[#1a1c23] p-1 rounded-xl">
                        {['ALL', 'ACTIVE', 'COMPLETED'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === tab
                                    ? 'bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab === 'ALL' ? 'All Courses' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search my courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1a1c23] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredCourses.map(course => (
                            <div key={course._id} className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300 group cursor-pointer flex flex-col">
                                <div className="h-48 relative overflow-hidden">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-teal-50 dark:bg-teal-900/10 flex items-center justify-center text-teal-500">
                                            <BookOpen size={48} className="opacity-50" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg ${course.status === 'COMPLETED'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white/90 text-teal-700 dark:bg-black/80 dark:text-teal-400'
                                            }`}>
                                            {course.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-7 flex flex-col flex-1">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-teal-500 transition-colors">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">
                                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{course.totalLessons || 0} Lessons</span>
                                            <span>•</span>
                                            <span>{Math.round(course.totalDuration / 60) || 0}h Video</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">

                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Progress</span>
                                            <span className="text-lg font-black text-teal-500">{Math.round(course.progress)}%</span>
                                        </div>

                                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-6 overflow-hidden">
                                            <div
                                                className="bg-linear-to-r from-teal-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out relative"
                                                style={{ width: `${course.progress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/course/${course.slug || course.courseId?._id || course._id}/learn`)}
                                            className="w-full mt-4 px-4 py-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
                                        >
                                            <PlayCircle size={18} />
                                            Continue Learning
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1a1c23] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-300 dark:text-gray-600">
                            <BookOpen size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No courses found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md text-center mb-8">
                            {searchTerm || filter !== 'ALL'
                                ? "We couldn't find any courses matching your search. Try different keywords or filters."
                                : "You haven't enrolled in any courses yet. It's the perfect time to start learning something new!"}
                        </p>
                        {!searchTerm && filter === 'ALL' && (
                            <button
                                onClick={() => navigate('/courses')}
                                className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 hover:-translate-y-1">
                                Browse Courses
                            </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentCourses;
