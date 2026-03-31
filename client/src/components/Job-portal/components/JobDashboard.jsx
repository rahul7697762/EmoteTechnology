// job-portal/components/JobDashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, Users, Eye, Clock, CheckCircle, Plus,
  MoreVertical, Edit, Trash2, BarChart3, ExternalLink, XCircle
} from 'lucide-react';
import { jobAPI } from '../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../services/toast';
import { Link } from 'react-router-dom';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
      showToast.success('Job closed successfully', { style: { borderRadius: 0, fontFamily: MONO, fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' } });
    } catch (error) {
      showToast.error('Failed to close job', { style: { borderRadius: 0, fontFamily: MONO, fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' } });
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to permanently delete this job and all its applications? This action cannot be undone.')) {
      return;
    }

    try {
      await jobAPI.deleteJob(jobId);
      setJobs(prev => prev.filter(job => job._id !== jobId));
      
      // Update local stats
      setStats(prev => ({
        ...prev,
        totalJobs: Math.max(0, prev.totalJobs - 1),
        activeJobs: jobs.find(j => j._id === jobId)?.status === 'ACTIVE' 
                     ? Math.max(0, prev.activeJobs - 1) 
                     : prev.activeJobs
      }));

      showToast.success('Job deleted successfully', { style: { borderRadius: 0, fontFamily: MONO, fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' } });
    } catch (error) {
      showToast.error('Failed to delete job', { style: { borderRadius: 0, fontFamily: MONO, fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' } });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // If not authorized, show message
  const role = authUser?.role || '';
  const isEmployer = ['COMPANY', 'EMPLOYER', 'ADMIN'].includes(role.toUpperCase());

  if (!isEmployer) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#252A41] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 shadow-sm">
        <h3 className="text-2xl font-bold mb-3 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>EMPLOYER ACCESS REQUIRED</h3>
        <p className="text-[#6B7194] dark:text-[#8B90B8] mb-8 text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>
          This section is only available to company/employer accounts. Please login with an employer account.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => navigate('/login')} className="px-8 py-3 bg-[#3B4FD8] text-white font-bold uppercase tracking-[0.2em] text-[11px] transition-colors hover:bg-[#1A1D2E]" style={{ fontFamily: MONO }}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] uppercase mb-2" style={{ fontFamily: SERIF }}>My Job <span className="text-[#3B4FD8] dark:text-[#6C7EF5] italic">Postings</span></h2>
          <p className="text-[#6B7194] dark:text-[#8B90B8] text-[10px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>Manage and track your job listings and applicants</p>
        </div>
        <Link
          to="/company/post-job"
          className="flex items-center gap-2 px-6 py-3.5 bg-[#F5A623] dark:bg-[#F9C74F] text-white dark:text-[#1A1D2E] font-bold text-[11px] uppercase tracking-[0.2em] rounded-none hover:bg-[#d9911a] hover:-translate-y-0.5 shadow-[4px_4px_0_0_rgba(26,29,46,0.1)] dark:shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] transition-all"
          style={{ fontFamily: MONO }}
        >
          <Plus size={16} strokeWidth={3} />
          Post New Job
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#252A41] rounded-none p-6 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Total Jobs</p>
              <p className="text-4xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mt-3" style={{ fontFamily: SERIF }}>
                {stats.totalJobs}
              </p>
            </div>
            <div className="p-3 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#3B4FD8] dark:text-[#6C7EF5] group-hover:bg-[#3B4FD8] dark:group-hover:bg-[#6C7EF5] group-hover:text-white transition-colors">
              <Briefcase size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#252A41] rounded-none p-6 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Active Jobs</p>
              <p className="text-4xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mt-3" style={{ fontFamily: SERIF }}>
                {stats.activeJobs}
              </p>
            </div>
            <div className="p-3 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#10B981]/30 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-white transition-colors">
              <Eye size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#252A41] rounded-none p-6 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Total Applications</p>
              <p className="text-4xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mt-3" style={{ fontFamily: SERIF }}>
                {stats.totalApplications}
              </p>
            </div>
            <div className="p-3 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#F5A623]/30 text-[#F5A623] dark:text-[#F9C74F] group-hover:bg-[#F5A623] dark:group-hover:bg-[#F9C74F] group-hover:text-white dark:group-hover:text-[#1A1D2E] transition-colors">
              <Users size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#252A41] rounded-none p-6 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Pending Review</p>
              <p className="text-4xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mt-3" style={{ fontFamily: SERIF }}>
                {stats.pendingApplications}
              </p>
            </div>
            <div className="p-3 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#E25C5C]/30 text-[#E25C5C] group-hover:bg-[#E25C5C] group-hover:text-white transition-colors">
              <Clock size={20} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-[#F7F8FF] dark:bg-[#1A1D2E] animate-pulse"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-16 text-center bg-[#F7F8FF]/50 dark:bg-[#1A1D2E]/50">
            <Briefcase className="w-16 h-16 mx-auto text-[#6B7194]/30 dark:text-[#8B90B8]/30 mb-6" strokeWidth={1} />
            <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-2 uppercase" style={{ fontFamily: SERIF }}>
              NO JOBS POSTED YET
            </h3>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-8" style={{ fontFamily: MONO }}>
              Create your first job posting to start receiving applications
            </p>
            <Link
              to="/company/post-job"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white dark:text-[#1A1D2E] font-bold text-[11px] uppercase tracking-[0.2em] rounded-none hover:bg-[#1A1D2E] dark:hover:bg-white transition-colors"
              style={{ fontFamily: MONO }}
            >
              <Plus size={16} strokeWidth={3} />
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F7F8FF] dark:bg-[#1A1D2E] border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>
                    Job Title
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>
                    Status
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>
                    Applications
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>
                    Posted Date
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-[0.2em] text-right" style={{ fontFamily: MONO }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3B4FD8]/10 dark:divide-[#6C7EF5]/10">
                {jobs.map((job) => (
                  <motion.tr
                    key={job._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#F7F8FF] dark:hover:bg-[#1A1D2E] transition-colors group"
                  >
                    <td className="px-6 py-5 align-top">
                      <div>
                        <Link
                          to={`/company/jobs/${job._id}`}
                          className="font-bold text-lg text-[#1A1D2E] dark:text-[#E8EAF2] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors line-clamp-1"
                          style={{ fontFamily: SERIF }}
                        >
                          {job.title}
                        </Link>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mt-1" style={{ fontFamily: MONO }}>
                          {job.jobType} <span className="text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50 mx-1">•</span> {job.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className={`inline-flex items-center px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] border ${job.status === 'ACTIVE'
                        ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]'
                        : 'border-[#E25C5C]/30 bg-[#E25C5C]/10 text-[#E25C5C]'
                        }`} style={{ fontFamily: MONO }}>
                        {job.status === 'ACTIVE' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-2"></span>
                            Active
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E25C5C] mr-2"></span>
                            Closed
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="flex flex-col gap-1">
                        <Link
                          to={`/company/applicants?job=${job._id}`}
                          className="text-[#1A1D2E] dark:text-[#E8EAF2] font-bold text-sm hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                        >
                          {job.applicationCount || 0} APPLICANTS
                        </Link>
                        {job.applicationCount > 0 && (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#F5A623] dark:text-[#F9C74F]" style={{ fontFamily: MONO }}>
                            {job.pendingCount || 0} pending review
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top text-[11px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-5 align-top text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/company/jobs/${job._id}`}
                          className="p-2 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8] dark:hover:bg-[#6C7EF5] hover:text-white transition-colors bg-white dark:bg-[#252A41]"
                          title="View Job"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link
                          to={`/company/jobs/edit/${job._id}`}
                          className="p-2 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#F5A623] hover:border-[#F5A623] hover:text-white transition-colors bg-white dark:bg-[#252A41]"
                          title="Edit Job"
                        >
                          <Edit size={16} />
                        </Link>
                        <Link
                          to={`/company/applicants?job=${job._id}`}
                          className="p-2 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#10B981] hover:border-[#10B981] hover:text-white transition-colors bg-white dark:bg-[#252A41]"
                          title="View Applicants"
                        >
                          <Users size={16} />
                        </Link>
                        <button
                          onClick={() => handleCloseJob(job._id)}
                          disabled={job.status === 'CLOSED'}
                          className="p-2 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#E25C5C] hover:border-[#E25C5C] hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent bg-white dark:bg-[#252A41]"
                          title="Close Job"
                        >
                          <XCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-2 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#6B7194] dark:text-[#8B90B8] hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-transparent bg-white dark:bg-[#252A41]"
                          title="Delete Job"
                        >
                          <Trash2 size={16} />
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