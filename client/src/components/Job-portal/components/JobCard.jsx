// job-portal/components/JobCard.jsx
import { motion } from 'framer-motion';
import { MapPin, Banknote, Calendar, Clock, ArrowUpRight } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const JobCard = ({ job, onViewJob }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Just now';
        const diffDays = Math.ceil(Math.abs(new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Just now';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Date(dateString).toLocaleDateString();
    };

    const companyName = job.company?.companyName || job.companyName || 'Unknown Company';
    const duration = job.duration || job.jobType || 'Full-time';
    const symbol = job.salaryCurrency === 'INR' ? '₹' : '$';
    const salary = job.salaryMin && job.salaryMax
        ? `${symbol}${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
        : job.salaryMin ? `${symbol}${job.salaryMin.toLocaleString()}` : 'Not Disclosed';

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            onClick={() => onViewJob?.(job._id)}
            className="group bg-[#F7F8FF] dark:bg-[#1A1D2E] p-6 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 hover:bg-[#EDEEFF] dark:hover:bg-[#252A41] transition-colors duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1 pr-4">
                    <h3
                        className="text-xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2] mb-2 group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors line-clamp-1"
                        style={{ fontFamily: SERIF }}
                        title={job.title}
                    >
                        {job.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[#6B7194] dark:text-[#8B90B8] text-sm">{companyName}</span>
                        {job.isHiring && (
                            <span
                                className="px-2 py-0.5 bg-[#F5A623] text-white text-[9px] font-bold uppercase tracking-wider"
                                style={{ fontFamily: MONO }}
                            >
                                Hiring
                            </span>
                        )}
                    </div>
                </div>
                {/* Logo Box */}
                <div className="w-12 h-12 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-center shrink-0">
                    {job.company?.logo?.url ? (
                        <img src={job.company.logo.url} alt={companyName} className="w-8 h-8 object-contain mix-blend-multiply dark:mix-blend-normal" />
                    ) : (
                        <span className="text-lg font-bold text-[#3B4FD8] dark:text-[#6C7EF5]" style={{ fontFamily: SERIF }}>
                            {companyName.charAt(0)}
                        </span>
                    )}
                </div>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
                {[
                    { icon: MapPin, text: job.location || 'Remote' },
                    { icon: Banknote, text: salary },
                    { icon: Calendar, text: duration }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 text-[11px] text-[#6B7194] dark:text-[#8B90B8] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                        <item.icon size={13} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>

            {/* Description Preview */}
            <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm line-clamp-2 leading-relaxed mb-6 flex-grow">
                {job.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 mt-auto">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                        <Clock size={11} /> {formatDate(job.createdAt)}
                    </span>
                    {/* Status Badge */}
                    {job.applicantsCount < 20 ? (
                        <span className="text-[10px] text-[#3B4FD8] dark:text-[#6C7EF5] uppercase tracking-wider font-semibold">New</span>
                    ) : (
                        <span className="text-[10px] text-[#F5A623] uppercase tracking-wider font-semibold">Hot</span>
                    )}
                </div>
                
                <ArrowUpRight
                    size={18}
                    className="text-[#3B4FD8] dark:text-[#6C7EF5] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
            </div>
        </motion.div>
    );
};

export default JobCard;
