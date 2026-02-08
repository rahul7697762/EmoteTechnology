import React from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const AIChat = ({ isOpen, onClose, width, isMobile }) => {
    return (
        <aside
            className={`
                fixed inset-y-0 right-0 z-30 bg-slate-50 dark:bg-[#111827] border-l border-slate-200 dark:border-slate-800 shadow-xl
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                lg:relative lg:shadow-none lg:z-0 lg:transition-none
                ${!isOpen && 'lg:hidden'}
            `}
            style={{ width: isMobile ? '100%' : width }} // Full width on mobile if needed, or fixed. Usually sidebar/chat overlays on mobile.
        >
            {/* Header */}
            <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-violet-600 dark:text-violet-400" />
                    <h2 className="font-bold text-slate-800 dark:text-white">AI Assistant</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Content / Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50 dark:bg-[#0F172A]">
                {/* Demo Messages */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-end gap-2">
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                            <MessageSquare size={12} className="text-white" />
                        </div>
                        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm">
                            <p>Hello! I'm your AI learning assistant. How can I help you with this lesson today?</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-end gap-2 flex-row-reverse">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">ME</span>
                        </div>
                        <div className="bg-violet-600 text-white rounded-2xl rounded-br-none px-4 py-2 text-sm shadow-sm">
                            <p>Can you summarize the main points of this video?</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-end gap-2">
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                            <MessageSquare size={12} className="text-white" />
                        </div>
                        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm">
                            <p>Sure! Here are the key takeaways:</p>
                            <ul className="list-disc ml-4 mt-2 space-y-1">
                                <li>The importance of efficient state management.</li>
                                <li>How to optimize React performance using memoization.</li>
                                <li>Best practices for structuring your components.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center my-4">
                    <span className="text-xs text-slate-400 font-medium px-2 bg-slate-50 dark:bg-[#0F172A]">Today</span>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]/50">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Ask a question..."
                        className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-slate-200"
                        disabled
                    />
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        disabled
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AIChat;
