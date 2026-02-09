// job-portal/pages/JobDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Briefcase, Building2, DollarSign, Clock,
  Calendar, Users, Globe, CheckCircle, ExternalLink, Share2,
  Bookmark, BookmarkCheck
} from 'lucide-react';
import { jobAPI, applicationAPI } from '../services/api';
import { showToast } from '../services/toast';
import ApplicationForm from '../components/ApplicationForm';
import { useAuth } from '../context/AuthContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    checkApplicationStatus();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobById(id);
      setJob(response.data);
    } catch (err) {
      setError('Failed to load job details');
      showToast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (role !== 'CANDIDATE' || !user) return;
    
    try {
      const response = await applicationAPI.getMyApplications();
      const hasApplied = response.data.some(app => app.job._id === id);
      setApplied(hasApplied);
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast.success('Link copied to clipboard!');
    }
  };

  const handleSaveJob = () => {
    // Save job to user's saved jobs
    setSaved(!saved);
    showToast.success(saved ? 'Job removed from saved' : 'Job saved successfully');
  };

  const handleApplySuccess = () => {
    setApplied(true);
    setShowApplyForm(false);
    showToast.success('Application submitted successfully!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Job Not Found
          </h2>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {job.company?.logo ? (
                        <img 
                          src={job.company.logo} 
                          alt={job.company.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        job.company?.name?.substring(0, 2).toUpperCase() || 'CO'
                      )}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {job.title}
                      </h1>
                      <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {job.company?.name}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {job.remote ? 'Remote' : job.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Salary and Experience */}
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {(job.salaryMin || job.salaryMax) && (
                      <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 mb-1">
                          <DollarSign className="w-5 h-5" />
                          <span className="font-semibold">Salary Range</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${job.salaryMin?.toLocaleString() || 'Negotiable'} - ${job.salaryMax?.toLocaleString() || 'Negotiable'}
                        </p>
                      </div>
                    )}

                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-1">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold">Experience Level</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {job.experienceLevel}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    {role === 'CANDIDATE' && (
                      <>
                        {applied ? (
                          <button
                            disabled
                            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg opacity-90"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Applied
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowApplyForm(true)}
                            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg"
                          >
                            Apply Now
                          </button>
                        )}
                      </>
                    )}

                    <button
                      onClick={handleSaveJob}
                      className="flex items-center gap-2 px-6 py-3 border border-teal-500 text-teal-500 dark:text-teal-400 font-semibold rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                    >
                      {saved ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                      {saved ? 'Saved' : 'Save Job'}
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Job Description
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </motion.div>

            {/* Requirements & Responsibilities */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {job.requirements?.split('\n').map((req, index) => (
                    req.trim() && (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{req}</span>
                      </li>
                    )
                  ))}
                </ul>
              </motion.div>

              {job.responsibilities && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Responsibilities
                  </h3>
                  <ul className="space-y-3">
                    {job.responsibilities.split('\n').map((resp, index) => (
                      resp.trim() && (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{resp}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Application Form Modal */}
            {showApplyForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Apply for {job.title}
                    </h2>
                    <button
                      onClick={() => setShowApplyForm(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  <ApplicationForm
                    jobId={job._id}
                    jobTitle={job.title}
                    onSuccess={handleApplySuccess}
                    onCancel={() => setShowApplyForm(false)}
                  />
                </motion.div>
              </div>
            )}
          </div>

          {/* Right Column - Company Info & Job Details */}
          <div className="space-y-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Company Information
              </h3>
              {job.company && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {job.company.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {job.company.name}
                      </h4>
                      {job.company.industry && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.company.industry}
                        </p>
                      )}
                    </div>
                  </div>

                  {job.company.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {job.company.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    {job.company.location && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {job.company.location}
                      </div>
                    )}
                    {job.company.website && (
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-teal-500 hover:text-teal-600 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {job.company.size && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        {job.company.size} employees
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Job Details Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Job Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Job Type</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {job.jobType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Experience</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {job.experienceLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Location</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {job.remote ? 'Remote' : job.location}
                  </span>
                </div>
                {job.deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Deadline</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Posted</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(job.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Applicants</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {job.applicationCount || 0}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;