// job-portal/components/ApplicationForm.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, X, FileText, AlertCircle, CheckCircle, Upload, 
  User, Mail, Linkedin, Globe, Award, Sparkles
} from 'lucide-react';
import { applicationAPI } from '../services/api';
import { showToast } from '../services/toast';
import ResumeUpload from './ResumeUpload';

const ApplicationForm = ({ jobId, jobTitle, companyName, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    coverLetter: '',
    resume: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingResumes, setExistingResumes] = useState([]);
  const [step, setStep] = useState(1); // 1: Personal info, 2: Resume, 3: Cover letter

  useEffect(() => {
    fetchUserProfile();
    fetchExistingResumes();
  }, []);

  const fetchUserProfile = async () => {
    // Get user profile from localStorage or API
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
      // This would be your API call to get user's resumes
      // const response = await applicationAPI.getMyResumes();
      // setExistingResumes(response.data);
      
      // Mock data for demonstration
      setExistingResumes([
        {
          _id: '1',
          originalName: 'John_Doe_Resume.pdf',
          createdAt: new Date('2024-01-15'),
          size: 1024 * 1024 * 2, // 2MB
        },
        {
          _id: '2',
          originalName: 'John_Doe_Updated_Resume.pdf',
          createdAt: new Date('2024-02-01'),
          size: 1024 * 1024 * 1.5, // 1.5MB
        },
      ]);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeSelect = (resume) => {
    setFormData(prev => ({ ...prev, resume }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError('Please enter your full name');
        return false;
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    if (step === 2 && !formData.resume) {
      setError('Please upload or select a resume');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setError('');
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setLoading(true);
    setError('');

    try {
      await applicationAPI.createApplication({
        jobId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        linkedin: formData.linkedin || undefined,
        portfolio: formData.portfolio || undefined,
        coverLetter: formData.coverLetter.trim() || undefined,
        resumeId: formData.resume?._id,
      });
      
      showToast.success('Application submitted successfully!');
      onSuccess?.();
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setError('You have already applied to this job');
        showToast.error('You have already applied to this job');
      } else if (status === 400) {
        setError('Job is no longer accepting applications');
        showToast.error('Job is no longer accepting applications');
      } else if (status === 403) {
        setError('You must complete your profile before applying');
        showToast.error('Please complete your profile first');
      } else {
        setError('Failed to submit application. Please try again.');
        showToast.error('Failed to submit application');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Resume', icon: FileText },
    { number: 3, title: 'Cover Letter', icon: Send },
  ];

  const StepIcon = steps[step - 1]?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Apply for {jobTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {companyName && `at ${companyName}`}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
            <div 
              className="absolute top-0 left-0 h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
          
          <div className="relative flex justify-between">
            {steps.map((stepItem) => {
              const Icon = stepItem.icon;
              const isActive = stepItem.number === step;
              const isCompleted = stepItem.number < step;
              
              return (
                <div key={stepItem.number} className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2
                    ${isActive ? 'bg-teal-500 text-white' : 
                      isCompleted ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-500 dark:text-teal-400' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-400'}
                    transition-all duration-300
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`
                    text-xs font-medium
                    ${isActive ? 'text-teal-500 dark:text-teal-400' : 
                      isCompleted ? 'text-teal-600 dark:text-teal-500' :
                      'text-gray-500 dark:text-gray-400'}
                  `}>
                    {stepItem.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <User className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tell us about yourself
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio / Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Resume */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Resume / CV
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload your resume or select an existing one
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {existingResumes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Select Existing Resume
                    </h4>
                    <div className="grid gap-2">
                      {existingResumes.map((resume) => (
                        <div
                          key={resume._id}
                          onClick={() => handleResumeSelect(resume)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            formData.resume?._id === resume._id
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-teal-500" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {resume.originalName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Uploaded {new Date(resume.createdAt).toLocaleDateString()} • 
                                  {(resume.size / (1024 * 1024)).toFixed(1)} MB
                                </p>
                              </div>
                            </div>
                            {formData.resume?._id === resume._id && (
                              <CheckCircle className="w-5 h-5 text-teal-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          Or upload a new one
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <ResumeUpload
                  onUploadSuccess={handleResumeSelect}
                  existingResume={formData.resume}
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      Resume Tips
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      <li>• Keep it to 1-2 pages for best results</li>
                      <li>• Include relevant keywords from the job description</li>
                      <li>• Highlight your achievements with numbers/metrics</li>
                      <li>• Save as PDF to preserve formatting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Cover Letter */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <Send className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cover Letter
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Optional - but highly recommended
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Write your cover letter
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows={10}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                  placeholder={`Dear Hiring Manager at ${companyName || 'the Company'},

I am writing to express my interest in the ${jobTitle} position...

Why I'm a great fit:
• [Your relevant experience]
• [Key achievement]
• [Why you're excited about this role]

Looking forward to discussing how I can contribute to your team.

Best regards,
${formData.fullName || 'Your Name'}`}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.coverLetter.length} characters
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.ceil(formData.coverLetter.length / 5)} words
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                      Cover Letter Tips
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                      <li>• Address the hiring manager by name if possible</li>
                      <li>• Mention the specific job title and company</li>
                      <li>• Explain why you're interested in THIS role at THIS company</li>
                      <li>• Keep it concise - aim for 200-400 words</li>
                      <li>• Proofread for spelling and grammar errors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex gap-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !formData.resume}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ApplicationForm;