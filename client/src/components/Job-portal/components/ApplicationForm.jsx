import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  Send,
  FileText,
  AlertCircle,
  CheckCircle,
  Upload,
  Info
} from 'lucide-react';
import { applicationAPI, jobAPI, resumeAPI } from '../services/api';
import { showToast } from '../services/toast';
import ResumeUpload from './ResumeUpload';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const ApplicationForm = ({ jobId, jobTitle, companyName, onSuccess, onCancel }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
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

  useEffect(() => {
    populateUserProfile();
    fetchExistingResumes();
    fetchJobInfo();
  }, [jobId, currentUser]);

  const fetchJobInfo = async () => {
    if (!jobId) return;
    try {
      const response = await jobAPI.getJobById(jobId);
      const jobData = response.data;
      setJob(jobData);
      if (!jobTitle) setDisplayJobTitle(jobData.title);
      if (!companyName) setDisplayCompanyName(jobData.company?.companyName || jobData.companyName);

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

  const populateUserProfile = () => {
    if (currentUser) {
      setFormData(prev => ({ ...prev, fullName: currentUser.name || '', email: currentUser.email || '' }));
    }
  };

  const fetchExistingResumes = async () => {
    try {
      const response = await resumeAPI.getMyResumes();
      setExistingResumes(response.data || []);
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

      await applicationAPI.createApplication(submissionData);
      showToast.success('Application submitted successfully!');
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
      showToast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full p-4 text-sm bg-white dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 focus:outline-none focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-colors";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="text-center mb-10 pb-8 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
        <h2 className="text-3xl font-bold mb-2 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
          Apply for <span className="text-[#3B4FD8] dark:text-[#6C7EF5]">{displayJobTitle}</span>
        </h2>
        <p className="text-[#6B7194] dark:text-[#8B90B8]">
          at {displayCompanyName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Availability */}
        <section>
          <h3 className="text-xl font-bold mb-5 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>Availability</h3>
          <div className="space-y-4">
            <p className="text-sm text-[#6B7194] dark:text-[#8B90B8]">
              Are you available for 6 months, starting immediately, for a full-time internship?
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 cursor-pointer transition-colors bg-white dark:bg-[#1A1D2E]">
                <input
                  type="radio"
                  name="availability"
                  value="yes"
                  checked={formData.availability === 'yes'}
                  onChange={(e) => setFormData(p => ({ ...p, availability: e.target.value }))}
                  className="w-4 h-4 accent-[#3B4FD8] dark:accent-[#6C7EF5]"
                />
                <span className="text-sm text-[#1A1D2E] dark:text-[#E8EAF2]">Yes, I am available</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 cursor-pointer transition-colors bg-white dark:bg-[#1A1D2E]">
                <input
                  type="radio"
                  name="availability"
                  value="no"
                  checked={formData.availability === 'no'}
                  onChange={(e) => setFormData(p => ({ ...p, availability: e.target.value }))}
                  className="w-4 h-4 accent-[#3B4FD8] dark:accent-[#6C7EF5]"
                />
                <span className="text-sm text-[#1A1D2E] dark:text-[#E8EAF2]">No (please specify your availability)</span>
              </label>
            </div>

            {formData.availability === 'no' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <textarea
                  placeholder="Tell us about your availability..."
                  value={formData.availabilityDetails}
                  onChange={(e) => setFormData(p => ({ ...p, availabilityDetails: e.target.value }))}
                  className={inputStyles}
                  rows={3}
                />
              </motion.div>
            )}
          </div>
        </section>

        {/* Dynamic Questions */}
        {job?.showQuestions && formData.answers.length > 0 && (
          <section className="space-y-8 pt-8 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
            {formData.answers.map((item, index) => (
              <div key={`answer-${index}`}>
                <label className="block text-xl font-bold mb-4 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                  {item.question}
                </label>
                <textarea
                  value={item.answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Type your answer here..."
                  required
                  className={`${inputStyles} min-h-[140px]`}
                />
              </div>
            ))}
          </section>
        )}

        {/* Resume */}
        <section className="pt-8 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>Resume</h3>
            <span className="text-xs text-[#6B7194] dark:text-[#8B90B8] flex items-center gap-1 uppercase tracking-widest" style={{ fontFamily: MONO }}>
              <Info size={12} /> Will be shared with recruiter
            </span>
          </div>

          <div className="space-y-4">
            {existingResumes.map((resume) => (
              <div
                key={resume._id}
                onClick={() => handleResumeSelect(resume)}
                className={`p-5 border transition-all cursor-pointer flex items-center justify-between bg-white dark:bg-[#1A1D2E] ${formData.resume?._id === resume._id
                  ? 'border-[#3B4FD8] dark:border-[#6C7EF5] bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5'
                  : 'border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 hover:border-[#3B4FD8]/40 dark:hover:border-[#6C7EF5]/40'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 flex items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1D2E] dark:text-[#E8EAF2] line-clamp-1">{resume.originalName}</p>
                    <p className="text-xs text-[#6B7194] dark:text-[#8B90B8] font-mono mt-1">{(resume.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                </div>
                {formData.resume?._id === resume._id && (
                  <CheckCircle size={20} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
                )}
              </div>
            ))}

            <div className="pt-4 text-center">
              {!showResumeUpload ? (
                <button
                  type="button"
                  onClick={() => setShowResumeUpload(true)}
                  className="text-xs uppercase tracking-widest text-[#3B4FD8] dark:text-[#6C7EF5] font-semibold flex items-center gap-2 mx-auto hover:underline"
                  style={{ fontFamily: MONO }}
                >
                  <Upload size={14} /> Upload a new resume
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-left mt-6 pt-6 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]">Upload New Resume</h4>
                    <button type="button" onClick={() => setShowResumeUpload(false)} className="text-xs uppercase tracking-wider text-[#E25C5C] hover:underline" style={{ fontFamily: MONO }}>
                      Cancel ✕
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
          <div className="p-4 bg-[#E25C5C]/10 text-[#E25C5C] border border-[#E25C5C]/20 flex items-center gap-3">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#1A1D2E] dark:text-[#E8EAF2] text-sm font-bold uppercase tracking-widest hover:bg-[#F7F8FF] dark:hover:bg-[#252A41] transition-colors"
            style={{ fontFamily: MONO }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3 disabled:opacity-50 hover:opacity-90"
            style={{ fontFamily: MONO }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Submit Application <Send size={16} /></>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ApplicationForm;
