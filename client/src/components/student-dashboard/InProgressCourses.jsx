import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInProgressCourses } from '../../redux/slices/courseSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const CircularProgress = ({ value, color }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    const colorClasses = {
        teal: "text-[#3B4FD8] dark:text-[#6C7EF5]",
        blue: "text-[#3B4FD8] dark:text-[#6C7EF5]",
        emerald: "text-[#2DC653]",
        amber: "text-[#F5A623]"
    };

    return (
        <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-[#F7F8FF] dark:text-[#1A1D2E]"
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
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: MONO }}>
                {Math.round(value)}%
            </div>
        </div>
    );
};

const CourseCard = ({ course }) => {
    return (
        <div className="bg-white dark:bg-[#252A41] p-6 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
                <CircularProgress value={course.progress} color={course.color} />
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border border-transparent ${course.status === 'High Priority'
                    ? 'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/30'
                    : 'bg-[#F7F8FF] text-[#6B7194] dark:bg-[#1A1D2E] dark:text-[#8B90B8]'
                    }`} style={{ fontFamily: MONO }}>
                    {course.status}
                </span>
            </div>

            <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3 line-clamp-1" style={{ fontFamily: SERIF }}>{course.title}</h3>
            <p className="text-[10px] text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest font-bold mb-8" style={{ fontFamily: MONO }}>
                LAST ACCESSED: {course.lastAccessed}
            </p>

            <Link 
                to={`/course/${course._id}/learn`}
                className={`w-full py-4 flex items-center justify-center gap-3 text-xs uppercase tracking-widest font-bold transition-colors border border-transparent ${course.active
                ? 'bg-[#3B4FD8] hover:bg-[#2c3ea8] text-white shadow-sm'
                : 'bg-[#F7F8FF] hover:bg-[#EDEEFF] dark:bg-[#1A1D2E] dark:hover:bg-black/20 text-[#6B7194] dark:text-[#8B90B8] border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10'
                }`} style={{ fontFamily: MONO }}>
                {course.active ? <Play size={14} fill="currentColor" /> : <Play size={14} />}
                {course.actionText || 'Resume Learning'}
            </Link>
        </div>
    );
};

const InProgressCourses = () => {
    const dispatch = useDispatch();
    const { inProgressCourses: courses, isFetchingStudentCourses: loading } = useSelector((state) => state.course);

    useEffect(() => {
        if (courses.length === 0) {
            dispatch(getInProgressCourses());
        }
    }, [dispatch, courses.length]);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-[3px] border-[#3B4FD8]/20 border-t-[#3B4FD8] dark:border-[#6C7EF5]/20 dark:border-t-[#6C7EF5] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-6" style={{ fontFamily: SERIF }}>In-Progress Courses</h2>
                <div className="bg-white dark:bg-[#252A41] p-10 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-center shadow-sm">
                    <p className="text-[#6B7194] dark:text-[#8B90B8] text-xs uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>You haven't started any courses yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-4">
                <h2 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>In-Progress Courses</h2>
                <Link to="/student-courses" className="text-[#3B4FD8] dark:text-[#6C7EF5] text-[10px] tracking-[0.2em] font-bold hover:underline" style={{ fontFamily: MONO }}>VIEW ALL</Link>
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
