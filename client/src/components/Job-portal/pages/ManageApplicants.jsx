// job-portal/pages/ManageApplicants.jsx — Tech-Brutalism Design
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, FileText, Eye, CheckCircle, XCircle, Clock,
  Search, Filter, Briefcase, Terminal, Zap
} from 'lucide-react';
import { jobAPI, applicationAPI } from '../services/api';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import ApplicantCard from '../components/ApplicantCard';

const MONO = "'Space Mono', 'IBM Plex Mono', monospace";

const ManageApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', search: '' });

  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jobIdParam = params.get('job');
    if (jobIdParam && jobs.length > 0) {
      const jobToSelect = jobs.find(j => j._id === jobIdParam);
      if (jobToSelect) setSelectedJob(jobToSelect);
    } else if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [location.search, jobs]);

  useEffect(() => {
    const role = authUser?.role || '';
    const isEmployer = ['COMPANY', 'EMPLOYER', 'ADMIN'].includes(role.toUpperCase());
    if (isEmployer) fetchCompanyJobs();
  }, [authUser]);

  useEffect(() => {
    if (selectedJob) fetchApplicants(selectedJob._id);
  }, [selectedJob, filters]);

  const fetchCompanyJobs = async () => {
    try {
      const response = await jobAPI.getCompanyJobs();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplicants = async (jobId) => {
    setLoading(true);
    try {
      const response = await jobAPI.getJobApplications(jobId);
      let filteredApplicants = response.data;
      if (filters.status) {
        filteredApplicants = filteredApplicants.filter(app => app.status === filters.status);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredApplicants = filteredApplicants.filter(app =>
          app.candidate?.name?.toLowerCase().includes(searchLower) ||
          app.candidate?.email?.toLowerCase().includes(searchLower)
        );
      }
      setApplicants(filteredApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await applicationAPI.updateApplicationStatus(applicationId, { status });
      setApplicants(prev => prev.map(app =>
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statusOptions = [
    { value: '', label: 'ALL_STATUS', icon: null },
    { value: 'PENDING', label: 'PENDING', icon: Clock },
    { value: 'REVIEWED', label: 'REVIEWED', icon: Eye },
    { value: 'SHORTLISTED', label: 'SHORTLISTED', icon: CheckCircle },
    { value: 'REJECTED', label: 'REJECTED', icon: XCircle },
  ];

  const handleRemoveJob = (e, jobId) => {
    e.stopPropagation();
    setJobs(prev => prev.filter(j => j._id !== jobId));
    if (selectedJob?._id === jobId) {
      setSelectedJob(null);
      setApplicants([]);
    }
  };

  const isEmployer = authUser && ['COMPANY', 'EMPLOYER', 'ADMIN'].includes((authUser.role || '').toUpperCase());

  return (
    <div className="min-h-screen bg-[#F7F8FF] py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: MONO }}>
      {/* Subtle grid bg */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#1A1D2E 1px, transparent 1px), linear-gradient(90deg, #1A1D2E 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-7xl mx-auto relative">

        {/* ── Header ── */}
        <div className="mb-10 border-b-[4px] border-[#1A1D2E] pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block bg-[#3B4FD8] text-white px-3 py-1 text-xs font-black uppercase tracking-widest mb-3">
                EMPLOYER_DASHBOARD
              </div>
              <h1 className="text-5xl font-black uppercase text-[#1A1D2E] leading-none">
                APPLICANTS
              </h1>
              <p className="text-[#1A1D2E] mt-3 font-medium text-sm opacity-60">
                // REVIEW_AND_MANAGE_APPLICATIONS_FOR_YOUR_POSTINGS
              </p>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#1A1D2E] border-[2px] border-[#1A1D2E] self-start md:self-end shadow-[4px_4px_0px_#3B4FD8]">
              <div className="w-2 h-2 bg-[#00E5FF] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-[#00E5FF]">LIVE_NOTIFICATIONS_ACTIVE</span>
            </div>
          </div>
        </div>

        {/* ── Employer gate ── */}
        {!isEmployer ? (
          <div className="p-12 text-center bg-[#F7F8FF] border-[3px] border-[#1A1D2E] shadow-[6px_6px_0px_#3B4FD8]">
            <Terminal className="w-16 h-16 mx-auto text-[#3B4FD8] mb-6" />
            <h3 className="text-2xl font-black uppercase text-[#1A1D2E] mb-2">
              ACCESS_DENIED // EMPLOYER_ONLY
            </h3>
            <p className="text-[#1A1D2E] text-sm mb-8 opacity-70">
              Please login with a company/employer account to manage applicants.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-[#3B4FD8] text-white font-black uppercase tracking-widest text-sm hover:bg-[#1A1D2E] transition-colors border-[2px] border-[#1A1D2E] shadow-[4px_4px_0px_#1A1D2E]"
            >
              LOGIN →
            </button>
          </div>
        ) : (
          <>
            {/* ── Job Selector ── */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-[#1A1D2E]">
                  SELECT_ACTIVE_LISTING
                </span>
                <span className="text-xs font-black text-[#3B4FD8] bg-[#F7F8FF] border-[2px] border-[#3B4FD8] px-2 py-1">
                  {jobs.length.toString().padStart(2, '0')}_TOTAL
                </span>
              </div>

              {jobs.length === 0 ? (
                <div className="p-6 bg-white border-[2px] border-[#1A1D2E] text-center">
                  <Briefcase className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">NO_ACTIVE_LISTINGS</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {jobs.map((job) => (
                    <motion.button
                      key={job._id}
                      onClick={() => setSelectedJob(job)}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.1 }}
                      className={`group relative flex items-center gap-2 pl-4 pr-10 py-3 font-black text-xs uppercase tracking-wider transition-all border-[2px] ${
                        selectedJob?._id === job._id
                          ? 'bg-[#3B4FD8] border-[#1A1D2E] text-white shadow-[4px_4px_0px_#1A1D2E]'
                          : 'bg-white border-[#1A1D2E] text-[#1A1D2E] hover:bg-[#1A1D2E] hover:text-[#00E5FF] shadow-[2px_2px_0px_#1A1D2E]'
                      }`}
                      style={{ fontFamily: MONO }}
                    >
                      <Briefcase className={`w-4 h-4 ${selectedJob?._id === job._id ? 'text-[#00E5FF]' : 'text-[#3B4FD8] group-hover:text-[#00E5FF]'}`} />
                      {job.title}

                      {/* Dismiss */}
                      <div
                        onClick={(e) => handleRemoveJob(e, job._id)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-colors ${
                          selectedJob?._id === job._id
                            ? 'hover:bg-white/20 text-white/60 hover:text-white'
                            : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'
                        }`}
                        title="Remove from view"
                      >
                        <XCircle size={14} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Filters ── */}
            <div className="bg-[#1A1D2E] border-[3px] border-[#1A1D2E] p-6 mb-8 shadow-[6px_6px_0px_#3B4FD8]">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Search */}
                <div>
                  <label className="flex items-center gap-2 text-[#00E5FF] text-xs font-black uppercase tracking-widest mb-3">
                    <Search className="w-4 h-4" />
                    SEARCH_APPLICANTS
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="SEARCH BY NAME OR EMAIL..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-[2px] border-[#F7F8FF] text-[#1A1D2E] font-bold text-sm focus:outline-none focus:border-[#00E5FF] placeholder:text-gray-400 placeholder:font-normal transition-colors"
                      style={{ fontFamily: MONO }}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="flex items-center gap-2 text-[#00E5FF] text-xs font-black uppercase tracking-widest mb-3">
                    <Filter className="w-4 h-4" />
                    FILTER_BY_STATUS
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setFilters(prev => ({ ...prev, status: option.value }))}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-black uppercase tracking-wider transition-all border-[2px] ${
                          filters.status === option.value
                            ? 'bg-[#00E5FF] text-[#1A1D2E] border-[#00E5FF] shadow-[2px_2px_0px_#F7F8FF]'
                            : 'bg-transparent text-white/70 border-white/30 hover:border-white hover:text-white'
                        }`}
                        style={{ fontFamily: MONO }}
                      >
                        {option.icon && <option.icon className="w-3 h-3" />}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Applicants List ── */}
            {selectedJob && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-black text-[#3B4FD8] uppercase tracking-widest">&gt;&gt; VIEWING</span>
                    <h2 className="text-xl font-black uppercase text-[#1A1D2E] mt-1">
                      "{selectedJob.title}"
                    </h2>
                  </div>
                  <div className="px-4 py-2 bg-[#3B4FD8] text-white border-[2px] border-[#1A1D2E] shadow-[3px_3px_0px_#1A1D2E]">
                    <span className="text-xs font-black uppercase tracking-widest">
                      {applicants.length.toString().padStart(2, '0')}_APPLICANTS
                    </span>
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-8 bg-white border-[3px] border-[#1A1D2E] animate-pulse shadow-[4px_4px_0px_#3B4FD8]">
                        <div className="h-5 bg-gray-200 mb-4 w-1/3" />
                        <div className="h-4 bg-gray-200 w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : applicants.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white border-[3px] border-[#1A1D2E] shadow-[6px_6px_0px_#3B4FD8]"
                  >
                    <div className="w-20 h-20 bg-[#F7F8FF] border-[3px] border-[#1A1D2E] flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_#3B4FD8]">
                      <FileText className="w-10 h-10 text-[#3B4FD8]" />
                    </div>
                    <h3 className="text-xl font-black uppercase text-[#1A1D2E] mb-2">
                      NO_APPLICANTS_FOUND
                    </h3>
                    <p className="text-[#1A1D2E] text-sm opacity-60 font-medium">
                      Applicants will appear here when they apply to this job posting.
                    </p>
                    {filters.status || filters.search ? (
                      <button
                        onClick={() => setFilters({ status: '', search: '' })}
                        className="mt-6 px-6 py-3 bg-[#3B4FD8] text-white font-black uppercase text-xs tracking-widest border-[2px] border-[#1A1D2E] hover:bg-[#1A1D2E] transition-colors shadow-[3px_3px_0px_#1A1D2E]"
                        style={{ fontFamily: MONO }}
                      >
                        CLEAR_FILTERS
                      </button>
                    ) : null}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {applicants.map((applicant) => (
                      <ApplicantCard
                        key={applicant._id}
                        applicant={applicant}
                        onStatusUpdate={updateStatus}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* No job selected state */}
            {!selectedJob && jobs.length > 0 && (
              <div className="text-center py-20 bg-white border-[3px] border-[#1A1D2E] shadow-[6px_6px_0px_#3B4FD8]">
                <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                  SELECT_A_JOB_LISTING_ABOVE
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageApplicants;