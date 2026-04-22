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

const TermsOfUse = () => {
    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] transition-colors duration-300">
            <Navbar />

            <div className="border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 text-center">
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                        <motion.h1 variants={fadeUp} className="leading-[0.93] max-w-3xl mx-auto" style={{ fontFamily: SERIF, fontSize: 'clamp(2.6rem, 5vw, 4.2rem)' }}>
                            <span className="block font-semibold">Terms of Use</span>
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
                        <h2 className="text-2xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>1. Acceptance of Terms</h2>
                        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>2. Informational Purposes</h2>
                        <p>This site and its components are offered for informational purposes only; this site shall not be responsible or liable for the accuracy, usefulness or availability of any information transmitted or made available via the site, and shall not be responsible or liable for any error or omissions in that information.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>3. Intellectual Property</h2>
                        <p>The Site and its original content, features, and functionality are owned by Emote Technology and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>4. Termination</h2>
                        <p>We may terminate your access to the Site, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account. All provisions of this Agreement that, by their nature, should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
                    </section>

                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfUse;
