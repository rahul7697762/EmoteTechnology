import React, { useState } from 'react';
import { FileText, Users, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import SubmissionReview from './SubmissionReview';

const SubmissionsTab = ({ courseId, submissions, loading }) => {
    const [selectedAssessment, setSelectedAssessment] = useState(null);

    // Only show global loading if NO assessment is selected
    // If an assessment is selected, let SubmissionReview handle its own loading state
    if (loading && !selectedAssessment) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
            </div>
        );
    }

    if (!submissions || submissions.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700">
                <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No Assessments Yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Create assessments in the Edit Course section to start receiving submissions.
                </p>
            </div>
        );
    }

    // If an assessment is selected, show the review interface
    if (selectedAssessment) {
        return (
            <SubmissionReview
                assessment={selectedAssessment}
                onBack={() => setSelectedAssessment(null)}
            />
        );
    }

    // Show list of assessments with submission stats
    return (
        <div className="space-y-4">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Assessment Submissions
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Click on an assessment to review pending submissions
                </p>
            </div>

            <div className="grid gap-4">
                {submissions.map((item) => {
                    const { assessment, stats, submissions: assessmentSubmissions } = item;
                    const hasPending = stats.pending > 0;

                    return (
                        <div
                            key={assessment._id}
                            onClick={() => setSelectedAssessment({ ...assessment, submissions: assessmentSubmissions, stats })}
                            className={`bg-white dark:bg-[#1E293B] border-2 rounded-xl p-6 transition-all cursor-pointer ${hasPending
                                ? 'border-amber-200 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-900/50 hover:shadow-lg'
                                : 'border-slate-200 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-900/30 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {assessment.title}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${assessment.type === 'QUIZ'
                                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                            : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                                            }`}>
                                            {assessment.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                        Total Marks: {assessment.totalMarks} | Passing: {assessment.passingMarks}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-slate-400" />
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {stats.total} Total
                                            </span>
                                        </div>
                                        {stats.pending > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-amber-500" />
                                                <span className="text-sm font-bold text-amber-600 dark:text-amber-500">
                                                    {stats.pending} Pending Review
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={16} className="text-emerald-500" />
                                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">
                                                {stats.passed} Passed
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <XCircle size={16} className="text-red-500" />
                                            <span className="text-sm font-medium text-red-600 dark:text-red-500">
                                                {stats.failed} Failed
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight size={20} className="text-slate-400 mt-2" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SubmissionsTab;
