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
import { useSelector } from 'react-redux';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const JobDetailPage = ({ jobId: propJobId, onApply, onBack }) => {
  const { id: paramId } = useParams();
  const jobId = propJobId || paramId;
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      checkApplicationStatus();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const isObjectId = /^[a-fA-F0-9]{24}$/.test(String(jobId));
      if (!isObjectId) {
        setError('Job not found');
        return;
      }
      const response = await jobAPI.getJobById(jobId);
      setJob(response.data);
    } catch (err) {
      setError('Failed to load job details');
      showToast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    if (role !== 'STUDENT' || !user) return;
    try {
      const response = await applicationAPI.getMyApplications();
      setApplied(response.data.some(app => app.job._id === jobId));
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: job.title, text: `Check out this job at ${job.company?.companyName}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast.success('Link copied to clipboard!');
    }
  };

  const handleSaveJob = () => {
    setSaved(!saved);
    showToast.success(saved ? 'Job removed from saved' : 'Job saved successfully');
  };

  const handleApplySuccess = () => {
    setApplied(true);
    setShowApplyForm(false);
    showToast.success('Application submitted successfully!');
    if (onApply) onApply();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] py-12 px-4 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 w-1/4"></div>
          <div className="h-96 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F7F8FF] dark:bg-[#1A1D2E]">
        <h2 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-4" style={{ fontFamily: SERIF }}>Job Not Found</h2>
        <button onClick={() => navigate('/jobs')} className="px-6 py-3 bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white text-xs font-semibold uppercase tracking-wider">
          Browse Jobs
        </button>
      </div>
    );
  }

  const symbol = job.salaryCurrency === 'INR' ? '₹' : '$';

  return (
    <div className="bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] pb-24">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => onBack ? onBack() : navigate('/jobs')}
          className="flex items-center gap-2 text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] mb-8 group text-sm transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Career Portal
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#252A41] p-8 md:p-10 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5] shrink-0">
                      {job.company?.logo?.url ? (
                        <img src={job.company.logo.url} alt={job.company.companyName} className="w-10 h-10 object-contain mix-blend-multiply dark:mix-blend-normal" />
                      ) : (
                        <span className="text-2xl font-bold" style={{ fontFamily: SERIF }}>
                          {job.company?.companyName?.charAt(0) || 'C'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3 leading-tight" style={{ fontFamily: SERIF }}>
                        {job.title}
                      </h1>
                      <div className="flex flex-wrap gap-4 text-[#6B7194] dark:text-[#8B90B8] text-sm">
                        <span className="flex items-center gap-1.5"><Building2 size={16} />{job.company?.companyName}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={16} />{job.remote ? 'Remote' : job.location}</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={16} />{job.jobType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                    <div className="flex items-center gap-3 pr-6 border-r border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 text-[#3B4FD8] dark:text-[#6C7EF5]">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Salary</p>
                            <p className="font-semibold">{job.salaryMin ? `${symbol}${job.salaryMin.toLocaleString()}` : 'Negotiable'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 text-[#3B4FD8] dark:text-[#6C7EF5]">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Level</p>
                            <p className="font-semibold">{job.experienceLevel}</p>
                        </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3 mt-8">
                    {(!role || role === 'STUDENT') && (
                      applied ? (
                        <div className="flex flex-1 md:flex-none items-center justify-center gap-2 px-8 py-3 bg-[#EAF2ED] text-[#2F7E4E] border border-[#2F7E4E]/20 text-sm font-semibold uppercase tracking-wider">
                          <CheckCircle size={18} /> Applied
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (onApply) onApply(jobId);
                            else if (!user) navigate(`/signup?redirect=/jobs/${jobId}?action=apply`);
                            else setShowApplyForm(true);
                          }}
                          className="flex-1 md:flex-none px-10 py-3 bg-[#F5A623] hover:bg-[#d9911a] text-white text-sm font-semibold uppercase tracking-wider transition-colors"
                          style={{ fontFamily: MONO }}
                        >
                          Apply Now
                        </button>
                      )
                    )}
                    <button onClick={handleSaveJob} className="px-5 py-3 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#3B4FD8] dark:text-[#6C7EF5] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors flex items-center justify-center">
                      {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                    </button>
                    <button onClick={handleShare} className="px-5 py-3 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#3B4FD8] dark:text-[#6C7EF5] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors flex items-center justify-center">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Tabs / Body */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#252A41] p-8 md:p-10 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: SERIF }}>The Role</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-sm text-[#3E435E] dark:text-[#A7ACC8] marker:text-[#3B4FD8] dark:marker:text-[#6C7EF5]">
                 <p className="whitespace-pre-line leading-relaxed">{job.description}</p>
              </div>
            </motion.div>

            {/* Reqs & Resps */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#252A41] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                <h3 className="text-xl font-bold mb-5" style={{ fontFamily: SERIF }}>Requirements</h3>
                <ul className="space-y-4">
                  {job.requirements?.split('\n').filter(r => r.trim()).map((req, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-5 h-5 mt-0.5 shrink-0 bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 flex items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5]">
                          <CheckCircle size={12} />
                      </div>
                      <span className="text-sm text-[#6B7194] dark:text-[#8B90B8] leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {job.responsibilities && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-[#252A41] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                  <h3 className="text-xl font-bold mb-5" style={{ fontFamily: SERIF }}>Responsibilities</h3>
                  <ul className="space-y-4">
                    {job.responsibilities.split('\n').filter(r => r.trim()).map((resp, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-5 h-5 mt-0.5 shrink-0 bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 flex items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5]">
                            <ArrowLeft size={12} className="rotate-180" />
                        </div>
                        <span className="text-sm text-[#6B7194] dark:text-[#8B90B8] leading-relaxed">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-8">
            {/* Company Block */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-[#252A41] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: SERIF }}>About Company</h3>
              {job.company && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5] text-lg font-bold" style={{ fontFamily: SERIF }}>
                      {job.company.companyName?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]">{job.company.companyName}</h4>
                      {job.company.industry && <p className="text-xs text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-wider">{job.company.industry}</p>}
                    </div>
                  </div>
                  {job.company.description && <p className="text-sm text-[#6B7194] dark:text-[#8B90B8] leading-relaxed">{job.company.description}</p>}
                  <div className="space-y-3 pt-4 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-sm">
                    {job.company.location && <div className="flex items-center gap-3 text-[#6B7194] dark:text-[#8B90B8]"><MapPin size={16} />{job.company.location}</div>}
                    {job.company.size && <div className="flex items-center gap-3 text-[#6B7194] dark:text-[#8B90B8]"><Users size={16} />{job.company.size}</div>}
                    {job.company.website && (
                      <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#3B4FD8] dark:text-[#6C7EF5] hover:underline">
                        <Globe size={16} /> Website <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Details Table */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#252A41] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: SERIF }}>Overview</h3>
              <div className="space-y-4 text-sm bg-[#F7F8FF] dark:bg-[#1A1D2E] p-5 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                <div className="flex justify-between items-center pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                  <span className="text-[#6B7194] dark:text-[#8B90B8]">Type</span><span className="font-semibold">{job.jobType}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                  <span className="text-[#6B7194] dark:text-[#8B90B8]">Level</span><span className="font-semibold">{job.experienceLevel}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                  <span className="text-[#6B7194] dark:text-[#8B90B8]">Location</span><span className="font-semibold">{job.remote ? 'Remote' : job.location}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                  <span className="text-[#6B7194] dark:text-[#8B90B8]">Posted</span><span className="font-semibold" style={{ fontFamily: MONO }}>{formatDate(job.createdAt)}</span>
                </div>
                {job.deadline && (
                  <div className="flex justify-between items-center pb-3 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                    <span className="text-[#6B7194] dark:text-[#8B90B8]">Deadline</span><span className="font-semibold text-[#E25C5C]" style={{ fontFamily: MONO }}>{formatDate(job.deadline)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7194] dark:text-[#8B90B8]">Applicants</span><span className="font-semibold">{job.applicationCount || 0}</span>
                </div>
              </div>
            </motion.div>

            {/* Tags block */}
            {job.tags && job.tags.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#252A41] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                <h3 className="text-xl font-bold mb-5" style={{ fontFamily: SERIF }}>Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 text-[#3B4FD8] dark:text-[#6C7EF5] text-[11px] font-medium uppercase tracking-wider" style={{ fontFamily: MONO }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Overlay for Apply */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-[#1A1D2E]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#F7F8FF] dark:bg-[#252A41] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" style={{ fontFamily: SERIF }}>Apply: {job.title}</h2>
              <button onClick={() => setShowApplyForm(false)} className="text-[#6B7194] hover:text-[#E25C5C] text-sm uppercase tracking-wider font-semibold" style={{ fontFamily: MONO }}>Close ✕</button>
            </div>
            {/* Note: ApplicationForm component needs its own styling update if it looks out of place, but it sits transparently inside this container */}
            <ApplicationForm jobId={job._id} jobTitle={job.title} onSuccess={handleApplySuccess} onCancel={() => setShowApplyForm(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;