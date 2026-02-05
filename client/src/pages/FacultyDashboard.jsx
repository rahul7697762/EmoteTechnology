import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/dashboard/Sidebar';
import StatsCard from '../components/dashboard/StatsCard';
import RecentCoursesTable from '../components/dashboard/RecentCoursesTable';
import { Users, BookOpen, DollarSign, Star, Search, Bell, Settings, LogOut, User } from 'lucide-react'; // Added icons
import { getFacultyCourses, getDashboardStats } from '../redux/slices/courseSlice';
import { logout } from '../redux/slices/authSlice'; // Added logout

const FacultyDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { myCourses: courses, stats, isFetchingCourses, isFetchingStats } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Default user image if none provided
    const userImage = user?.profile?.avatar;

    useEffect(() => {
        dispatch(getFacultyCourses());
        dispatch(getDashboardStats());
    }, [dispatch]);

    // Close on click outside
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
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors duration-300">
            <Sidebar />

            <main className={`p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Top Header Row: Search & Profile */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-xl">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search your courses..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-shadow shadow-sm"
                        />
                    </div>

                    {/* Right Side: Notification & Profile */}
                    <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                        <button className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                            <Bell size={24} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0f]"></span>
                        </button>

                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800 focus:outline-none"
                                aria-expanded={isProfileOpen}
                                aria-haspopup="true"
                            >
                                <div className="text-right hidden sm:block">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                                        {user?.name || 'Faculty Member'}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Instructor
                                    </p>
                                </div>
                                {userImage ? (
                                    <img
                                        src={userImage}
                                        alt="Profile"
                                        className={`w-10 h-10 rounded-full object-cover border-2 shadow-sm transition-colors ${isProfileOpen ? 'border-teal-500' : 'border-white dark:border-gray-800'
                                            }`}
                                    />
                                ) : (
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 shadow-sm transition-colors ${isProfileOpen ? 'border-teal-500 text-teal-600' : 'border-white dark:border-gray-800 text-gray-400'}`}>
                                        <User size={20} />
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1a1c23] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="p-2">
                                        <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                            <Settings size={18} />
                                            <span>Settings</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-left"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name?.split(' ')[0] || 'Faculty'}! 👋
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Here's what's happening with your courses today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatsCard
                        title="Total Revenue"
                        value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
                        icon={DollarSign}
                        color="emerald"
                    />
                    <StatsCard
                        title="Total Students"
                        value={stats?.totalStudents || 0}
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard
                        title="Active Courses"
                        value={stats?.totalCourses || 0}
                        icon={BookOpen}
                        color="purple"
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
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Recent Courses</h2>
                        <button
                            onClick={() => navigate('/my-courses')}
                            className="px-4 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
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
