// job-portal/components/ApplicationForm.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  FileText,
  AlertCircle,
  CheckCircle,
  Upload,
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createApplication } from '../../../redux/slices/applicationSlice';
import { getJobById } from '../../../redux/slices/jobSlice';
import { getMyResumes } from '../../../redux/slices/resumeSlice';
import { showToast } from "./Toast";
import ResumeUpload from './ResumeUpload';

const ApplicationForm = ({ jobId, jobTitle, companyName, onSuccess, onCancel }) => {
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    availability: 'yes',
    availabilityDetails: '',
    answers: [],
    resume: null,
  });
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingResumes, setExistingResumes] = useState([]);
  const [displayJobTitle, setDisplayJobTitle] = useState(jobTitle);
  const [displayCompanyName, setDisplayCompanyName] = useState(companyName);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserProfile();
    fetchExistingResumes();
    fetchJobInfo();
  }, [jobId]);

  const fetchJobInfo = async () => {
    if (!jobId) return;
    try {
      const response = await dispatch(getJobById(jobId)).unwrap();
      const jobData = response.job || response;
      setJob(jobData);
      if (!jobTitle) setDisplayJobTitle(jobData.title);
      if (!companyName) setDisplayCompanyName(jobData.company?.name || jobData.companyName);

      // Initialize answers array if job has questions and showQuestions is true
      if (jobData.showQuestions && jobData.applicationQuestions?.length > 0) {
        setFormData(prev => ({
          ...prev,
          answers: jobData.applicationQuestions.map(q => ({ question: q, answer: '' }))
        }));
      }
    } catch (err) {
      console.error('Error fetching job info:', err);
    }
  };

  const fetchUserProfile = async () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          fullName: user.name || '',
          email: user.email || '',
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const fetchExistingResumes = async () => {
    try {
      const response = await dispatch(getMyResumes()).unwrap();
      setExistingResumes(response.resumes || response || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...formData.answers];
    newAnswers[index].answer = value;
    setFormData(prev => ({ ...prev, answers: newAnswers }));
  };

  const handleResumeSelect = (resume) => {
    setFormData(prev => ({ ...prev, resume }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume) {
      setError('Please select or upload a resume');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare the data to be sent
      const submissionData = {
        jobId,
        fullName: formData.fullName,
        email: formData.email,
        resumeId: formData.resume?._id,
        answers: [
          {
            question: "Availability",
            answer: formData.availability === 'yes'
              ? "Available for 6 months, starting immediately"
              : `Not immediately available: ${formData.availabilityDetails}`
          },
          ...formData.answers
        ]
      };

      await dispatch(createApplication(submissionData)).unwrap();

      showToast.success('Application submitted successfully!');
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
      showToast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto py-8 px-4"
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Apply for {displayJobTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          at {displayCompanyName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Availability Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Availability</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Are you available for 6 months, starting immediately, for a full-time internship?
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="availability"
                  value="yes"
                  checked={formData.availability === 'yes'}
                  onChange={(e) => setFormData(p => ({ ...p, availability: e.target.value }))}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Yes, I am available</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="availability"
                  value="no"
                  checked={formData.availability === 'no'}
                  onChange={(e) => setFormData(p => ({ ...p, availability: e.target.value }))}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">No (please specify your availability)</span>
              </label>
            </div>

            {formData.availability === 'no' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <textarea
                  placeholder="Tell us about your availability..."
                  value={formData.availabilityDetails}
                  onChange={(e) => setFormData(p => ({ ...p, availabilityDetails: e.target.value }))}
                  className="w-full p-4 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  rows={2}
                />
              </motion.div>
            )}
          </div>
        </section>

        {/* Dynamic Questions Section */}
        {job?.showQuestions && formData.answers.length > 0 && (
          <section className="space-y-8">
            {formData.answers.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                  {item.question}
                </label>
                <textarea
                  value={item.answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Type your answer here..."
                  required
                  className="w-full p-4 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px]"
                />
              </div>
            ))}
          </section>
        )}

        {/* Resume Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resume</h3>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Info size={14} /> Will be shared with recruiter
            </span>
          </div>

          <div className="space-y-4">
            {existingResumes.map((resume) => (
              <div
                key={resume._id}
                onClick={() => handleResumeSelect(resume)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${formData.resume?._id === resume._id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                  : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{resume.originalName}</p>
                    <p className="text-xs text-gray-500">{(resume.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                </div>
                {formData.resume?._id === resume._id && (
                  <CheckCircle size={18} className="text-blue-500" />
                )}
              </div>
            ))}

            <div className="pt-2 text-center">
              {!showResumeUpload ? (
                <button
                  type="button"
                  onClick={() => setShowResumeUpload(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 mx-auto hover:underline"
                >
                  <Upload size={16} />
                  Or upload a new one
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Upload New Resume</h4>
                    <button
                      type="button"
                      onClick={() => setShowResumeUpload(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                  <ResumeUpload
                    onUploadSuccess={(resume) => {
                      handleResumeSelect(resume);
                      setShowResumeUpload(false);
                      setExistingResumes(prev => [resume, ...prev]);
                    }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-3 border border-red-100 dark:border-red-800">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Submit application
                <Send size={18} />
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ApplicationForm;
