import React from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const AIChat = ({ isOpen, onClose, width, isMobile }) => {
    return (
        <aside
            className={`
                fixed inset-y-0 right-0 z-30 bg-[#F7F8FF] dark:bg-[#0A0B10] border-l border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-2xl
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                lg:relative lg:shadow-none lg:z-0 lg:transition-none
                ${!isOpen && 'lg:hidden'}
            `}
            style={{ width: isMobile ? '100%' : width }} // Full width on mobile if needed, or fixed. Usually sidebar/chat overlays on mobile.
        >
            {/* Header */}
            <div className="h-16 px-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-between shrink-0 bg-white dark:bg-[#1A1D2E]">
                <div className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
                    <h2 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>AI Assistant</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-[#6B7194] hover:text-[#1A1D2E] dark:text-[#8B90B8] dark:hover:text-[#E8EAF2] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content / Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[#F7F8FF] dark:bg-[#0A0B10]">
                {/* Demo Messages */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-end gap-3">
                        <div className="w-8 h-8 bg-[#3B4FD8] flex items-center justify-center shrink-0 border border-[#3B4FD8]/20">
                            <MessageSquare size={16} className="text-white" />
                        </div>
                        <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 px-5 py-4 text-[#1A1D2E] dark:text-[#E8EAF2] shadow-sm max-w-[85%]">
                            <p className="leading-relaxed">Hello! I'm your AI learning assistant. How can I help you with this lesson today?</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-end gap-3 flex-row-reverse">
                        <div className="w-8 h-8 bg-[#1A1D2E] dark:bg-[#E8EAF2] flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-white dark:text-[#1A1D2E]" style={{ fontFamily: MONO }}>ME</span>
                        </div>
                        <div className="bg-[#3B4FD8] text-white px-5 py-4 shadow-sm max-w-[85%]">
                            <p className="leading-relaxed">Can you summarize the main points of this video?</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-end gap-3">
                        <div className="w-8 h-8 bg-[#3B4FD8] flex items-center justify-center shrink-0 border border-[#3B4FD8]/20">
                            <MessageSquare size={16} className="text-white" />
                        </div>
                        <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 px-5 py-4 text-[#1A1D2E] dark:text-[#E8EAF2] shadow-sm max-w-[85%]">
                            <p className="leading-relaxed font-bold mb-2">Sure! Here are the key takeaways:</p>
                            <ul className="list-disc ml-5 space-y-2 opacity-90">
                                <li>The importance of efficient state management.</li>
                                <li>How to optimize React performance using memoization.</li>
                                <li>Best practices for structuring your components.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center my-6">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B7194] dark:text-[#8B90B8] px-4 bg-[#F7F8FF] dark:bg-[#0A0B10]" style={{ fontFamily: MONO }}>TODAY</span>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-white dark:bg-[#1A1D2E]">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Ask a question..."
                        className="w-full pl-4 pr-12 py-3 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#1A1D2E] dark:text-[#E8EAF2] focus:outline-none focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] placeholder:text-[#6B7194]/50 dark:placeholder:text-[#8B90B8]/50"
                        disabled
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#6B7194] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                        disabled
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AIChat;
