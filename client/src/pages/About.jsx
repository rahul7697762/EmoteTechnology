import { motion } from 'framer-motion';
import { Target, Eye, BookOpen, ArrowRight } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const About = () => {
    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] transition-colors duration-300">
            <Navbar />

            {/* ── Hero Header ── */}
            <div className="border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14">
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>

                        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
                            <div style={{ width: 28, height: 1, background: '#3B4FD8' }} />
                            <span className="text-[10px] tracking-[0.28em] uppercase text-[#3B4FD8] dark:text-[#6C7EF5]" style={{ fontFamily: MONO }}>
                                About Us
                            </span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="leading-[0.93] max-w-3xl" style={{ fontFamily: SERIF, fontSize: 'clamp(2.6rem, 5vw, 4.2rem)' }}>
                            <span className="block font-semibold">Bridging Education</span>
                            <span className="block font-light italic text-[#3B4FD8] dark:text-[#6C7EF5]">& Real-World Experience.</span>
                        </motion.h1>

                    </motion.div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-20 sm:space-y-28">

                {/* ── Who We Are ── */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                    className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                >
                    {/* Text */}
                    <div>
                        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                            <div style={{ width: 20, height: 1, background: '#3B4FD8' }} />
                            <span className="text-[10px] tracking-[0.24em] uppercase text-[#3B4FD8] dark:text-[#6C7EF5]" style={{ fontFamily: MONO }}>
                                Who We Are
                            </span>
                        </motion.div>

                        <motion.h2 variants={fadeUp} className="mb-6 leading-tight" style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                            <span className="block font-semibold">Emote Technology</span>
                            <span className="block font-light italic text-[#3B4FD8] dark:text-[#6C7EF5]">A Dynamic Platform</span>
                        </motion.h2>

                        <motion.p variants={fadeUp} className="text-[#6B7194] dark:text-[#8B90B8] text-[15px] leading-relaxed mb-4">
                            Emote Technology is a dynamic platform dedicated to bridging the gap between education and real-world experience. We specialize in offering industry-relevant internships and career-focused courses that empower students and professionals to enhance their skills and stay ahead in today's competitive job market.
                        </motion.p>

                        <motion.p variants={fadeUp} className="text-[#6B7194] dark:text-[#8B90B8] text-[15px] leading-relaxed">
                            With a focus on practical learning, mentorship, and hands-on projects, Emote Technology ensures that every learner gains not just knowledge, but also the confidence to apply it in real-world scenarios. Our mission is to create a community where learning, innovation, and career growth come together seamlessly.
                        </motion.p>
                    </div>

                    {/* Visual card */}
                    <motion.div variants={fadeUp} className="relative">
                        <div
                            className="absolute inset-0 rounded-2xl blur-3xl opacity-20"
                            style={{ background: 'linear-gradient(135deg, #3B4FD8, #6C7EF5)', transform: 'rotate(4deg)' }}
                        />
                        <div className="relative rounded-2xl overflow-hidden border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                alt="Team collaboration at Emote Technology"
                                className="w-full h-72 sm:h-80 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/75 to-transparent">
                                <p className="text-white text-lg font-medium" style={{ fontFamily: SERIF }}>
                                    "Where learning, innovation, and career growth meet."
                                </p>
                            </div>
                            <div
                                className="absolute top-5 left-5 px-3 py-1.5 text-white text-[9px] tracking-[0.2em] uppercase"
                                style={{ background: 'rgba(59,79,216,0.85)', fontFamily: MONO, backdropFilter: 'blur(8px)' }}
                            >
                                Emote Technology · EdTech
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* ── Online Courses ── */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                >
                    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                        <div style={{ width: 20, height: 1, background: '#3B4FD8' }} />
                        <span className="text-[10px] tracking-[0.24em] uppercase text-[#3B4FD8] dark:text-[#6C7EF5]" style={{ fontFamily: MONO }}>
                            Online Courses
                        </span>
                    </motion.div>

                    <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-start">
                        <motion.h2 variants={fadeUp} className="leading-tight" style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                            <span className="block font-semibold">Career-Focused</span>
                            <span className="block font-light italic text-[#3B4FD8] dark:text-[#6C7EF5]">Courses That Matter.</span>
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-[#6B7194] dark:text-[#8B90B8] text-[15px] leading-relaxed self-center">
                            Our courses are designed with industry relevance at the core — combining structured curriculum, real-world projects, and expert mentorship so learners graduate job-ready, not just degree-ready.
                        </motion.p>
                    </div>

                    {/* Feature row */}
                    <motion.div variants={fadeUp} className="mt-10 grid sm:grid-cols-3 gap-px bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 rounded-xl overflow-hidden">
                        {[
                            { label: 'Practical Learning', desc: 'Hands-on projects that mirror real industry workflows.' },
                            { label: 'Expert Mentorship', desc: 'Guidance from professionals working in your target field.' },
                            { label: 'Industry Internships', desc: 'Earn experience while you learn with our partner network.' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-[#F7F8FF] dark:bg-[#1A1D2E] px-6 py-8 group hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/8 transition-colors"
                            >
                                <BookOpen size={18} className="text-[#3B4FD8] dark:text-[#6C7EF5] mb-4" />
                                <h4 className="font-semibold text-sm mb-2">{item.label}</h4>
                                <p className="text-[#6B7194] dark:text-[#8B90B8] text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.section>

                {/* ── Mission & Vision ── */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                >
                    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
                        <div style={{ width: 20, height: 1, background: '#3B4FD8' }} />
                        <span className="text-[10px] tracking-[0.24em] uppercase text-[#3B4FD8] dark:text-[#6C7EF5]" style={{ fontFamily: MONO }}>
                            Mission & Vision
                        </span>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Mission */}
                        <motion.div
                            variants={fadeUp}
                            className="rounded-2xl p-8 border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 bg-white/60 dark:bg-[#252A41]/40"
                        >
                            <div className="w-11 h-11 rounded-xl bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/12 flex items-center justify-center mb-6">
                                <Target size={20} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
                            </div>
                            <span className="text-[9px] tracking-[0.22em] uppercase text-[#3B4FD8] dark:text-[#6C7EF5] block mb-3" style={{ fontFamily: MONO }}>
                                Mission
                            </span>
                            <h3 className="mb-3 font-semibold leading-snug" style={{ fontFamily: SERIF, fontSize: '1.5rem' }}>
                                Empowering Learners
                            </h3>
                            <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm leading-relaxed">
                                Empowering learners with real-world skills — equipping every individual with the practical knowledge and hands-on experience needed to thrive in a fast-evolving industry landscape.
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            variants={fadeUp}
                            className="rounded-2xl p-8 border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15"
                            style={{ background: 'linear-gradient(135deg, #3B4FD8 0%, #6C7EF5 100%)' }}
                        >
                            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-6">
                                <Eye size={20} className="text-white" />
                            </div>
                            <span className="text-[9px] tracking-[0.22em] uppercase text-white/70 block mb-3" style={{ fontFamily: MONO }}>
                                Vision
                            </span>
                            <h3 className="mb-3 font-semibold text-white leading-snug" style={{ fontFamily: SERIF, fontSize: '1.5rem' }}>
                                Global Impact
                            </h3>
                            <p className="text-white/80 text-sm leading-relaxed">
                                Bridging education and industry globally — creating a world where quality learning and career-defining opportunities are accessible to everyone, everywhere.
                            </p>
                        </motion.div>
                    </div>
                </motion.section>

            </main>

            <Footer />
        </div>
    );
};

export default About;
