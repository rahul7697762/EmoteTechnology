import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const QuizItem = ({ quiz }) => {
    return (
        <div className="bg-white dark:bg-[#1a1c23] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
            <div className="flex gap-4">
                {/* Date Box */}
                <div className="flex-shrink-0 w-14 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 py-2">
                    <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">{quiz.month}</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{quiz.day}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{quiz.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{quiz.time}</p>

                    {quiz.active ? (
                        <button className="w-full py-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-bold rounded-lg transition-colors">
                            View Details
                        </button>
                    ) : (
                        <button className="w-full py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Reminder Set
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const UpcomingQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await api.get('/student/upcoming-quizzes');

                if (response.data.success) {
                    setQuizzes(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch upcoming quizzes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) {
        return (
            <div className="mb-8 animate-pulse">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                <div className="space-y-4">
                    <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                    <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                </div>
            </div>
        )
    }

    if (quizzes.length === 0) {
        return (
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-amber-500">⏱</span> Upcoming Quizzes
                </h3>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/30 rounded-xl text-center text-gray-500 text-sm">
                    No upcoming quizzes.
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-amber-500">⏱</span> Upcoming Quizzes
            </h3>
            {quizzes.map(quiz => (
                <QuizItem key={quiz.id} quiz={quiz} />
            ))}
        </div>
    );
};

export default UpcomingQuizzes;
