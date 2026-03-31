import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const CTA = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-32 px-6 lg:px-8 bg-[#F7F8FF] dark:bg-[#1A1D2E] border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-12 md:p-16 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                        Ready to Start Your{' '}
                        <span className="text-[#F5A623] italic">
                            Journey?
                        </span>
                    </h2>
                    <p className="text-[#6B7194] dark:text-[#8B90B8] text-lg mb-10 max-w-xl mx-auto">
                        Join thousands of learners who are transforming their careers with EmoteTechnology.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="group inline-flex items-center gap-3 px-10 py-5 bg-[#F5A623] hover:bg-[#d9911a] font-bold text-xs uppercase tracking-widest text-[#1A1D2E] transition-colors border border-[#1A1D2E]/10"
                        style={{ fontFamily: MONO }}
                    >
                        Get Started for Free
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
