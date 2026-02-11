import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { submitAssessment } from '../../redux/slices/submissionSlice';
import { CheckCircle, XCircle, AlertCircle, Maximize, Minimize, X, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

const QuizPlayer = ({ assessment, onCompleted, previewMode = false }) => {
    const dispatch = useDispatch();
    const [answers, setAnswers] = useState({}); // { questionId: optionString }
    const [submitting, setSubmitting] = useState(false);
    const { questions } = assessment;
    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Result State
    const [result, setResult] = useState(null);

    // Enter full screen on mount
    useEffect(() => {
        const enterFullScreen = async () => {
            try {
                if (containerRef.current && containerRef.current.requestFullscreen) {
                    await containerRef.current.requestFullscreen();
                    setIsFullscreen(true);
                }
            } catch (err) {
                console.error("Error enabling full-screen:", err);
            }
        };
        enterFullScreen();

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => console.error(err));
            }
        };
    }, []);

    const handleExit = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.error(err));
        }
        if (onCompleted) onCompleted(null); // Exit without result if cancelled
    };

    const handleOptionChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        if (previewMode) {
            toast.success("This is a preview. Submission is disabled.");
            return;
        }

        const answeredCount = Object.keys(answers).length;
        if (answeredCount < questions.length) {
            if (!window.confirm(`You have answered ${answeredCount} of ${questions.length} questions. Are you sure you want to submit?`)) {
                return;
            }
        }

        setSubmitting(true);
        try {
            const minimalAnswers = Object.entries(answers).map(([qId, val]) => ({
                questionId: qId,
                selectedOption: val
            }));

            const resultAction = await dispatch(submitAssessment({
                assessmentId: assessment._id,
                data: {
                    answers: minimalAnswers,
                    submissionType: 'QUIZ'
                }
            })).unwrap();

            setResult(resultAction.data);
            // Don't auto-close, let them see the result
            // if (onCompleted) onCompleted(resultAction.data);

        } catch (error) {
            console.error("Quiz submission failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    const currentQuestionIndex = Object.keys(answers).length;
    const progress = Math.round((currentQuestionIndex / questions.length) * 100);

    if (result) {
        return (
            <div ref={containerRef} className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 overflow-y-auto">
                <div className="max-w-xl w-full p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <div className={`mb-6 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center ${result.status === 'PASSED' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'
                        }`}>
                        {result.status === 'PASSED' ? <CheckCircle size={40} /> : <XCircle size={40} />}
                    </div>

                    <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                        Quiz {result.status === 'PASSED' ? 'Passed!' : 'Failed'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        {result.status === 'PASSED'
                            ? "Excellent work! You've mastered this module."
                            : "Don't worry, you can try again to improve your score."}
                    </p>

                    <div className="flex items-center justify-center gap-8 mb-8">
                        <div className="text-center">
                            <span className="block text-4xl font-bold text-slate-900 dark:text-white">
                                {assessment.totalMarks > 0
                                    ? Math.round((result.score / assessment.totalMarks) * 100)
                                    : 0}%
                            </span>
                            <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                                Score ({result.score}/{assessment.totalMarks})
                            </span>
                        </div>
                        <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                        <div className="text-center">
                            <span className={`block text-4xl font-bold ${result.status === 'PASSED' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {result.status}
                            </span>
                            <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Status</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (onCompleted) onCompleted(result);
                        }}
                        className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/25"
                    >
                        {result.status === 'PASSED' ? 'Continue Course' : 'Close & Retry'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-md">
                        {assessment.title}
                    </h2>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-full text-xs font-bold uppercase tracking-wider">
                        <AlertCircle size={14} />
                        {questions.length} Questions
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right mr-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Progress</span>
                        <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{Object.keys(answers).length}/{questions.length}</span>
                    </div>
                    <button
                        onClick={handleExit}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                        title="Exit Quiz"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-slate-200 dark:bg-slate-700 w-full">
                <div
                    className="h-full bg-violet-600 transition-all duration-300 ease-out"
                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-8 pb-20">
                    {questions && questions.map((q, index) => (
                        <div key={q._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
                            <div className="flex gap-4 mb-6">
                                <span className="shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center">
                                    {index + 1}
                                </span>
                                <h3 className="text-lg md:text-xl font-medium text-slate-900 dark:text-white pt-1">
                                    {q.questionText}
                                </h3>
                            </div>

                            <div className="space-y-3 pl-12">
                                {q.options.map((opt, i) => (
                                    <label
                                        key={i}
                                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[q._id] === opt
                                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 shadow-sm'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${answers[q._id] === opt ? 'border-violet-600' : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                            {answers[q._id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
                                        </div>
                                        <span className={`text-base ${answers[q._id] === opt ? 'font-medium text-violet-900 dark:text-violet-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {opt}
                                        </span>
                                        <input
                                            type="radio"
                                            name={`question-${q._id}`}
                                            value={opt}
                                            checked={answers[q._id] === opt}
                                            onChange={() => handleOptionChange(q._id, opt)}
                                            className="hidden" // Hide default radio
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="h-20 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center px-6 shrink-0 z-10">
                <div className="max-w-3xl w-full flex justify-between items-center">
                    <div className="text-sm text-slate-500 hidden sm:block">
                        {Object.keys(answers).length} of {questions.length} Answered
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`px-8 py-3 font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg ${previewMode
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                            : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                    >
                        {submitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : previewMode ? (
                            <>
                                <Eye size={20} /> Preview Only
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} /> Submit Quiz
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizPlayer;
