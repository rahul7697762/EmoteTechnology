import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createAssessment,
    getAssessmentForFaculty,
    updateAssessment,
    deleteAssessment,
    togglePublishAssessment
} from '../../redux/slices/assessmentSlice';
import QuizEditor from './QuizEditor';
import { Plus, Edit, FileText, CheckCircle, X, Save, Upload, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';

const AssessmentManager = ({ moduleId, courseId, hasAssessment, onUpdate }) => {
    const dispatch = useDispatch();
    const [openCreation, setOpenCreation] = useState(false);
    const [openEditor, setOpenEditor] = useState(false);

    // Creation State
    const [type, setType] = useState('QUIZ');
    const [title, setTitle] = useState('');
    const [questionPdf, setQuestionPdf] = useState(null); // New state for file

    // Edit State (for PDF mainly)
    const [editTitle, setEditTitle] = useState('');
    const [editPdf, setEditPdf] = useState(null);
    const [editTotalMarks, setEditTotalMarks] = useState(0);
    const [editPassingMarks, setEditPassingMarks] = useState(0);

    // Current Assessment Data
    const { assessment, isCreating, isDeletingAssessment } = useSelector(state => state.assessment);

    // Fetch assessment when component mounts or hasAssessment changes
    useEffect(() => {
        if (hasAssessment && moduleId) {
            dispatch(getAssessmentForFaculty(moduleId));
        }
    }, [hasAssessment, moduleId, dispatch]);

    useEffect(() => {
        if (assessment) {
            setEditTitle(assessment.title);
            setEditTotalMarks(assessment.totalMarks || 0);
            setEditPassingMarks(assessment.passingMarks || 0);
        }
    }, [assessment]);

    const handleCreateSubmit = async () => {
        if (!title) return;

        const formData = new FormData();
        formData.append('courseId', courseId);
        formData.append('moduleId', moduleId);
        formData.append('type', type);
        formData.append('title', title);

        // PDF Upload removed from creation

        try {
            // Note: The moduleSlice now listens to createAssessment.fulfilled to update hasAssessment
            await dispatch(createAssessment(formData)).unwrap();
            setOpenCreation(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Failed to create assessment", error);
        }
    };

    const handleUpdateAssessment = async () => {
        if (!editTitle) return;

        const formData = new FormData();
        formData.append('title', editTitle);

        if (assessment.type === 'PDF') {
            formData.append('totalMarks', editTotalMarks);
            formData.append('passingMarks', editPassingMarks);
            if (editPdf) {
                formData.append('questionPdf', editPdf);
            }
        } else {
            // For Quiz, marks are calculated from questions usually, but simple update might be allowed if needed.
            // But usually Quiz Editor handles this.
            // Logic kept simple for now as requested.
        }


        try {
            await dispatch(updateAssessment({ id: assessment._id, data: formData })).unwrap();
            setOpenEditor(false);
            setEditPdf(null);
        } catch (error) {
            console.error("Failed to update assessment", error);
        }
    };

    if (hasAssessment && assessment) {
        return (
            <div className="mt-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-800 dark:text-white">{assessment.title}</h4>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                                {assessment.type}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {assessment.type === 'QUIZ'
                                ? `${assessment.questions?.length || 0} Questions`
                                : "PDF Assignment"
                            }
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => dispatch(togglePublishAssessment(assessment._id))}
                            className={`px-3 py-1.5 text-sm border rounded transition-colors flex items-center gap-2 ${assessment.status === 'PUBLISHED'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
                                : 'bg-slate-50 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            title={assessment.status === 'PUBLISHED' ? "Unpublish Assessment" : "Publish Assessment"}
                        >
                            {assessment.status === 'PUBLISHED' ? <Eye size={14} /> : <EyeOff size={14} />}
                            {assessment.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                        </button>
                        <button
                            onClick={() => setOpenEditor(true)}
                            className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2"
                        >
                            <Edit size={14} />
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
                                    dispatch(deleteAssessment({ id: assessment._id, moduleId }))
                                        .unwrap()
                                        .then(() => {
                                            if (onUpdate) onUpdate();
                                        });
                                }
                            }}
                            disabled={isDeletingAssessment}
                            className="px-3 py-1.5 text-sm border border-red-200 dark:border-red-900/30 rounded bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeletingAssessment ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            {isDeletingAssessment ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>

                {/* Editor Modal */}
                {openEditor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Edit {assessment.type === 'QUIZ' ? 'Quiz' : 'Assignment'}
                                </h3>
                                <button onClick={() => setOpenEditor(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1">
                                {assessment.type === 'QUIZ' ? (
                                    <QuizEditor assessment={assessment} />
                                ) : (
                                    <div className="space-y-6">
                                        {/* Edit Title */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                            <input
                                                className="w-full pl-4 pr-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-400 dark:text-white font-medium"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                placeholder="Assessment Title"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Total Marks</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-full pl-4 pr-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-400 dark:text-white font-medium"
                                                    value={editTotalMarks}
                                                    onChange={(e) => setEditTotalMarks(e.target.value === '' ? '' : Number(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Passing Marks</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-full pl-4 pr-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-400 dark:text-white font-medium"
                                                    value={editPassingMarks}
                                                    onChange={(e) => setEditPassingMarks(e.target.value === '' ? '' : Number(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        {/* Existing PDF Info */}
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <FileText size={24} className="text-violet-600" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Current Question Paper</p>
                                                    {assessment.questionPdfUrl ? (
                                                        <a href={assessment.questionPdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 hover:underline">
                                                            View/Download PDF
                                                        </a>
                                                    ) : (
                                                        <p className="text-xs text-slate-500 italic">No file uploaded</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Upload New PDF */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Replace Question Paper (optional)</label>
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={(e) => setEditPdf(e.target.files[0])}
                                                className="block w-full text-sm text-slate-500
                                                  file:mr-4 file:py-2 file:px-4
                                                  file:rounded-full file:border-0
                                                  file:text-sm file:font-semibold
                                                  file:bg-violet-50 file:text-violet-700
                                                  hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-300
                                                "
                                            />
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                onClick={handleUpdateAssessment}
                                                disabled={!editTitle} // Disabled if no title
                                                className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                                            >
                                                <Save size={18} />
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default: Add Assessment Button
    return (
        <div className="mt-2 text-center">
            {!hasAssessment && (
                <button
                    onClick={() => setOpenCreation(true)}
                    className="group w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all flex flex-col items-center justify-center gap-2"
                >
                    <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={20} className="text-violet-600 dark:text-violet-300" />
                    </div>
                    <span className="font-medium text-slate-600 dark:text-slate-300 group-hover:text-violet-700 dark:group-hover:text-violet-300">
                        Add Assessment
                    </span>
                </button>
            )}

            {openCreation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Assessment</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose the type of assessment you want to create.</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setType('QUIZ')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${type === 'QUIZ'
                                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 shadow-md transform scale-[1.02]'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                >
                                    {type === 'QUIZ' && (
                                        <div className="absolute top-2 right-2 text-violet-600">
                                            <CheckCircle size={18} />
                                        </div>
                                    )}
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform">
                                        <CheckCircle size={20} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Quiz</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Multiple choice questions with auto-grading.</p>
                                </button>

                                <button
                                    onClick={() => setType('PDF')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${type === 'PDF'
                                        ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 shadow-md transform scale-[1.02]'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                >
                                    {type === 'PDF' && (
                                        <div className="absolute top-2 right-2 text-violet-600">
                                            <CheckCircle size={18} />
                                        </div>
                                    )}
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform">
                                        <FileText size={20} className="text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Assignment</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Students upload a PDF file for manual review.</p>
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                <div className="relative">
                                    <input
                                        className="w-full pl-4 pr-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all placeholder:text-slate-400 dark:text-white font-medium"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Fundamental Concepts Quiz"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Removed PDF Upload Field from Creation - Only available in Edit */}
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setOpenCreation(false)}
                                className="px-5 py-2.5 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSubmit}
                                disabled={isCreating || !title}
                                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/30 flex items-center transform active:scale-95"
                            >
                                {isCreating ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Assessment'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssessmentManager;
