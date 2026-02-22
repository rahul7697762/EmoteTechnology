// job-portal/components/JobPostForm.jsx
// NOTE: Simple standalone job posting form used in small UIs. Prefer using
// `PostJob.jsx` for the full posting experience (company profile checks, preview, etc.).
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, MapPin, Calendar, FileText, Tag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createJob } from '../../../redux/slices/jobSlice';

const JobPostForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    salaryMin: '',
    salaryMax: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    remote: false,
    tags: [],
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTags = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (!formData.tags.includes(tag) && formData.tags.length < 10) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await dispatch(createJob(formData)).unwrap();
      onSuccess?.();
      setFormData({
        title: '',
        description: '',
        requirements: '',
        responsibilities: '',
        salaryMin: '',
        salaryMax: '',
        location: '',
        jobType: 'Full-time',
        experienceLevel: 'Mid-level',
        remote: false,
        tags: [],
        deadline: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Post a New Job
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in the details to attract the best candidates
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Briefcase className="w-4 h-4" />
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

        {/* Job Type & Experience */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4" />
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

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
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
        </div>

        {/* Location & Remote */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4" />
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
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4" />
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="w-4 h-4" />
              Minimum Salary ($)
            </label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="e.g., 80000"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="w-4 h-4" />
              Maximum Salary ($)
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
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Skills & Technologies (Press Enter to add)
          </label>
          <input
            type="text"
            onKeyDown={handleTags}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="e.g., React, Node.js, AWS"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-teal-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileText className="w-4 h-4" />
            Job Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="Describe the role, company culture, and expectations..."
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Requirements *
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="List the required skills, qualifications, and experience..."
          />
        </div>

        {/* Remote Option */}
        <div className="flex items-center">
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

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-linear-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting Job...' : 'Post Job'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default JobPostForm;