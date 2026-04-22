import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Mail, MessageSquare, Send, MapPin, Phone } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Contact = () => {
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
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] transition-colors duration-300">
            <Helmet>
                <title>Contact Us | Emote Technology – Get in Touch</title>
                <meta name="description" content="Contact Emote Technology for course enquiries, support, or partnership opportunities. Reach us at hr@emotetechnology.in or call +91 8757363225. Located in Zirakpur, Punjab, India." />
                <link rel="canonical" href="https://emotetechnology.in/contact" />
                <meta property="og:title" content="Contact Emote Technology" />
                <meta property="og:description" content="Reach out to Emote Technology for course enquiries, support, or partnerships." />
                <meta property="og:url" content="https://emotetechnology.in/contact" />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ContactPage",
                    "name": "Contact Emote Technology",
                    "url": "https://emotetechnology.in/contact",
                    "mainEntity": {
                        "@type": "Organization",
                        "name": "Emote Technology",
                        "telephone": "+91-8757363225",
                        "email": "hr@emotetechnology.in",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "DSS-15, Trishala City Road, Behind Gopal Sweets",
                            "addressLocality": "Zirakpur",
                            "addressRegion": "Punjab",
                            "postalCode": "140603",
                            "addressCountry": "IN"
                        }
                    }
                })}</script>
            </Helmet>
            <Navbar />

            <div className="border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14">
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
                            <div style={{ width: 28, height: 1, background: '#3B4FD8' }} />
                            <span className="text-[10px] tracking-[0.28em] uppercase text-[#3B4FD8] dark:text-[#6C7EF5]" style={{ fontFamily: MONO }}>
                                Contact Us
                            </span>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="leading-[0.93] max-w-3xl" style={{ fontFamily: SERIF, fontSize: 'clamp(2.6rem, 5vw, 4.2rem)' }}>
                            <span className="block font-semibold">Get in Touch</span>
                            <span className="block font-light italic text-[#3B4FD8] dark:text-[#6C7EF5]">We are here to help.</span>
                        </motion.h1>
                    </motion.div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
                <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
                    {/* Left Side: Contact Information */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                        className="space-y-10"
                    >
                        <motion.div variants={fadeUp}>
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 leading-snug" style={{ fontFamily: SERIF }}>
                                We'd love to hear from you.
                            </h2>
                            <p className="text-[#6B7194] dark:text-[#8B90B8]">
                                Whether you have a question about courses, pricing, or anything else, our team is ready to answer all your questions.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeUp} className="space-y-6 bg-white/40 dark:bg-[#252A41]/20 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3B4FD8]/10 dark:from-[#6C7EF5]/10 to-transparent blur-3xl rounded-full" />
                            
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 text-[#3B4FD8] dark:text-[#6C7EF5] text-xs tracking-widest uppercase mb-1" style={{ fontFamily: MONO }}>
                                    <MapPin size={16} /> Location
                                </div>
                                <p className="text-[#1A1D2E] dark:text-[#E8EAF2] leading-relaxed text-[15px]">
                                    DSS-15, Trishala City Road,<br/>
                                    Behind Gopal Sweets,<br/>
                                    Zirakpur, Punjab 140603
                                </p>
                            </div>

                            <div className="w-full h-px bg-gradient-to-r from-[#3B4FD8]/15 dark:from-[#6C7EF5]/15 to-transparent"></div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-3 text-[#3B4FD8] dark:text-[#6C7EF5] text-xs tracking-widest uppercase mb-1" style={{ fontFamily: MONO }}>
                                    <Phone size={16} /> Phone
                                </div>
                                <p className="text-[#1A1D2E] dark:text-[#E8EAF2] text-[15px]">
                                    +91 8757363225
                                </p>
                            </div>

                            <div className="w-full h-px bg-gradient-to-r from-[#3B4FD8]/15 dark:from-[#6C7EF5]/15 to-transparent"></div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-3 text-[#3B4FD8] dark:text-[#6C7EF5] text-xs tracking-widest uppercase mb-1" style={{ fontFamily: MONO }}>
                                    <Mail size={16} /> Email
                                </div>
                                <p className="text-[#1A1D2E] dark:text-[#E8EAF2] text-[15px]">
                                    hr@emotetechnology.in
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side: Contact Form */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="bg-white/60 dark:bg-[#252A41]/40 border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 rounded-2xl p-8 sm:p-12 shadow-sm"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-[#3B4FD8] dark:text-[#6C7EF5] mb-2" style={{ fontFamily: MONO }}>
                                    Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={18} className="text-[#8B90B8]" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] placeholder-[#8B90B8] border border-[#3B4FD8]/20 dark:border-[#3B4FD8]/25 rounded-xl focus:outline-none focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-colors"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-[#3B4FD8] dark:text-[#6C7EF5] mb-2" style={{ fontFamily: MONO }}>
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-[#8B90B8]" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] placeholder-[#8B90B8] border border-[#3B4FD8]/20 dark:border-[#3B4FD8]/25 rounded-xl focus:outline-none focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-colors"
                                        placeholder="mail@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-[#3B4FD8] dark:text-[#6C7EF5] mb-2" style={{ fontFamily: MONO }}>
                                    Message
                                </label>
                                <div className="relative">
                                    <div className="absolute top-4 left-4 pointer-events-none">
                                        <MessageSquare size={18} className="text-[#8B90B8]" />
                                    </div>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] placeholder-[#8B90B8] border border-[#3B4FD8]/20 dark:border-[#3B4FD8]/25 rounded-xl focus:outline-none focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-colors resize-none"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 mt-2 bg-[#F5A623] hover:bg-[#d9911a] text-white font-medium tracking-wide rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
