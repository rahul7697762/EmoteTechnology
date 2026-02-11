import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubmissions, gradeSubmission } from '../../redux/slices/submissionSlice';
import { ExternalLink, X, CheckCircle, AlertCircle } from 'lucide-react';

const SubmissionReview = ({ assessmentId }) => {
    const dispatch = useDispatch();
    const { submissions, loading } = useSelector(state => state.submission);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradeData, setGradeData] = useState({ score: 0, status: 'PASSED', feedback: '' });

    useEffect(() => {
        if (assessmentId) {
            dispatch(getSubmissions(assessmentId));
        }
    }, [assessmentId, dispatch]);

    const handleOpenGrade = (submission) => {
        setSelectedSubmission(submission);
        setGradeData({
            score: submission.score || 0,
            status: submission.status === 'PENDING_REVIEW' ? 'PASSED' : submission.status,
            feedback: ''
        });
    };

    const handleGradeSubmit = async () => {
        await dispatch(gradeSubmission({
            id: selectedSubmission._id,
            data: gradeData
        }));
        setSelectedSubmission(null);
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Submissions</h3>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Student</th>
                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Date</th>
                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Type</th>
                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Score</th>
                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                            <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900/50">
                        {submissions.map((sub) => (
                            <tr key={sub._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-3">
                                    <p className="font-medium text-slate-900 dark:text-white text-sm">{sub.userId?.name || 'Unknown'}</p>
                                    <p className="text-xs text-slate-500">{sub.userId?.email}</p>
                                </td>
                                <td className="p-3 text-sm text-slate-600 dark:text-slate-400">
                                    {new Date(sub.submittedAt).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-sm text-slate-600 dark:text-slate-400">{sub.submissionType}</td>
                                <td className="p-3 text-sm font-medium">{sub.score}%</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sub.status === 'PASSED' ? 'bg-green-100 text-green-700' :
                                            sub.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    {sub.submissionType === 'PDF' ? (
                                        <button
                                            onClick={() => handleOpenGrade(sub)}
                                            className="text-violet-600 hover:text-violet-800 text-sm font-medium"
                                        >
                                            Review
                                        </button>
                                    ) : (
                                        <span className="text-xs text-slate-400">Auto-graded</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {submissions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    No submissions yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Grading Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Grade Submission</h3>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Submitted File</h4>
                                <a
                                    href={selectedSubmission.pdfUrl}
                                    target="_blank"
                                    rel="noopener"
                                    className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    <ExternalLink size={16} className="mr-2" /> Open PDF
                                </a>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Score (0-100)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 outline-none"
                                    value={gradeData.score}
                                    onChange={(e) => setGradeData({ ...gradeData, score: Number(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                <select
                                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 outline-none"
                                    value={gradeData.status}
                                    onChange={(e) => setGradeData({ ...gradeData, status: e.target.value })}
                                >
                                    <option value="PASSED">PASSED</option>
                                    <option value="FAILED">FAILED</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feedback</label>
                                <textarea
                                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 outline-none"
                                    rows="3"
                                    value={gradeData.feedback}
                                    onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGradeSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Submit Grade'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionReview;
