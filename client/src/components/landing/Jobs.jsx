import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Building2, ArrowRight, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllJobs } from '../../redux/slices/jobSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
    }
};

const Jobs = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { jobsList, isFetchingJobs } = useSelector((state) => state.job);
    const jobs = jobsList?.jobs?.slice(0, 4) || [];

    useEffect(() => {
        dispatch(getAllJobs({ limit: 4, sort: 'recent' }));
    }, [dispatch]);

    const handleJobClick = (job) => {
        navigate(`/jobs/${job._id}`);
    };

    if (isFetchingJobs && jobs.length === 0) {
        return (
            <section className="py-24 px-6 lg:px-8 bg-[#F7F8FF] dark:bg-[#1A1D2E]">
                <div className="max-w-7xl mx-auto flex justify-center items-center h-64">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <div className="w-full h-full border-[3px] border-[#3B4FD8]/20 border-t-[#3B4FD8] dark:border-[#6C7EF5]/20 dark:border-t-[#6C7EF5] rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!isFetchingJobs && jobs.length === 0) {
        return null;
    }

    return (
        <section className="py-24 px-6 lg:px-8 bg-[#F7F8FF] dark:bg-[#1A1D2E]">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6"
                >
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>FEATURED <span className="text-[#3B4FD8] dark:text-[#6C7EF5] italic">JOBS</span></h2>
                        <p className="text-[#6B7194] dark:text-[#8B90B8] text-xs uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>Explore top opportunities from leading tech companies.</p>
                    </div>
                    {/* View All Jobs Link */}
                    <button 
                        onClick={() => navigate('/jobs')}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3B4FD8] dark:text-[#6C7EF5] hover:underline"
                        style={{ fontFamily: MONO }}
                    >
                        VIEW ALL JOBS
                    </button>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-6"
                >
                    {jobs.map((job, index) => {
                        const symbol = job.salaryCurrency === 'INR' ? '₹' : '$';
                        const salary = job.salaryMin && job.salaryMax
                            ? `${symbol}${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                            : job.salaryMin ? `${symbol}${job.salaryMin.toLocaleString()}` : 'Not Disclosed';

                        return (
                        <motion.div
                            key={job._id || index}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            onClick={() => handleJobClick(job)}
                            className="group p-6 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] transition-all duration-300 cursor-pointer rounded-none shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-5">
                                    <div className="w-14 h-14 shrink-0 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-center text-[#1A1D2E] dark:text-[#E8EAF2] rounded-none group-hover:bg-[#3B4FD8] group-hover:text-white dark:group-hover:bg-[#6C7EF5] transition-colors overflow-hidden">
                                        {job.company?.logo?.url || job.company?.logo ? (
                                            <img src={job.company?.logo?.url || job.company?.logo} alt={job.company.companyName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xl font-bold" style={{ fontFamily: SERIF }}>{job.company?.companyName?.charAt(0) || 'J'}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors line-clamp-1 mb-2" style={{ fontFamily: SERIF }}>{job.title}</h3>
                                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] uppercase font-bold tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                                            <span className="flex items-center gap-1.5"><Building2 size={13} /> {job.company?.companyName}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={13} /> {job.location}</span>
                                            <span className="flex items-center gap-1.5"><Banknote size={13} /> {salary}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:block shrink-0 ml-4 border p-3 border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 group-hover:bg-[#3B4FD8] dark:group-hover:bg-[#6C7EF5] text-[#6B7194] dark:text-[#8B90B8] group-hover:text-white transition-colors">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                            <div className="mt-6 pt-5 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-between">
                                <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#6B7194] dark:text-[#8B90B8] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 group-hover:border-[#3B4FD8] dark:group-hover:border-[#6C7EF5] group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors rounded-none" style={{ fontFamily: MONO }}>
                                    {job.jobType}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                                    {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                                </span>
                            </div>
                        </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Jobs;
