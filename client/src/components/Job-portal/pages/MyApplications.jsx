// job-portal/pages/MyApplications.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, XCircle, Eye, Download,
  Calendar, MapPin, Building2, Filter, Search, AlertCircle, Briefcase,
  MessageSquare
} from 'lucide-react';
import { applicationAPI } from '../services/api';
import { showToast } from '../services/toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatModal from '../../chat/ChatModal';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
  const [chatConfig, setChatConfig] = useState({
    isOpen: false,
    jobId: null,
    applicantId: null,
    jobTitle: '',
    otherPartyName: ''
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
      PENDING: { icon: Clock, color: 'text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30', label: 'Pending' },
      REVIEWED: { icon: Eye, color: 'text-[#3B4FD8] dark:text-[#6C7EF5] bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 border border-[#3B4FD8]/30', label: 'Reviewed' },
      SHORTLISTED: { icon: CheckCircle, color: 'text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30', label: 'Shortlisted' },
      REJECTED: { icon: XCircle, color: 'text-red-500 bg-red-500/10 border border-red-500/30', label: 'Rejected' },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-end"
        >
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-3 px-8 py-4 bg-[#3B4FD8] text-white font-bold rounded-none hover:bg-[#2f3fab] transition-all shadow-sm uppercase tracking-widest text-[10px]"
            style={{ fontFamily: MONO }}
          >
            <Briefcase className="w-4 h-4" />
            BROWSE JOBS
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'TOTAL APPLICATIONS', value: applications.length, color: 'text-[#1A1D2E] dark:text-[#E8EAF2]' },
            { label: 'SHORTLISTED', value: applications.filter(a => a.status === 'SHORTLISTED').length, color: 'text-[#10B981]' },
            { label: 'PENDING', value: applications.filter(a => a.status === 'PENDING').length, color: 'text-[#F5A623]' },
            { label: 'REVIEWED', value: applications.filter(a => a.status === 'REVIEWED').length, color: 'text-[#3B4FD8] dark:text-[#6C7EF5]' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1A1D2E] rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 p-6 flex flex-col justify-center items-center">
              <div className={`text-4xl font-bold mb-3 ${stat.color} font-sans`}>
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1A1D2E] rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 p-8 mb-10 shadow-sm"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Search */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-3" style={{ fontFamily: MONO }}>
                <Search className="w-4 h-4" />
                SEARCH APPLICATIONS
              </label>
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-4 py-4 rounded-none border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-all text-xs font-bold"
                style={{ fontFamily: MONO }}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-3" style={{ fontFamily: MONO }}>
                <Filter className="w-4 h-4" />
                STATUS FILTER
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-4 rounded-none border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-all text-xs font-bold uppercase tracking-wider appearance-none"
                style={{ fontFamily: MONO }}
              >
                <option value="">ALL STATUSES</option>
                <option value="PENDING">PENDING</option>
                <option value="REVIEWED">REVIEWED</option>
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-3 block" style={{ fontFamily: MONO }}>
                SORT BY
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-4 py-4 rounded-none border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-all text-xs font-bold uppercase tracking-wider appearance-none"
                style={{ fontFamily: MONO }}
              >
                <option value="newest">NEWEST FIRST</option>
                <option value="oldest">OLDEST FIRST</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1A1D2E] rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 p-8 animate-pulse">
                <div className="h-6 bg-[#F7F8FF] dark:bg-[#0A0B10] rounded-none mb-4 w-1/3 border border-[#3B4FD8]/5"></div>
                <div className="h-4 bg-[#F7F8FF] dark:bg-[#0A0B10] rounded-none w-2/3 border border-[#3B4FD8]/5"></div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white dark:bg-[#1A1D2E] border border-dashed border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 rounded-none"
          >
            <div className="w-20 h-20 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/10 flex items-center justify-center mx-auto mb-6 text-[#6B7194]">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3" style={{ fontFamily: SERIF }}>
              No applications yet
            </h3>
            <p className="text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] mb-8 max-w-md mx-auto uppercase tracking-widest leading-loose" style={{ fontFamily: MONO }}>
              YOU HAVEN'T APPLIED TO ANY JOBS YET. START BROWSING OPPORTUNITIES AND SUBMIT YOUR FIRST APPLICATION!
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#3B4FD8] text-white font-bold rounded-none hover:bg-[#2f3fab] transition-all shadow-sm uppercase tracking-widest text-[10px]"
              style={{ fontFamily: MONO }}
            >
              BROWSE JOBS
            </button>
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
                  className="bg-white dark:bg-[#1A1D2E] rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 p-8 hover:border-[#3B4FD8]/30 dark:hover:border-[#6C7EF5]/30 transition-colors group relative shadow-sm"
                >
                  {/* Hover Accent Line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3B4FD8] dark:bg-[#6C7EF5] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-none bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 flex items-center justify-center p-2">
                        {application.job.company?.logo?.url || application.job.company?.logo ? (
                          <img
                            src={application.job.company.logo.url || application.job.company.logo}
                            alt={application.job.company?.companyName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 text-[#6B7194] dark:text-[#8B90B8]" />
                        )}
                      </div>
                    </div>

                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3" style={{ fontFamily: SERIF }}>
                            {application.job.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>
                            <span className="flex items-center gap-2 text-[#3B4FD8] dark:text-[#6C7EF5]">
                              <Building2 className="w-4 h-4" />
                              {application.job.company?.companyName}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {application.job.remote ? 'REMOTE' : application.job.location}
                            </span>
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              APPLIED {formatDate(application.createdAt)}
                            </span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-none text-[9px] font-bold uppercase tracking-widest ${statusInfo.color}`} style={{ fontFamily: MONO }}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Application Details */}
                      <div className="space-y-4">
                        {application.coverLetter && (
                          <div className="p-4 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 rounded-none">
                            <h4 className="text-[10px] font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-2 uppercase tracking-widest" style={{ fontFamily: MONO }}>
                              COVER LETTER
                            </h4>
                            <p className="text-sm text-[#6B7194] dark:text-[#8B90B8] line-clamp-3">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}

                        {application.notes && (
                          <div className="p-4 bg-[#F5A623]/5 border border-[#F5A623]/20 rounded-none">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="w-4 h-4 text-[#F5A623]" />
                              <h4 className="text-[10px] font-bold text-[#F5A623] uppercase tracking-widest" style={{ fontFamily: MONO }}>
                                EMPLOYER NOTE
                              </h4>
                            </div>
                            <p className="text-sm text-[#6B7194] dark:text-[#E8EAF2]">
                              {application.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 lg:w-48 mt-4 lg:mt-0">
                      <a
                        href={`/jobs/${application.job._id}`}
                        className="w-full px-4 py-3 text-center bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#3B4FD8] dark:text-[#6C7EF5] font-bold uppercase tracking-widest text-[10px] rounded-none hover:bg-[#3B4FD8]/5 transition-colors"
                        style={{ fontFamily: MONO }}
                      >
                        VIEW JOB
                      </a>

                      <button
                        onClick={() => downloadResume(application.resume._id)}
                        className="w-full px-4 py-3 text-center border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#1A1D2E] dark:text-[#E8EAF2] font-bold uppercase tracking-widest text-[10px] rounded-none hover:bg-[#F7F8FF] dark:hover:bg-[#0A0B10] transition-colors flex items-center justify-center gap-2"
                        style={{ fontFamily: MONO }}
                      >
                        <Download className="w-4 h-4" />
                        RESUME
                      </button>

                      <button
                        onClick={() => setChatConfig({
                          isOpen: true,
                          jobId: application.job._id,
                          applicantId: user._id,
                          jobTitle: application.job.title,
                          otherPartyName: application.job.company?.companyName
                        })}
                        className="w-full px-4 py-3 text-center bg-[#1A1D2E] border border-[#1A1D2E] text-[#00E5FF] font-bold uppercase tracking-widest text-[10px] rounded-none hover:bg-[#3B4FD8] hover:text-white transition-colors flex items-center justify-center gap-2"
                        style={{ fontFamily: MONO }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        MESSAGE COMPANY
                      </button>

                      {application.status === 'PENDING' && (
                        <button
                          onClick={() => handleWithdraw(application._id)}
                          className="w-full px-4 py-3 text-center bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-[10px] rounded-none hover:bg-red-500/20 transition-colors"
                          style={{ fontFamily: MONO }}
                        >
                          WITHDRAW
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

      <ChatModal
        isOpen={chatConfig.isOpen}
        onClose={() => setChatConfig(prev => ({ ...prev, isOpen: false }))}
        jobId={chatConfig.jobId}
        applicantId={chatConfig.applicantId}
        jobTitle={chatConfig.jobTitle}
        otherPartyName={chatConfig.otherPartyName}
      />
    </div>
  );
};

export default MyApplications;