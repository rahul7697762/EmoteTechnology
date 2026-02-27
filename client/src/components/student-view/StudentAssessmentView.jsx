import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAssessmentForStudent } from '../../redux/slices/assessmentSlice';
import { getMySubmissions } from '../../redux/slices/submissionSlice';
import QuizPlayer from '../dashboard/QuizPlayer';
import AssignmentUpload from '../dashboard/AssignmentUpload';
import {
    PlayCircle, FileText, CheckCircle, Clock, Download,
    HelpCircle, Trophy, Upload, AlertCircle, FileQuestion, History, XCircle, Eye
} from 'lucide-react';

const StudentAssessmentView = ({ moduleId, courseId, onCompleted, previewMode = false }) => {
    const dispatch = useDispatch();
    const { assessment, loading, error } = useSelector(state => state.assessment);
    const { submissions: history, loading: loadingHistory } = useSelector(state => state.submission);

    // State for UI management
    const [view, setView] = useState('START'); // START, ATTEMPT

    // Fetch assessment when moduleId changes
    useEffect(() => {
        if (moduleId) {
            dispatch(getAssessmentForStudent(moduleId));
            setView('START'); // Reset view on module change
        }
    }, [moduleId, dispatch]);

    // Fetch History when assessment is loaded (SKIP IN PREVIEW)
    useEffect(() => {
        if (assessment?._id && !previewMode) {
            dispatch(getMySubmissions(assessment._id));
        }
    }, [assessment?._id, dispatch, previewMode]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-full mb-4">
                    <AlertCircle size={32} className="text-red-500" />
                </div>
                <p className="text-lg font-medium text-slate-800 dark:text-white mb-2">Failed to load assessment</p>
                <p className="text-sm">{error.message || "Please try again later"}</p>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
                <FileQuestion size={48} className="text-slate-300 mb-4" />
                <p>No assessment found for this module.</p>
            </div>
        );
    }

    // --- RENDER MODES ---

    // 1. ATTEMPT MODE
    if (view === 'ATTEMPT') {
        return (
            <div className="h-full overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto py-6 px-4">
                    <button
                        onClick={() => setView('START')}
                        className="mb-6 flex items-center text-sm text-slate-500 hover:text-violet-600 transition-colors"
                    >
                        &larr; Back to Details
                    </button>

                    {assessment.type === 'QUIZ' ? (
                        <QuizPlayer
                            assessment={assessment}
                            onCompleted={() => {
                                onCompleted?.();
                                if (!previewMode) dispatch(getMySubmissions(assessment._id)); // Refresh history
                                setView('START');
                            }}
                            previewMode={previewMode}
                        />
                    ) : (
                        <AssignmentUpload
                            assessment={assessment}
                            onSubmitted={() => {
                                onCompleted?.();
                                dispatch(getMySubmissions(assessment._id)); // Refresh history
                                setView('START');
                            }}
                            previewMode={previewMode}
                        />
                    )}
                </div>
            </div>
        );
    }

    // 2. START SCREEN (Default)
    const lastSubmission = !previewMode && history && history.length > 0 ? history[0] : null;

    return (
        <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto py-8 px-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">

                    {/* Header Banner */}
                    <div className="bg-linear-to-r from-violet-600 to-indigo-600 px-8 py-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                            {assessment.type === 'QUIZ' ? <CheckCircle size={200} /> : <FileText size={200} />}
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4 text-violet-100 bg-white/10 w-fit px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/20">
                                {assessment.type === 'QUIZ' ? <Clock size={14} /> : <Download size={14} />}
                                {assessment.type === 'QUIZ' ? 'Quiz Assessment' : 'Assignment Task'}
                                {previewMode && <span className="ml-2 bg-amber-400 text-amber-900 px-2 rounded-full">PREVIEW MODE</span>}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{assessment.title}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-violet-100 font-medium">
                                {assessment.type === 'QUIZ' && (
                                    <div className="flex items-center gap-2">
                                        <HelpCircle size={18} />
                                        <span>{assessment.questions?.length || 0} Questions</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Trophy size={18} />
                                    <span>{assessment.passingMarks || 0} Marks to Pass</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    <span>Total: {assessment.totalMarks || 0} Marks</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-8">
                        {/* Status Badge */}
                        {lastSubmission && (
                            <div className={`mb-8 p-4 rounded-xl border flex items-center justify-between ${lastSubmission.status === 'PASSED'
                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                                : lastSubmission.status === 'FAILED'
                                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                                    : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {lastSubmission.status === 'PASSED' ? (
                                        <CheckCircle size={24} className="text-emerald-500" />
                                    ) : lastSubmission.status === 'FAILED' ? (
                                        <XCircle size={24} className="text-red-500" />
                                    ) : (
                                        <Clock size={24} className="text-amber-500" />
                                    )}
                                    <div>
                                        <h4 className={`font-bold ${lastSubmission.status === 'PASSED' ? 'text-emerald-700 dark:text-emerald-400' :
                                            lastSubmission.status === 'FAILED' ? 'text-red-700 dark:text-red-400' :
                                                'text-amber-700 dark:text-amber-400'
                                            }`}>
                                            {lastSubmission.status === 'PENDING_REVIEW' ? 'Under Review' : `You ${lastSubmission.status}`}
                                        </h4>
                                        <p className="text-sm opacity-80 text-slate-600 dark:text-slate-400">
                                            Last attempt: {new Date(lastSubmission.submittedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-slate-900 dark:text-white">
                                        {lastSubmission.score !== undefined ? lastSubmission.score : '-'}
                                        <span className="text-sm text-slate-500 font-normal"> / {assessment.totalMarks}</span>
                                    </span>
                                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        {lastSubmission.score !== undefined && assessment.totalMarks > 0
                                            ? `${Math.round((lastSubmission.score / assessment.totalMarks) * 100)}%`
                                            : 'Score'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Instructions</h3>
                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                {assessment.description || (
                                    assessment.type === 'QUIZ'
                                        ? "This quiz is designed to test your understanding of the module. You need to answer the questions correctly to pass. Good luck!"
                                        : "Please download the assignment instruction file below, complete the task, and upload your solution for review."
                                )}
                            </p>
                        </div>

                        {assessment.type === 'PDF' && assessment.questionPdfUrl && (
                            <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-900 dark:text-white">Assignment Problem Statement</h4>
                                        <p className="text-xs text-slate-500">PDF Document</p>
                                    </div>
                                </div>
                                <a
                                    href={assessment.questionPdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 transition-colors font-medium text-sm"
                                >
                                    <Download size={16} />
                                    Download
                                </a>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => setView('ATTEMPT')}
                                className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-violet-500/20"
                            >
                                {previewMode ? (
                                    <>
                                        <Eye size={20} /> Preview Assessment
                                    </>
                                ) : lastSubmission ? (
                                    <>
                                        <History size={20} /> Try Again
                                    </>
                                ) : assessment.type === 'QUIZ' ? (
                                    <>
                                        <PlayCircle size={20} /> Start Quiz
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} /> Submit Assignment
                                    </>
                                )}
                            </button>
                        </div>

                        {/* History List - HIDE IN PREVIEW */}
                        {!previewMode && history && history.length > 0 && (
                            <div className="mt-10">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <History size={20} /> Submission History
                                </h3>
                                <div className="space-y-3">
                                    {history.map((sub, idx) => (
                                        <div key={sub._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${sub.status === 'PASSED' ? 'bg-emerald-100 text-emerald-600' :
                                                    sub.status === 'FAILED' ? 'bg-red-100 text-red-600' :
                                                        'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {history.length - idx}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                        Attempt on {new Date(sub.submittedAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(sub.submittedAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${sub.status === 'PASSED' ? 'bg-emerald-100 text-emerald-600' :
                                                    sub.status === 'FAILED' ? 'bg-red-100 text-red-600' :
                                                        'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {sub.status}
                                                </span>
                                                <p className="text-sm font-bold mt-1">
                                                    {sub.score !== undefined ? sub.score : '-'} / {assessment.totalMarks}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAssessmentView;
