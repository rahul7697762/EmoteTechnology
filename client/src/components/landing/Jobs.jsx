import { motion } from 'framer-motion';
import { Briefcase, MapPin, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const jobs = [
    {
        role: "Senior React Developer",
        company: "TechFlow Systems",
        location: "San Francisco, CA (Remote)",
        type: "Full-time",
        logo: "TS"
    },
    {
        role: "Product Designer",
        company: "Creative Pulse",
        location: "New York, NY",
        type: "Contract",
        logo: "CP"
    },
    {
        role: "Machine Learning Engineer",
        company: "DataMinds",
        location: "Austin, TX (Hybrid)",
        type: "Full-time",
        logo: "DM"
    },
    {
        role: "Frontend Engineer",
        company: "WebSolutions",
        location: "Remote",
        type: "Full-time",
        logo: "WS"
    }
];

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

    const handleJobClick = (job, index) => {
        // If not logged in, send user to login and preserve intended destination
        const jobRef = job._id || `landing-${encodeURIComponent(job.role)}-${index}`;
        if (!user) {
            navigate('/login', { state: { from: `/jobs?open=${jobRef}` } });
            return;
        }

        // For logged in users, take them to jobs page and instruct it to open the job
        navigate('/jobs', { state: { openJobId: job._id || jobRef } });
    };
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
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            onClick={() => handleJobClick(job, index)}
                            className="group p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-teal-500/30 hover:bg-white dark:hover:bg-white/10 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                                        {job.logo}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-teal-500 transition-colors">{job.role}</h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1"><Building2 size={14} /> {job.company}</span>
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ x: 5 }}
                                    className="self-center p-2 rounded-full bg-white dark:bg-white/10 text-gray-400 group-hover:bg-teal-500 group-hover:text-white transition-all"
                                >
                                    <ArrowRight size={20} />
                                </motion.button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 group-hover:bg-teal-50 dark:group-hover:bg-teal-500/20 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                    {job.type}
                                </span>
                                <span className="text-xs text-gray-500 group-hover:text-teal-400 transition-colors">Posted 2 days ago</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Jobs;
