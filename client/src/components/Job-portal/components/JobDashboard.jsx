// job-portal/components/JobDashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Users, Eye, Clock, CheckCircle, Plus,
  MoreVertical, Edit, Trash2, BarChart3, ExternalLink
} from 'lucide-react';
import { jobAPI } from '../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../services/toast';
import { Link } from 'react-router-dom';

const JobDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });

  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch company jobs for authenticated employer/admin users
    const role = authUser?.role || '';
    const isEmployer = ['COMPANY', 'EMPLOYER', 'ADMIN'].includes(role.toUpperCase());
    if (isEmployer) {
      fetchJobs();
    }
  }, [authUser]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getCompanyJobs();
      setJobs(response.data);

      // Calculate stats
      const totalJobs = response.data.length;
      const activeJobs = response.data.filter(job => job.status === 'ACTIVE').length;
      let totalApplications = 0;
      let pendingApplications = 0;

      response.data.forEach(job => {
        totalApplications += job.applicationCount || 0;
        // Assuming you have pending count in job data
        // pendingApplications += job.pendingApplications || 0;
      });

      setStats({
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
      });
    } catch (error) {
      showToast.error('Failed to load jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to close this job? New applications will not be accepted.')) {
      return;
    }

    try {
      await jobAPI.closeJob(jobId);
      setJobs(prev => prev.map(job =>
        job._id === jobId ? { ...job, status: 'CLOSED' } : job
      ));
      showToast.success('Job closed successfully');
    } catch (error) {
      showToast.error('Failed to close job');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // If not authorized, show message
  const role = authUser?.role || '';
  const isEmployer = ['COMPANY', 'EMPLOYER', 'ADMIN'].includes(role.toUpperCase());

  if (!isEmployer) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Employer access required</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This section is only available to company/employer accounts. Please login with an employer account to view your job postings.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-teal-500 text-white rounded-lg">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalJobs}
              </p>
            </div>
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <Briefcase className="w-6 h-6 text-teal-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.activeJobs}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalApplications}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.pendingApplications}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Job Postings</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your job listings</p>
        </div>
        <Link
          to="/company/post-job"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </Link>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No jobs posted yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first job posting to start receiving applications
            </p>
            <Link
              to="/company/post-job"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {jobs.map((job) => (
                  <motion.tr
                    key={job._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          to={`/company/jobs/${job._id}`}
                          className="font-medium text-gray-900 dark:text-white hover:text-teal-500 dark:hover:text-teal-400"
                        >
                          {job.title}
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.jobType} • {job.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${job.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                        {job.status === 'ACTIVE' ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Active
                          </>
                        ) : (
                          'Closed'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/company/applicants?job=${job._id}`}
                          className="font-medium text-gray-900 dark:text-white hover:text-teal-500 dark:hover:text-teal-400"
                        >
                          {job.applicationCount || 0} applicants
                        </Link>
                        {job.applicationCount > 0 && (
                          <span className="text-xs text-teal-500 dark:text-teal-400">
                            ({job.pendingCount || 0} pending)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/company/jobs/${job._id}`}
                          className="p-2 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
                          title="View Job"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/company/jobs/edit/${job._id}`}
                          className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/company/applicants?job=${job._id}`}
                          className="p-2 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                          title="View Applicants"
                        >
                          <Users className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleCloseJob(job._id)}
                          disabled={job.status === 'CLOSED'}
                          className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Close Job"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDashboard;