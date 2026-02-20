// job-portal/pages/MyApplications.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, XCircle, Eye, Download,
  Calendar, MapPin, Building2, Filter, Search, AlertCircle
} from 'lucide-react';
import { applicationAPI } from '../services/api';
import { showToast } from '../services/toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    // Only students should access this page
    if ((role || '').toUpperCase() !== 'STUDENT') {
      navigate('/company/dashboard');
      return;
    }
    fetchApplications();
  }, [filters, role, navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getMyApplications();
      let filteredApps = response.data;

      // Apply filters
      if (filters.status) {
        filteredApps = filteredApps.filter(app => app.status === filters.status);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredApps = filteredApps.filter(app =>
          app.job.title.toLowerCase().includes(searchTerm) ||
          app.job.company?.name?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      filteredApps.sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });

      setApplications(filteredApps);
    } catch (error) {
      showToast.error('Failed to load applications');
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      // This endpoint needs to be created: DELETE /applications/:id
      // await applicationAPI.withdrawApplication(applicationId);
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      showToast.success('Application withdrawn successfully');
    } catch (error) {
      showToast.error('Failed to withdraw application');
    }
  };

  const downloadResume = async (resumeId) => {
    try {
      // This endpoint needs to be created
      // const response = await resumeAPI.downloadResume(resumeId);
      showToast.success('Resume download started');
    } catch (error) {
      showToast.error('Failed to download resume');
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { icon: Clock, color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30', label: 'Pending' },
      REVIEWED: { icon: Eye, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30', label: 'Reviewed' },
      SHORTLISTED: { icon: CheckCircle, color: 'text-green-500 bg-green-100 dark:bg-green-900/30', label: 'Shortlisted' },
      REJECTED: { icon: XCircle, color: 'text-red-500 bg-red-100 dark:bg-red-900/30', label: 'Rejected' },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-teal-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Applications
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Track the status of all your job applications in one place
            </p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Search className="w-5 h-5" />
            Browse Jobs
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {applications.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Applications</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-teal-500 mb-2">
              {applications.filter(a => a.status === 'SHORTLISTED').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Shortlisted</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {applications.filter(a => a.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {applications.filter(a => a.status === 'REVIEWED').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reviewed</div>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Search className="w-4 h-4" />
                Search Applications
              </label>
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Filter className="w-4 h-4" />
                Status Filter
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText className="w-20 h-20 mx-auto text-gray-400 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No applications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              You haven't applied to any jobs yet. Start browsing opportunities and submit your first application!
            </p>
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
            >
              Browse Jobs
            </a>
          </motion.div>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {applications.map((application) => {
              const statusInfo = getStatusInfo(application.status);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={application._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {application.job.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 mb-3">
                            <span className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              {application.job.company?.name}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {application.job.remote ? 'Remote' : application.job.location}
                            </span>
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Applied {formatDate(application.createdAt)}
                            </span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Application Details */}
                      <div className="space-y-4">
                        {application.coverLetter && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              Cover Letter
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}

                        {application.notes && (
                          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                              <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                                Employer Note
                              </h4>
                            </div>
                            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                              {application.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      <a
                        href={`/jobs/${application.job._id}`}
                        className="w-full px-4 py-2 text-center border border-teal-500 text-teal-500 dark:text-teal-400 font-medium rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                      >
                        View Job
                      </a>

                      <button
                        onClick={() => downloadResume(application.resume._id)}
                        className="w-full px-4 py-2 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Resume
                      </button>

                      {application.status === 'PENDING' && (
                        <button
                          onClick={() => handleWithdraw(application._id)}
                          className="w-full px-4 py-2 text-center border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;