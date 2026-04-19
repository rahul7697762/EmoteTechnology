import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, MapPin, Mail, Phone, ArrowUpRight, Twitter, Linkedin, Github, Youtube } from 'lucide-react';
import ContactModal from './ContactModal';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const links = {
    Learn: [
        { label: 'All Courses', href: '/courses' },
        { label: 'AI Interview Prep', href: '/ai-interview' }
    ],
    Company: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Use', href: '#' }
    ],
    Support: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact', href: '#' }
    ],
};

const socials = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Youtube, href: '#', label: 'YouTube' },
];

const Footer = () => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] tracking-[0.28em] uppercase text-[#6C7EF5] mb-2" style={{ fontFamily: MONO }}>
                            Stay in the loop
                        </p>
                        <h3 className="text-2xl font-semibold text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                            Get updates on new courses &amp; jobs.
                        </h3>
                    </div>
                    <div className="flex w-full md:w-auto gap-0 min-w-[320px]">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-3 bg-[#252A41] text-[#E8EAF2] placeholder-[#8B90B8] border border-[#3B4FD8]/25 focus:outline-none focus:border-[#6C7EF5] text-sm transition-colors"
                        />
                        <button className="px-5 py-3 bg-[#F5A623] text-white text-sm font-medium tracking-wide hover:bg-[#d9911a] transition-colors whitespace-nowrap flex items-center gap-2">
                            Subscribe <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ── Main grid ── */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">

                {/* Brand column */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Logo */}
                    <div className="flex items-baseline gap-0.5 mb-6">
                        <span className="text-[1.5rem] font-semibold text-[#6C7EF5]" style={{ fontFamily: SERIF }}>Emote</span>
                        <span className="text-base font-light text-[#E8EAF2] tracking-[0.04em]">Technology</span>
                    </div>
                    <p className="text-[#8B90B8] text-sm leading-relaxed mb-8 max-w-xs">
                        AI-powered education platform bridging the gap between learners and industry — built for the institutions of tomorrow.
                    </p>

                    {/* Contact */}
                    <div className="space-y-3">
                        {[
                            { icon: MapPin, text: 'Tech Valley, CA 94043, US' },
                            { icon: Mail, text: 'contact@emotetechnology.com' },
                            { icon: Phone, text: '+1 (555) 123-4567' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3 text-[#8B90B8] text-xs">
                                <Icon size={13} className="text-[#6C7EF5] shrink-0" />
                                <span>{text}</span>
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
                                    {item.label === 'Contact' ? (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsContactModalOpen(true);
                                            }}
                                            className="text-[#8B90B8] text-sm hover:text-[#E8EAF2] transition-colors group flex items-center gap-1.5 focus:outline-none text-left w-full"
                                        >
                                            <span className="w-0 h-px bg-[#6C7EF5] group-hover:w-3 transition-all duration-200" />
                                            {item.label}
                                        </button>
                                    ) : item.href.startsWith('/') ? (
                                        <Link
                                            to={item.href}
                                            className="text-[#8B90B8] text-sm hover:text-[#E8EAF2] transition-colors group flex items-center gap-1.5"
                                        >
                                            <span className="w-0 h-px bg-[#6C7EF5] group-hover:w-3 transition-all duration-200" />
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <a
                                            href={item.href}
                                            className="text-[#8B90B8] text-sm hover:text-[#E8EAF2] transition-colors group flex items-center gap-1.5"
                                        >
                                            <span className="w-0 h-px bg-[#6C7EF5] group-hover:w-3 transition-all duration-200" />
                                            {item.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>

            {/* ── Bottom bar ── */}
            <div className="border-t border-[#3B4FD8]/15 dark:border-[#6C7EF5]/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[#8B90B8] text-xs" style={{ fontFamily: MONO }}>
                        © {new Date().getFullYear()} EmoteTechnology · All rights reserved.
                    </p>
                    {/* Socials */}
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

            {/* Contact Modal */}
            <ContactModal 
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </footer>
    );
};

export default Footer;
