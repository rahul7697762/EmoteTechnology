import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const RecommendedCard = ({ course }) => {
    return (
        <div className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all group">
            {/* Card Header / Image Area */}
            <div className={`h-48 ${course.gradient} relative p-6 flex flex-col items-center justify-center text-center`}>
                <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                    {course.icon}
                </div>

                <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-white text-xs font-semibold">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{course.rating}</span>
                    <span className="text-white/70 font-normal">({course.reviews})</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold tracking-wider uppercase">
                    <span className={`px-2 py-1 rounded text-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400`}>
                        {course.category}
                    </span>
                    <span className="text-gray-400">{course.duration}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[56px]">
                    {course.title}
                </h3>

                <button className="w-full py-2.5 rounded-lg border-2 border-teal-500 text-teal-600 dark:text-teal-400 font-semibold text-sm hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors">
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
            gradient: "bg-linear-to-br from-[#1d4e4e] to-[#0f2e2e]",
            icon: (
                <div className="text-6xl font-bold opacity-80 select-none">🐍</div>
            )
        },
        {
            id: 2,
            title: "Leadership Essentials in Modern Teams",
            rating: 4.9,
            reviews: "850 reviews",
            category: "Business",
            duration: "6h 20m",
            gradient: "bg-linear-to-br from-[#c28e2b] to-[#8a6217]",
            icon: (
                <div className="text-6xl font-bold opacity-80 select-none text-white font-serif">A+</div>
            )
        }
    ];

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended For You</h2>
                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ChevronRight size={16} />
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
