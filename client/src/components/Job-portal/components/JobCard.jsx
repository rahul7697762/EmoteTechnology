  // job-portal/components/JobCard.jsx
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Building2, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getLogoInitials = (companyName) => {
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ 
        scale: 1.02, 
        transition: { duration: 0.2 } 
      }}
      className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 cursor-pointer"
    >
      <Link to={`/jobs/${job._id}`}>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
              {job.company?.logo ? (
                <img 
                  src={job.company.logo} 
                  alt={job.company.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                getLogoInitials(job.company?.name || job.companyName || 'CO')
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-teal-500 transition-colors">
                {job.title}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                {job.company?.name && (
                  <span className="flex items-center gap-1">
                    <Building2 size={14} /> 
                    {job.company.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> 
                  {job.remote ? 'Remote' : job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase size={14} /> 
                  {job.jobType}
                </span>
              </div>
            </div>
          </div>
          <motion.div
            whileHover={{ x: 5 }}
            className="self-center p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 group-hover:bg-teal-500 group-hover:text-white transition-all"
          >
            <ArrowRight size={20} />
          </motion.div>
        </div>

        {/* Job Description Preview */}
        <p className="mt-4 text-gray-600 dark:text-gray-400 line-clamp-2">
          {job.description?.substring(0, 120)}...
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full"
            >
              {tag}
            </span>
          ))}
          {job.tags?.length > 3 && (
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {job.salaryMin && job.salaryMax && (
              <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                <DollarSign size={14} />
                ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
              </span>
            )}
            <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {job.experienceLevel}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} />
            {formatDate(job.createdAt)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default JobCard;