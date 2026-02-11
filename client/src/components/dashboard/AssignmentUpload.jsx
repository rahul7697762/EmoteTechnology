import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitAssessment } from '../../redux/slices/submissionSlice';
import { UploadCloud, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AssignmentUpload = ({ assessment, onSubmitted, previewMode = false }) => {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { loading, error } = useSelector(state => state.submission);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            if (e.target.files[0].type !== 'application/pdf') {
                alert("Only PDF files are allowed");
                return;
            }
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (previewMode) {
            toast.success("This is a preview. Submission is disabled.");
            return;
        }

        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('submissionType', 'PDF');

            await dispatch(submitAssessment({
                assessmentId: assessment._id,
                data: formData
            })).unwrap();

            if (onSubmitted) onSubmitted();

        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mt-4 max-w-2xl mx-auto p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-center">
            <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{assessment.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
                {assessment.description || "Please upload your assignment in PDF format."}
            </p>

            <label className="block w-full cursor-pointer">
                <div className={`border-2 border-dashed rounded-xl p-8 transition-colors ${file ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}>
                    <input
                        type="file"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />

                    <div className="flex flex-col items-center">
                        {file ? (
                            <>
                                <FileText className="w-12 h-12 text-violet-600 mb-3" />
                                <p className="text-lg font-medium text-violet-700 dark:text-violet-400">{file.name}</p>
                                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
                                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Click to Upload PDF</p>
                                <p className="text-sm text-slate-500 mt-1">Max size: 10MB</p>
                            </>
                        )}
                    </div>
                </div>
            </label>

            {(loading || uploading) && (
                <div className="mt-4 w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 overflow-hidden">
                    <div className="bg-violet-600 h-2.5 rounded-full w-1/2 animate-progress"></div>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error.message}
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={(!file && !previewMode) || loading || uploading}
                    className={`px-6 py-2.5 font-medium rounded-lg transition-colors flex items-center ${previewMode
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white'
                        }`}
                >
                    {loading || uploading ? 'Uploading...' : previewMode ? 'Preview Submit' : 'Submit Assignment'}
                </button>
            </div>
        </div>
    );
};

export default AssignmentUpload;
