import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroCanvas from './HeroCanvas';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.11 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const Hero = () => {
    const navigate = useNavigate();

    const stats = [
        { number: '5,000+', label: 'Active Learners' },
        { number: '98%', label: 'Satisfaction Rate' },
        { number: '50+', label: 'Expert Courses' },
        { number: '200+', label: 'Hiring Partners' },
    ];

    return (
        <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
            <HeroCanvas />

            {/* Large ambient section number */}
            <div
                className="absolute right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none hidden lg:block"
                style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(10rem, 22vw, 20rem)',
                    fontWeight: 700,
                    color: 'rgba(59,79,216,0.040)',
                }}
            >
                01
            </div>
            <div
                className="absolute right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none hidden lg:dark:block"
                style={{
                    fontFamily: SERIF,
                    fontSize: 'clamp(10rem, 22vw, 20rem)',
                    fontWeight: 700,
                    color: 'rgba(108,126,245,0.045)',
                }}
            >
                01
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-[1fr_300px] min-h-[calc(100vh-4rem)]">

                    {/* ── Left: Content ── */}
                    <motion.div
                        className="flex flex-col items-center text-center justify-center py-20 lg:pr-16 lg:border-r border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8"
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {/* Section label */}
                        <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-10">
                            <div className="w-8 h-px bg-[#3B4FD8] dark:bg-[#6C7EF5]" />
                            <span
                                className="text-[#3B4FD8] dark:text-[#6C7EF5] text-[10px] tracking-[0.28em] uppercase"
                                style={{ fontFamily: MONO }}
                            >
                                01 / Intelligent Education
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={fadeUp} className="mb-8 leading-[0.93]" style={{ fontFamily: SERIF }}>
                            <span
                                className="block font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]"
                                style={{ fontSize: 'clamp(3.2rem,7vw,6.2rem)' }}
                            >
                                The Future
                            </span>
                            <span
                                className="block font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]"
                                style={{ fontSize: 'clamp(3.2rem,7vw,6.2rem)' }}
                            >
                                of Learning
                            </span>
                            <span
                                className="block font-light italic text-[#3B4FD8] dark:text-[#6C7EF5]"
                                style={{ fontSize: 'clamp(3.2rem,7vw,6.2rem)' }}
                            >
                                is Intelligent.
                            </span>
                        </motion.h1>

                        {/* Body text */}
                        <motion.p
                            variants={fadeUp}
                            className="text-[#6B7194] dark:text-[#8B90B8] font-light text-lg leading-relaxed max-w-[480px] mb-10 mx-auto"
                        >
                            Engaging AI teachers and advanced learning tools to upskill your students anywhere, anytime. Built for the institutions of tomorrow.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
                            <button
                                onClick={() => navigate('/login')}
                                className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#F5A623] dark:bg-[#F9C74F] text-white dark:text-[#1A1D2E] text-sm font-medium tracking-[0.06em] hover:bg-[#d9911a] dark:hover:bg-[#F5A623] transition-colors"
                            >
                                Start Free Trial
                                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="flex items-center justify-center gap-3 px-8 py-4 border border-[#3B4FD8]/18 dark:border-[#6C7EF5]/14 text-[#1A1D2E] dark:text-[#E8EAF2] text-sm font-medium tracking-[0.06em] hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors">
                                <Play size={13} fill="currentColor" />
                                Watch Demo
                            </button>
                        </motion.div>

                        {/* Trusted by */}
                        <motion.div
                            variants={fadeUp}
                            className="border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8 pt-8 w-full flex flex-col items-center"
                        >
                            <p
                                className="text-[10px] tracking-[0.25em] uppercase text-[#6B7194] dark:text-[#8B90B8] mb-5"
                                style={{ fontFamily: MONO }}
                            >
                                Trusted by Leading Institutions
                            </p>
                            <div className="flex flex-wrap justify-center gap-8 items-center">
                                {['Stanford', 'Pearson', 'Zoom', 'OpenAI'].map((name) => (
                                    <span
                                        key={name}
                                        className="text-lg font-semibold text-[#1A1D2E]/35 dark:text-[#E8EAF2]/25 hover:text-[#3B4FD8]/70 dark:hover:text-[#6C7EF5]/70 transition-colors cursor-default"
                                        style={{ fontFamily: SERIF }}
                                    >
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* ── Right: Stats ── */}
                    <motion.div
                        className="hidden lg:flex flex-col border-l border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className={`flex-1 flex flex-col justify-center px-10 group hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/4 transition-colors cursor-default ${i < stats.length - 1 ? 'border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8' : ''
                                    }`}
                            >
                                <div
                                    className="text-5xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2] mb-2 group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors"
                                    style={{ fontFamily: SERIF }}
                                >
                                    {stat.number}
                                </div>
                                <div
                                    className="text-[10px] tracking-[0.22em] uppercase text-[#6B7194] dark:text-[#8B90B8]"
                                    style={{ fontFamily: MONO }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
