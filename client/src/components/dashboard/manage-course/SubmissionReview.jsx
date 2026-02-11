import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubmissionsByAssessment, reviewSubmission } from '../../../redux/slices/submissionSlice';
import { ArrowLeft, User, Calendar, FileText, Loader2, CheckCircle, XCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const SubmissionReview = ({ assessment, onBack }) => {
    const dispatch = useDispatch();
    const { submissions, loading, isReviewing } = useSelector((state) => state.submission);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [reviewData, setReviewData] = useState({ score: '', status: 'PASSED' });
    const [hasFetched, setHasFetched] = useState(false);

    // Fetch submissions only once when component mounts or assessment changes
    useEffect(() => {
        if (assessment?._id && !hasFetched) {
            setHasFetched(true);
            dispatch(getSubmissionsByAssessment({
                assessmentId: assessment._id,
                status: assessment.type === 'PDF' ? 'PENDING_REVIEW' : null
            }));
        }
    }, [assessment?._id, hasFetched, dispatch]);

    // Reset hasFetched when assessment changes
    useEffect(() => {
        setHasFetched(false);
    }, [assessment?._id]);

    const handleReview = async (submissionId) => {
        if (!reviewData.score || reviewData.score < 0 || reviewData.score > assessment.totalMarks) {
            toast.error(`Score must be between 0 and ${assessment.totalMarks}`);
            return;
        }

        try {
            await dispatch(reviewSubmission({
                id: submissionId,
                data: {
                    score: parseInt(reviewData.score),
                    status: parseInt(reviewData.score) >= assessment.passingMarks ? 'PASSED' : 'FAILED'
                }
            })).unwrap();

            // Reset form and close modal
            setSelectedSubmission(null);
            setReviewData({ score: '', status: 'PASSED' });

            // Redux automatically updates the submission in state, no need to refetch
        } catch (error) {
            // Error handled by slice
        }
    };

    if (loading && !submissions) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-violet-600" size={40} />
            </div>
        );
    }

    const pendingSubmissions = submissions?.filter(s => s.status === 'PENDING_REVIEW') || [];

    return (
        <div>
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Assessments</span>
            </button>

            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {assessment.title}
                </h2>
                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                    <span>Type: <strong className="text-slate-700 dark:text-slate-300">{assessment.type}</strong></span>
                    <span>Total Marks: <strong className="text-slate-700 dark:text-slate-300">{assessment.totalMarks}</strong></span>
                    <span>Passing Marks: <strong className="text-slate-700 dark:text-slate-300">{assessment.passingMarks}</strong></span>
                    <span>Pending: <strong className="text-amber-600 dark:text-amber-500">{pendingSubmissions.length}</strong></span>

                    {assessment.questionPdfUrl && (
                        <a
                            href={assessment.questionPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-violet-600 hover:text-violet-700 font-medium"
                        >
                            <FileText size={16} />
                            Question Paper
                        </a>
                    )}
                </div>
            </div>

            {pendingSubmissions.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700">
                    <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        All Caught Up!
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                        {assessment.type === 'QUIZ'
                            ? 'Quiz submissions are automatically graded.'
                            : 'No pending submissions to review.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingSubmissions.map((submission) => (
                        <div
                            key={submission._id}
                            className="bg-white dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-violet-300 dark:hover:border-violet-700 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    {submission.userId?.profile?.avatar ? (
                                        <img
                                            src={submission.userId.profile.avatar}
                                            alt={submission.userId.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-slate-200 dark:border-slate-700">
                                            <User size={24} className="text-slate-400" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">
                                            {submission.userId?.name || 'Unknown Student'}
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {submission.userId?.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <Calendar size={16} />
                                    {new Date(submission.submittedAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* PDF Link */}
                            {submission.pdfUrl ? (
                                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                                            <FileText size={24} className="text-violet-600 dark:text-violet-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">Submitted Answer Script</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">PDF Document</p>
                                        </div>
                                    </div>
                                    <a
                                        href={submission.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                                    >
                                        <Download size={16} />
                                        View / Download
                                    </a>
                                </div>
                            ) : (
                                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg text-sm text-amber-800 dark:text-amber-400">
                                    No PDF file attached to this submission.
                                </div>
                            )}

                            {/* Review Form */}
                            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                <div className="flex items-end gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Score (out of {assessment.totalMarks})
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max={assessment.totalMarks}
                                            value={selectedSubmission === submission._id ? reviewData.score : ''}
                                            onChange={(e) => {
                                                setSelectedSubmission(submission._id);
                                                setReviewData({ ...reviewData, score: e.target.value });
                                            }}
                                            className="w-full px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                                            placeholder="Enter score"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleReview(submission._id)}
                                        disabled={!reviewData.score || selectedSubmission !== submission._id || isReviewing}
                                        className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
                                    >
                                        {isReviewing && selectedSubmission === submission._id ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={18} />
                                                Submit Review
                                            </>
                                        )}
                                    </button>
                                </div>
                                {reviewData.score && selectedSubmission === submission._id && (
                                    <p className={`mt-2 text-sm font-medium ${parseInt(reviewData.score) >= assessment.passingMarks
                                        ? 'text-emerald-600 dark:text-emerald-500'
                                        : 'text-red-600 dark:text-red-500'
                                        }`}>
                                        {parseInt(reviewData.score) >= assessment.passingMarks ? '✓ Pass' : '✗ Fail'}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubmissionReview;
