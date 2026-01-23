import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import StatsCard from '../components/dashboard/StatsCard';
import { Users, BookOpen, DollarSign, Star, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FacultyDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCourses: 0,
        totalRevenue: 0,
        averageRating: 0
    });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Use environment variable for API URL or fallback to localhost
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

                // 1. Fetch from API (Best effort)
                let apiData = [];
                try {
                    const coursesRes = await axios.get(`${apiUrl}/faculty/my-courses`, {
                        withCredentials: true
                    });
                    if (coursesRes.data.success) {
                        apiData = coursesRes.data.data;
                    }

                    const statsRes = await axios.get(`${apiUrl}/faculty/dashboard-stats`, {
                        withCredentials: true
                    });
                    if (statsRes.data.success) {
                        setStats(statsRes.data.data);
                    }
                } catch (apiError) {
                    console.warn("API not available, using local data only.");
                }

                // 2. Load Local Draft
                let localCourses = [];
                const savedDraft = localStorage.getItem('courseDraft');
                if (savedDraft) {
                    try {
                        const parsed = JSON.parse(savedDraft);
                        if (parsed.course) {
                            localCourses.push({
                                _id: 'local-draft',
                                title: parsed.course.title || "Untitled Draft",
                                price: 0, // Placeholder
                                enrolledCount: 0,
                                status: parsed.course.status || "DRAFT",
                                rating: { average: 0 },
                                thumbnail: parsed.course.thumbnail || null
                            });
                        }
                    } catch (e) {
                        console.error("Failed to parse local draft", e);
                    }
                }

                // 3. Merge (Local drafts first)
                setCourses([...localCourses, ...apiData]);

            } catch (error) {
                console.error("Unexpected error loading dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
            <Sidebar />

            <main className="md:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name?.split(' ')[0] || 'Faculty'}! 👋
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Here's what's happening with your courses today.
                    </p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatsCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        color="emerald"
                    />
                    <StatsCard
                        title="Total Students"
                        value={stats.totalStudents}
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard
                        title="Active Courses"
                        value={stats.totalCourses}
                        icon={BookOpen}
                        color="purple"
                    />
                    <StatsCard
                        title="Average Rating"
                        value={stats.averageRating}
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
                            className="text-teal-500 hover:text-teal-400 font-medium text-sm"
                        >
                            View All
                        </button>
                    </div>

                    <div className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        {courses.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {courses.map((course) => (
                                            <tr
                                                key={course._id}
                                                onClick={() => navigate('/create-course', { state: { courseId: course._id } })}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex items-center justify-center text-gray-400">
                                                            {course.thumbnail ? (
                                                                <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <BookOpen size={20} />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px] group-hover:text-teal-500 transition-colors">
                                                            {course.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {course.price === 0 ? 'Free' : `$${course.price}`}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {course.enrolledCount}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${course.status === 'PUBLISHED'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                        }`}>
                                                        {course.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 flex items-center text-sm text-amber-500">
                                                    <Star size={14} className="fill-current mr-1" />
                                                    {course.rating?.average || 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                                <p>You haven't created any courses yet.</p>
                                <button
                                    onClick={() => navigate('/create-course')}
                                    className="mt-4 px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
                                >
                                    Create Your Course
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default FacultyDashboard;
