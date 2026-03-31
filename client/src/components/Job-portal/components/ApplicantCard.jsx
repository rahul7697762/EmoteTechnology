// job-portal/components/ApplicantCard.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, Download, Eye, CheckCircle,
  XCircle, Clock, MoreVertical, FileText, ExternalLink,
  MessageSquare
} from 'lucide-react';
import { applicationAPI } from '../services/api';
import { showToast } from '../services/toast';
import ChatModal from '../../chat/ChatModal';

const SERIF = "'Space Mono', monospace";
const MONO = "'Space Mono', monospace";

const ApplicantCard = ({ applicant, onStatusUpdate }) => {
  const [status, setStatus] = useState(applicant.status);
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(applicant.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await onStatusUpdate(applicant._id, newStatus);
      setStatus(newStatus);
      setShowActions(false);
      showToast.success(`Application ${newStatus.toLowerCase()} successfully`, {
        style: {
          borderRadius: '0',
          border: '1px solid #3B4FD8',
          background: '#F7F8FF',
          color: '#1A1D2E',
          fontFamily: MONO
        }
      });
    } catch (error) {
      showToast.error('Failed to update status', {
        style: {
          borderRadius: '0',
          border: '1px solid #D83B3B',
          background: '#FFF7F7',
          color: '#1A1D2E',
          fontFamily: MONO
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await applicationAPI.updateApplicationStatus(applicant._id, { notes });
      showToast.success('Notes saved successfully', {
        style: {
          borderRadius: '0',
          border: '1px solid #3B4FD8',
          background: '#F7F8FF',
          color: '#1A1D2E',
          fontFamily: MONO
        }
      });
    } catch (error) {
      showToast.error('Failed to save notes', {
         style: {
          borderRadius: '0',
          border: '1px solid #D83B3B',
          background: '#FFF7F7',
          color: '#1A1D2E',
          fontFamily: MONO
        }
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { icon: Clock, color: 'bg-yellow-200 text-yellow-900 border-yellow-900', label: 'PENDING' },
      REVIEWED: { icon: Eye, color: 'bg-[#3B4FD8] text-white border-[#3B4FD8]', label: 'REVIEWED' },
      SHORTLISTED: { icon: CheckCircle, color: 'bg-green-400 text-green-900 border-green-900', label: 'SHORTLISTED' },
      REJECTED: { icon: XCircle, color: 'bg-red-500 text-white border-red-900 font-bold', label: 'REJECTED' },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();
  };

  const statusInfo = getStatusInfo(status);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#F7F8FF] rounded-none p-6 border-[3px] border-[#1A1D2E] shadow-[4px_4px_0px_#3B4FD8] hover:shadow-[6px_6px_0px_#3B4FD8] hover:-translate-y-1 hover:-translate-x-1 transition-all relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Applicant Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-none border-[2px] border-[#1A1D2E] bg-[#3B4FD8] flex items-center justify-center text-[#F7F8FF] font-bold text-lg" style={{ fontFamily: MONO }}>
                  {applicant.candidate?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1A1D2E] tracking-tight uppercase" style={{ fontFamily: SERIF }}>
                    {applicant.candidate?.name || 'APPLICANT'}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-[#1A1D2E] font-medium" style={{ fontFamily: MONO }}>
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
                  className="p-2 border-[2px] border-[#1A1D2E] hover:bg-[#3B4FD8] hover:text-white transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {showActions && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-[#F7F8FF] border-[2px] border-[#1A1D2E] shadow-[4px_4px_0px_#1A1D2E] z-10"
                    >
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleStatusChange('REVIEWED')}
                          disabled={loading || status === 'REVIEWED'}
                          className="w-full px-4 py-3 text-left text-sm font-bold text-[#1A1D2E] hover:bg-[#3B4FD8] hover:text-white disabled:opacity-50 flex items-center gap-2 border-b-[2px] border-[#1A1D2E]"
                          style={{ fontFamily: MONO }}
                        >
                          <Eye className="w-4 h-4" />
                          REVIEWED
                        </button>
                        <button
                          onClick={() => handleStatusChange('SHORTLISTED')}
                          disabled={loading || status === 'SHORTLISTED'}
                          className="w-full px-4 py-3 text-left text-sm font-bold text-[#1A1D2E] hover:bg-[#3B4FD8] hover:text-white disabled:opacity-50 flex items-center gap-2 border-b-[2px] border-[#1A1D2E]"
                          style={{ fontFamily: MONO }}
                        >
                          <CheckCircle className="w-4 h-4" />
                          SHORTLIST
                        </button>
                        <button
                          onClick={() => handleStatusChange('REJECTED')}
                          disabled={loading || status === 'REJECTED'}
                          className="w-full px-4 py-3 text-left text-sm font-bold text-[#1A1D2E] hover:bg-[#D83B3B] hover:text-white disabled:opacity-50 flex items-center gap-2"
                          style={{ fontFamily: MONO }}
                        >
                          <XCircle className="w-4 h-4" />
                          REJECT
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-4">
              {applicant.coverLetter && (
                <div className="bg-[#1A1D2E] text-[#F7F8FF] p-4 border-[2px] border-black shadow-[2px_2px_0px_#3B4FD8]">
                  <h4 className="font-bold text-sm mb-2 uppercase tracking-wider text-[#00E5FF]" style={{ fontFamily: MONO }}>
                    [ COVER_LETTER ]
                  </h4>
                  <p className="text-sm line-clamp-3 leading-relaxed" style={{ fontFamily: MONO }}>
                    {applicant.coverLetter}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm font-bold text-[#1A1D2E]" style={{ fontFamily: MONO }}>
                <span className="flex items-center gap-1 bg-white border-[2px] border-[#1A1D2E] px-3 py-1 shadow-[2px_2px_0px_#1A1D2E]">
                  <Calendar className="w-4 h-4" />
                  APPLIED: {formatDate(applicant.createdAt)}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 border-[2px] text-xs font-black tracking-widest shadow-[2px_2px_0px_#1A1D2E] ${statusInfo.color}`}>
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
              className="w-full px-4 py-3 text-center bg-[#3B4FD8] text-white font-bold uppercase tracking-wider hover:bg-[#1A1D2E] transition-colors flex items-center justify-center gap-2 border-[2px] border-[#1A1D2E] shadow-[2px_2px_0px_#1A1D2E]"
              style={{ fontFamily: MONO }}
            >
              <Eye className="w-4 h-4" />
              DETAILS
            </button>

            <a
              href={applicant.resume?.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 text-center bg-white text-[#1A1D2E] font-bold uppercase tracking-wider hover:bg-[#00E5FF] transition-colors flex items-center justify-center gap-2 border-[2px] border-[#1A1D2E] shadow-[2px_2px_0px_#1A1D2E]"
              style={{ fontFamily: MONO }}
            >
              <FileText className="w-4 h-4" />
              RESUME
            </a>

            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full px-4 py-3 text-center bg-[#1A1D2E] text-[#00E5FF] font-bold uppercase tracking-wider hover:bg-[#3B4FD8] hover:text-white transition-colors flex items-center justify-center gap-2 border-[2px] border-[#1A1D2E] shadow-[2px_2px_0px_#1A1D2E]"
              style={{ fontFamily: MONO }}
            >
              <MessageSquare className="w-4 h-4" />
              CHAT_CMD
            </button>

            <button
              onClick={() => {
                if (applicant.resume?.fileUrl) {
                  window.open(applicant.resume.fileUrl, '_blank');
                } else {
                  showToast.error('Resume URL not found');
                }
              }}
              className="w-full px-4 py-3 text-center bg-gray-200 text-[#1A1D2E] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 border-[2px] border-[#1A1D2E] shadow-[2px_2px_0px_#1A1D2E]"
              style={{ fontFamily: MONO }}
            >
              <Download className="w-4 h-4" />
              DOWNLOAD
            </button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-6 pt-6 border-t-[3px] border-[#1A1D2E]">
          <h4 className="font-bold text-sm mb-2 uppercase tracking-wider" style={{ fontFamily: MONO }}>
            [ INTERNAL_NOTES ]
          </h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ADD PRIVATE NOTES (BRUTALIST FONT)..."
            className="w-full px-4 py-3 bg-white border-[2px] border-[#1A1D2E] text-[#1A1D2E] focus:outline-none focus:ring-0 focus:border-[#3B4FD8] transition-all text-sm resize-none shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]"
            rows="3"
            style={{ fontFamily: MONO }}
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSaveNotes}
              disabled={isSavingNotes || notes === applicant.notes}
              className="px-6 py-2 bg-[#1A1D2E] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#3B4FD8] transition-colors disabled:opacity-50 border-[2px] border-[#1A1D2E] shadow-[2px_2px_0px_#1A1D2E]"
              style={{ fontFamily: MONO }}
            >
              {isSavingNotes ? 'SAVING' : 'SAVE_CMD'}
            </button>
          </div>
        </div>
        
        {/* Brutalist Deco */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-[#3B4FD8] border-b-[3px] border-l-[3px] border-[#1A1D2E] flex items-center justify-center">
          <div className="w-2 h-2 bg-[#00E5FF] rounded-none"></div>
        </div>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1D2E]/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: 50, rotateX: -20 }}
              className="bg-[#F7F8FF] rounded-none w-full max-w-4xl max-h-[90vh] overflow-hidden border-[4px] border-[#1A1D2E] shadow-[12px_12px_0px_#3B4FD8] flex flex-col"
            >
              <div className="p-6 border-b-[4px] border-[#1A1D2E] bg-[#3B4FD8] flex items-center justify-between text-white flex-shrink-0">
                <h2 className="text-2xl font-black uppercase tracking-widest" style={{ fontFamily: SERIF }}>// CANDIDATE_DATA</h2>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-1 hover:bg-[#1A1D2E] transition-colors border-[2px] border-transparent hover:border-white"
                >
                  <XCircle className="w-8 h-8" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1 relative bg-grid-pattern">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <div className="bg-white border-[3px] border-[#1A1D2E] p-6 shadow-[4px_4px_0px_#1A1D2E]">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-4 bg-[#1A1D2E] text-white inline-block px-2 py-1" style={{ fontFamily: MONO }}>sys.contact</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b-[2px] border-gray-200 pb-3">
                          <div className="p-2 bg-[#F7F8FF] border-[2px] border-[#1A1D2E]"><User className="w-5 h-5 text-[#3B4FD8]" /></div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase" style={{ fontFamily: MONO }}>NAME_REF</p>
                            <p className="font-black text-lg" style={{ fontFamily: SERIF }}>{applicant.candidate?.name || applicant.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 border-b-[2px] border-gray-200 pb-3">
                          <div className="p-2 bg-[#F7F8FF] border-[2px] border-[#1A1D2E]"><Mail className="w-5 h-5 text-[#3B4FD8]" /></div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase" style={{ fontFamily: MONO }}>EMAIL_ADDR</p>
                            <p className="font-bold text-md" style={{ fontFamily: MONO }}>{applicant.candidate?.email || applicant.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pb-2">
                          <div className="p-2 bg-[#F7F8FF] border-[2px] border-[#1A1D2E]"><Phone className="w-5 h-5 text-[#3B4FD8]" /></div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase" style={{ fontFamily: MONO }}>TEL_NO</p>
                            <p className="font-bold text-md" style={{ fontFamily: MONO }}>{applicant.candidate?.phone || applicant.phone || 'NULL'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    {(applicant.linkedin || applicant.portfolio) && (
                      <div className="bg-[#1A1D2E] text-white border-[3px] border-[#3B4FD8] p-6 shadow-[4px_4px_0px_#3B4FD8]">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-[#00E5FF]" style={{ fontFamily: MONO }}>sys.links</h3>
                        <div className="space-y-3">
                          {applicant.linkedin && (
                            <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white text-[#1A1D2E] border-[2px] border-black hover:bg-[#00E5FF] hover:border-[#1A1D2E] hover:text-black transition-all font-bold group" style={{ fontFamily: MONO }}>
                              <span>LINKEDIN</span>
                              <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                          )}
                          {applicant.portfolio && (
                            <a href={applicant.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white text-[#1A1D2E] border-[2px] border-black hover:bg-[#00E5FF] hover:border-[#1A1D2E] hover:text-black transition-all font-bold group" style={{ fontFamily: MONO }}>
                              <span>PORTFOLIO</span>
                              <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter & Questionnaire */}
                  <div className="space-y-6">
                    <div className="bg-[#F7F8FF] border-[3px] border-[#3B4FD8] p-6 shadow-[4px_4px_0px_#1A1D2E]">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-4 bg-[#3B4FD8] text-white inline-block px-2 py-1" style={{ fontFamily: MONO }}>blob.cover_letter</h3>
                      <div className="bg-white p-4 border-[2px] border-[#1A1D2E] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-[#1A1D2E]" style={{ fontFamily: MONO }}>
                          {applicant.coverLetter || 'NULL_DATA'}
                        </p>
                      </div>
                    </div>

                    {applicant.answers && applicant.answers.length > 0 && (
                      <div className="bg-white border-[3px] border-[#1A1D2E] p-6 shadow-[4px_4px_0px_#3B4FD8]">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4 bg-[#1A1D2E] text-[#00E5FF] inline-block px-2 py-1" style={{ fontFamily: MONO }}>array.questionnaire</h3>
                        <div className="space-y-4">
                          {applicant.answers.map((ans, idx) => (
                            <div key={idx} className="bg-[#F7F8FF] border-l-[6px] border-[#3B4FD8] border-t-[2px] border-b-[2px] border-r-[2px] border-[#1A1D2E] p-4">
                              <p className="text-xs font-black text-[#1A1D2E] mb-2 uppercase" style={{ fontFamily: MONO }}>Q: {ans.question}</p>
                              <p className="text-sm font-medium text-[#1A1D2E]" style={{ fontFamily: SERIF }}>A: {ans.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t-[4px] border-[#1A1D2E] bg-white flex justify-end flex-shrink-0">
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-8 py-3 bg-[#1A1D2E] text-white border-[2px] border-[#1A1D2E] shadow-[4px_4px_0px_#3B4FD8] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all font-black uppercase tracking-widest"
                  style={{ fontFamily: MONO }}
                >
                  TERMSIG // CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        jobId={applicant.job}
        applicantId={applicant.candidate?._id || applicant.candidate}
        jobTitle={applicant.job?.title || 'JOB_REF'}
        otherPartyName={applicant.candidate?.name || applicant.fullName}
      />
    </>
  );
};

export default ApplicantCard;