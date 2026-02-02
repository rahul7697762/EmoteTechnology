import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Bot, Mic, Video } from 'lucide-react';

const AiInterview = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />
            <main className="pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 mb-8 animate-bounce">
                        <Bot size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Master Your Interview <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                            With AI
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                        Practice real-time technical and behavioral interviews with our advanced AI interviewer. Get instant feedback and improve your confidence.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="p-6 bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-200 dark:border-gray-800">
                            <Video className="w-10 h-10 text-purple-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold mb-2">Video Analysis</h3>
                            <p className="text-sm text-gray-500">AI analyzes your body language and eye contact.</p>
                        </div>
                        <div className="p-6 bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-200 dark:border-gray-800">
                            <Mic className="w-10 h-10 text-pink-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold mb-2">Speech Patterns</h3>
                            <p className="text-sm text-gray-500">Improve your clarity, pace, and tone.</p>
                        </div>
                        <div className="p-6 bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-200 dark:border-gray-800">
                            <Bot className="w-10 h-10 text-teal-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold mb-2">Technical Q&A</h3>
                            <p className="text-sm text-gray-500">Coding challenges and system design questions.</p>
                        </div>
                    </div>

                    <button className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all">
                        Start Practice Session
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AiInterview;
