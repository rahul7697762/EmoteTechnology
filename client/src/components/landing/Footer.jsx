import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, MapPin, Mail, Phone, ArrowUpRight, Twitter, Linkedin, Github, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const links = {
    Learn: [
        { label: 'All Courses', path: '/courses' },
        { label: 'AI Interview Prep', path: '/ai-interview-prep' }
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

            {/* ── Top CTA strip ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="border-b border-[#3B4FD8]/20 dark:border-[#6C7EF5]/10"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] tracking-[0.28em] uppercase text-[#6C7EF5] mb-2" style={{ fontFamily: MONO }}>
                            Stay in the loop
                        </p>
                        <h3 className="text-xl sm:text-2xl font-semibold text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                            Get updates on new courses &amp; jobs.
                        </h3>
                    </div>
                    <div className="flex w-full md:w-auto md:min-w-[320px]">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-3 bg-[#252A41] text-[#E8EAF2] placeholder-[#8B90B8] border border-[#3B4FD8]/25 focus:outline-none focus:border-[#6C7EF5] text-sm transition-colors min-w-0"
                        />
                        <button className="px-4 sm:px-5 py-3 bg-[#F5A623] text-white text-sm font-medium tracking-wide hover:bg-[#d9911a] transition-colors whitespace-nowrap flex items-center gap-2 shrink-0">
                            Subscribe <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ── Main grid ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">

                {/* Brand + contact — full width on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="col-span-3 lg:col-span-2 mb-10 lg:mb-0 pb-10 lg:pb-0 border-b lg:border-b-0 border-[#3B4FD8]/15"
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
                                <span className="leading-relaxed">{text}</span>
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
