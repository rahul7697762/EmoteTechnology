import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const RecommendedCard = ({ course }) => {
    return (
        <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            {/* Card Header / Image Area */}
            <div className={`h-48 ${course.gradient} relative p-6 flex flex-col items-center justify-center text-center`}>
                <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                    {course.icon}
                </div>

                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 flex items-center gap-1.5 text-white text-[10px] font-bold tracking-widest uppercase border border-white/20" style={{ fontFamily: MONO }}>
                    <Star size={12} className="fill-[#F5A623] text-[#F5A623]" />
                    <span>{course.rating}</span>
                    <span className="text-white/60">({course.reviews})</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: MONO }}>
                    <span className="px-2 py-1 text-[#3B4FD8] bg-[#3B4FD8]/10 dark:text-[#6C7EF5] dark:bg-[#6C7EF5]/10 border border-transparent">
                        {course.category}
                    </span>
                    <span className="text-[#6B7194] dark:text-[#8B90B8]">{course.duration}</span>
                </div>

                <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-6 line-clamp-2 min-h-[56px]" style={{ fontFamily: SERIF }}>
                    {course.title}
                </h3>

                <button className="mt-auto w-full py-3.5 border border-[#3B4FD8] dark:border-[#6C7EF5] text-[#3B4FD8] dark:text-[#6C7EF5] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#3B4FD8] hover:text-white dark:hover:bg-[#6C7EF5] dark:hover:text-[#1A1D2E] transition-colors" style={{ fontFamily: MONO }}>
                    Enroll Now
                </button>
            </div>
        </div>
    );
};

const RecommendedCourses = () => {
    // Mock courses
    const courses = [
        {
            id: 1,
            title: "Introduction to Python for Data Science",
            rating: 4.8,
            reviews: "1.2k reviews",
            category: "Development",
            duration: "12h 45m",
            gradient: "bg-[#1A1D2E]",
            icon: (
                <div className="text-6xl font-bold opacity-100 select-none">🐍</div>
            )
        },
        {
            id: 2,
            title: "Leadership Essentials in Modern Teams",
            rating: 4.9,
            reviews: "850 reviews",
            category: "Business",
            duration: "6h 20m",
            gradient: "bg-[#F5A623]",
            icon: (
                <div className="text-6xl font-bold opacity-100 select-none text-white font-serif" style={{ fontFamily: SERIF }}>L+</div>
            )
        }
    ];

    return (
        <section>
            <div className="flex items-center justify-between mb-8 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-4">
                <h2 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>Recommended For You</h2>
                <div className="flex gap-3">
                    <button className="w-10 h-10 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 flex items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5] hover:bg-[#3B4FD8]/10 dark:hover:bg-[#6C7EF5]/10 transition-colors shadow-sm bg-white dark:bg-[#252A41]">
                        <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>
                    <button className="w-10 h-10 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 flex items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5] hover:bg-[#3B4FD8]/10 dark:hover:bg-[#6C7EF5]/10 transition-colors shadow-sm bg-white dark:bg-[#252A41]">
                        <ChevronRight size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                    <RecommendedCard key={course.id} course={course} />
                ))}
            </div>
        </section>
    );
};

export default RecommendedCourses;
