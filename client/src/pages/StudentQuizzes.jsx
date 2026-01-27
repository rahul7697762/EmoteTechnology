import React, { useEffect, useState } from 'react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Search, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const StudentQuizzes = () => {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');

                // Currently reusing the same endpoint, but in a real app might need a different one for "All Quizzes"
                // For now, we will use the upcoming one and filter or mock past ones
                const response = await axios.get(`${apiUrl}/student/upcoming-quizzes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setQuizzes(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch quizzes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    // Helper to render quiz card
    const QuizCard = ({ quiz }) => (
        <div className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center">

            {/* Date Badge */}
            <div className="flex-shrink-0 w-20 h-20 bg-teal-50 dark:bg-teal-900/10 rounded-2xl flex flex-col items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/20">
                <span className="text-xs font-bold uppercase tracking-wider">{quiz.month}</span>
                <span className="text-3xl font-bold">{quiz.day}</span>
            </div>

            <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-md uppercase tracking-wide">
                        {quiz.courseName || 'General'}
                    </span>
                    {quiz.active && (
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-md uppercase tracking-wide flex items-center gap-1">
                            <Clock size={12} /> Live Now
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        <span>{quiz.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <AlertCircle size={16} />
                        <span>30 Mins Duration</span>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-auto">
                <button className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all ${quiz.active
                        ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}>
                    {quiz.active ? 'Start Quiz' : 'Not Started'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white font-sans flex">
            <StudentSidebar />

            <main className="flex-1 md:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quizzes & Assessments</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your upcoming tests and review past results</p>
                </header>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`pb-4 px-6 text-sm font-bold border-b-2 transition-colors ${activeTab === 'upcoming'
                            ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`pb-4 px-6 text-sm font-bold border-b-2 transition-colors ${activeTab === 'past'
                            ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        Past Results
                    </button>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : activeTab === 'upcoming' ? (
                    <div className="space-y-4">
                        {quizzes.length > 0 ? (
                            quizzes.map(quiz => (
                                <QuizCard key={quiz.id} quiz={quiz} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-[#1a1c23] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No upcoming quizzes</h3>
                                <p className="text-gray-500 dark:text-gray-400">You're all caught up! Great job.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#1a1c23] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                        <p className="text-gray-500 dark:text-gray-400">Past results history coming soon.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentQuizzes;
