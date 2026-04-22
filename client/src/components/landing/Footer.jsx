import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, ArrowUpRight, Twitter, Linkedin, Github, Youtube } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const links = {
    Learn: [
        { label: 'All Courses', href: '/courses' },
        { label: 'AI Interview Prep', href: '/ai-interview' },
        { label: 'Certificates', href: '#' },
        { label: 'Live Sessions', href: '#' },
    ],
    Company: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/jobs' },
        { label: 'Blog', href: '#' },
        { label: 'Press', href: '#' },
    ],
    Support: [
        { label: 'Help Center', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Use', href: '#' },
        { label: 'Contact', href: '#' },
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

                {/* Brand + contact — full width on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="md:hidden mb-10 sm:mb-12 pb-10 sm:pb-12 border-b border-[#3B4FD8]/15"
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

                {/* Link columns — 3-col grid on mobile, inline on desktop */}
                <div className="grid grid-cols-3 md:hidden gap-6 mt-2">
                    {Object.entries(links).map(([category, items], ci) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.08 * (ci + 1) }}
                        >
                            <h4
                                className="text-[9px] tracking-[0.18em] uppercase text-[#6C7EF5] mb-4"
                                style={{ fontFamily: MONO }}
                            >
                                {category}
                            </h4>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            className="text-[#8B90B8] text-xs hover:text-[#E8EAF2] transition-colors leading-snug block"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Desktop: 4-col grid (brand + 3 link cols) */}
                <div className="hidden md:grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 mt-0">
                    {/* Empty first cell — brand column already rendered above (shared markup); re-render inline for desktop layout */}
                    <div>
                        <div className="flex items-baseline gap-0.5 mb-4">
                            <span className="text-[1.5rem] font-semibold text-[#6C7EF5]" style={{ fontFamily: SERIF }}>Emote</span>
                            <span className="text-base font-light text-[#E8EAF2] tracking-[0.04em]">Technology</span>
                        </div>
                        <p className="text-[#8B90B8] text-sm leading-relaxed mb-6 max-w-xs">
                            AI-powered education platform bridging the gap between learners and industry — built for the institutions of tomorrow.
                        </p>
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
                    </div>

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
                                        <a
                                            href={item.href}
                                            className="text-[#8B90B8] text-sm hover:text-[#E8EAF2] transition-colors group flex items-center gap-1.5"
                                        >
                                            <span className="w-0 h-px bg-[#6C7EF5] group-hover:w-3 transition-all duration-200" />
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
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
