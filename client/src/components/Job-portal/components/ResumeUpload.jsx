// job-portal/components/ResumeUpload.jsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Check, AlertCircle, Trash2 } from 'lucide-react';
import { resumeAPI } from '../services/api';

const ResumeUpload = ({ onUploadSuccess, existingResume }) => {
  const [resume, setResume] = useState(existingResume || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF and DOC/DOCX files are allowed';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await resumeAPI.uploadResume(file);
      const uploadedResume = response.data;

      setResume(uploadedResume);
      onUploadSuccess?.(uploadedResume);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveResume = () => {
    setResume(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
        </div>
      )}

      {resume ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-300">
                    {resume.originalName || 'resume.pdf'}
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  {formatFileSize(resume.size)} • Uploaded successfully
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveResume}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${uploading
              ? 'border-teal-300 bg-teal-50 dark:bg-teal-900/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/10'
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              {uploading ? (
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Upload className="w-8 h-8 text-teal-500" />
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {uploading ? 'Uploading Resume...' : 'Upload Your Resume'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                PDF or DOC/DOCX, max 5MB
              </p>
            </div>

            <button
              type="button"
              disabled={uploading}
              className="px-6 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </button>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Your resume will be saved and can be reused for future applications</p>
        <p>• Make sure your resume is up-to-date</p>
        <p>• Recommended: Include your contact information and work experience</p>
      </div>
    </div>
  );
};

export default ResumeUpload;