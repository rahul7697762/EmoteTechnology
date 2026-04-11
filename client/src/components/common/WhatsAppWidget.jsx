import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto show popup after 4 seconds
    const timer = setTimeout(() => {
      if (!hasOpened) {
        setIsOpen(true);
        setHasOpened(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [hasOpened]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error('Please enter your name and message.');
      return;
    }
    
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/whatsapp`, formData);
    } catch (err) {
      console.error('Error saving lead to backend:', err);
      // We proceed to WhatsApp regardless so the user flow is not interrupted
    } finally {
      setLoading(false);
      const text = encodeURIComponent(`Hello, I am ${formData.name}. ${formData.message}`);
      window.open(`https://wa.me/917061029937?text=${text}`, '_blank');
      setIsOpen(false);
      setFormData({ name: '', message: '' });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 mb-4 overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Hi there! 👋</h3>
                <p className="text-sm opacity-90">Need help? Chat with us</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] dark:bg-gray-700 dark:text-white text-sm transition-shadow"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] dark:bg-gray-700 dark:text-white text-sm transition-shadow resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              >
                {loading ? 'Starting Chat...' : (
                  <>
                    <Send size={18} />
                    Start Chat
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow"
        aria-label="Open WhatsApp Chat"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={32} />}
      </motion.button>
    </div>
  );
};

export default WhatsAppWidget;
