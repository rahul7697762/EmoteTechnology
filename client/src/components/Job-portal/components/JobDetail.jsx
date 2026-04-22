// job-portal/components/JobDetail.jsx — Tech-Brutalism Design
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  DollarSign,
  Calendar,
  Clock,
  RotateCcw,
  PlayCircle,
  CircleCheck,
  Zap
} from 'lucide-react';
import { jobAPI } from '../services/api';

const MONO = "'Space Mono', 'IBM Plex Mono', monospace";

const JobDetail = ({ jobId, onApply, applied = false }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobById(jobId);
      setJob(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load job details');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'NOT_SPECIFIED';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: '2y'
    }).replace(',', '').replace('20', "' ");
  };

  if (loading) {
    return (
      <div className="bg-[#F7F8FF] border-[3px] border-[#1A1D2E] p-8 shadow-[6px_6px_0px_#3B4FD8] animate-pulse" style={{ fontFamily: MONO }}>
        <div className="h-8 bg-gray-300 w-3/4 mb-4 border-[2px] border-[#1A1D2E]"></div>
        <div className="h-4 bg-gray-300 w-1/4 mb-8 border-[2px] border-[#1A1D2E]"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-300 border-[2px] border-[#1A1D2E]"></div>)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-300 border-[2px] border-[#1A1D2E]"></div>)}
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-red-500 border-[3px] border-[#1A1D2E] p-8 text-center text-white shadow-[6px_6px_0px_#1A1D2E]" style={{ fontFamily: MONO }}>
        <p className="font-black uppercase tracking-widest">{error || 'JOB_NOT_FOUND'}</p>
      </div>
    );
  }

  const CurrencyIcon = job.salaryCurrency === 'INR' ? IndianRupee : DollarSign;
  const currencySymbol = job.salaryCurrency === 'INR' ? '₹' : '$';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#F7F8FF] border-[3px] border-[#1A1D2E] shadow-[8px_8px_0px_#3B4FD8] overflow-hidden relative"
      style={{ fontFamily: MONO }}
    >
      {/* Subtle grid bg inside card */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#1A1D2E 1px, transparent 1px), linear-gradient(90deg, #1A1D2E 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />

      <div className="p-8 relative">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-6">
            <h1 className="text-3xl md:text-4xl font-black uppercase text-[#1A1D2E] leading-none mb-3">
              {job.title}
            </h1>
            <p className="text-[#3B4FD8] font-black uppercase tracking-widest text-sm">
              // {job.company?.name || job.companyName}
            </p>
          </div>
          <div className="w-20 h-20 bg-white border-[3px] border-[#1A1D2E] flex items-center justify-center shrink-0 shadow-[4px_4px_0px_#1A1D2E]">
            {job.company?.logo ? (
              <img src={job.company.logo} alt="Company logo" className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-[#3B4FD8] font-black text-3xl uppercase">
                {(job.company?.name || job.companyName || 'CO').substring(0, 1)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#1A1D2E] font-bold text-sm uppercase mb-4">
          <MapPin size={16} className="text-[#00E5FF]" />
          <span>{job.remote ? 'REMOTE_POSITION' : job.location}</span>
        </div>

        <div className="flex items-center gap-2 text-[#1A1D2E] font-bold text-sm uppercase mb-8 pb-8 border-b-[3px] border-[#1A1D2E]">
          <Briefcase size={16} className="text-[#00E5FF]" />
          <span>{job.jobType}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#3B4FD8] mb-2">
              <PlayCircle size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">START_DATE</span>
            </div>
            <p className="text-[#1A1D2E] font-bold uppercase text-sm">IMMEDIATELY</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#3B4FD8] mb-2">
              <Calendar size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">DURATION</span>
            </div>
            <p className="text-[#1A1D2E] font-bold uppercase text-sm">{job.jobType === 'Internship' ? '6_MONTHS' : 'PERMANENT'}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#3B4FD8] mb-2">
              <CurrencyIcon size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">STIPEND</span>
            </div>
            <p className="text-[#1A1D2E] font-bold uppercase text-sm">
              {job.salaryMin && job.salaryMax ? `${currencySymbol}${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()}/MO` : (job.salaryMin ? `${currencySymbol}${job.salaryMin.toLocaleString()}/MO` : 'NEGOTIABLE')}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#3B4FD8] mb-2">
              <Clock size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">APPLY_BY</span>
            </div>
            <p className="text-[#1A1D2E] font-bold uppercase text-sm">{formatDate(job.deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-400 text-[#1A1D2E] text-xs font-black uppercase tracking-widest border-[2px] border-[#1A1D2E]">
            <RotateCcw size={12} className="rotate-180" />
            JUST_POSTED
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1D2E] text-[#00E5FF] text-xs font-black uppercase tracking-widest border-[2px] border-[#1A1D2E]">
            <Briefcase size={12} />
            {job.jobType}
          </span>
          {job.urgent && (
             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500 text-white text-xs font-black uppercase tracking-widest border-[2px] border-[#1A1D2E]">
               <Zap size={12} />
               URGENT
             </span>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          <section>
            <h3 className="text-xl font-black uppercase text-[#1A1D2E] mb-4 flex items-center gap-2">
              <span className="text-[#3B4FD8]">/01</span> ABOUT_THE_JOB
            </h3>
            <div className="bg-white border-[3px] border-[#1A1D2E] p-6 text-[#1A1D2E] font-medium leading-relaxed whitespace-pre-line shadow-[4px_4px_0px_#1A1D2E]">
              {job.description}
            </div>
          </section>

          {job.tags && job.tags.length > 0 && (
            <section>
              <h3 className="text-xl font-black uppercase text-[#1A1D2E] mb-4 flex items-center gap-2">
                <span className="text-[#3B4FD8]">/02</span> SKILLS_REQUIRED
              </h3>
              <div className="flex flex-wrap gap-3">
                {job.tags.map((tag, index) => (
                  <span key={index} className="px-4 py-2 bg-white border-[2px] border-[#1A1D2E] text-[#1A1D2E] text-sm font-black uppercase tracking-wider shadow-[2px_2px_0px_#1A1D2E]">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-xl font-black uppercase text-[#1A1D2E] mb-4 flex items-center gap-2">
              <span className="text-[#3B4FD8]">/03</span> WHO_CAN_APPLY
            </h3>
            <div className="bg-[#1A1D2E] p-6 border-[3px] border-[#1A1D2E]">
              <p className="text-[#00E5FF] font-black text-sm uppercase tracking-widest mb-4">
                ONLY_CANDIDATES_WHO:
              </p>
              <ul className="space-y-3">
                {[
                  "Are available for full time (in-office) role",
                  `Can start between ${new Date().toLocaleDateString('en-GB', { day: 'j', month: 'M' }).replace('j', '1st')} Feb'25 and ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'j', month: 'M' }).replace('j', '8th')} Mar'25`,
                  "Are available for duration of 6 months",
                  "Have relevant skills and interests"
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white font-medium">
                    <span className="text-[#3B4FD8] font-black mt-0.5">[{i + 1}]</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {job.benefits && (
            <section>
              <h3 className="text-xl font-black uppercase text-[#1A1D2E] mb-4 flex items-center gap-2">
                <span className="text-[#3B4FD8]">/04</span> PERKS_&_BENEFITS
              </h3>
              <div className="flex flex-wrap gap-3">
                {job.benefits.split('\n').map((perk, index) => (
                  perk.trim() && (
                    <span key={index} className="px-4 py-2 bg-[#00E5FF] border-[2px] border-[#1A1D2E] text-[#1A1D2E] text-sm font-black uppercase tracking-wider shadow-[2px_2px_0px_#1A1D2E]">
                      {perk}
                    </span>
                  )
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-xl font-black uppercase text-[#1A1D2E] mb-2 flex items-center gap-2">
              <span className="text-[#3B4FD8]">/05</span> OPENINGS
            </h3>
            <p className="text-3xl font-black text-[#1A1D2E]">
              {job.openings || '01'}
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t-[3px] border-[#1A1D2E] flex justify-center">
          {applied ? (
             <div className="px-10 py-4 bg-[#1A1D2E] text-[#00E5FF] font-black text-lg uppercase tracking-widest border-[3px] border-[#1A1D2E] shadow-[6px_6px_0px_#00E5FF] flex items-center gap-3">
             <CircleCheck size={24} />
             ALREADY_APPLIED
           </div>
         ) : (
           <button
             onClick={onApply}
             className="px-12 py-4 bg-[#3B4FD8] text-white font-black text-lg uppercase tracking-widest border-[3px] border-[#1A1D2E] shadow-[6px_6px_0px_#1A1D2E] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3"
           >
             APPLY_HERE <Zap size={20} />
           </button>
         )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobDetail;
