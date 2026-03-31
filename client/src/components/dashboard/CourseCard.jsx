import React from 'react';
import {
    Edit3, Trash2, BookOpen, Users, Clock, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const CourseCard = ({ course, handleDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 hover:shadow-lg transition-all duration-300 group flex flex-col">
            {/* Thumbnail Section */}
            <div className="h-48 bg-[#F7F8FF] dark:bg-[#1A1D2E] relative overflow-hidden flex items-center justify-center border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="text-[#3B4FD8]/30 dark:text-[#6C7EF5]/30">
                        <BookOpen size={48} strokeWidth={1} />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/90 dark:bg-[#1A1D2E]/90 backdrop-blur-md shadow-sm border border-white/20 ${course.status === 'PUBLISHED'
                        ? 'text-[#2DC653]'
                        : 'text-[#F5A623]'
                        }`} style={{ fontFamily: MONO }}>
                        {course.status}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6">
                    <h3 className="font-semibold text-2xl text-[#1A1D2E] dark:text-[#E8EAF2] line-clamp-2 mb-3 group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors leading-tight" style={{ fontFamily: SERIF }}>
                        {course.title || "Untitled Course"}
                    </h3>
                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                        <span className="flex items-center gap-2">
                            <Users size={14} />
                            {course.enrolledCount || 0} Students
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={14} />
                            {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-5 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-between gap-3">
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit-course/${course._id}`);
                            }}
                            className="flex-1 py-2.5 bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/10 hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] font-semibold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10"
                            style={{ fontFamily: MONO }}
                        >
                            <Edit3 size={14} />
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/manage-course/${course._id}`);
                            }}
                            className="flex-1 py-2.5 bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-[#F5A623]/10 hover:text-[#F5A623] dark:hover:text-[#F5A623] font-semibold text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10"
                            title="Manage Submissions & Applicants"
                            style={{ fontFamily: MONO }}
                        >
                            <Settings size={14} />
                            Manage
                        </button>
                        <button
                            onClick={(e) => handleDelete(course._id, e)}
                            className="px-3 py-2.5 bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#E25C5C] hover:bg-[#E25C5C]/10 transition-colors flex items-center justify-center border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 hover:border-[#E25C5C]/30"
                            title="Delete Course"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
