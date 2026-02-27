import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseDetails, enrollInCourse, getCourseReviews } from '../redux/slices/courseSlice';
import { createOrder, verifyPayment, getKey } from '../redux/slices/paymentSlice';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import {
    Star, User, Clock, BookOpen, CheckCircle, Lock, PlayCircle, FileText, Share2, Award, X, Play
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCourse: course, isFetchingDetails: loading, error, reviews } = useSelector((state) => state.course);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (id) {
            dispatch(getCourseDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (course?._id) {
            dispatch(getCourseReviews({ courseId: course._id }));
        }
    }, [dispatch, course?._id]);




    const getCurrencySymbol = (currencyCode) => {
        if (!currencyCode) return '';
        const code = currencyCode.toUpperCase();
        switch (code) {
            case 'USD': return '$';
            case 'EUR': return '€';
            case 'INR': return '₹';
            default: return (currencyCode || '') + ' ';
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            toast.error("Please login to enroll");
            navigate('/login');
            return;
        }

        // Free Course Enrollment or Fully Discounted
        const price = course.finalPrice || (course.price - (course.price * (course.discount || 0)) / 100);

        if (!price || price <= 0) {
            dispatch(enrollInCourse({ courseId: course._id || course.id, courseDetails: course }))
                .unwrap()
                .then(() => {
                    toast.success("Enrolled successfully!");
                    navigate('/student-courses');
                })
                .catch((err) => toast.error(err || "Failed to enroll"));
            return;
        }

        // Paid Course Enrollment
        try {
            const { key } = await dispatch(getKey()).unwrap();
            const { order } = await dispatch(createOrder({ courseId: course._id || course.id })).unwrap();

            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: "Emote Technology",
                description: course.title,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await dispatch(verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })).unwrap();
                        toast.success("Payment successful! Enrolled.");
                        navigate('/student-courses');
                    } catch (error) {
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || ""
                },
                theme: {
                    color: "#14b8a6"
                }
            };

            const rzp = new window.Razorpay(options);
            console.log("Razorpay Options:", { ...options, key: options.key ? "PRESENT" : "MISSING" }); // Debugging
            rzp.on('payment.failed', function (response) {
                toast.error(response.error.description || "Payment Failed");
            });
            rzp.open();

        } catch (error) {
            console.error("Payment Initialization Error:", error);
            toast.error(typeof error === 'string' ? error : "Failed to initialize payment");
        }
    };

    const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
    const [previewArticle, setPreviewArticle] = useState(null);

    const handlePreviewOpen = () => {
        if (course?.previewVideo) {
            setPreviewVideoUrl(course.previewVideo);
        }
    };

    const handleLessonPreview = (lesson) => {
        if (lesson.type === 'VIDEO') {
            if (lesson.video?.url) {
                setPreviewVideoUrl(lesson.video.url);
            } else if (lesson.url) {
                setPreviewVideoUrl(lesson.url);
            }
        } else if (lesson.type === 'ARTICLE') {
            setPreviewArticle(lesson);
        }
    };

    const closePreview = () => {
        setPreviewVideoUrl(null);
        setPreviewArticle(null);
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

            {/* Video Preview Modal */}
            {previewVideoUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
                        <button
                            onClick={closePreview}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <video
                            src={previewVideoUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Article Preview Modal */}
            {previewArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-3xl bg-white dark:bg-[#1a1c23] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-8">
                                {previewArticle.title}
                            </h3>
                            <button
                                onClick={closePreview}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300
                                prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                                prose-a:text-teal-600 dark:prose-a:text-teal-400
                                prose-img:rounded-xl prose-img:shadow-lg">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {previewArticle.content || "> *No content available.*"}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}


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
                                            {module.subModules?.map((lesson) => (
                                                <div
                                                    key={lesson._id}
                                                    onClick={() => {
                                                        if (lesson.isPreview) {
                                                            handleLessonPreview(lesson);
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${lesson.isPreview ? 'cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-400">
                                                            {lesson.type === 'VIDEO' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                                        </span>
                                                        <span className={`font-medium text-sm ${lesson.isPreview ? 'text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    {lesson.isPreview ? (
                                                        <span className="text-teal-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                                            {lesson.type === 'VIDEO' && <Play size={10} />}
                                                            Free Preview
                                                        </span>
                                                    ) : (
                                                        <Lock size={14} className="text-gray-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Student Reviews</h2>
                            {reviews && reviews.length > 0 ? (
                                <div className="grid gap-6">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="bg-white dark:bg-[#1a1c23] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold">
                                                        {review.userId?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                                                            {review.userId?.name || 'Unknown User'}
                                                        </h4>
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.title && (
                                                <h5 className="font-bold text-gray-900 dark:text-white mb-2">
                                                    {review.title}
                                                </h5>
                                            )}
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this course!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Floating Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-xl shadow-teal-900/5">
                            <div className="rounded-2xl overflow-hidden mb-6 relative aspect-video group cursor-pointer" onClick={handlePreviewOpen}>
                                <img
                                    src={course.thumbnail || 'https://via.placeholder.com/400x250'}
                                    alt={course.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <PlayCircle size={48} className="text-white opacity-80 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                                </div>
                            </div>

                            <div className="flex flex-col mb-6">
                                <div className="flex items-end gap-3 flex-wrap">
                                    {course.price && course.discount > 0 ? (
                                        <>
                                            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                                {getCurrencySymbol(course.currency)}
                                                {(course.price * (1 - course.discount / 100)).toFixed(2)}
                                            </span>
                                            <span className="text-lg text-gray-400 line-through mb-1.5">
                                                {getCurrencySymbol(course.currency)}
                                                {course.price}
                                            </span>
                                            <span className="text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full mb-2">
                                                {course.discount}% OFF
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                            {course.price ? `${getCurrencySymbol(course.currency)}${course.price}` : 'Free'}
                                        </span>
                                    )}
                                </div>
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
