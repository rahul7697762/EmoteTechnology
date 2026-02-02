import React, { useEffect, useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Search, BookOpen, Clock, Star, User } from 'lucide-react';
import api from '../utils/api';

const Courses = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                let endpoint = '/courses';
                if (searchQuery.trim()) {
                    endpoint = `/courses/search?query=${encodeURIComponent(searchQuery)}`;
                }

                const response = await api.get(endpoint);
                // Assuming response structure: { success: true, data: [...] } or just [...]
                // Let's handle generic success wrapper if it exists (common pattern)
                const data = response.data?.courses || response.data?.data || response.data || [];

                // Ensure we proceed with an array
                setCourses(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to fetch courses:', err);
                setError('Failed to load courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchCourses();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                        Explore Our Courses
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover new skills, advance your career, and learn from industry experts.
                    </p>

                    <div className="mt-8 max-w-xl mx-auto relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-4 py-4 border border-gray-200 dark:border-gray-800 rounded-2xl leading-5 bg-white dark:bg-[#1a1c23] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
                            placeholder="Search for Python, Marketing, Design..."
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white dark:bg-[#1a1c23] rounded-3xl p-4 h-96 animate-pulse">
                                <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-4"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                {searchQuery ? `No courses found matching "${searchQuery}"` : "No courses found at the moment."}
                            </div>
                        ) : (
                            courses.map((course) => (
                                <div key={course._id || course.id} className="group bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-1">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={course.thumbnail || course.image || 'https://via.placeholder.com/400x250?text=Course'}
                                            alt={course.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-teal-600 dark:text-teal-400">
                                            {course.category || 'Development'}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center text-yellow-400 text-sm font-bold">
                                                <Star size={16} className="fill-current mr-1" />
                                                {course.rating || 4.5}
                                            </div>
                                            <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                                                <User size={14} className="mr-1" /> {course.students?.length || course.students || 0}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-teal-500 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            by {course.instructor?.name || course.instructor || 'Instructor'}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {course.price ? `$${course.price}` : 'Free'}
                                            </span>
                                            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 text-gray-900 dark:text-white rounded-xl font-semibold transition-all text-sm">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Courses;
