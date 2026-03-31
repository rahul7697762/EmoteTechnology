// client/src/components/chat/ChatModal.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Building2, MessageSquare, Loader2 } from 'lucide-react';
import { messageAPI } from '../Job-portal/services/api';
import { useSelector } from 'react-redux';
import { showToast } from '../Job-portal/services/toast';

const MONO = "'Space Mono', 'IBM Plex Mono', monospace";

const ChatModal = ({ isOpen, onClose, jobId, applicantId, jobTitle, otherPartyName }) => {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen && jobId && applicantId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [isOpen, jobId, applicantId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getMessages(jobId, applicantId);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await messageAPI.sendMessage({
        jobId,
        applicantId,
        content: newMessage.trim()
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      showToast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1D2E]/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#F7F8FF] border-[4px] border-[#1A1D2E] w-full max-w-2xl h-[80vh] flex flex-col shadow-[12px_12px_0px_#3B4FD8]"
          style={{ fontFamily: MONO }}
        >
          {/* Header */}
          <div className="p-4 bg-[#1A1D2E] text-white border-b-[4px] border-[#1A1D2E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#3B4FD8] border-[2px] border-white">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-widest text-sm">
                  CHAT_WITH: {otherPartyName || 'USER'}
                </h3>
                <p className="text-[10px] text-[#00E5FF] font-bold uppercase opacity-80">
                  REF: {jobTitle || 'JOB_POSTING'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#3B4FD8] transition-colors border-[2px] border-transparent hover:border-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-grid-pattern"
            style={{ 
              backgroundImage: 'linear-gradient(#1A1D2E 1px, transparent 1px), linear-gradient(90deg, #1A1D2E 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              backgroundAlpha: 0.03
            }}
          >
            {loading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-[#1A1D2E]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest">ESTABLISHING_SECURE_CONNECTION...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#1A1D2E] opacity-50">
                <MessageSquare className="w-12 h-12 mb-4" />
                <span className="text-xs font-black uppercase tracking-widest">NO_MESSAGES_YET // START_CONVERSATION</span>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMine = msg.sender === user._id;
                return (
                  <div 
                    key={msg._id || idx}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div 
                        className={`p-4 border-[3px] border-[#1A1D2E] ${
                          isMine 
                            ? 'bg-[#3B4FD8] text-white shadow-[4px_4px_0px_#1A1D2E]' 
                            : 'bg-white text-[#1A1D2E] shadow-[4px_4px_0px_#3B4FD8]'
                        }`}
                      >
                        <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-tighter mt-1 opacity-60">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                        {isMine ? ' // SENT' : ' // RECEIVED'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t-[4px] border-[#1A1D2E] flex gap-3"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="ENTER_MESSAGE_HERE..."
              className="flex-1 px-4 py-3 bg-[#F7F8FF] border-[3px] border-[#1A1D2E] text-[#1A1D2E] font-bold text-sm focus:outline-none focus:border-[#3B4FD8] transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-3 bg-[#1A1D2E] text-[#00E5FF] border-[3px] border-[#1A1D2E] hover:bg-[#3B4FD8] hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 shadow-[4px_4px_0px_#3B4FD8] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span className="font-black uppercase tracking-widest text-xs">SEND</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChatModal;
