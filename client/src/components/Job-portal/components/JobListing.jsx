// job-portal/components/JobListing.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, MapPin, Building2, ArrowRight, Search, Filter,
  Clock, DollarSign, Users, Star, Zap, Globe, ChevronLeft, ChevronRight
} from 'lucide-react';
import { jobAPI } from '../services/api';
import JobCard from './JobCard';

const JobListing = ({ jobs: initialJobs = [], loading: initialLoading = false }) => {
  const [jobs, setJobs] = useState(initialJobs);
  const [loading, setLoading] = useState(initialLoading);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    minSalary: '',
    remote: false,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [sortBy, setSortBy] = useState('recent');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  useEffect(() => {
    if (!initialJobs.length) {
      fetchJobs();
    }
  }, [filters, pagination.page, pagination.limit, sortBy]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        ...filters,
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key] && params[key] !== false) {
          delete params[key];
        }
      });

      const response = await jobAPI.getAllJobs(params);
      setJobs(response.data.jobs);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        totalPages: response.data.totalPages,
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
    setFilters({
      search: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      minSalary: '',
      remote: false,
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Remote', label: 'Remote' },
  ];

  const experienceLevels = [
    { value: '', label: 'All Levels' },
    { value: 'Entry-level', label: 'Entry-level' },
    { value: 'Mid-level', label: 'Mid-level' },
    { value: 'Senior', label: 'Senior' },
    { value: 'Lead', label: 'Lead' },
    { value: 'Executive', label: 'Executive' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'salary-high', label: 'Salary: High to Low' },
    { value: 'salary-low', label: 'Salary: Low to High' },
    { value: 'applicants-low', label: 'Fewest Applicants' },
    { value: 'applicants-high', label: 'Most Applicants' },
  ];

  const featuredJobs = jobs.filter(job => job.featured).slice(0, 2);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Discover Your Next <span className="text-teal-500">Opportunity</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Browse through our curated list of tech jobs from innovative companies worldwide.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pagination.total.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Jobs Available
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title, company, skills, or keywords..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-lg"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
              Search
            </button>
          </div>
        </motion.div>

        {/* Filters & Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-teal-500" />
              <span className="font-medium text-gray-900 dark:text-white">Filters</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({jobs.length} jobs found)
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-3">
            {/* Job Type Filter */}
            <div className="relative">
              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                {jobTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-48"
              />
            </div>

            {/* Experience Filter */}
            <div className="relative">
              <select
                value={filters.experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                {experienceLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Salary Filter */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="Min Salary"
                value={filters.minSalary}
                onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-32"
              />
            </div>

            {/* Remote Filter */}
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={filters.remote}
                onChange={(e) => handleFilterChange('remote', e.target.checked)}
                className="w-4 h-4 text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Remote Only</span>
            </label>
          </div>
        </motion.div>

        {/* Featured Jobs Banner */}
        {featuredJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6" />
                  <div>
                    <h3 className="text-xl font-bold">Featured Jobs</h3>
                    <p className="text-amber-100">Top opportunities from leading companies</p>
                  </div>
                </div>
                <Zap className="w-6 h-6" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {featuredJobs.map((job, index) => (
                  <div
                    key={job._id}
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          {job.company?.logo ? (
                            <img 
                              src={job.company.logo} 
                              alt={job.company.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <Building2 className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold">{job.title}</h4>
                          <p className="text-sm text-amber-100">{job.company?.name}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-6 w-1/2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your filters or search terms. We couldn't find any jobs matching your criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <>
            {/* Jobs Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {jobs.map((job, index) => (
                <JobCard key={job._id || index} job={job} />
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} jobs
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
                          pagination.page === pageNum
                            ? 'bg-teal-500 text-white'
                            : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Job Alert Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Get Job Alerts
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Never miss an opportunity. Sign up to receive alerts when new jobs matching your preferences are posted.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JobListing;