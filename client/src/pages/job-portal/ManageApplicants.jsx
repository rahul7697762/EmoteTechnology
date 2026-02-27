// Missing: ManageApplicants.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, FileText, Download, Eye, CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight, Search, Filter
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getCompanyJobs } from '../../redux/slices/companySlice';
import { getJobApplications } from '../../redux/slices/jobSlice';
import { updateApplicationStatus as updateAppStatus } from '../../redux/slices/applicationSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import ApplicantCard from "../../components/Job-portal/components/ApplicantCard";

const ManageApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jobIdParam = params.get('job');

    if (jobIdParam && jobs.length > 0) {
      const jobToSelect = jobs.find(j => j._id === jobIdParam);
      if (jobToSelect) {
        setSelectedJob(jobToSelect);
      }
    } else if (jobs.length > 0 && !selectedJob) {
      // Only default if no param or param not found
      setSelectedJob(jobs[0]);
    }
  }, [location.search, jobs]); // Run when url params or jobs list changes

  useEffect(() => {
    const role = authUser?.role || '';
    const isEmployer = ['COMPANY', 'EMPLOYER', 'ADMIN'].includes(role.toUpperCase());
    if (isEmployer) {
      fetchCompanyJobs();
    }
  }, [authUser]);

  useEffect(() => {
    if (selectedJob) {
      fetchApplicants(selectedJob._id);
    }
  }, [selectedJob, filters]);

  const fetchCompanyJobs = async () => {
    try {
      const response = await dispatch(getCompanyJobs()).unwrap();
      setJobs(response.jobs || response);
      // Selection logic moved to useEffect to support URL params
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplicants = async (jobId) => {
    setLoading(true);
    try {
      const response = await dispatch(getJobApplications({ id: jobId })).unwrap();
      let filteredApplicants = response.applications || response;

      // Apply client-side filtering
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
      await dispatch(updateAppStatus({ id: applicationId, data: { status } })).unwrap();
      // Update local state
      setApplicants(prev => prev.map(app =>
        app._id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Status', icon: null },
    { value: 'PENDING', label: 'Pending', icon: Clock, color: 'yellow' },
    { value: 'REVIEWED', label: 'Reviewed', icon: Eye, color: 'blue' },
    { value: 'SHORTLISTED', label: 'Shortlisted', icon: CheckCircle, color: 'green' },
    { value: 'REJECTED', label: 'Rejected', icon: XCircle, color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0f] dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-teal-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Applicant Management
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage applications for your job postings
          </p>
        </div>

        {/* Job Selector */}
        {!authUser || !['COMPANY', 'EMPLOYER', 'ADMIN'].includes((authUser.role || '').toUpperCase()) ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold">Employer access required</h3>
            <p className="text-gray-600 dark:text-gray-400">Please login with a company/employer account to manage applicants.</p>
            <div className="mt-4">
              <button onClick={() => navigate('/login')} className="px-6 py-2 bg-teal-500 text-white rounded-lg">Login</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Job
              </label>
              <div className="flex flex-wrap gap-2">
                {jobs.map((job) => (
                  <button
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedJob?._id === job._id
                      ? 'bg-teal-500 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    {job.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Search className="w-4 h-4" />
                    Search Applicants
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Filter className="w-4 h-4" />
                    Application Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </>
        )}

        {/* Applicants List */}
        {selectedJob && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Applicants for "{selectedJob.title}"
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {applicants.length} applicant(s)
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No applicants yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Applicants will appear here when they apply to your job
                </p>
              </div>
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
      </div>
    </div>
  );
};

export default ManageApplicants;