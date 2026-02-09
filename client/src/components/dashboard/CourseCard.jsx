import React from 'react';
import {
    Edit3, Trash2, BookOpen, Users, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, handleDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            {/* Thumbnail Section */}
            <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                        <BookOpen size={40} />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-md ${course.status === 'PUBLISHED'
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-amber-500/90 text-white'
                        }`}>
                        {course.status}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-violet-500 transition-colors">
                        {course.title || "Untitled Course"}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <Users size={14} />
                            {course.enrolledCount || 0} Students
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-3">
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={() => navigate(`/edit-course/${course._id}`)}
                            className="flex-1 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                        >
                            <Edit3 size={16} />
                            Edit
                        </button>
                        <button
                            onClick={(e) => handleDelete(course._id, e)}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
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
