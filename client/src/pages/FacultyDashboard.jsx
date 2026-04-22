import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/dashboard/Sidebar';
import StatsCard from '../components/dashboard/StatsCard';
import RecentCoursesTable from '../components/dashboard/RecentCoursesTable';
import { Users, BookOpen, DollarSign, Star, Search, Bell, Settings, LogOut, User, Menu } from 'lucide-react';
import { getFacultyCourses, getDashboardStats } from '../redux/slices/courseSlice';
import { logout } from '../redux/slices/authSlice';
import { toggleSidebar } from '../redux/slices/uiSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const FacultyDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { facultyCourses, stats, isFetchingCourses, isFetchingStats } = useSelector((state) => state.course);
    const courses = facultyCourses || [];
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const userImage = user?.profile?.avatar;

    useEffect(() => {
        dispatch(getFacultyCourses());
        dispatch(getDashboardStats());
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    };

    const { isSidebarCollapsed } = useSelector((state) => state.ui);

    if (isFetchingCourses && isFetchingStats) {
        return (
            <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#3B4FD8] border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] transition-colors duration-300">
            <Sidebar />

            <main className={`p-4 md:p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Top Header Row: Search & Profile */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 md:mb-10 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-4 md:pb-6">
                    {/* Mobile Menu (Visible only on mobile) */}
                    <div className="flex items-center justify-start w-full md:hidden">
                        <button 
                            onClick={() => dispatch(toggleSidebar())} 
                            className="p-2 -ml-2 text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-black/5 dark:hover:bg-[#E8EAF2]/10 transition-colors rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-xl">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7194] dark:text-[#8B90B8]" size={18} />
                        <input
                            type="text"
                            placeholder="Search your courses..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1A1D2E] border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 text-[#1A1D2E] dark:text-[#E8EAF2] placeholder-[#6B7194] dark:placeholder-[#8B90B8] focus:outline-none focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-colors font-mono text-sm"
                            style={{ fontFamily: MONO }}
                        />
                    </div>

                    {/* Right Side: Notification & Profile */}
                    <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                        <button className="relative text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors">
                            <Bell size={22} />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F5A623] border border-[#F7F8FF] dark:border-[#1A1D2E]"></span>
                        </button>

                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-4 pl-6 border-l border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 focus:outline-none"
                            >
                                <div className="text-right hidden sm:block">
                                    <h4 className="text-sm font-semibold text-[#1A1D2E] dark:text-[#E8EAF2] leading-tight" style={{ fontFamily: SERIF }}>
                                        {user?.name || 'Faculty Member'}
                                    </h4>
                                    <p className="text-[10px] text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mt-0.5" style={{ fontFamily: MONO }}>
                                        Instructor
                                    </p>
                                </div>
                                {userImage ? (
                                    <img
                                        src={userImage}
                                        alt="Profile"
                                        className={`w-10 h-10 object-cover border transition-colors ${isProfileOpen ? 'border-[#3B4FD8] dark:border-[#6C7EF5]' : 'border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20'}`}
                                    />
                                ) : (
                                    <div className={`w-10 h-10 flex items-center justify-center bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 border transition-colors ${isProfileOpen ? 'border-[#3B4FD8] text-[#3B4FD8] dark:border-[#6C7EF5] dark:text-[#6C7EF5]' : 'border-[#3B4FD8]/20 text-[#6B7194] dark:border-[#6C7EF5]/20 dark:text-[#8B90B8]'}`}>
                                        <User size={18} />
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-[#252A41] shadow-2xl border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="p-1">
                                        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-[#F7F8FF] dark:hover:bg-[#1A1D2E] transition-colors" style={{ fontFamily: MONO }}>
                                            <Settings size={14} /> Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#E25C5C] hover:bg-[#E25C5C]/10 transition-colors text-left" style={{ fontFamily: MONO }}
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-6 md:mb-10">
                    <h1 className="text-3xl md:text-4xl font-semibold mb-2" style={{ fontFamily: SERIF }}>
                        Welcome back, <span className="italic text-[#3B4FD8] dark:text-[#6C7EF5]">{user?.name?.split(' ')[0] || 'Faculty'}</span>
                    </h1>
                    <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm font-mono tracking-tight">
                        Here's what's happening with your courses today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    <StatsCard
                        title="Total Revenue"
                        value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
                        icon={DollarSign}
                        color="indigo"
                    />
                    <StatsCard
                        title="Total Students"
                        value={stats?.totalStudents || 0}
                        icon={Users}
                        color="amber"
                    />
                    <StatsCard
                        title="Active Courses"
                        value={stats?.activeCourses || 0}
                        icon={BookOpen}
                        color="indigo"
                    />
                    <StatsCard
                        title="Average Rating"
                        value={stats?.averageRating || 0}
                        icon={Star}
                        color="amber"
                    />
                </div>

                {/* Recent Courses Section */}
                <section>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-4">
                        <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: SERIF }}>Your Recent Courses</h2>
                        <button
                            onClick={() => navigate('/my-courses')}
                            className="px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#3B4FD8] dark:text-[#6C7EF5] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors"
                            style={{ fontFamily: MONO }}
                        >
                            View All
                        </button>
                    </div>

                    <RecentCoursesTable courses={courses} />
                </section>
            </main>
        </div>
    );
};

export default FacultyDashboard;
