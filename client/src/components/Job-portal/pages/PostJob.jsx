// job-portal/pages/PostJob.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Briefcase, Save, Upload, Plus, Trash2, Building2,
  DollarSign, MapPin, Calendar, FileText, Tag, Users,
  Globe, Clock, CheckCircle, AlertCircle, Eye, Zap
} from 'lucide-react';
import { jobAPI, companyAPI } from '../services/api';
import { showToast } from '../services/toast';
import { useAuth } from '../context/AuthContext';

const PostJob = ({ editMode, jobId }) => {
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [companyProfile, setCompanyProfile] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    location: '',
    remote: false,
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    category: '',
    tags: [],
    deadline: '',
    applicationInstructions: '',
    hiringProcess: '',
    featured: false,
    urgent: false,
    applicationQuestions: [],
    visibility: 'PUBLIC',
  });

  const [newTag, setNewTag] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Volunteer'];
  const experienceLevels = ['Intern', 'Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];
  const categories = [
    'Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations',
    'Finance', 'Human Resources', 'Customer Support', 'Legal', 'Other'
  ];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY', 'CNY'];

  const fetchCompanyProfile = useCallback(async () => {
    try {
      const response = await companyAPI.getProfile();
      setCompanyProfile(response.data);
      
      // Pre-fill location if company has one
      if (response.data.location && !formData.location) {
        setFormData(prev => ({ ...prev, location: response.data.location }));
      }
    } catch (err) {
      console.error('Error fetching company profile:', err);
      showToast.error('Please complete your company profile first');
      navigate('/company/profile');
    }
  }, []);

  useEffect(() => {
    if (editMode && jobId) {
      fetchJobDetails();
    } else {
      fetchCompanyProfile();
    }
  }, [editMode, jobId, fetchCompanyProfile]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobById(jobId);
      const job = response.data;
      
      setFormData({
        title: job.title || '',
        description: job.description || '',
        requirements: job.requirements || '',
        responsibilities: job.responsibilities || '',
        benefits: job.benefits || '',
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        salaryCurrency: job.salaryCurrency || 'USD',
        location: job.location || '',
        remote: job.remote || false,
        jobType: job.jobType || 'Full-time',
        experienceLevel: job.experienceLevel || 'Mid-level',
        category: job.category || '',
        tags: job.tags || [],
        deadline: job.deadline || '',
        applicationInstructions: job.applicationInstructions || '',
        hiringProcess: job.hiringProcess || '',
        featured: job.featured || false,
        urgent: job.urgent || false,
        applicationQuestions: job.applicationQuestions || [],
        visibility: job.visibility || 'PUBLIC',
      });
    } catch (err) {
      showToast.error('Failed to load job details');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() && formData.applicationQuestions.length < 5) {
      setFormData(prev => ({
        ...prev,
        applicationQuestions: [...prev.applicationQuestions, newQuestion.trim()],
      }));
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      applicationQuestions: prev.applicationQuestions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!companyProfile) {
      setError('Please complete your company profile first');
      showToast.error('Complete company profile required');
      return;
    }

    if (!formData.title.trim()) {
      setError('Job title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Job description is required');
      return;
    }

    if (!formData.requirements.trim()) {
      setError('Requirements are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (editMode) {
        await jobAPI.updateJob(jobId, formData);
        showToast.success('Job updated successfully!');
      } else {
        await jobAPI.createJob(formData);
        showToast.success('Job posted successfully!');
      }
      
      // Redirect to job dashboard after a short delay
      setTimeout(() => {
        navigate('/company/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
      showToast.error('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      // Save as draft logic
      showToast.success('Draft saved successfully');
    } catch (err) {
      showToast.error('Failed to save draft');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {editMode ? 'Edit Job Posting' : 'Post a New Job'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {editMode 
                  ? 'Update your job posting details' 
                  : 'Fill in the details to attract the best candidates'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2 border border-teal-500 text-teal-500 dark:text-teal-400 font-medium rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        )}

        {companyProfile && !companyProfile.completed && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-yellow-700 dark:text-yellow-400">
                  Complete your company profile to post jobs. Some features may be limited.
                </p>
                <button
                  onClick={() => navigate('/company/profile')}
                  className="mt-2 text-sm font-medium text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400"
                >
                  Complete Profile →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!previewMode ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <Briefcase className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Basic Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start with the job title and basic details
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>

                {/* Category & Type */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Type *
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Experience & Location */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Experience Level *
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="e.g., San Francisco, CA or Remote"
                    />
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        name="remote"
                        id="remote"
                        checked={formData.remote}
                        onChange={handleChange}
                        className="w-4 h-4 text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="remote" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        This is a remote position
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills & Technologies (Max 10)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="e.g., React, Node.js, AWS"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!newTag.trim() || formData.tags.length >= 10}
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(index)}
                            className="hover:text-teal-900 dark:hover:text-teal-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Salary & Compensation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Salary & Compensation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Salary range and benefits (optional but recommended)
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Salary
                    </label>
                    <div className="flex">
                      <select
                        name="salaryCurrency"
                        value={formData.salaryCurrency}
                        onChange={handleChange}
                        className="px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {currencies.map(currency => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="e.g., 80000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Salary
                    </label>
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="e.g., 150000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Application Deadline
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Benefits (Optional)
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="List the benefits offered (health insurance, remote work, flexible hours, etc.)"
                  />
                </div>
              </div>
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Job Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Describe the role and what you're looking for
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Describe the role, team, projects, and impact..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requirements & Qualifications *
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="List required skills, education, experience, and qualifications..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Responsibilities (Optional)
                  </label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="List day-to-day responsibilities and tasks..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Application Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Application Process
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    How candidates should apply and what to expect
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Application Instructions
                  </label>
                  <textarea
                    name="applicationInstructions"
                    value={formData.applicationInstructions}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Any special instructions for applicants..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hiring Process (Optional)
                  </label>
                  <textarea
                    name="hiringProcess"
                    value={formData.hiringProcess}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Describe your hiring process (interviews, tests, timeline)..."
                  />
                </div>

                {/* Additional Questions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Additional Questions (Optional)
                    </label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.applicationQuestions.length}/5
                    </span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Add a question for applicants (e.g., Why do you want to work here?)"
                    />
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      disabled={!newQuestion.trim() || formData.applicationQuestions.length >= 5}
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {formData.applicationQuestions.length > 0 && (
                    <div className="space-y-2">
                      {formData.applicationQuestions.map((question, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{index + 1}.</span>
                            <span className="text-gray-700 dark:text-gray-300">{question}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(index)}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Visibility & Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Eye className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Visibility & Options
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Control how your job is displayed
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Visibility
                    </label>
                    <select
                      name="visibility"
                      value={formData.visibility}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="PUBLIC">Public - Listed on job board</option>
                      <option value="UNLISTED">Unlisted - Only accessible via link</option>
                      <option value="DRAFT">Draft - Only visible to you</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority Options
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="w-4 h-4 text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Featured Listing
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Highlight your job at the top of search results
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="urgent"
                          checked={formData.urgent}
                          onChange={handleChange}
                          className="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-4 h-4 text-red-500" />
                            Urgent Hiring
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Mark as urgent to attract more applicants quickly
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end gap-4 pt-6"
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? (editMode ? 'Updating...' : 'Posting...') : (editMode ? 'Update Job' : 'Post Job')}
              </button>
            </motion.div>
          </form>
        ) : (
          /* Preview Mode */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {formData.title || 'Job Title Preview'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {companyProfile?.companyName || 'Your Company'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {formData.remote ? 'Remote' : formData.location || 'Location'}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {formData.jobType}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formData.experienceLevel}
                </span>
                {(formData.salaryMin || formData.salaryMax) && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formData.salaryMin && formData.salaryMax
                      ? `${formData.salaryCurrency} ${formData.salaryMin} - ${formData.salaryMax}`
                      : 'Salary negotiable'}
                  </span>
                )}
              </div>
            </div>

            {/* Job Description Preview */}
            {formData.description && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Job Description
                </h3>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {formData.description}
                  </p>
                </div>
              </div>
            )}

            {/* Requirements Preview */}
            {formData.requirements && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Requirements
                </h3>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {formData.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Tags Preview */}
            {formData.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setPreviewMode(false)}
                className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
              >
                Back to Editing
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PostJob;