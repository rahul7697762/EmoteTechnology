import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star } from 'lucide-react';

const RecentCoursesTable = ({ courses }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {courses && courses.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {courses.map((course) => (
                                <tr
                                    key={course._id}
                                    onClick={() => navigate('/create-course', { state: { courseId: course._id } })}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex items-center justify-center text-gray-400">
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <BookOpen size={20} />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px] group-hover:text-teal-500 transition-colors">
                                                {course.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {course.price === 0 ? 'Free' : `$${course.price}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {course.enrolledCount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${course.status === 'PUBLISHED'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center text-sm text-amber-500">
                                        <Star size={14} className="fill-current mr-1" />
                                        {course.rating?.average || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                    <p>You haven't created any courses yet.</p>
                    <button
                        onClick={() => navigate('/create-course')}
                        className="mt-4 px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
                    >
                        Create Your Course
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentCoursesTable;
