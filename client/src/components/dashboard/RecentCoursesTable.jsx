import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const RecentCoursesTable = ({ courses }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 overflow-hidden shadow-sm">
            {courses && courses.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F7F8FF] dark:bg-[#1A1D2E] border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                            <tr>
                                <th className="px-6 py-5 text-xs font-semibold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest w-2/5" style={{ fontFamily: MONO }}>Course</th>
                                <th className="px-6 py-5 text-xs font-semibold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>Price</th>
                                <th className="px-6 py-5 text-xs font-semibold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>Enrolled</th>
                                <th className="px-6 py-5 text-xs font-semibold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>Status</th>
                                <th className="px-6 py-5 text-xs font-semibold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3B4FD8]/5 dark:divide-[#6C7EF5]/5">
                            {courses.map((course) => (
                                <tr
                                    key={course._id}
                                    onClick={() => navigate('/create-course', { state: { courseId: course._id } })}
                                    className="hover:bg-[#F7F8FF] dark:hover:bg-[#1A1D2E] transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-20 bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 flex items-center justify-center text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <BookOpen size={20} strokeWidth={1.5} />
                                                )}
                                            </div>
                                            <span className="text-base font-semibold text-[#1A1D2E] dark:text-[#E8EAF2] group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors" style={{ fontFamily: SERIF }}>
                                                {course.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                                        {course.price === 0 ? 'Free' : `₹${course.price}`}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                                        {course.enrolledCount}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${course.status === 'PUBLISHED'
                                            ? 'bg-[#2DC653]/10 text-[#2DC653]'
                                            : 'bg-[#F5A623]/10 text-[#F5A623]'
                                            }`} style={{ fontFamily: MONO }}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 flex items-center text-sm text-[#F5A623]" style={{ fontFamily: MONO }}>
                                        <Star size={14} className="fill-current mr-2" />
                                        {course.rating?.average || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-16 text-center text-[#6B7194] dark:text-[#8B90B8]">
                    <BookOpen size={40} className="mx-auto mb-6 text-[#3B4FD8]/30 dark:text-[#6C7EF5]/30" strokeWidth={1} />
                    <p className="text-lg mb-6" style={{ fontFamily: SERIF }}>You haven't created any courses yet.</p>
                    <button
                        onClick={() => navigate('/create-course')}
                        className="px-6 py-3 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] text-xs font-semibold uppercase tracking-widest transition-colors"
                        style={{ fontFamily: MONO }}
                    >
                        Create Your Course
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentCoursesTable;
