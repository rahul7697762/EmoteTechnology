import React, { useEffect, useState } from 'react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentCourses } from '../redux/slices/courseSlice';
import { Search, BookOpen, ChevronRight, Clock, PlayCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../redux/slices/uiSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] font-sans flex transition-colors duration-300">
            <StudentSidebar />

            <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center mb-6">
                    <button 
                        onClick={() => dispatch(toggleSidebar())} 
                        className="p-2 -ml-2 text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors cursor-pointer"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Hero / Welcome Section */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 bg-[#3B4FD8] text-white p-6 md:p-10 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-[#F5A623] font-bold uppercase tracking-[0.2em] text-[10px]" style={{ fontFamily: MONO }}>
                            <Clock size={14} />
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: SERIF }}>
                            Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
                        </h1>
                        <p className="text-white/80 max-w-lg text-sm font-medium">
                            You've made great progress this week. Pick up right where you left off and keep learning!
                        </p>
                    </div>

                    {/* Visual Decoration */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rotate-45 pointer-events-none"></div>

                    {/* Stats Cards Row */}
                    <div className="flex gap-4 relative z-10 w-full md:w-auto mt-6 md:mt-0">
                        <div className="bg-white/10 backdrop-blur-md p-6 border border-white/20 text-center min-w-[140px] shadow-inner">
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2" style={{ fontFamily: MONO }}>In Progress</p>
                            <h4 className="text-4xl font-bold text-white shadow-sm" style={{ fontFamily: SERIF }}>{inProgressCount}</h4>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 border border-white/20 text-center min-w-[140px] shadow-inner">
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2" style={{ fontFamily: MONO }}>Completed</p>
                            <h4 className="text-4xl font-bold text-[#F5A623]" style={{ fontFamily: SERIF }}>{completedCount}</h4>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10">
                    <div className="flex bg-[#F7F8FF] dark:bg-[#1A1D2E] p-1 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 w-full md:w-auto overflow-x-auto">
                        {['ALL', 'ACTIVE', 'COMPLETED'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex-1 md:flex-none text-center ${filter === tab
                                    ? 'bg-[#3B4FD8] text-white'
                                    : 'text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 hover:text-[#1A1D2E] dark:hover:text-[#E8EAF2]'
                                    }`}
                                style={{ fontFamily: MONO }}
                            >
                                {tab === 'ALL' ? 'All Courses' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7194] dark:text-[#8B90B8]" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH MY COURSES..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-[320px] pl-12 pr-4 py-4 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-white dark:bg-[#252A41] focus:outline-none focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-colors text-[10px] font-bold uppercase tracking-widest text-[#1A1D2E] dark:text-[#E8EAF2] placeholder:text-[#6B7194] dark:placeholder:text-[#8B90B8]"
                            style={{ fontFamily: MONO }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                         <div className="w-10 h-10 border-[3px] border-[#3B4FD8]/20 border-t-[#3B4FD8] dark:border-[#6C7EF5]/20 dark:border-t-[#6C7EF5] rounded-full animate-spin"></div>
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredCourses.map(course => (
                            <div key={course._id} className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 hover:shadow-lg hover:border-[#3B4FD8]/30 dark:hover:border-[#6C7EF5]/30 transition-all duration-300 group cursor-pointer flex flex-col pt-0">
                                <div className="h-48 relative overflow-hidden bg-[#1A1D2E]">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-[#1A1D2E] flex items-center justify-center text-[#3B4FD8]">
                                            <BookOpen size={48} className="opacity-50" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md shadow-sm ${course.status === 'COMPLETED'
                                            ? 'bg-[#3B4FD8] text-white'
                                            : 'bg-[#F5A623] text-[#1A1D2E]'
                                            }`} style={{ fontFamily: MONO }}>
                                            {course.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-2xl text-[#1A1D2E] dark:text-[#E8EAF2] mb-4 line-clamp-2 leading-tight group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors" style={{ fontFamily: SERIF }}>
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-[10px] text-[#6B7194] dark:text-[#8B90B8] font-bold uppercase tracking-[0.2em] mb-8" style={{ fontFamily: MONO }}>
                                            <span className="bg-[#3B4FD8]/10 text-[#3B4FD8] dark:bg-[#6C7EF5]/10 dark:text-[#6C7EF5] px-2 py-1">{course.totalLessons || 0} Lessons</span>
                                            <span>{Math.round(course.totalDuration / 60) || 0}h Video</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">

                                        <div className="flex justify-between items-end mb-3">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Progress</span>
                                            <span className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>{Math.round(course.progress)}%</span>
                                        </div>

                                        <div className="w-full bg-[#F7F8FF] dark:bg-[#1A1D2E] h-1.5 mb-8 overflow-hidden rounded-none border border-[#3B4FD8]/5 dark:border-[#6C7EF5]/5">
                                            <div
                                                className="bg-[#F5A623] h-full transition-all duration-1000 ease-out relative"
                                                style={{ width: `${course.progress}%` }}
                                            >
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/course/${course.slug || course.courseId?._id || course._id}/learn`)}
                                            className="w-full py-4 bg-[#3B4FD8] dark:bg-[#6C7EF5] hover:bg-[#2f3fab] dark:hover:bg-[#5b6cd4] text-white dark:text-[#1A1D2E] font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-3 border border-transparent shadow-sm"
                                            style={{ fontFamily: MONO }}
                                        >
                                            <PlayCircle size={16} />
                                            Continue Learning
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-center">
                        <div className="w-20 h-20 bg-[#F7F8FF] dark:bg-[#1A1D2E] flex items-center justify-center mb-8 text-[#3B4FD8] dark:text-[#6C7EF5]">
                            <BookOpen size={40} />
                        </div>
                        <h3 className="text-3xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-4" style={{ fontFamily: SERIF }}>No courses found</h3>
                        <p className="text-[#6B7194] dark:text-[#8B90B8] max-w-md text-center mb-8">
                            {searchTerm || filter !== 'ALL'
                                ? "We couldn't find any courses matching your search. Try different keywords or filters."
                                : "You haven't enrolled in any courses yet. It's the perfect time to start learning!"}
                        </p>
                        {!searchTerm && filter === 'ALL' && (
                            <button
                                onClick={() => navigate('/courses')}
                                className="px-8 py-4 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] font-bold text-[10px] uppercase tracking-widest transition-colors shadow-sm" style={{ fontFamily: MONO }}>
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
