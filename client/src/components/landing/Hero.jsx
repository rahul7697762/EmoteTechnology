import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#021124]">
            {/* Background Image with Left-to-Right Subtle Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url(/hero.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-[#021124]/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#021124]/80 via-[#021124]/50 to-transparent" />
            </div>

            {/* Giant Watermark Text */}
            <div
                className="absolute top-[6%] md:top-[10%] left-0 w-full flex justify-center pointer-events-none select-none z-0"
            >
                <span className="text-[6.5vw] lg:text-[7.5vw] font-bold text-white/[0.04] tracking-widest whitespace-nowrap" style={{ textShadow: '0px 4px 20px rgba(0,0,0,0.1)' }}>
                    EMOTE TECHNOLOGY
                </span>
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 relative z-10">
                <div className="flex items-center min-h-[calc(100vh-4rem)]">

                    {/* ── Content ── */}
                    <div className="flex flex-col items-start text-left justify-center py-20 max-w-3xl">

                        {/* Kicker Tag */}
                        <div className="flex items-center justify-start gap-2 mb-3">
                            <span className="text-white text-sm">🎓</span>
                            <span className="text-white font-semibold text-xs md:text-sm tracking-wide">
                                India's Leading Platform for Tech Excellence
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="mb-6 font-bold leading-[1.15] text-white" style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)' }}>
                            Master <span className="text-[#6C7EF5]">Transformative Skills</span> with Industry-Focused Learning
                        </h1>

                        {/* Body text */}
                        <p className="text-gray-200 mt-2 font-normal text-sm md:text-[15px] leading-relaxed max-w-[600px] mb-8">
                            Build a strong foundation in emerging technologies through practical, hands-on learning designed for real-world success. We equip students with industry-relevant skills, transforming them into confident, job-ready professionals.
                        </p>

                        {/* CTA */}
                        <div className="flex justify-start gap-3">
                            <button
                                onClick={() => navigate('/signup')}
                                className="group flex items-center justify-center gap-2 px-6 py-2.5 md:px-8 md:py-3 bg-[#3B4FD8] text-white text-[13px] md:text-sm font-semibold rounded hover:bg-[#2A3CB8] transition-colors"
                            >
                                Start Free Trial
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Hero;
