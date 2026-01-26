import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import axios from 'axios';

const CircularProgress = ({ value, color }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    const colorClasses = {
        teal: "text-teal-500",
        blue: "text-blue-500",
        emerald: "text-emerald-500",
        amber: "text-amber-500"
    };

    return (
        <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-gray-100 dark:text-gray-800"
                />
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={colorClasses[color] || colorClasses.teal}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
                {Math.round(value)}%
            </div>
        </div>
    );
};

const CourseCard = ({ course }) => {
    return (
        <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <CircularProgress value={course.progress} color={course.color} />
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${course.status === 'High Priority'
                        ? 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                    {course.status}
                </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{course.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-6">Last accessed: {course.lastAccessed}</p>

            <button className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${course.active
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                {course.active ? <Play size={16} fill="currentColor" /> : <Play size={16} />}
                {course.actionText}
            </button>
        </div>
    );
};

const InProgressCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');

                const response = await axios.get(`${apiUrl}/student/in-progress-courses`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setCourses(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch in-progress courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">In-Progress Courses</h2>
                <div className="bg-white dark:bg-[#1a1c23] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-gray-500 dark:text-gray-400">You haven't started any courses yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">In-Progress Courses</h2>
                <a href="#" className="text-teal-600 dark:text-teal-400 text-sm font-semibold hover:underline">View All</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                    <CourseCard key={course._id} course={course} />
                ))}
            </div>
        </section>
    );
};

export default InProgressCourses;
