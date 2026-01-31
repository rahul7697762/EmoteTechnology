import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/dashboard/Sidebar';
import StatsCard from '../components/dashboard/StatsCard';
import RecentCoursesTable from '../components/dashboard/RecentCoursesTable';
import { Users, BookOpen, DollarSign, Star } from 'lucide-react';
import { getFacultyCourses, getDashboardStats } from '../redux/slices/courseSlice';

const FacultyDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { myCourses: courses, stats, isFetchingCourses, isFetchingStats } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getFacultyCourses());
        dispatch(getDashboardStats());
    }, [dispatch]);

    if (isFetchingCourses && isFetchingStats) {
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
                            className="text-teal-500 hover:text-teal-400 font-medium text-sm"
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
