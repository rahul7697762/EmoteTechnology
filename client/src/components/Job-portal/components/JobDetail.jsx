// job-portal/components/JobDetail.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  Clock,
  Users,
  RotateCcw,
  PlayCircle,
  Award,
  CircleCheck,
  Zap,
  Star
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { getJobById } from '../../../redux/slices/jobSlice';

const JobDetail = ({ jobId, onApply, applied = false }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getJobById(jobId)).unwrap();
      setJob(response.job || response);
      setError('');
    } catch (err) {
      setError('Failed to load job details');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: '2y'
    }).replace(',', '').replace('20', "' ");
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>)}
        </div>
      </div>
    );
  }

  if (error || !job) {
    return <div className="p-8 text-center text-red-500">{error || 'Job not found'}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {job.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {job.company?.name || job.companyName}
            </p>
          </div>
          <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-700 p-2 border border-gray-100 dark:border-gray-600 flex items-center justify-center shrink-0">
            {job.company?.logo ? (
              <img src={job.company.logo} alt="Company logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xl uppercase">
                {(job.company?.name || job.companyName || 'CO').substring(0, 1)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
          <MapPin size={18} className="text-gray-400" />
          <span className="text-sm">{job.remote ? 'Work from home' : job.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
          <Briefcase size={18} className="text-gray-400" />
          <span className="text-sm">{job.jobType}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <PlayCircle size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Start Date</span>
            </div>
            <p className="text-gray-900 dark:text-white font-medium">Immediately</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Calendar size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Duration</span>
            </div>
            <p className="text-gray-900 dark:text-white font-medium">{job.jobType === 'Internship' ? '6 Months' : 'Permanent'}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <IndianRupee size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Stipend</span>
            </div>
            <p className="text-gray-900 dark:text-white font-medium">
              {job.salaryMin && job.salaryMax ? `₹ ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} /month` : '₹ 3,001 - 4,500 /month'}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Calendar size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Apply By</span>
            </div>
            <p className="text-gray-900 dark:text-white font-medium">{formatDate(job.deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-50 text-green-700 text-[11px] font-bold">
            <RotateCcw size={12} className="rotate-180" />
            Just now
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[11px] font-bold">
            <Briefcase size={12} />
            {job.jobType}
          </span>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About the job</h3>
            <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </section>

          {job.tags && job.tags.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Skill(s) required</h3>
              <div className="flex flex-wrap gap-3">
                {job.tags.map((tag, index) => (
                  <span key={index} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Who can apply</h3>
            <ul className="space-y-3">
              {[
                "are available for full time (in-office) internship",
                `can start the internship between ${new Date().toLocaleDateString('en-GB', { day: 'j', month: 'M' }).replace('j', '1st')} Feb'25 and ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'j', month: 'M' }).replace('j', '8th')} Mar'25`,
                "are available for duration of 6 months",
                "have relevant skills and interests"
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Only those candidates can apply who:</span>
                </li>
              ))}
              <div className="pl-6 space-y-2">
                {[
                  "are available for full time (in-office) internship",
                  `can start the internship between 1st Feb'25 and 8th Mar'25`,
                  "are available for duration of 6 months",
                  "have relevant skills and interests"
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-gray-400 text-xs mt-1.5">{i + 1}.</span>
                    <span>{text}</span>
                  </li>
                ))}
              </div>
            </ul>
          </section>

          {job.benefits && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Perks</h3>
              <div className="flex flex-wrap gap-4">
                {job.benefits.split('\n').map((perk, index) => (
                  perk.trim() && (
                    <span key={index} className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm rounded-full border border-gray-100 dark:border-gray-600 font-medium">
                      {perk}
                    </span>
                  )
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Number of openings</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">1</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-center">
          {applied ? (
            <div className="px-10 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2">
              <CircleCheck size={20} />
              Applied
            </div>
          ) : (
            <button
              onClick={onApply}
              className="px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
            >
              Apply now
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobDetail;
