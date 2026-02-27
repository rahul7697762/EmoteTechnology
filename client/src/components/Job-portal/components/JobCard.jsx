// job-portal/components/JobCard.jsx
import { motion } from 'framer-motion';
import {
  MapPin,
  Banknote,
  Calendar,
  Clock,
  Zap,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';

const JobCard = ({ job, onViewJob }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Just now';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const companyName = job.company?.name || job.companyName || 'Unknown Company';
  const duration = job.duration || job.jobType || 'Full-time';
  const salary = job.salaryMin && job.salaryMax
    ? `₹ ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
    : job.salaryMin ? `₹ ${job.salaryMin.toLocaleString()}` : 'Not Disclosed';

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => onViewJob?.(job._id)}
      className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer relative flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 transition-colors line-clamp-1" title={job.title}>
            {job.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-600 dark:text-gray-400 font-medium text-sm flex items-center gap-1.5">
              <Briefcase size={14} className="text-teal-500" />
              {companyName}
            </span>
            {job.isHiring && (
              <span className="px-2.5 py-0.5 rounded-full border border-blue-200/60 bg-blue-50/80 text-blue-600 text-[10px] font-bold uppercase tracking-wide">
                Hiring
              </span>
            )}
          </div>
        </div>
        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-1 border border-gray-100 dark:border-gray-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt={companyName}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <span className="text-xl font-bold bg-linear-to-br from-teal-500 to-cyan-600 bg-clip-text text-transparent">
              {companyName.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700/50">
          <MapPin size={14} className="text-rose-500" />
          <span>{job.location || 'Remote'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700/50">
          <Banknote size={14} className="text-emerald-500" />
          <span>{salary}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700/50">
          <Calendar size={14} className="text-indigo-500" />
          <span>{duration}</span>
        </div>
      </div>

      {/* Description Preview */}
      <div className="mb-6 grow">
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
            <Clock size={12} />
            {formatDate(job.createdAt)}
          </span>
          {/* Dynamic Badge Example */}
          {job.applicantsCount < 20 ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
              <Zap size={12} fill="currentColor" />
              Fast Apply
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100">
              <Layers size={12} />
              Popular
            </span>
          )}
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg group-hover:bg-teal-500 dark:group-hover:bg-teal-400 group-hover:text-white transition-all shadow-sm group-hover:shadow-teal-500/25">
          View Details
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default JobCard;
