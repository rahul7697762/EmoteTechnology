import { motion } from 'framer-motion';
import { Target, Users, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const pillars = [
    { icon: Target, title: "Mission Driven", desc: "Empowering individuals to reach their full potential through structured, AI-powered learning paths." },
    { icon: Users, title: "Community Focused", desc: "Building a supportive network of learners, instructors, and industry mentors." },
    { icon: Shield, title: "Quality First", desc: "Delivering world-class curriculum and instruction vetted by industry experts." }
];

const AboutUs = () => {
    const navigate = useNavigate();
    return (
        <section
            className="about-section py-32 px-6 lg:px-8 border-t transition-colors duration-300"
            style={{ borderColor: 'rgba(59,79,216,0.10)' }}
        >
            {/* Use inline styles to guarantee correct colors regardless of Tailwind purging */}
            <style>{`
                .about-section { background: #F7F8FF; }
                .dark .about-section { background: #1A1D2E; }
                .about-label { color: #3B4FD8; }
                .dark .about-label { color: #6C7EF5; }
                .about-h2 { color: #1A1D2E; }
                .dark .about-h2 { color: #E8EAF2; }
                .about-accent { background: linear-gradient(90deg, #3B4FD8, #6C7EF5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .about-body { color: #6B7194; }
                .dark .about-body { color: #8B90B8; }
                .about-icon-bg { background: rgba(59,79,216,0.09); }
                .dark .about-icon-bg { background: rgba(108,126,245,0.12); }
                .about-icon { color: #3B4FD8; }
                .dark .about-icon { color: #6C7EF5; }
                .about-pill-title { color: #1A1D2E; font-weight: 700; }
                .dark .about-pill-title { color: #E8EAF2; }
                .about-card-border { border-color: rgba(59,79,216,0.14); }
                .dark .about-card-border { border-color: rgba(108,126,245,0.12); }
                .about-stat-card { background: rgba(59,79,216,0.06); border: 1px solid rgba(59,79,216,0.12); }
                .dark .about-stat-card { background: rgba(108,126,245,0.08); border-color: rgba(108,126,245,0.12); }
                .about-stat-num { color: #3B4FD8; }
                .dark .about-stat-num { color: #6C7EF5; }
                .about-cta { background: #F5A623; color: #fff; }
                .about-cta:hover { background: #d9911a; }
                .dark .about-cta { background: #F9C74F; color: #1A1D2E; }
            `}</style>

            <div className="max-w-7xl mx-auto">
                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div style={{ width: 32, height: 1, background: '#3B4FD8' }} />
                        <span className="about-label text-[10px] tracking-[0.28em] uppercase" style={{ fontFamily: MONO }}>
                            04 / About Us
                        </span>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <h2 className="about-h2 leading-[0.93]" style={{ fontFamily: SERIF, fontSize: 'clamp(2.4rem,5vw,4rem)' }}>
                            <span style={{ display: 'block', fontWeight: 600 }}>We Are Shaping</span>
                            <span className="about-accent" style={{ display: 'block', fontStyle: 'italic', fontWeight: 300 }}>The Way the World Learns.</span>
                        </h2>
                        <p className="about-body max-w-sm text-sm leading-relaxed lg:text-right">
                            Bridging the gap between academic learning and real-world careers since 2021.
                        </p>
                    </div>
                </motion.div>

                {/* ── Grid: pillars + image ── */}
                <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-start">

                    {/* Left: pillars + stats */}
                    <div>
                        <div className="space-y-px" style={{ borderLeft: '1px solid rgba(59,79,216,0.12)' }}>
                            {pillars.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.12, duration: 0.55 }}
                                    viewport={{ once: true }}
                                    className="flex gap-6 pl-8 py-8 group"
                                    style={{ borderBottom: '1px solid rgba(59,79,216,0.08)' }}
                                >
                                    <div className="about-icon-bg w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <item.icon size={22} className="about-icon" />
                                    </div>
                                    <div>
                                        <h4 className="about-pill-title text-base mb-1.5">{item.title}</h4>
                                        <p className="about-body text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>



                        {/* CTA */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ x: 4 }}
                            onClick={() => navigate('/about')}
                            className="about-cta flex items-center gap-3 px-6 py-3.5 mt-8 text-sm font-medium tracking-wide transition-colors"
                        >
                            Our Story <ArrowRight size={15} />
                        </motion.button>
                    </div>

                    {/* Right: image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Indigo glow blob */}
                        <motion.div
                            animate={{ rotate: [6, 0, 6] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute inset-0 rounded-3xl blur-3xl opacity-25 transform rotate-6"
                            style={{ background: 'linear-gradient(135deg, #3B4FD8, #6C7EF5)' }}
                        />
                        <motion.div
                            whileHover={{ y: -6 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative rounded-3xl overflow-hidden shadow-2xl about-card-border border"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                alt="Team collaboration"
                                className="w-full h-full object-cover"
                            />
                            {/* Indigo overlay badge */}
                            <div
                                className="absolute top-6 left-6 px-4 py-2 text-white text-[10px] tracking-[0.22em] uppercase"
                                style={{ background: 'rgba(59,79,216,0.82)', fontFamily: MONO, backdropFilter: 'blur(8px)' }}
                            >
                                Est. 2021 · EdTech
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white font-medium text-lg" style={{ fontFamily: SERIF }}>"We are shaping the way the world learns."</p>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AboutUs;
