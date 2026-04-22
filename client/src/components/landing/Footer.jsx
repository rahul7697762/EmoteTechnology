import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, MapPin, Mail, Phone, ArrowUpRight, Twitter, Linkedin, Github, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const links = {
    Learn: [
        { label: 'All Courses', path: '/courses' },
        { label: 'AI Interview Prep', path: '/ai-interview' }
    ],
    Company: [
        { label: 'About Us', path: '/about' },
        { label: 'Blog', path: '/blog' }
    ],
    Support: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Use', path: '/terms' },
        { label: 'Contact', path: '/contact' }
    ],
};

const socials = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Youtube, href: '#', label: 'YouTube' },
];

const Footer = () => {
    return (
        <footer className="bg-[#1A1D2E] dark:bg-[#0F1120] border-t border-[#3B4FD8]/20 dark:border-[#6C7EF5]/15 transition-colors duration-300">

            {/* ── Main grid ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-3 md:grid-cols-12 gap-6 lg:gap-8">

                {/* Brand + contact */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="col-span-3 md:col-span-5 lg:col-span-3 mb-6 md:mb-0"
                >
                    {/* Logo */}
                    <div className="flex items-baseline gap-0.5 mb-4">
                        <span className="text-[1.5rem] font-semibold text-[#6C7EF5]" style={{ fontFamily: SERIF }}>Emote</span>
                        <span className="text-base font-light text-[#E8EAF2] tracking-[0.04em]">Technology</span>
                    </div>
                    <p className="text-[#8B90B8] text-sm leading-relaxed mb-6 max-w-xs">
                        AI-powered education platform bridging the gap between learners and industry — built for the institutions of tomorrow.
                    </p>

                    {/* Contact */}
                    <div className="space-y-3">
                        {[
                            { icon: MapPin, text: 'DSS-15, Trishala City Road, Behind Gopal Sweets, Zirakpur, Punjab 140603' },
                            { icon: Phone, text: '+91 8757363225' },
                            { icon: Mail, text: 'hr@emotetechnology.in' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-start gap-3 text-[#8B90B8] text-xs">
                                <Icon size={13} className="text-[#6C7EF5] shrink-0 mt-0.5" />
                                <span className="leading-relaxed pr-4">{text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Link columns */}
                {Object.entries(links).map(([category, items], ci) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.08 * (ci + 1) }}
                        className="col-span-1 md:col-span-2 lg:col-span-2 min-w-0"
                    >
                        <h4
                            className="text-[10px] tracking-[0.22em] uppercase text-[#6C7EF5] mb-6"
                            style={{ fontFamily: MONO }}
                        >
                            {category}
                        </h4>
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        to={item.path}
                                        className="text-[#8B90B8] text-sm hover:text-[#E8EAF2] transition-colors group flex items-center gap-1.5"
                                    >
                                        <span className="w-0 h-px bg-[#6C7EF5] group-hover:w-3 transition-all duration-200" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}

                {/* Newsletter Column */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="col-span-3 md:col-span-7 lg:col-span-3 mt-4 md:mt-8 lg:mt-0"
                >
                    <h4
                        className="text-[10px] tracking-[0.22em] uppercase text-[#6C7EF5] mb-6"
                        style={{ fontFamily: MONO }}
                    >
                        Stay in the loop
                    </h4>
                    <p className="text-xl sm:text-lg lg:text-xl font-semibold text-[#E8EAF2] mb-4" style={{ fontFamily: SERIF }}>
                        Get updates on new courses &amp; jobs.
                    </p>
                    <div className="flex flex-col gap-2">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 bg-[#252A41] text-[#E8EAF2] placeholder-[#8B90B8] border border-[#3B4FD8]/25 focus:outline-none focus:border-[#6C7EF5] text-sm transition-colors"
                        />
                        <button className="w-full px-4 py-3 bg-[#3B4FD8] text-white text-sm font-medium tracking-wide hover:bg-[#2A3CB8] transition-colors flex items-center justify-center gap-2">
                            Subscribe <ArrowUpRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* ── Bottom bar ── */}
            <div className="border-t border-[#3B4FD8]/15 dark:border-[#6C7EF5]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[#8B90B8] text-xs text-center sm:text-left" style={{ fontFamily: MONO }}>
                        © {new Date().getFullYear()} EmoteTechnology · All rights reserved.
                    </p>
                    <div className="flex items-center gap-3">
                        {socials.map(({ icon: Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-8 h-8 flex items-center justify-center border border-[#3B4FD8]/25 text-[#8B90B8] hover:border-[#6C7EF5] hover:text-[#6C7EF5] hover:bg-[#6C7EF5]/8 transition-all duration-200"
                            >
                                <Icon size={14} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
