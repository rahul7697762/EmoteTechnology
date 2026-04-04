// client/src/components/chat/ChatModal.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Building2, MessageSquare, Loader2 } from 'lucide-react';
import { messageAPI } from '../Job-portal/services/api';
import { useSelector } from 'react-redux';
import { showToast } from '../Job-portal/services/toast';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1D2E]/60 dark:bg-[#0A0B10]/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl rounded-sm overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-between bg-[#F7F8FF] dark:bg-[#1A1D2E]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#3B4FD8] dark:text-[#6C7EF5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                  {otherPartyName || 'Chat'}
                </h3>
                <p className="text-xs text-[#6B7194] dark:text-[#8B90B8]">
                  {jobTitle || 'Job Application'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#6B7194] hover:text-[#1A1D2E] dark:text-[#8B90B8] dark:hover:text-[#E8EAF2] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[#F7F8FF] dark:bg-[#0A0B10]"
          >
            {loading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-[#6B7194] dark:text-[#8B90B8]">
                <Loader2 className="w-8 h-8 animate-spin text-[#3B4FD8] dark:text-[#6C7EF5]" />
                <span className="text-xs font-medium" style={{ fontFamily: MONO }}>Connecting...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#6B7194] dark:text-[#8B90B8] opacity-70">
                <MessageSquare className="w-12 h-12 mb-4 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50" />
                <span className="text-sm font-medium">No messages yet.</span>
                <span className="text-xs mt-1" style={{ fontFamily: MONO }}>Start the conversation</span>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMine = msg.sender === user._id;
                return (
                  <div 
                    key={msg._id || idx}
                    className={`flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex items-end gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                       <div className={`w-8 h-8 flex items-center justify-center shrink-0 border 
                         ${isMine ? 'bg-[#1A1D2E] dark:bg-[#E8EAF2] border-transparent' : 'bg-[#3B4FD8] border-[#3B4FD8]/20'}
                       `}>
                         {isMine ? (
                           <span className="text-[10px] font-bold text-white dark:text-[#1A1D2E]" style={{ fontFamily: MONO }}>ME</span>
                         ) : (
                           <MessageSquare size={14} className="text-white" />
                         )}
                       </div>
                       <div className={`px-5 py-4 shadow-sm max-w-[85%] border 
                         ${isMine 
                            ? 'bg-[#3B4FD8] text-white border-[#3B4FD8]' 
                            : 'bg-white dark:bg-[#252A41] text-[#1A1D2E] dark:text-[#E8EAF2] border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10'}
                       `}>
                         <p className="leading-relaxed text-sm">{msg.content}</p>
                       </div>
                    </div>
                    <span className="text-[10px] text-[#6B7194] dark:text-[#8B90B8] mt-1 px-11" style={{ fontFamily: MONO }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-white dark:bg-[#1A1D2E] flex gap-3"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#1A1D2E] dark:text-[#E8EAF2] text-sm focus:outline-none focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] placeholder:text-[#6B7194]/50 dark:placeholder:text-[#8B90B8]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-3 bg-[#3B4FD8] text-white hover:bg-[#2a3eb1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChatModal;
