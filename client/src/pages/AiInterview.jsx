import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Bot, Mic, Video } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const AiInterview = () => {
    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] transition-colors duration-300">
            <Navbar />
            <main className="pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    <div className="w-20 h-20 mb-10 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 flex items-center justify-center shadow-sm relative">
                        <div className="absolute inset-0 bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5" />
                        <Bot size={40} className="text-[#3B4FD8] dark:text-[#6C7EF5] relative z-10" strokeWidth={1} />
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight" style={{ fontFamily: SERIF }}>
                        Master Your Interview <br />
                        <span className="text-[#F5A623] italic font-normal">
                            With AI
                        </span>
                    </h1>
                    
                    <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm uppercase tracking-widest font-semibold mb-16 max-w-2xl leading-relaxed" style={{ fontFamily: MONO }}>
                        Practice real-time technical and behavioral interviews with our advanced AI interviewer. Get instant feedback and improve your confidence.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 w-full mb-16">
                        <div className="p-8 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex flex-col items-center shadow-sm">
                            <Video className="w-12 h-12 text-[#3B4FD8] dark:text-[#6C7EF5] mb-6" strokeWidth={1} />
                            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: SERIF }}>Video Analysis</h3>
                            <p className="text-xs uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>AI analyzes your body language and eye contact.</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex flex-col items-center shadow-sm">
                            <Mic className="w-12 h-12 text-[#F5A623] mb-6" strokeWidth={1} />
                            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: SERIF }}>Speech Patterns</h3>
                            <p className="text-xs uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Improve your clarity, pace, and tone.</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex flex-col items-center shadow-sm">
                            <Bot className="w-12 h-12 text-[#3B4FD8] dark:text-[#6C7EF5] mb-6" strokeWidth={1} />
                            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: SERIF }}>Technical Q&A</h3>
                            <p className="text-xs uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Coding challenges and system design questions.</p>
                        </div>
                    </div>

                    <button className="px-12 py-5 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] font-bold text-xs uppercase tracking-widest transition-colors shadow-sm border border-[#1A1D2E]/10" style={{ fontFamily: MONO }}>
                        Start Practice Session
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AiInterview;
