import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, MessageSquare } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Contact form submitted", formData);
        alert("Thanks for contacting us! We will get back to you soon.");
        setFormData({ name: '', email: '', message: '' });
        onClose();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-[#0F1120]/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-6"
                    >
                        <div className="bg-[#1A1D2E] border border-[#3B4FD8]/20 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[#3B4FD8]/20">
                                <h3 className="text-xl font-semibold text-[#E8EAF2]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                                    Contact Us
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-[#8B90B8] hover:text-[#6C7EF5] transition-colors p-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <p className="text-[#8B90B8] text-sm mb-6">
                                    Have a question or need help? Fill out the form below and we'll get back to you as soon as possible.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-[#6C7EF5] mb-2" style={{ fontFamily: "'Space Mono', 'Courier New', monospace" }}>
                                            Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={16} className="text-[#8B90B8]" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-[#252A41] text-[#E8EAF2] placeholder-[#8B90B8] border border-[#3B4FD8]/25 rounded-lg focus:outline-none focus:border-[#6C7EF5] text-sm transition-colors"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-[#6C7EF5] mb-2" style={{ fontFamily: "'Space Mono', 'Courier New', monospace" }}>
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={16} className="text-[#8B90B8]" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-[#252A41] text-[#E8EAF2] placeholder-[#8B90B8] border border-[#3B4FD8]/25 rounded-lg focus:outline-none focus:border-[#6C7EF5] text-sm transition-colors"
                                                placeholder="mail@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-[#6C7EF5] mb-2" style={{ fontFamily: "'Space Mono', 'Courier New', monospace" }}>
                                            Message
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <MessageSquare size={16} className="text-[#8B90B8]" />
                                            </div>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows="4"
                                                className="w-full pl-10 pr-4 py-3 bg-[#252A41] text-[#E8EAF2] placeholder-[#8B90B8] border border-[#3B4FD8]/25 rounded-lg focus:outline-none focus:border-[#6C7EF5] text-sm transition-colors resize-none"
                                                placeholder="How can we help you?"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 mt-4 bg-[#F5A623] hover:bg-[#d9911a] text-white text-sm font-medium tracking-wide rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        Send Message <Send size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;
