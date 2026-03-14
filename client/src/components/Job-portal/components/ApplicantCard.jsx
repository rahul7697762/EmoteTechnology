// job-portal/components/ApplicantCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, Download, Eye, CheckCircle,
  XCircle, Clock, MoreVertical, FileText, ExternalLink
} from 'lucide-react';
import { applicationAPI } from '../services/api';
import { showToast } from '../services/toast';

const ApplicantCard = ({ applicant, onStatusUpdate }) => {
  const [status, setStatus] = useState(applicant.status);
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(applicant.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await onStatusUpdate(applicant._id, newStatus);
      setStatus(newStatus);
      setShowActions(false);
      showToast.success(`Application ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      showToast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await applicationAPI.updateApplicationStatus(applicant._id, { notes });
      showToast.success('Notes saved successfully');
    } catch (error) {
      showToast.error('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending' },
      REVIEWED: { icon: Eye, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Reviewed' },
      SHORTLISTED: { icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Shortlisted' },
      REJECTED: { icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Rejected' },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const statusInfo = getStatusInfo(status);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
      >
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Applicant Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  {applicant.candidate?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {applicant.candidate?.name || 'Applicant'}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {applicant.candidate?.email}
                    </span>
                    {applicant.candidate?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {applicant.candidate.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>

                {showActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                    <button
                      onClick={() => handleStatusChange('REVIEWED')}
                      disabled={loading || status === 'REVIEWED'}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Mark as Reviewed
                    </button>
                    <button
                      onClick={() => handleStatusChange('SHORTLISTED')}
                      disabled={loading || status === 'SHORTLISTED'}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Shortlist Candidate
                    </button>
                    <button
                      onClick={() => handleStatusChange('REJECTED')}
                      disabled={loading || status === 'REJECTED'}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-4">
              {applicant.coverLetter && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Cover Letter
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                    {applicant.coverLetter}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Applied {formatDate(applicant.createdAt)}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  <statusInfo.icon className="w-3 h-3" />
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Resume Actions */}
          <div className="flex flex-col gap-3 md:w-48">
            <button
              onClick={() => setIsDetailsModalOpen(true)}
              className="w-full px-4 py-2 text-center bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>

            <a
              href={applicant.resume?.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-2 text-center border border-teal-500 text-teal-500 dark:text-teal-400 font-medium rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Resume
            </a>

            <button
              onClick={() => {
                if (applicant.resume?.fileUrl) {
                  window.open(applicant.resume.fileUrl, '_blank');
                } else {
                  showToast.error('Resume URL not found');
                }
              }}
              className="w-full px-4 py-2 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Notes Section (for employers) */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add private notes about this candidate..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm resize-none"
            rows="2"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSaveNotes}
              disabled={isSavingNotes || notes === applicant.notes}
              className="px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {isSavingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Details Modal */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Applicant Information</h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-4">Contact Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><User className="w-5 h-5" /></div>
                        <div>
                          <p className="text-xs text-gray-500">Full Name</p>
                          <p className="font-semibold">{applicant.candidate?.name || applicant.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><Mail className="w-5 h-5" /></div>
                        <div>
                          <p className="text-xs text-gray-500">Email Address</p>
                          <p className="font-semibold">{applicant.candidate?.email || applicant.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><Phone className="w-5 h-5" /></div>
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="font-semibold">{applicant.candidate?.phone || applicant.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  {(applicant.linkedin || applicant.portfolio) && (
                    <div>
                      <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-4">Professional Links</h3>
                      <div className="space-y-3">
                        {applicant.linkedin && (
                          <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition-colors">
                            <span className="font-medium">LinkedIn Profile</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {applicant.portfolio && (
                          <a href={applicant.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-xl text-teal-700 dark:text-teal-400 hover:bg-teal-100 transition-colors">
                            <span className="font-medium">Portfolio / Website</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cover Letter & Questionnaire */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-4">Cover Letter</h3>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {applicant.coverLetter || 'No cover letter provided.'}
                      </p>
                    </div>
                  </div>

                  {applicant.answers && applicant.answers.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-4">Questionnaire Responses</h3>
                      <div className="space-y-4">
                        {applicant.answers.map((ans, idx) => (
                          <div key={idx} className="bg-white dark:bg-gray-800 border-l-4 border-teal-500 p-4 rounded-r-xl shadow-sm">
                            <p className="text-xs font-bold text-gray-500 mb-1">{ans.question}</p>
                            <p className="text-sm font-medium">{ans.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ApplicantCard;