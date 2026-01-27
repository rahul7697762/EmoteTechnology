// Add useState, useRef, useEffect to imports
import React, { useState, useRef, useEffect } from 'react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import WelcomeBanner from '../components/student-dashboard/WelcomeBanner';
import InProgressCourses from '../components/student-dashboard/InProgressCourses';
import RecommendedCourses from '../components/student-dashboard/RecommendedCourses';
import UpcomingQuizzes from '../components/student-dashboard/UpcomingQuizzes';
import RecentCertificates from '../components/student-dashboard/RecentCertificates';
import WeeklyStreak from '../components/student-dashboard/WeeklyStreak';
import { Search, Bell, Settings, LogOut } from 'lucide-react'; // Added icons for reuse
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [stats, setStats] = useState({
        hoursSpent: 0,
        assignments: 0,
        goalProgress: 0
    });
    const profileRef = useRef(null);

    // Default user image if none provided
    const userImage = user?.profile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80";

    // Fetch Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');
                if (!token) return;

                // Import axios if not already imported at top, or assume it is available
                // Note: We need to make sure axios is imported.
                // Assuming I need to add axios import in a separate edit if missing
                const response = await fetch(`${apiUrl}/student/dashboard-stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                if (data.success) {
                    setStats(data.data);
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
        logout();
        // optionally navigate if logout logic doesn't auto-redirect
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white font-sans">
            <StudentSidebar />

            <main className="md:ml-64 p-8 transition-all duration-300">
                {/* Top Header Row: Search & Profile */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-xl">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for courses, lessons, or tutors..."
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
                                        {user?.name || 'Alex Rivera'}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user?.profile?.title || 'Student'}
                                    </p>
                                </div>
                                <img
                                    src={userImage}
                                    alt="Profile"
                                    className={`w-10 h-10 rounded-full object-cover border-2 shadow-sm transition-colors ${isProfileOpen ? 'border-teal-500' : 'border-white dark:border-gray-800'
                                        }`}
                                />
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
                </header>

                <WelcomeBanner user={user} stats={stats} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Main Column */}
                    <div className="xl:col-span-2 space-y-8">
                        <InProgressCourses />
                        <RecommendedCourses />
                    </div>

                    {/* Right Sidebar Column */}
                    <div className="space-y-8">
                        <UpcomingQuizzes />
                        <RecentCertificates />
                        <WeeklyStreak />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
