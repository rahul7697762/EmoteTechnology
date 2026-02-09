// job-portal/components/JobDetail.jsx
import { motion } from 'framer-motion';
import {
  MapPin, Briefcase, Building2, DollarSign, Clock, Calendar,
  Users, Globe, CheckCircle, ExternalLink, Bookmark, BookmarkCheck,
  ArrowUpRight, Star, Shield, Zap, Award, Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const JobDetail = ({ job, onApply, onSave, onShare, applied = false, saved = false }) => {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Negotiable';
    if (!min) return `Up to $${max.toLocaleString()}`;
    if (!max) return `From $${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Job Header Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Company Logo & Basic Info */}
          <div className="flex-1">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-teal-500/20">
                {job.company?.logo ? (
                  <img 
                    src={job.company.logo} 
                    alt={job.company.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  job.company?.name?.substring(0, 2).toUpperCase() || 'CO'
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {job.title}
                  </h1>
                  {job.featured && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium">
                      <Star className="w-3.5 h-3.5" />
                      Featured
                    </span>
                  )}
                  {job.urgent && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white text-sm font-medium">
                      <Zap className="w-3.5 h-3.5" />
                      Urgent Hiring
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
                  <span className="flex items-center gap-2 font-medium">
                    <Building2 className="w-5 h-5" />
                    {job.company?.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {job.remote ? '🌍 Remote' : job.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {job.jobType}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {job.experienceLevel}
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-linear-to-br from-teal-500/10 to-cyan-500/10 dark:from-teal-500/5 dark:to-cyan-500/5 border border-teal-500/20">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Salary/year
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 border border-blue-500/20">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {job.applicationCount || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Applicants
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/5 dark:to-emerald-500/5 border border-green-500/20">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {calculateDaysAgo(job.createdAt)}d
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Days ago
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 border border-purple-500/20">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {job.views || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Views
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {applied ? (
                <button
                  disabled
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg opacity-90"
                >
                  <CheckCircle className="w-5 h-5" />
                  Applied Successfully
                </button>
              ) : (
                <button
                  onClick={onApply}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl hover:shadow-teal-500/25"
                >
                  Apply Now
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={onSave}
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
                onClick={onShare}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>

              <button className="flex items-center gap-2 px-6 py-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Heart className="w-5 h-5" />
                Report Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          {/* About the Job */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              About the Job
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {job.description}
              </div>
            </div>
          </div>

          {/* Requirements & Responsibilities Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Requirements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Requirements
                </h3>
              </div>
              <ul className="space-y-4">
                {job.requirements?.split('\n').map((req, index) => (
                  req.trim() && (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{req}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Award className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Responsibilities
                  </h3>
                </div>
                <ul className="space-y-4">
                  {job.responsibilities.split('\n').map((resp, index) => (
                    resp.trim() && (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{resp}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Benefits (if any) */}
          {job.benefits && (
            <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 dark:from-teal-500/5 dark:to-cyan-500/5 rounded-2xl p-8 border border-teal-500/20">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Benefits & Perks
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {job.benefits.split('\n').map((benefit, index) => (
                  benefit.trim() && (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-8">
          {/* Company Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              About the Company
            </h3>
            {job.company && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold">
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
                      className="flex items-center gap-2 text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
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
          </div>

          {/* Job Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Job Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Job Type</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {job.jobType}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Experience</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {job.experienceLevel}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Location</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {job.remote ? '🌍 Remote' : job.location}
                </span>
              </div>
              {job.deadline && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Application Deadline</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(job.deadline)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Posted Date</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(job.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Skills & Technologies */}
          {job.tags && job.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-500/5 dark:to-cyan-500/5 text-teal-700 dark:text-teal-400 text-sm font-medium rounded-lg border border-teal-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Similar Jobs Preview */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Looking for similar jobs?</h3>
            <p className="text-gray-300 text-sm mb-4">
              We have {job.similarJobs || 12}+ similar positions available.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse All Jobs
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobDetail;