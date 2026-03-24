import React, { useState, useRef, useEffect } from 'react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import WelcomeBanner from '../components/student-dashboard/WelcomeBanner';
import InProgressCourses from '../components/student-dashboard/InProgressCourses';
import UpcomingQuizzes from '../components/student-dashboard/UpcomingQuizzes';
import RecentCertificates from '../components/student-dashboard/RecentCertificates';
import WeeklyStreak from '../components/student-dashboard/WeeklyStreak';
import { Search, Settings, LogOut, User, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { toggleSidebar } from '../redux/slices/uiSlice';
import { Link } from 'react-router-dom';
import NotificationBell from '../components/common/NotificationBell';

import api from '../utils/api'; // Import centralized api

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const StudentDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { isSidebarCollapsed } = useSelector((state) => state.ui);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [stats, setStats] = useState({
        hoursSpent: 0,
        assignments: 0,
        goalProgress: 0
    });
    const profileRef = useRef(null);

    // Default user image if none provided
    const userImage = user?.profile?.avatar;

    // Fetch Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/student/dashboard-stats');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

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

    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] font-sans transition-colors duration-300">
            <StudentSidebar />

            <main className={`p-4 md:p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Top Header Row: Search & Profile */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Mobile Top Row: Menu & Branding / Notifs */}
                    <div className="flex items-center justify-between w-full md:hidden mb-2">
                        <button 
                            onClick={() => dispatch(toggleSidebar())} 
                            className="p-2 -ml-2 text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Removed Search Bar as per request */}
                    <div></div>

                    {/* Right Side: Notification & Profile */}
                    <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                        <NotificationBell />

                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 pl-6 border-l border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 focus:outline-none"
                                aria-expanded={isProfileOpen}
                                aria-haspopup="true"
                            >
                                <div className="text-right hidden sm:block">
                                    <h4 className="text-base font-bold text-[#1A1D2E] dark:text-[#E8EAF2] leading-tight" style={{ fontFamily: SERIF }}>
                                        {user?.name || 'Alex Rivera'}
                                    </h4>
                                    <p className="text-[10px] uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] font-bold mt-0.5" style={{ fontFamily: MONO }}>
                                        {user?.profile?.title || 'Student'}
                                    </p>
                                </div>
                                {userImage ? (
                                    <img
                                        src={userImage}
                                        alt="Profile"
                                        className={`w-10 h-10 rounded-full object-cover border-2 shadow-sm transition-colors ${isProfileOpen ? 'border-[#3B4FD8] dark:border-[#6C7EF5]' : 'border-white dark:border-[#252A41]'
                                            }`}
                                    />
                                ) : (
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#F7F8FF] dark:bg-[#1A1D2E] border-2 shadow-sm transition-colors ${isProfileOpen ? 'border-[#3B4FD8] text-[#3B4FD8] dark:border-[#6C7EF5] dark:text-[#6C7EF5]' : 'border-white dark:border-[#252A41] text-[#6B7194] dark:text-[#8B90B8]'}`}>
                                        <User size={20} />
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="p-2">
                                        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-[#F7F8FF] dark:hover:bg-[#1A1D2E] transition-colors" style={{ fontFamily: MONO }}>
                                            <Settings size={14} />
                                            <span>Settings</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold text-[#E25C5C] hover:bg-[#E25C5C]/10 transition-colors text-left"
                                            style={{ fontFamily: MONO }}
                                        >
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <WelcomeBanner user={user} stats={stats} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Main Column */}
                    <div className="xl:col-span-2 space-y-8">
                        <InProgressCourses />
                        <UpcomingQuizzes />
                    </div>

                    {/* Right Sidebar Column */}
                    <div className="space-y-8">
                        <WeeklyStreak />
                        <RecentCertificates />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
