// job-portal/components/JobListing.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Building2, Search, Filter,
  Clock, DollarSign, Users, Star, Zap, Globe, ChevronLeft, ChevronRight
} from 'lucide-react';
import { jobAPI } from '../services/api';
import JobCard from './JobCard';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const JobListing = ({ jobs: initialJobs = [], loading: initialLoading = false, onViewJob }) => {
  const [jobs, setJobs] = useState(initialJobs);
  const [loading, setLoading] = useState(initialLoading);
  const [filters, setFilters] = useState({
    search: '', location: '', jobType: '', experienceLevel: '', minSalary: '', remote: false,
  });
  const [pagination, setPagination] = useState({
    page: 1, limit: 12, total: 0, totalPages: 0,
  });
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (!initialJobs.length) fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, pagination.limit, sortBy]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit, sort: sortBy, ...filters };
      Object.keys(params).forEach(key => {
        if (!params[key] && params[key] !== false) delete params[key];
      });
      const response = await jobAPI.getAllJobs(params);
      setJobs(response.data.jobs);
      setPagination(prev => ({
        ...prev, total: response.data.total, totalPages: response.data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', location: '', jobType: '', experienceLevel: '', minSalary: '', remote: false });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'salary-high', label: 'Salary: High to Low' },
    { value: 'salary-low', label: 'Salary: Low to High' },
    { value: 'applicants-low', label: 'Fewest Applicants' },
    { value: 'applicants-high', label: 'Most Applicants' },
  ];

  const featuredJobs = jobs.filter(job => job.featured).slice(0, 2);

  // Common input styles for flat EdTech typography look
  const inputStyles = "appearance-none bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 focus:outline-none focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] text-sm transition-colors py-2.5 px-3 w-full placeholder-[#6B7194] dark:placeholder-[#8B90B8]";

  return (
    <section className="bg-[#F7F8FF] dark:bg-[#1A1D2E] pb-24">
      {/* ── Filters & Search ── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-12">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
            <h2 className="text-lg font-semibold" style={{ fontFamily: SERIF }}>Filter &amp; Sort</h2>
            <span className="text-[#6B7194] dark:text-[#8B90B8] text-xs">({pagination.total} jobs found)</span>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7194] dark:text-[#8B90B8]" />
              <input
                type="text"
                placeholder="Search titles, skills..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className={`${inputStyles} pl-10`}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`${inputStyles} w-44`}
            >
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="relative col-span-2 md:col-span-1">
             <input type="text" placeholder="Location" value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} className={`${inputStyles} pl-9`} />
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7194]" />
          </div>
          <div className="relative">
            <select value={filters.jobType} onChange={e => handleFilterChange('jobType', e.target.value)} className={`${inputStyles} pl-9`}>
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7194] pointer-events-none" />
          </div>
          <div className="relative">
            <select value={filters.experienceLevel} onChange={e => handleFilterChange('experienceLevel', e.target.value)} className={`${inputStyles} pl-9`}>
              <option value="">All Levels</option>
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
            </select>
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7194] pointer-events-none" />
          </div>
          <div className="relative">
            <input type="number" placeholder="Min Salary" value={filters.minSalary} onChange={e => handleFilterChange('minSalary', e.target.value)} className={`${inputStyles} pl-9`} />
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7194]" />
          </div>
          <label className={`flex items-center justify-center gap-2 cursor-pointer transition-colors ${inputStyles} hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5]`}>
            <input type="checkbox" checked={filters.remote} onChange={e => handleFilterChange('remote', e.target.checked)} className="w-3.5 h-3.5 accent-[#3B4FD8] dark:accent-[#6C7EF5]" />
            <Globe className="w-4 h-4 text-[#6B7194]" />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ fontFamily: MONO }}>Remote</span>
          </label>
        </div>
        
        {(filters.search || filters.location || filters.jobType || filters.experienceLevel || filters.minSalary || filters.remote) && (
            <div className="flex justify-end mt-4">
               <button onClick={handleClearFilters} className="text-[#E25C5C] text-xs font-semibold uppercase tracking-wider hover:underline" style={{ fontFamily: MONO }}>Clear All Filters</button>
            </div>
        )}
      </motion.div>

      {/* ── Featured Jobs ── */}
      {featuredJobs.length > 0 && (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-5 h-5 text-[#F5A623] fill-[#F5A623]" />
            <h2 className="text-2xl font-bold" style={{ fontFamily: SERIF }}>Featured Opportunities</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => <JobCard key={job._id} job={job} onViewJob={onViewJob} />)}
          </div>
        </motion.div>
      )}

      {/* ── Main Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 bg-[#F7F8FF] dark:bg-[#1A1D2E] animate-pulse">
              <div className="h-4 bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 mb-4 w-3/4" />
              <div className="h-4 bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 mb-6 w-1/2" />
              <div className="h-4 bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 w-2/3" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-white dark:bg-[#252A41]/30">
          <Briefcase className="w-10 h-10 text-[#6B7194] dark:text-[#8B90B8] mx-auto mb-4 opacity-50" />
          <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm mb-4">No jobs match your criteria.</p>
          <button onClick={handleClearFilters} className="px-5 py-2 bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity">
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {jobs.filter(job => !featuredJobs.some(f => f._id === job._id)).map((job) => <JobCard key={job._id} job={job} onViewJob={onViewJob} />)}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Pagination ── */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
          <span className="text-[#6B7194] dark:text-[#8B90B8] text-xs" style={{ fontFamily: MONO }}>
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="w-10 h-10 flex items-center justify-center border border-[#3B4FD8]/15 text-[#1A1D2E] dark:text-[#E8EAF2] hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="w-10 h-10 flex items-center justify-center border border-[#3B4FD8]/15 text-[#1A1D2E] dark:text-[#E8EAF2] hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Job Alert ── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-20 px-8 py-12 bg-[#3B4FD8] dark:bg-[#252A41] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-center">
        <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: SERIF }}>Don't miss out.</h3>
        <p className="text-[#EDEEFF] dark:text-[#8B90B8] text-sm mb-8">Sign up for job alerts perfectly tailored to you.</p>
        <div className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
          <input type="email" placeholder="Email Address" className="flex-1 px-4 py-3 bg-white text-[#1A1D2E] focus:outline-none placeholder-[#6B7194]" />
          <button className="px-6 py-3 bg-[#F5A623] text-white text-sm font-semibold uppercase tracking-wider hover:bg-[#d9911a] transition-colors" style={{ fontFamily: MONO }}>
            Subscribe
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default JobListing;