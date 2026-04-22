import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] transition-colors duration-300">
            <Navbar />

            <div className="border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 text-center">
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                        <motion.h1 variants={fadeUp} className="leading-[0.93] max-w-3xl mx-auto" style={{ fontFamily: SERIF, fontSize: 'clamp(2.6rem, 5vw, 4.2rem)' }}>
                            <span className="block font-semibold">Privacy Policy</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mt-6 text-[#6B7194] dark:text-[#8B90B8]">
                            Last Updated: {new Date().toLocaleDateString()}
                        </motion.p>
                    </motion.div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 text-left space-y-8 text-lg">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-8 text-[#6B7194] dark:text-[#8B90B8]">
                    
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>1. Introduction</h2>
                        <p>Welcome to Emote Technology. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>2. Data We Collect</h2>
                        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                            <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                        </ul>
                    </section>
                    
                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>3. How We Use Your Data</h2>
                        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>4. Contact Us</h2>
                        <p>If you have any questions about this privacy policy, please contact us at hr@emotetechnology.in</p>
                    </section>

                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
