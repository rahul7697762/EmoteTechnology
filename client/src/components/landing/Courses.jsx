import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, Clock, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../../redux/slices/courseSlice';


const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=800";
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const Courses = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courses, isFetchingPublicCourses } = useSelector((state) => state.course);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        dispatch(fetchCourses({ page: 1, limit: 50 }));
    }, [dispatch]);

    // Derive categories dynamically from available courses
    const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))];

    const filteredCourses = (selectedCategory === "All"
        ? courses
        : courses.filter(course => course.category === selectedCategory)).slice(0, 6);

    return (
        <section className="py-32 px-6 lg:px-8 bg-[#EDEEFF]/60 dark:bg-[#252A41] border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-8">
                    <div>
                        <div
                            className="text-[10px] tracking-[0.28em] uppercase text-[#3B4FD8] dark:text-[#6C7EF5] mb-5"
                            style={{ fontFamily: MONO }}
                        >
                            03 / Courses
                        </div>
                        <h2
                            className="leading-[0.93]"
                            style={{ fontFamily: SERIF, fontSize: 'clamp(2.4rem,5vw,4rem)' }}
                        >
                            <span className="block font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]">Popular</span>
                            <span className="block font-light italic text-[#3B4FD8] dark:text-[#6C7EF5]">Courses.</span>
                        </h2>
                    </div>

                    {/* Category filter */}
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-1.5 text-[10px] tracking-widest uppercase transition-all border ${
                                    selectedCategory === category
                                        ? 'bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white border-[#3B4FD8] dark:border-[#6C7EF5]'
                                        : 'text-[#6B7194] dark:text-[#8B90B8] border-[#1A1D2E]/15 dark:border-[#E8EAF2]/10 hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5]'
                                }`}
                                style={{ fontFamily: MONO }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course grid */}
                <motion.div
                    layout
                    className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.map((course) => (
                            <motion.div
                                layout
                                key={course._id || course.title}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => navigate(`/course/${course._id}`)}
                                className="group bg-[#F7F8FF] dark:bg-[#1A1D2E] border-b border-r border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 overflow-hidden cursor-pointer hover:bg-[#EDEEFF] dark:hover:bg-[#2D3350] transition-colors duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden bg-[#E8EAF2] dark:bg-[#2D3350]">
                                    <motion.img
                                        whileHover={{ scale: 1.06 }}
                                        transition={{ duration: 0.65 }}
                                        src={getImageUrl(course.thumbnail)}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=800";
                                        }}
                                        alt={course.title}
                                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D2E]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                                    {/* Category badge */}
                                    <div
                                        className="absolute top-4 left-4 px-2 py-1 bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white text-[9px] tracking-[0.2em] uppercase"
                                        style={{ fontFamily: MONO }}
                                    >
                                        {course.category}
                                    </div>

                                    {/* Rating */}
                                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#F7F8FF]/92 dark:bg-[#1A1D2E]/92 backdrop-blur-sm px-2 py-1 text-[11px] font-medium text-[#1A1D2E] dark:text-[#E8EAF2]">
                                        <Star size={10} className="text-[#F5A623] fill-[#F5A623]" />
                                        {course.rating?.average || '0.0'}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Tags */}
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        {(course.tags || []).slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className="text-[9px] tracking-wider px-2 py-0.5 border border-[#3B4FD8]/22 text-[#3B4FD8] dark:text-[#6C7EF5] dark:border-[#6C7EF5]/18"
                                                style={{ fontFamily: MONO }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h3
                                        className="text-xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2] mb-4 leading-snug line-clamp-2 group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors"
                                        style={{ fontFamily: SERIF }}
                                    >
                                        {course.title}
                                    </h3>

                                    <div className="flex items-center justify-between text-xs text-[#6B7194] dark:text-[#8B90B8] border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pt-4">
                                        <div className="flex items-center gap-1.5">
                                            <BookOpen size={12} />
                                            <span>{course.enrolledCount || 0} students</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} />
                                            <span>{course.totalDuration ? `${course.totalDuration} Hrs` : 'Self-paced'}</span>
                                        </div>
                                        <ArrowUpRight
                                            size={15}
                                            className="text-[#3B4FD8] dark:text-[#6C7EF5] opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-20 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8">
                        <p className="text-[#6B7194] dark:text-[#8B90B8] font-light text-sm">
                            No courses found in this category.
                        </p>
                    </div>
                )}

                {/* View all */}
                <div className="mt-12 flex justify-center">
                    <button 
                        onClick={() => navigate('/courses')}
                        className="group flex items-center gap-2 px-8 py-3.5 border border-[#1A1D2E]/18 dark:border-[#E8EAF2]/14 text-sm font-medium text-[#1A1D2E] dark:text-[#E8EAF2] tracking-[0.05em] hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                    >
                        View All Courses
                        <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Courses;
