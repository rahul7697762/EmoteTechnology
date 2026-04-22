import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';

const ContactSupport = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for contact submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0F1120] font-sans">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto mt-4">
          <Link 
            to="/help" 
            className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-[#8B90B8] hover:text-[#6C7EF5] dark:hover:text-[#6C7EF5] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help Center
          </Link>
          
          <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl shadow-sm border border-gray-100 dark:border-[#3B4FD8]/20 p-8 md:p-10 mb-8">
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-[#E8EAF2] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Message Sent!
                </h2>
                <p className="text-gray-600 dark:text-[#8B90B8] mb-8 max-w-md mx-auto">
                  Thank you for reaching out. Our support team has received your message and will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-6 py-3 bg-[#6C7EF5] hover:bg-[#5A6CE4] text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C7EF5] dark:focus:ring-offset-[#1A1D2E]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-[#E8EAF2] mb-3" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Contact Support
                </h1>
                <p className="text-gray-600 dark:text-[#8B90B8] mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-[#E8EAF2] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#3B4FD8]/30 bg-white dark:bg-[#252A41] text-gray-900 dark:text-[#E8EAF2] focus:ring-2 focus:ring-[#6C7EF5] focus:border-transparent transition-shadow outline-none placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-[#E8EAF2] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#3B4FD8]/30 bg-white dark:bg-[#252A41] text-gray-900 dark:text-[#E8EAF2] focus:ring-2 focus:ring-[#6C7EF5] focus:border-transparent transition-shadow outline-none placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-[#E8EAF2] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#3B4FD8]/30 bg-white dark:bg-[#252A41] text-gray-900 dark:text-[#E8EAF2] focus:ring-2 focus:ring-[#6C7EF5] focus:border-transparent transition-shadow outline-none placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-[#E8EAF2] mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#3B4FD8]/30 bg-white dark:bg-[#252A41] text-gray-900 dark:text-[#E8EAF2] focus:ring-2 focus:ring-[#6C7EF5] focus:border-transparent transition-shadow outline-none resize-none placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="Please explicitly describe your issue..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-6 py-4 bg-[#6C7EF5] hover:bg-[#5A6CE4] text-white rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C7EF5] dark:focus:ring-offset-[#1A1D2E]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactSupport;
