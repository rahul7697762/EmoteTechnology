import React, { useEffect, useState } from 'react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import { Clock, CheckCircle, AlertCircle, Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/slices/uiSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const StudentQuizzes = () => {
    const { user } = useSelector((state) => state.auth);
    const { isSidebarCollapsed } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // Currently reusing the same endpoint, but in a real app might need a different one for "All Quizzes"
                // For now, we will use the upcoming one and filter or mock past ones
                const response = await api.get('/student/upcoming-quizzes');

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
        <div className="bg-white dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 p-6 hover:shadow-md hover:border-[#3B4FD8]/30 dark:hover:border-[#6C7EF5]/30 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center rounded-none relative group">
            
            {/* Hover Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3B4FD8] dark:bg-[#6C7EF5] opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Date Badge */}
            <div className="shrink-0 w-20 h-20 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 flex flex-col items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5] rounded-none">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>{quiz.month}</span>
                <span className="text-3xl font-bold font-sans">{quiz.day}</span>
            </div>

            <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/10 text-[#6B7194] dark:text-[#8B90B8] text-[9px] font-bold uppercase tracking-widest rounded-none" style={{ fontFamily: MONO }}>
                        {quiz.courseName || 'General'}
                    </span>
                    {quiz.active && (
                        <span className="px-2 py-1 bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623] text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 rounded-none" style={{ fontFamily: MONO }}>
                            <Clock size={10} /> LIVE NOW
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3" style={{ fontFamily: SERIF }}>{quiz.title}</h3>

                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
                        <span>{quiz.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertCircle size={14} className="text-[#F5A623]" />
                        <span>30 MINS DURATION</span>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-auto mt-4 md:mt-0">
                <button className={`w-full md:w-auto px-8 py-4 font-bold text-[10px] uppercase tracking-widest transition-all rounded-none shadow-sm ${quiz.active
                    ? 'bg-[#3B4FD8] hover:bg-[#2f3fab] text-white'
                    : 'bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#6B7194] dark:text-[#8B90B8] cursor-not-allowed hidden md:block'
                    }`}
                    style={{ fontFamily: MONO }}
                >
                    {quiz.active ? 'START QUIZ' : 'NOT STARTED'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] flex transition-colors duration-300">
            <StudentSidebar />

            <main className={`flex-1 p-4 md:p-8 lg:p-12 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center mb-6">
                    <button 
                        onClick={() => dispatch(toggleSidebar())} 
                        className="p-2 -ml-2 text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors cursor-pointer"
                    >
                        <Menu size={24} />
                    </button>
                </div>
                <header className="mb-10 animate-in fade-in slide-in-from-top-4">
                    <h1 className="text-4xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3" style={{ fontFamily: SERIF }}>Quizzes & Assessments</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Track your upcoming tests and review past results</p>
                </header>

                {/* Tabs */}
                <div className="flex border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 mb-8 overflow-x-auto custom-scrollbar animate-in fade-in">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`pb-4 px-8 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === 'upcoming'
                            ? 'border-[#3B4FD8] text-[#3B4FD8] dark:border-[#6C7EF5] dark:text-[#6C7EF5]'
                            : 'border-transparent text-[#6B7194] dark:text-[#8B90B8] hover:text-[#1A1D2E] dark:hover:text-[#E8EAF2]'}`}
                        style={{ fontFamily: MONO }}
                    >
                        UPCOMING
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`pb-4 px-8 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === 'past'
                            ? 'border-[#3B4FD8] text-[#3B4FD8] dark:border-[#6C7EF5] dark:text-[#6C7EF5]'
                            : 'border-transparent text-[#6B7194] dark:text-[#8B90B8] hover:text-[#1A1D2E] dark:hover:text-[#E8EAF2]'}`}
                        style={{ fontFamily: MONO }}
                    >
                        PAST RESULTS
                    </button>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="w-12 h-12 border-[3px] border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 border-t-[#3B4FD8] dark:border-t-[#6C7EF5] rounded-none animate-spin"></div>
                    </div>
                ) : activeTab === 'upcoming' ? (
                    <div className="space-y-6 max-w-5xl animate-in slide-in-from-bottom-4">
                        {quizzes.length > 0 ? (
                            quizzes.map(quiz => (
                                <QuizCard key={quiz.id} quiz={quiz} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-[#1A1D2E] border border-dashed border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 rounded-none">
                                <div className="w-20 h-20 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/10 flex items-center justify-center mx-auto mb-6 text-[#6B7194] dark:text-[#8B90B8]">
                                    <CheckCircle size={40} className="text-[#10B981]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3" style={{ fontFamily: SERIF }}>No upcoming quizzes</h3>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>You're all caught up! Great job.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#1A1D2E] border border-dashed border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 rounded-none animate-in slide-in-from-bottom-4">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Past results history coming soon.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentQuizzes;
