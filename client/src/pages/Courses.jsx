import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Search, BookOpen, Star, User, ArrowUpRight, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../redux/slices/courseSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO  = "'Space Mono', 'Courier New', monospace";

const getCurrencySymbol = (code) => {
    switch ((code || '').toUpperCase()) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'INR': return '₹';
        default: return (code || '') + ' ';
    }
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

const Courses = () => {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const { courses, pagination, searchQuery: storedSearch, isFetchingPublicCourses: loading, error } =
        useSelector((s) => s.course);

    const [searchQuery, setSearchQuery] = useState(storedSearch || '');
    const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        if (courses.length > 0 && searchQuery === storedSearch && currentPage === (pagination?.page || 1)) return;
        const id = setTimeout(() => dispatch(fetchCourses({ searchQuery, page: currentPage, limit: 50 })), 500);
        return () => clearTimeout(id);
    }, [searchQuery, currentPage, dispatch, courses.length, storedSearch, pagination?.page]);

    const handlePageChange = (p) => {
        if (p >= 1 && p <= (pagination?.pages || 1)) {
            setCurrentPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] transition-colors duration-300">
            <Navbar />

            {/* ── Page header ── */}
            <div className="border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8 bg-[#F7F8FF] dark:bg-[#1A1D2E]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-12">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>

                        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
                            <div style={{ width: 28, height: 1, background: '#3B4FD8' }} />
                            <span className="text-[10px] tracking-[0.28em] uppercase text-[#3B4FD8] dark:text-[#6C7EF5]" style={{ fontFamily: MONO }}>
                                Course Catalogue
                            </span>
                        </motion.div>

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                            <motion.h1 variants={fadeUp} className="leading-[0.93]" style={{ fontFamily: SERIF, fontSize: 'clamp(2.6rem, 5vw, 4.2rem)' }}>
                                <span className="block font-semibold">Explore</span>
                                <span className="block font-light italic text-[#3B4FD8] dark:text-[#6C7EF5]">Our Courses.</span>
                            </motion.h1>

                            {/* Search */}
                            <motion.div variants={fadeUp} className="relative w-full lg:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7194] dark:text-[#8B90B8]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search courses..."
                                    className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/12 text-[#1A1D2E] dark:text-[#E8EAF2] placeholder-[#6B7194] dark:placeholder-[#8B90B8] focus:outline-none focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] text-sm transition-colors"
                                />
                            </motion.div>
                        </div>
                        
                        {/* Category filter */}
                        {!loading && courses.length > 0 && (
                            <motion.div variants={fadeUp} className="mt-8 flex gap-2 flex-wrap">
                                {["All", ...Array.from(new Set(courses.map(c => c.category || 'Course')))].map(category => (
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
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* ── Course grid ── */}
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-[#F7F8FF] dark:bg-[#1A1D2E] p-6 animate-pulse">
                                <div className="w-full h-44 bg-[#3B4FD8]/8 dark:bg-[#6C7EF5]/8 mb-5" />
                                <div className="h-5 bg-[#3B4FD8]/8 dark:bg-[#6C7EF5]/8 rounded w-3/4 mb-3" />
                                <div className="h-4 bg-[#3B4FD8]/8 dark:bg-[#6C7EF5]/8 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-24 border border-[#E25C5C]/20">
                        <p className="text-[#E25C5C] font-light text-sm">{error}</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-24 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8">
                        <p className="text-[#6B7194] dark:text-[#8B90B8] font-light text-sm">
                            {searchQuery ? `No courses found matching "${searchQuery}"` : 'No courses available at the moment.'}
                        </p>
                    </div>
                ) : (
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10"
                    >
                        <AnimatePresence>
                            {(selectedCategory === "All" ? courses : courses.filter(c => (c.category || 'Course') === selectedCategory)).map((course) => {
                                const price    = course.price;
                                const discount = course.discount;
                                const symbol   = getCurrencySymbol(course.currency);
                                const discounted = discount > 0
                                    ? (price * (1 - discount / 100)).toFixed(2)
                                    : null;

                                return (
                                    <motion.div
                                        key={course._id || course.id}
                                        variants={fadeUp}
                                        className="group bg-[#F7F8FF] dark:bg-[#1A1D2E] overflow-hidden cursor-pointer hover:bg-[#EDEEFF] dark:hover:bg-[#252A41] transition-colors duration-300"
                                        onClick={() => navigate(`/course/${course.slug || course._id || course.id}`)}
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative h-44 overflow-hidden">
                                            <img
                                                src={course.thumbnail || course.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'}
                                                alt={course.title}
                                                className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D2E]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Category badge */}
                                            <div
                                                className="absolute top-4 left-4 px-2 py-1 bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white text-[9px] tracking-[0.2em] uppercase"
                                                style={{ fontFamily: MONO }}
                                            >
                                                {course.category || 'Course'}
                                            </div>

                                            {/* Rating */}
                                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#F7F8FF]/92 dark:bg-[#1A1D2E]/92 backdrop-blur-sm px-2 py-1 text-[11px] font-medium text-[#1A1D2E] dark:text-[#E8EAF2]">
                                                <Star size={10} className="text-[#F5A623] fill-[#F5A623]" />
                                                {typeof course.rating === 'object'
                                                    ? (course.rating?.average || 4.5).toFixed(1)
                                                    : (course.rating || 4.5)}
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-6">
                                            {/* Instructor */}
                                            <div className="flex items-center gap-1.5 text-[#6B7194] dark:text-[#8B90B8] text-xs mb-3">
                                                <User size={11} />
                                                <span>{course.instructor?.name || 'Expert Instructor'}</span>
                                            </div>

                                            <h3
                                                className="text-lg font-semibold text-[#1A1D2E] dark:text-[#E8EAF2] mb-4 leading-snug line-clamp-2 group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors"
                                                style={{ fontFamily: SERIF }}
                                            >
                                                {course.title}
                                            </h3>

                                            {/* Footer row */}
                                            <div className="flex items-center justify-between border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pt-4">
                                                {/* Price */}
                                                <div className="flex flex-col">
                                                    {discounted ? (
                                                        <>
                                                            <span className="text-[10px] text-[#6B7194] dark:text-[#8B90B8] line-through">{symbol}{price}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg font-semibold text-[#3B4FD8] dark:text-[#6C7EF5]" style={{ fontFamily: SERIF }}>
                                                                    {symbol}{discounted}
                                                                </span>
                                                                <span className="text-[9px] font-bold text-[#E25C5C] bg-[#E25C5C]/10 px-1.5 py-0.5 tracking-wider" style={{ fontFamily: MONO }}>
                                                                    {discount}% OFF
                                                                </span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg font-semibold text-[#3B4FD8] dark:text-[#6C7EF5]" style={{ fontFamily: SERIF }}>
                                                            {price ? `${symbol}${price}` : 'Free'}
                                                        </span>
                                                    )}
                                                </div>

                                                <ArrowUpRight
                                                    size={16}
                                                    className="text-[#3B4FD8] dark:text-[#6C7EF5] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Pagination */}
                {!loading && !error && pagination?.pages > 1 && (
                    <div className="flex justify-center items-center mt-12 gap-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-6 py-3 border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/12 text-sm font-medium text-[#1A1D2E] dark:text-[#E8EAF2] hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-[#6B7194] dark:text-[#8B90B8] text-sm" style={{ fontFamily: MONO }}>
                            {currentPage} / {pagination.pages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.pages}
                            className="px-6 py-3 border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/12 text-sm font-medium text-[#1A1D2E] dark:text-[#E8EAF2] hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Courses;
