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

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
            <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] flex items-center justify-center">
                <div className="w-14 h-14 border-[3px] border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 border-t-[#3B4FD8] dark:border-t-[#6C7EF5] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-4" style={{ fontFamily: SERIF }}>Course Not Found</h2>
                <p className="text-[#6B7194] dark:text-[#8B90B8] mb-8 font-semibold uppercase tracking-widest text-sm" style={{ fontFamily: MONO }}>{error || "The course you're looking for doesn't exist."}</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="px-10 py-4 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] font-bold text-xs uppercase tracking-widest transition-colors shadow-sm"
                    style={{ fontFamily: MONO }}
                >
                    Browse Courses
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] font-sans transition-colors duration-300">
            <Navbar />

            {/* Video Preview Modal */}
            {previewVideoUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-4xl bg-black border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 overflow-hidden shadow-2xl aspect-video">
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
                    <div className="relative w-full max-w-3xl bg-white dark:bg-[#252A41] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#F7F8FF] dark:bg-[#1A1D2E]">
                            <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] truncate pr-8" style={{ fontFamily: SERIF }}>
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
            <div className="bg-[#1A1D2E] text-[#E8EAF2] pt-32 pb-20 relative overflow-hidden border-b border-[#6C7EF5]/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 text-[#F5A623] font-bold tracking-[0.2em] uppercase text-xs mb-6" style={{ fontFamily: MONO }}>
                                <span>{course.category || 'Development'}</span>
                                <span className="opacity-50">•</span>
                                <span>{course.level || 'All Levels'}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight" style={{ fontFamily: SERIF }}>
                                {course.title}
                            </h1>
                            <p className="text-lg text-[#8B90B8] mb-10 max-w-2xl leading-relaxed" style={{ fontFamily: MONO }}>
                                {course.description?.substring(0, 150)}...
                            </p>

                            <div className="flex flex-wrap gap-6 text-xs uppercase tracking-widest text-[#8B90B8] font-semibold" style={{ fontFamily: MONO }}>
                                <div className="flex items-center gap-2">
                                    <Star className="text-[#F5A623] fill-current" size={16} />
                                    <span className="text-[#E8EAF2]">{course.rating?.average || 4.8}</span>
                                    <span>({course.rating?.count || 120} RATINGS)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
                                    <span>CREATED BY <span className="text-[#E8EAF2]">{course.instructor?.name || 'Instructor'}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
                                    <span>UPDATED {new Date(course.updatedAt || Date.now()).toLocaleDateString()}</span>
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
                        <div className="bg-white dark:bg-[#252A41] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>What you'll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.learningOutcomes?.map((outcome, idx) => (
                                    <div key={idx} className="flex gap-3 text-[#1A1D2E] dark:text-[#E8EAF2] text-sm font-medium">
                                        <CheckCircle size={20} className="text-[#3B4FD8] dark:text-[#6C7EF5] shrink-0" strokeWidth={2} />
                                        <span>{outcome}</span>
                                    </div>
                                )) || (
                                        <p className="text-[#6B7194] dark:text-[#8B90B8] italic">No learning outcomes listed.</p>
                                    )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>Description</h2>
                            <div className="prose dark:prose-invert max-w-none text-[#6B7194] dark:text-[#8B90B8] leading-relaxed">
                                {course.description}
                            </div>
                        </div>

                        {/* Syllabus */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>Course Content</h2>
                            <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm">
                                {course.modules?.map((module, idx) => (
                                    <div key={module._id} className="border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 last:border-0">
                                        <div className="px-6 py-4 bg-[#F7F8FF] dark:bg-[#1A1D2E] flex justify-between items-center cursor-pointer hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors">
                                            <div className="flex gap-4 items-center">
                                                <span className="text-[#6B7194] dark:text-[#8B90B8] font-bold text-xs uppercase tracking-widest" style={{ fontFamily: MONO }}>SEC {idx + 1}</span>
                                                <h3 className="font-bold text-[#1A1D2E] dark:text-[#E8EAF2] text-lg" style={{ fontFamily: SERIF }}>{module.title}</h3>
                                            </div>
                                            <span className="text-xs text-[#6B7194] dark:text-[#8B90B8] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>{module.subModulesCount || 0} Lessons</span>
                                        </div>
                                        <div className="divide-y divide-[#3B4FD8]/10 dark:divide-[#6C7EF5]/10 bg-white dark:bg-[#252A41]">
                                            {module.subModules?.map((lesson) => (
                                                <div
                                                    key={lesson._id}
                                                    onClick={() => {
                                                        if (lesson.isPreview) {
                                                            handleLessonPreview(lesson);
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between p-4 transition-colors ${lesson.isPreview ? 'cursor-pointer hover:bg-[#F5A623]/5' : 'hover:bg-[#F7F8FF] dark:hover:bg-[#1A1D2E]'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[#3B4FD8] dark:text-[#6C7EF5]">
                                                            {lesson.type === 'VIDEO' ? <PlayCircle size={18} strokeWidth={1.5} /> : <FileText size={18} strokeWidth={1.5} />}
                                                        </span>
                                                        <span className={`font-medium text-sm ${lesson.isPreview ? 'text-[#F5A623]' : 'text-[#1A1D2E] dark:text-[#E8EAF2]'}`}>
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    {lesson.isPreview ? (
                                                        <span className="text-[#F5A623] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ fontFamily: MONO }}>
                                                            {lesson.type === 'VIDEO' && <Play size={10} fill="currentColor" />}
                                                            Free Preview
                                                        </span>
                                                    ) : (
                                                        <Lock size={14} className="text-[#6B7194] dark:text-[#8B90B8]" />
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
                            <h2 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>Student Reviews</h2>
                            {reviews && reviews.length > 0 ? (
                                <div className="grid gap-6">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="bg-white dark:bg-[#252A41] p-6 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 flex items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5] text-lg font-bold" style={{ fontFamily: SERIF }}>
                                                        {review.userId?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-[#1A1D2E] dark:text-[#E8EAF2] mb-1">
                                                            {review.userId?.name || 'Unknown User'}
                                                        </h4>
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={`${i < review.rating ? 'text-[#F5A623] fill-current' : 'text-[#3B4FD8]/20 dark:text-[#6C7EF5]/20'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.title && (
                                                <h5 className="font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-2" style={{ fontFamily: SERIF }}>
                                                    {review.title}
                                                </h5>
                                            )}
                                            <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm">
                                    <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>No reviews yet. Be the first to review this course!</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right Column: Floating Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 p-6 shadow-sm">
                            <div className="mb-6 relative aspect-video group cursor-pointer border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 overflow-hidden" onClick={handlePreviewOpen}>
                                <img
                                    src={course.thumbnail || 'https://via.placeholder.com/400x250'}
                                    alt={course.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <PlayCircle size={48} className="text-white opacity-80 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" strokeWidth={1.5} />
                                </div>
                            </div>

                            <div className="flex flex-col mb-8">
                                <div className="flex items-end gap-3 flex-wrap">
                                    {course.price && course.discount > 0 ? (
                                        <>
                                            <span className="text-4xl font-extrabold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                                                {getCurrencySymbol(course.currency)}
                                                {(course.price * (1 - course.discount / 100)).toFixed(2)}
                                            </span>
                                            <span className="text-lg text-[#6B7194] dark:text-[#8B90B8] line-through mb-1.5" style={{ fontFamily: SERIF }}>
                                                {getCurrencySymbol(course.currency)}
                                                {course.price}
                                            </span>
                                            <span className="text-[10px] font-bold text-[#F5A623] uppercase tracking-widest border border-[#F5A623]/30 bg-[#F5A623]/10 px-2 py-1 mb-2" style={{ fontFamily: MONO }}>
                                                {course.discount}% OFF
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-extrabold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                                            {course.price ? `${getCurrencySymbol(course.currency)}${course.price}` : 'Free'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleEnroll}
                                className="w-full py-4 bg-[#3B4FD8] hover:bg-[#2c3ea8] text-white font-bold text-xs uppercase tracking-widest shadow-sm transition-all active:scale-[0.98] mb-6 border border-transparent"
                                style={{ fontFamily: MONO }}
                            >
                                Enroll Now
                            </button>

                            <p className="text-center text-[10px] text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-[0.2em] font-bold mb-8" style={{ fontFamily: MONO }}>
                                30-Day Money-Back Guarantee
                            </p>

                            <div className="space-y-4">
                                <h4 className="font-bold text-[#1A1D2E] dark:text-[#E8EAF2] text-xs uppercase tracking-widest mb-4" style={{ fontFamily: MONO }}>This course includes:</h4>
                                <div className="flex items-center gap-4 text-sm text-[#1A1D2E] dark:text-[#E8EAF2] font-medium">
                                    <PlayCircle size={18} className="text-[#3B4FD8] dark:text-[#6C7EF5]" strokeWidth={1.5} />
                                    <span>{course.modules?.reduce((acc, m) => acc + (m.subModulesCount || 0), 0) || 0} lessons</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-[#1A1D2E] dark:text-[#E8EAF2] font-medium">
                                    <Clock size={18} className="text-[#3B4FD8] dark:text-[#6C7EF5]" strokeWidth={1.5} />
                                    <span>Full lifetime access</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-[#1A1D2E] dark:text-[#E8EAF2] font-medium">
                                    <Share2 size={18} className="text-[#3B4FD8] dark:text-[#6C7EF5]" strokeWidth={1.5} />
                                    <span>Access on mobile and TV</span>
                                </div>
                                {course.certificateEnabled && (
                                    <div className="flex items-center gap-4 text-sm text-[#1A1D2E] dark:text-[#E8EAF2] font-medium">
                                        <Award size={18} className="text-[#3B4FD8] dark:text-[#6C7EF5]" strokeWidth={1.5} />
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
