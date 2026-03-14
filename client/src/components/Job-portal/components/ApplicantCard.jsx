// job-portal/components/ApplicantCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, Download, Eye, CheckCircle,
  XCircle, Clock, MoreVertical, FileText, ExternalLink,
  Zap, Briefcase, MapPin, Layers, ShieldCheck, Globe, Terminal
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
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {applicant.candidate?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {applicant.candidate?.name || applicant.fullName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Applying for {applicant.job?.title || 'this position'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusInfo.color}`}>
                  <statusInfo.icon className="w-3.5 h-3.5" />
                  {statusInfo.label}
                </span>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Profile & Contact */}
                <div className="space-y-8">
                  <section>
                    <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <User size={14} /> Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 group">
                        <div className="p-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-xl group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                          <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Email</p>
                          <p className="text-sm font-medium">{applicant.candidate?.email || applicant.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 group">
                        <div className="p-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-xl group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">
                          <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Phone</p>
                          <p className="text-sm font-medium">{applicant.candidate?.phone || applicant.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Skills Section */}
                  {(applicant.resume?.parsedData?.skills?.length > 0 || applicant.candidate?.profile?.skills?.length > 0) && (
                    <section>
                      <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap size={14} /> Key Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(applicant.resume?.parsedData?.skills || applicant.candidate?.profile?.skills || []).map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Professional Links */}
                  {(applicant.linkedin || applicant.portfolio) && (
                    <section>
                      <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ExternalLink size={14} /> Professional Links
                      </h3>
                      <div className="space-y-3">
                        {applicant.linkedin && (
                          <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition-all group">
                            <span className="text-sm font-bold">LinkedIn Profile</span>
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                        {applicant.portfolio && (
                          <a href={applicant.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-xl text-teal-700 dark:text-teal-400 hover:bg-teal-100 transition-all group">
                            <span className="text-sm font-bold">Portfolio / Website</span>
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                      </div>
                    </section>
                  )}
                </div>

                {/* Right 2 Columns: Experience, Education, Answers */}
                <div className="lg:col-span-2 space-y-10">
                  {/* Cover Letter - Candidate's personal pitch */}
                  {applicant.coverLetter && (
                    <section>
                      <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <User size={14} /> Cover Letter
                      </h3>
                      <div className="bg-teal-50/30 dark:bg-teal-900/10 p-6 rounded-2xl border border-teal-100/50 dark:border-teal-900/30">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap italic">
                          "{applicant.coverLetter}"
                        </p>
                      </div>
                    </section>
                  )}

                  {/* Questionnaire Responses - Most important for companies */}
                  {applicant.answers && applicant.answers.length > 0 && (
                    <section>
                      <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FileText size={14} /> Candidate Questionnaire
                      </h3>
                      <div className="space-y-6">
                        {applicant.answers.map((ans, idx) => (
                          <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-teal-500 before:to-cyan-500 before:rounded-full">
                            <p className="text-sm font-bold text-gray-900 dark:text-white mb-2 leading-relaxed">
                              {ans.question}
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {ans.answer || 'No answer provided.'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Work Experience */}
                  {(applicant.candidate?.profile?.experience?.length > 0 || applicant.resume?.parsedData?.experience?.length > 0) && (
                    <section>
                      <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Briefcase size={14} /> Work Experience
                      </h3>
                      <div className="space-y-8">
                        {(applicant.candidate?.profile?.experience || applicant.resume?.parsedData?.experience || []).map((exp, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="mt-1.5 w-2 h-2 rounded-full bg-teal-500 shrink-0 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                            <div className="space-y-2">
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{exp.title}</h4>
                                <p className="text-teal-600 dark:text-teal-400 text-sm font-bold">{exp.company}</p>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                <Calendar size={12} />
                                <span>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                                {exp.location && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                    <MapPin size={12} />
                                    <span>{exp.location}</span>
                                  </>
                                )}
                              </div>
                              {exp.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Education */}
                  {(applicant.candidate?.profile?.education?.length > 0 || applicant.resume?.parsedData?.education?.length > 0) && (
                    <section>
                      <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Layers size={14} /> Education
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {(applicant.candidate?.profile?.education || applicant.resume?.parsedData?.education || []).map((edu, i) => (
                          <div key={i} className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-700/50 hover:border-teal-500/30 transition-colors group">
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors leading-tight mb-1">{edu.degree}</h4>
                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3">{edu.school}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                              <Calendar size={12} />
                              <span>{formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Metadata Section (Technical details) */}
                  {applicant.metadata && (
                    <section className="pt-6 border-t border-gray-100 dark:border-gray-700/50">
                      <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldCheck size={14} /> Application Metadata
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1 flex items-center gap-1">
                            <Globe size={10} /> IP Address
                          </p>
                          <p className="text-xs font-mono text-gray-700 dark:text-gray-300">{applicant.metadata.ipAddress || 'Not recorded'}</p>
                        </div>
                        <div className="p-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1 flex items-center gap-1">
                            <Terminal size={10} /> Submission Source
                          </p>
                          <p className="text-xs font-mono text-gray-700 dark:text-gray-300 uppercase">{applicant.metadata.source || 'Web'}</p>
                        </div>
                        {applicant.metadata.userAgent && (
                          <div className="sm:col-span-2 p-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">User Agent</p>
                            <p className="text-[10px] font-mono text-gray-600 dark:text-gray-400 break-all leading-relaxed">
                              {applicant.metadata.userAgent}
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {applicant.resume?.fileUrl && (
                  <a
                    href={applicant.resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
                  >
                    <FileText size={16} />
                    Full Resume
                  </a>
                )}
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
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