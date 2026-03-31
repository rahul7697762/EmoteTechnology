import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Clock } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const QuizItem = ({ quiz }) => {
    return (
        <div className="bg-white dark:bg-[#252A41] p-5 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm mb-4 rounded-none">
            <div className="flex gap-5">
                {/* Date Box */}
                <div className="shrink-0 w-16 flex flex-col items-center justify-center bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 py-3 rounded-none">
                    <span className="text-[10px] uppercase font-bold text-[#6B7194] dark:text-[#8B90B8] tracking-widest" style={{ fontFamily: MONO }}>{quiz.month}</span>
                    <span className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>{quiz.day}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h4 className="font-bold text-[#1A1D2E] dark:text-[#E8EAF2] text-lg mb-1" style={{ fontFamily: SERIF }}>{quiz.title}</h4>
                    <p className="text-[10px] text-[#6B7194] dark:text-[#8B90B8] font-bold uppercase tracking-widest mb-4" style={{ fontFamily: MONO }}>{quiz.time}</p>

                    {quiz.active ? (
                        <button className="w-full py-3 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm rounded-none border border-transparent" style={{ fontFamily: MONO }}>
                            View Details
                        </button>
                    ) : (
                        <button className="w-full py-3 bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#6B7194] dark:text-[#8B90B8] text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5" style={{ fontFamily: MONO }}>
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
            <div className="mb-8 p-6 flex justify-center">
                <div className="w-6 h-6 border-[3px] border-[#3B4FD8]/20 border-t-[#3B4FD8] dark:border-[#6C7EF5]/20 dark:border-t-[#6C7EF5] rounded-full animate-spin"></div>
            </div>
        )
    }

    if (quizzes.length === 0) {
        return (
            <div className="mb-8">
                <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-6 flex items-center gap-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-4" style={{ fontFamily: SERIF }}>
                    <Clock className="text-[#F5A623]" size={20} /> Upcoming Quizzes
                </h3>
                <div className="p-8 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm text-center">
                    <p className="text-[#6B7194] dark:text-[#8B90B8] text-xs uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>No upcoming quizzes.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-6 flex items-center gap-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-4" style={{ fontFamily: SERIF }}>
                <Clock className="text-[#F5A623]" size={20} /> Upcoming Quizzes
            </h3>
            {quizzes.map(quiz => (
                <QuizItem key={quiz.id} quiz={quiz} />
            ))}
        </div>
    );
};

export default UpcomingQuizzes;
