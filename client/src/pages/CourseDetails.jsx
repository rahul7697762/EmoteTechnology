import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseDetails, enrollInCourse } from '../redux/slices/courseSlice';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import {
    Star, User, Clock, BookOpen, CheckCircle, Lock, PlayCircle, FileText, Share2, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCourse: course, isFetchingDetails: loading, error } = useSelector((state) => state.course);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (id) {
            dispatch(getCourseDetails(id));
        }
    }, [dispatch, id]);

    const handleEnroll = () => {
        if (!user) {
            toast.error("Please login to enroll");
            navigate('/login');
            return;
        }

        dispatch(enrollInCourse(course._id || course.id))
            .unwrap()
            .then(() => {
                toast.success("Enrolled successfully!");
                navigate('/student-courses');
            })
            .catch((err) => toast.error(err || "Failed to enroll"));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{error || "The course you're looking for doesn't exist."}</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="px-6 py-2 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors"
                >
                    Browse Courses
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white font-sans transition-colors duration-300">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gray-900 text-white pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-black/80 z-0"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 text-teal-400 font-semibold tracking-wide uppercase text-sm mb-4">
                                <span>{course.category || 'Development'}</span>
                                <span>•</span>
                                <span>{course.level || 'All Levels'}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                                {course.description?.substring(0, 150)}...
                            </p>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-300 font-medium">
                                <div className="flex items-center gap-2">
                                    <Star className="text-yellow-400 fill-current" size={18} />
                                    <span className="text-white font-bold">{course.rating?.average || 4.8}</span>
                                    <span>({course.rating?.count || 120} ratings)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    <span>Created by <span className="text-white underline decoration-teal-500 underline-offset-4">{course.instructor?.name || 'Instructor'}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    <span>Last updated {new Date(course.updatedAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Share2 size={18} />
                                    <span>English</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Description & Syllabus */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* What you'll learn */}
                        <div className="bg-white dark:bg-[#1a1c23] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.learningOutcomes?.map((outcome, idx) => (
                                    <div key={idx} className="flex gap-3 text-gray-600 dark:text-gray-300 text-sm">
                                        <CheckCircle size={20} className="text-teal-500 shrink-0" />
                                        <span>{outcome}</span>
                                    </div>
                                )) || (
                                        <p className="text-gray-500 italic">No learning outcomes listed.</p>
                                    )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Description</h2>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                                {course.description}
                            </div>
                        </div>

                        {/* Syllabus */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                            <div className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                {course.modules?.map((module, idx) => (
                                    <div key={module._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                                            <div className="flex gap-3 items-center">
                                                <span className="text-gray-400 font-bold text-sm">SEC {idx + 1}</span>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{module.title}</h3>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">{module.subModulesCount || 0} Lessons</span>
                                        </div>
                                        <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1a1c23]">
                                            {module.subModules?.map((lesson, lIdx) => (
                                                <div key={lesson._id} className="px-6 py-3 flex items-center justify-between text-sm group hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 overflow-hidden">
                                                        {lesson.type === 'VIDEO' ? <PlayCircle size={16} className="shrink-0 group-hover:text-teal-500" /> : <FileText size={16} className="shrink-0 group-hover:text-teal-500" />}
                                                        <span className="truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{lesson.title}</span>
                                                    </div>
                                                    <div className="shrink-0">
                                                        {lesson.isPreview ? (
                                                            <span className="text-teal-500 text-xs font-bold uppercase tracking-wide">Preview</span>
                                                        ) : (
                                                            <Lock size={14} className="text-gray-300 dark:text-gray-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Floating Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xl shadow-teal-900/5">
                            <div className="rounded-2xl overflow-hidden mb-6 relative aspect-video group">
                                <img
                                    src={course.thumbnail || 'https://via.placeholder.com/400x250'}
                                    alt={course.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <PlayCircle size={48} className="text-white opacity-80 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                                </div>
                            </div>

                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                    {course.price ? `$${course.price}` : 'Free'}
                                </span>
                                {course.price && (
                                    <span className="text-lg text-gray-400 line-through mb-1.5">${course.price * 2}</span>
                                )}
                            </div>

                            <button
                                onClick={handleEnroll}
                                className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all active:scale-[0.98] mb-4"
                            >
                                Enroll Now
                            </button>

                            <p className="text-center text-xs text-gray-500 mb-6 font-medium">
                                30-Day Money-Back Guarantee
                            </p>

                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-2">This course includes:</h4>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <PlayCircle size={18} className="text-teal-500" />
                                    <span>{course.modules?.reduce((acc, m) => acc + (m.subModulesCount || 0), 0) || 0} lessons</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Clock size={18} className="text-teal-500" />
                                    <span>Full lifetime access</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Share2 size={18} className="text-teal-500" />
                                    <span>Access on mobile and TV</span>
                                </div>
                                {course.certificateEnabled && (
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <Award size={18} className="text-teal-500" />
                                        <span>Certificate of completion</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CourseDetails;
