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

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
                <div className="w-10 h-10 border-[3px] border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 border-t-[#3B4FD8] dark:border-t-[#6C7EF5] animate-spin rounded-none"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-[#1A1D2E] dark:text-[#E8EAF2]">
                <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 p-6 rounded-none mb-6">
                    <AlertCircle size={40} className="text-[#EF4444]" />
                </div>
                <p className="text-2xl font-bold mb-2" style={{ fontFamily: SERIF }}>Failed to load assessment</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>{error.message || "Please try again later"}</p>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-[#6B7194] dark:text-[#8B90B8]">
                <FileQuestion size={48} className="opacity-50 mb-6" />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>No assessment found for this module.</p>
            </div>
        );
    }

    // --- RENDER MODES ---

    // 1. ATTEMPT MODE
    if (view === 'ATTEMPT') {
        return (
            <div className="h-full overflow-y-auto custom-scrollbar bg-[#F7F8FF] dark:bg-[#0A0B10]">
                <div className="max-w-4xl mx-auto py-8 px-6">
                    <button
                        onClick={() => setView('START')}
                        className="mb-8 flex items-center text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                        style={{ fontFamily: MONO }}
                    >
                        &larr; BACK TO DETAILS
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
        <div className="h-full overflow-y-auto custom-scrollbar bg-[#F7F8FF] dark:bg-[#0A0B10]">
            <div className="max-w-4xl mx-auto py-10 px-6">
                <div className="bg-white dark:bg-[#1A1D2E] rounded-none shadow-sm border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 overflow-hidden">

                    {/* Header Banner */}
                    <div className="bg-[#3B4FD8] dark:bg-[#6C7EF5] px-10 py-12 text-white dark:text-[#1A1D2E] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-1/4 -translate-y-1/4 text-white dark:text-[#1A1D2E]">
                            {assessment.type === 'QUIZ' ? <CheckCircle size={280} /> : <FileText size={280} />}
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6 bg-white/10 dark:bg-black/10 w-fit px-4 py-2 border border-white/20 dark:border-black/20 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>
                                {assessment.type === 'QUIZ' ? <Clock size={16} /> : <Download size={16} />}
                                {assessment.type === 'QUIZ' ? 'Quiz Assessment' : 'Assignment Task'}
                                {previewMode && <span className="ml-3 bg-[#F5A623] text-[#1A1D2E] px-3 py-1 font-bold">PREVIEW MODE</span>}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white dark:text-[#1A1D2E]" style={{ fontFamily: SERIF }}>{assessment.title}</h1>
                            <div className="flex flex-wrap items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-white/90 dark:text-[#1A1D2E]/90" style={{ fontFamily: MONO }}>
                                {assessment.type === 'QUIZ' && (
                                    <div className="flex items-center gap-2">
                                        <HelpCircle size={16} />
                                        <span>{assessment.questions?.length || 0} Questions</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Trophy size={16} />
                                    <span>{assessment.passingMarks || 0} Marks to Pass</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    <span>Total: {assessment.totalMarks || 0} Marks</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-10">
                        {/* Status Badge */}
                        {lastSubmission && (
                            <div className={`mb-10 p-6 border-l-[4px] flex items-center justify-between ${lastSubmission.status === 'PASSED'
                                ? 'bg-[#10B981]/10 border-[#10B981]'
                                : lastSubmission.status === 'FAILED'
                                    ? 'bg-[#EF4444]/10 border-[#EF4444]'
                                    : 'bg-[#F5A623]/10 border-[#F5A623]'
                                }`}>
                                <div className="flex items-center gap-4">
                                    {lastSubmission.status === 'PASSED' ? (
                                        <CheckCircle size={28} className="text-[#10B981]" />
                                    ) : lastSubmission.status === 'FAILED' ? (
                                        <XCircle size={28} className="text-[#EF4444]" />
                                    ) : (
                                        <Clock size={28} className="text-[#F5A623]" />
                                    )}
                                    <div>
                                        <h4 className={`text-xl font-bold ${lastSubmission.status === 'PASSED' ? 'text-[#10B981]' :
                                            lastSubmission.status === 'FAILED' ? 'text-[#EF4444]' :
                                                'text-[#F5A623]'
                                            }`} style={{ fontFamily: SERIF }}>
                                            {lastSubmission.status === 'PENDING_REVIEW' ? 'UNDER REVIEW' : `YOU ${lastSubmission.status}`}
                                        </h4>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1" style={{ fontFamily: MONO }}>
                                            Last attempt: {new Date(lastSubmission.submittedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-4xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                                        {lastSubmission.score !== undefined ? lastSubmission.score : '-'}
                                        <span className="text-lg text-[#6B7194] dark:text-[#8B90B8] opacity-70"> / {assessment.totalMarks}</span>
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                                        {lastSubmission.score !== undefined && assessment.totalMarks > 0
                                            ? `${Math.round((lastSubmission.score / assessment.totalMarks) * 100)}% SCORE`
                                            : 'SCORE'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
                            <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-4" style={{ fontFamily: SERIF }}>Instructions</h3>
                            <p className="text-[#1A1D2E]/80 dark:text-[#E8EAF2]/80 leading-relaxed whitespace-pre-wrap">
                                {assessment.description || (
                                    assessment.type === 'QUIZ'
                                        ? "This quiz is designed to test your understanding of the module. You need to answer the questions correctly to pass. Good luck!"
                                        : "Please download the assignment instruction file below, complete the task, and upload your solution for review."
                                )}
                            </p>
                        </div>

                        {assessment.type === 'PDF' && assessment.questionPdfUrl && (
                            <div className="mb-10 p-6 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-white dark:bg-[#1A1D2E] border border-[#EF4444]/20 text-[#EF4444]">
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>Assignment Problem Statement</h4>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mt-1" style={{ fontFamily: MONO }}>PDF Document</p>
                                    </div>
                                </div>
                                <a
                                    href={assessment.questionPdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-[#3B4FD8] hover:text-white dark:hover:bg-[#6C7EF5] dark:hover:text-[#1A1D2E] dark:hover:border-[#6C7EF5] transition-colors font-bold text-[10px] uppercase tracking-widest"
                                    style={{ fontFamily: MONO }}
                                >
                                    <Download size={16} />
                                    Download
                                </a>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                            <button
                                onClick={() => setView('ATTEMPT')}
                                className="flex-1 flex items-center justify-center gap-3 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] px-10 py-5 font-bold transition-colors shadow-sm text-[10px] uppercase tracking-widest"
                                style={{ fontFamily: MONO }}
                            >
                                {previewMode ? (
                                    <>
                                        <Eye size={18} /> PREVIEW ASSESSMENT
                                    </>
                                ) : lastSubmission ? (
                                    <>
                                        <History size={18} /> TRY AGAIN
                                    </>
                                ) : assessment.type === 'QUIZ' ? (
                                    <>
                                        <PlayCircle size={18} /> START QUIZ
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} /> SUBMIT ASSIGNMENT
                                    </>
                                )}
                            </button>
                        </div>

                        {/* History List - HIDE IN PREVIEW */}
                        {!previewMode && history && history.length > 0 && (
                            <div className="mt-16 pt-10 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                                <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-8 flex items-center gap-3" style={{ fontFamily: SERIF }}>
                                    <History size={24} className="text-[#3B4FD8] dark:text-[#6C7EF5]" /> Submission History
                                </h3>
                                <div className="space-y-4">
                                    {history.map((sub, idx) => (
                                        <div key={sub._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 hover:border-[#3B4FD8]/30 transition-colors gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 flex items-center justify-center font-bold text-sm border ${sub.status === 'PASSED' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' :
                                                    sub.status === 'FAILED' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30' :
                                                        'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/30'
                                                    }`} style={{ fontFamily: MONO }}>
                                                    #{history.length - idx}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                                                        Attempt on {new Date(sub.submittedAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mt-1" style={{ fontFamily: MONO }}>
                                                        {new Date(sub.submittedAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right flex items-center sm:block gap-4 sm:gap-0">
                                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${sub.status === 'PASSED' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' :
                                                    sub.status === 'FAILED' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30' :
                                                        'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/30'
                                                    }`} style={{ fontFamily: MONO }}>
                                                    {sub.status}
                                                </span>
                                                <p className="text-xl font-bold mt-2 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
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
