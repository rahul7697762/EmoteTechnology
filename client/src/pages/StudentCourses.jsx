import React, { useEffect, useState } from 'react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Search, Filter, BookOpen, Clock, Award, ChevronRight } from 'lucide-react';

const StudentCourses = () => {
    const { user } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, COMPLETED

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');

                // We'll create a new endpoint for all enrolled courses
                const response = await axios.get(`${apiUrl}/student/enrolled-courses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setCourses(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch enrolled courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'ALL' || course.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white font-sans flex">
            <StudentSidebar />

            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Learning</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your courses and track your progress</p>
                </header>

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
                            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1a1c23] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <div key={course._id} className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                                <div className="h-40 relative overflow-hidden">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-teal-50 dark:bg-teal-900/10 flex items-center justify-center text-teal-500">
                                            <BookOpen size={40} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-lg uppercase tracking-wide backdrop-blur-md ${course.status === 'COMPLETED'
                                            ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                                            : 'bg-teal-500/90 text-white'
                                            }`}>
                                            {course.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">{course.title}</h3>

                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
                                        <div
                                            className="bg-teal-500 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-6">
                                        <span>{Math.round(course.progress)}% Complete</span>
                                        <span>{course.totalLessons || 0} Lessons</span>
                                    </div>

                                    <button className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-500 hover:text-teal-500 dark:hover:text-teal-400 dark:hover:border-teal-500 font-semibold text-sm transition-colors flex items-center justify-center gap-2 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/10">
                                        <span>Continue Learning</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#1a1c23] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <BookOpen size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No courses found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                            {searchTerm || filter !== 'ALL'
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "You haven't enrolled in any courses yet. Explore our catalog to get started!"}
                        </p>
                        {!searchTerm && filter === 'ALL' && (
                            <button className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-teal-500/20">
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
