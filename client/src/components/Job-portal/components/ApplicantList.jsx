// job-portal/components/ApplicantList.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Filter, Search, Download, Mail, Phone, Calendar,
  ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Eye,
  FileText, ExternalLink, MessageSquare, Star, MoreVertical
} from 'lucide-react';
import ApplicantCard from './ApplicantCard';

const ApplicantList = ({ applicants, loading, filters, onFilterChange, onStatusUpdate, onExport }) => {
  const [expandedApplicant, setExpandedApplicant] = useState(null);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [sortBy, setSortBy] = useState('newest');

  const handleSelectAll = () => {
    if (selectedApplicants.length === applicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(applicants.map(app => app._id));
    }
  };

  const handleSelectApplicant = (applicantId) => {
    setSelectedApplicants(prev =>
      prev.includes(applicantId)
        ? prev.filter(id => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedApplicants.length === 0) return;
    
    switch (action) {
      case 'shortlist':
        selectedApplicants.forEach(id => onStatusUpdate(id, 'SHORTLISTED'));
        break;
      case 'reject':
        selectedApplicants.forEach(id => onStatusUpdate(id, 'REJECTED'));
        break;
      case 'export':
        onExport(selectedApplicants);
        break;
    }
    setSelectedApplicants([]);
  };

  const getStatusStats = () => {
    const stats = {
      PENDING: 0,
      REVIEWED: 0,
      SHORTLISTED: 0,
      REJECTED: 0,
    };
    
    applicants.forEach(app => {
      stats[app.status]++;
    });
    
    return stats;
  };

  const statusStats = getStatusStats();

  const sortedApplicants = [...applicants].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'name') {
      return (a.candidate?.name || '').localeCompare(b.candidate?.name || '');
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              </div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Users className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No applicants yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          Applicants will appear here when they apply to your job posting.
          Share your job to attract more candidates.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="px-4 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors">
            Share Job
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            View Analytics
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {applicants.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center border border-yellow-200 dark:border-yellow-800">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {statusStats.PENDING}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {statusStats.REVIEWED}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Reviewed</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {statusStats.SHORTLISTED}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Shortlisted</div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedApplicants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-teal-500 to-cyan-500 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">
                  {selectedApplicants.length} applicant{selectedApplicants.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-teal-100">
                  Perform bulk actions on selected applicants
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('shortlist')}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors border border-white/30 text-sm"
              >
                Shortlist All
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors border border-white/30 text-sm"
              >
                Reject All
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1.5 bg-white text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors text-sm"
              >
                Export Selected
              </button>
              <button
                onClick={() => setSelectedApplicants([])}
                className="px-3 py-1.5 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all w-full sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-teal-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 ${viewMode === 'table' ? 'bg-teal-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={() => onExport(applicants.map(app => app._id))}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Select All */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={selectedApplicants.length === applicants.length && applicants.length > 0}
          onChange={handleSelectAll}
          className="w-4 h-4 text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          Select all {applicants.length} applicants
        </label>
      </div>

      {/* Applicants List */}
      <AnimatePresence>
        <motion.div
          layout
          className={`grid ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-4`}
        >
          {sortedApplicants.map((applicant) => (
            <motion.div
              key={applicant._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ApplicantCard
                applicant={applicant}
                selected={selectedApplicants.includes(applicant._id)}
                onSelect={() => handleSelectApplicant(applicant._id)}
                onStatusUpdate={onStatusUpdate}
                expanded={expandedApplicant === applicant._id}
                onExpand={() => setExpandedApplicant(
                  expandedApplicant === applicant._id ? null : applicant._id
                )}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination (if needed) */}
      {applicants.length > 10 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing 1-10 of {applicants.length} applicants
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components
const Grid = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const List = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default ApplicantList;