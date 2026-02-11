import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addQuestion, deleteQuestion, updateAssessment } from '../../redux/slices/assessmentSlice';
import { Trash2, Plus, Save, X } from 'lucide-react';

const QuizEditor = ({ assessment }) => {
    const dispatch = useDispatch();
    const [newQuestion, setNewQuestion] = useState({
        questionText: '',
        type: 'MCQ',
        options: ['', '', '', ''],
        correctAnswer: '',
        marks: 5
    });
    const [adding, setAdding] = useState(false);

    // Calculate passing percentage from passingMarks
    const [passingPercentage, setPassingPercentage] = useState(
        assessment.totalMarks > 0
            ? Math.round((assessment.passingMarks / assessment.totalMarks) * 100)
            : 50
    );

    // Auto-calculate totalMarks when questions change
    useEffect(() => {
        if (assessment.questions && assessment.questions.length > 0) {
            const calculatedTotal = assessment.questions.reduce((sum, q) => sum + (q.marks || 0), 0);

            // Only update if different from current totalMarks
            if (calculatedTotal !== assessment.totalMarks) {
                const newPassingMarks = Math.round((calculatedTotal * passingPercentage) / 100);

                dispatch(updateAssessment({
                    id: assessment._id,
                    data: {
                        totalMarks: calculatedTotal,
                        passingMarks: newPassingMarks
                    }
                }));
            }
        }
    }, [assessment.questions]);

    // Update passingMarks when percentage changes
    const handlePassingPercentageChange = (percentage) => {
        setPassingPercentage(percentage);

        if (percentage === '' || isNaN(percentage)) return;

        const newPassingMarks = Math.round((assessment.totalMarks * percentage) / 100);

        dispatch(updateAssessment({
            id: assessment._id,
            data: {
                passingMarks: newPassingMarks
            }
        }));
    };

    const handleAddQuestion = async () => {
        if (!newQuestion.questionText || !newQuestion.correctAnswer) return;

        await dispatch(addQuestion({
            assessmentId: assessment._id,
            data: newQuestion
        }));

        setNewQuestion({
            questionText: '',
            type: 'MCQ',
            options: ['', '', '', ''],
            correctAnswer: '',
            marks: 5
        });
        setAdding(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteQuestion(id));
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">Quiz Questions</h3>

            {/* Assessment Info */}
            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Total Marks</label>
                        <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                            {assessment.totalMarks || 0}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Auto-calculated from questions</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Passing Marks</label>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {assessment.passingMarks || 0}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Passing Percentage</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={passingPercentage}
                                onChange={(e) => handlePassingPercentageChange(e.target.value === '' ? '' : parseInt(e.target.value))}
                                className="w-20 px-3 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-lg font-bold text-center"
                            />
                            <span className="text-lg font-bold text-slate-600 dark:text-slate-300">%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {assessment.questions && assessment.questions.map((q, index) => (
                    <div key={q._id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-slate-900 dark:text-white text-base">
                                {index + 1}. {q.questionText}
                            </h4>
                            <button
                                onClick={() => handleDelete(q._id)}
                                className="text-red-500 hover:text-red-700 p-1"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div className="pl-4 space-y-1">
                            {q.options.map((opt, i) => (
                                <p key={i} className={`text-sm ${opt === q.correctAnswer ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                                    {String.fromCharCode(65 + i)}. {opt}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {!adding ? (
                <button
                    onClick={() => setAdding(true)}
                    className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center font-medium"
                >
                    <Plus size={18} className="mr-2" /> Add Question
                </button>
            ) : (
                <div className="mt-4 p-4 border border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-900/10 rounded-xl">
                    <h4 className="text-sm font-semibold text-violet-800 dark:text-violet-300 mb-3 uppercase tracking-wider">New Question</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Question Text</label>
                            <textarea
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-violet-500 outline-none"
                                rows="2"
                                value={newQuestion.questionText}
                                onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Marks</label>
                            <input
                                type="number"
                                className="w-24 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-violet-500 outline-none"
                                value={newQuestion.marks}
                                onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Options</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {newQuestion.options.map((opt, i) => (
                                    <div key={i} className="flex items-center">
                                        <span className="text-sm font-bold text-slate-400 w-6">{String.fromCharCode(65 + i)}.</span>
                                        <input
                                            className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                                            value={opt}
                                            onChange={(e) => {
                                                const newOptions = [...newQuestion.options];
                                                newOptions[i] = e.target.value;
                                                setNewQuestion({ ...newQuestion, options: newOptions });
                                            }}
                                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correct Answer (Exact Match)</label>
                            <input
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-violet-500 outline-none"
                                value={newQuestion.correctAnswer}
                                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                                placeholder="Paste the correct option text here"
                            />
                            <p className="text-xs text-slate-500 mt-1">Must match one of the options exactly.</p>
                        </div>

                        <div className="flex justify-end pt-2 space-x-2">
                            <button
                                onClick={() => setAdding(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddQuestion}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center"
                            >
                                <Save size={16} className="mr-2" /> Save Question
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizEditor;
