// job-portal/components/JobCard.jsx
import { motion } from 'framer-motion';
import {
  IndianRupee,
  Calendar,
  FileText,
  Clock,
  Zap,
  RotateCcw,
  Home,
  ChevronRight
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

  const companyName = job.company?.companyName || job.companyName || 'Unknown Company';
  const category = job.category || 'General';

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
      onClick={() => onViewJob?.(job._id)}
      className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded">
              {category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-1">
            {job.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {companyName}
          </p>
        </div>

        <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-700 p-1 border border-gray-100 dark:border-gray-600 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt={companyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-lg">
              {companyName.substring(0, 1)}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
          <Home size={16} className="text-gray-400" />
          <span>{job.remote ? 'Work from home' : job.location || 'Flexible'}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
          <IndianRupee size={16} className="text-gray-400" />
          <span>
            {job.salaryMin || job.salaryMax
              ? `₹ ${job.salaryMin?.toLocaleString() || '0'} - ${job.salaryMax?.toLocaleString() || 'Negotiable'}`
              : 'Salary Negotiable'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
          <Calendar size={16} className="text-gray-400" />
          <span>{job.jobType || 'Full-time'}</span>
        </div>
      </div>

      <div className="flex items-start gap-2 mb-4">
        <FileText size={16} className="text-gray-400 mt-1 shrink-0" />
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {job.tags.slice(0, 5).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded transition-colors"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 5 && (
            <span className="text-xs text-gray-400 py-0.5 font-medium">
              +{job.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-green-200 bg-green-50 text-green-700 text-[11px] font-bold">
            <RotateCcw size={12} className="rotate-180" />
            {formatDate(job.createdAt)}
          </span>
          {job.urgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-orange-200 bg-orange-50 text-orange-700 text-[11px] font-bold">
              <Zap size={12} fill="currentColor" />
              Urgent
            </span>
          )}
        </div>

        <div className="px-2 py-1 flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform">
          View <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;

