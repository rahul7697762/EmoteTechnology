import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jobAPI } from '../Job-portal/services/api';

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
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4 }
    }
};

const Jobs = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                const response = await jobAPI.getAllJobs({ limit: 4 });
                setJobs(response.data.jobs);
            } catch (error) {
                console.error('Error fetching landing jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedJobs();
    }, []);

    const handleJobClick = (job) => {
        if (!user) {
            navigate('/login', { state: { from: `/jobs/${job._id}` } });
            return;
        }
        navigate(`/jobs/${job._id}`);
    };

    if (loading) {
        return (
            <section className="py-24 px-6 lg:px-8 bg-white dark:bg-[#0a0a0f]">
                <div className="max-w-7xl mx-auto flex justify-center">
                    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </section>
        );
    }

    if (jobs.length === 0) return null;

    return (
        <section className="py-24 px-6 lg:px-8 bg-white dark:bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-between items-end mb-12"
                >
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured <span className="text-teal-500">Jobs</span></h2>
                        <p className="text-gray-600 dark:text-gray-400">Explore top opportunities from leading tech companies.</p>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-6"
                >
                    {jobs.map((job, index) => (
                        <motion.div
                            key={job._id || index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            onClick={() => handleJobClick(job)}
                            className="group p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-teal-500/30 hover:bg-white dark:hover:bg-white/10 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                                        {job.company?.logo?.url ? (
                                            <img src={job.company.logo.url} alt="" className="w-full h-full object-contain p-1" />
                                        ) : (
                                            (job.company?.companyName || job.title).charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <div className="inline-flex px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-500/10 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">Featured Role</div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-teal-500 transition-colors leading-tight">{job.title}</h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1.5"><Building2 size={14} className="text-teal-500/70" /> {job.company?.companyName || 'Anonymous'}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-teal-500/70" /> {job.location || 'Remote'}</span>
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 text-xs font-medium"><Briefcase size={12} className="text-teal-500/70" /> {job.experienceLevel}</span>
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ x: 5 }}
                                    className="hidden sm:flex self-center p-2.5 rounded-full bg-white dark:bg-white/10 text-gray-400 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-teal-500/50"
                                >
                                    <ArrowRight size={20} />
                                </motion.button>
                            </div>

                            {/* Skills Tags */}
                            {job.tags && job.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {job.tags.slice(0, 4).map((tag, i) => (
                                        <span key={i} className="text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 font-medium group-hover:border-teal-500/20 transition-colors uppercase tracking-tight">
                                            {tag}
                                        </span>
                                    ))}
                                    {job.tags.length > 4 && (
                                        <span className="text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 font-medium">
                                            +{job.tags.length - 4} more
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                                        {job.jobType}
                                    </span>
                                    {job.salaryMin && (
                                        <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                            {job.salaryCurrency} {job.salaryMin.toLocaleString()}{job.salaryMax ? ` - ${job.salaryMax.toLocaleString()}` : '+'}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-teal-400 transition-colors font-medium">
                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Jobs;
