import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseThreads, setDiscussionMaximized, createThread, resetDiscussionList } from '../../redux/slices/discussionSlice';
import { MessageSquare, Maximize2, X, Plus, ThumbsUp, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const DiscussionSidebar = ({ courseId, onClose, width, isMobile, isEmbedded = false }) => {
    const dispatch = useDispatch();
    const { threads, loading, error, hasMore, currentPage } = useSelector((state) => state.discussion);
    const user = useSelector((state) => state.auth.user);
    const [showCreate, setShowCreate] = useState(false);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newThreadContent, setNewThreadContent] = useState('');

    useEffect(() => {
        if (courseId) {
            dispatch(resetDiscussionList());
            dispatch(fetchCourseThreads({ courseId, page: 1 }));
        }
    }, [dispatch, courseId]);

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            if (!loading && hasMore) {
                dispatch(fetchCourseThreads({ courseId, page: currentPage + 1 }));
            }
        }
    };

    const handleCreateThread = async (e) => {
        e.preventDefault();
        if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

        await dispatch(createThread({
            courseId,
            title: newThreadTitle,
            content: newThreadContent
        }));
        setNewThreadTitle('');
        setNewThreadContent('');
        setShowCreate(false);
    };

    return (
        <aside
            className={isEmbedded
                ? `w-full h-full flex flex-col bg-white dark:bg-[#1A1D2E]`
                : `
                fixed inset-y-0 right-0 z-30 bg-white dark:bg-[#1A1D2E] border-l border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-2xl
                transform transition-transform duration-300 ease-in-out flex flex-col
                translate-x-0
                lg:relative lg:shadow-none lg:z-0 lg:transition-none
            `}
            style={isEmbedded ? {} : { width: isMobile ? '100%' : (typeof width === 'string' ? width : `${width}px`) }}
        >
            {/* HEADER */}
            <div className="h-16 px-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-between shrink-0 bg-white dark:bg-[#1A1D2E]">
                <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] flex items-center gap-3" style={{ fontFamily: SERIF }}>
                    <MessageSquare size={20} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
                    Discussions
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => dispatch(setDiscussionMaximized(true))}
                        className="p-2 text-[#6B7194] hover:text-[#1A1D2E] dark:text-[#8B90B8] dark:hover:text-[#E8EAF2] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors"
                        title="Maximize"
                    >
                        <Maximize2 size={18} />
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-[#6B7194] hover:text-[#1A1D2E] dark:text-[#8B90B8] dark:hover:text-[#E8EAF2] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <div
                className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#F7F8FF] dark:bg-[#0A0B10]"
                onScroll={handleScroll}
            >

                {/* Create Thread Toggle */}
                {!showCreate ? (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] font-bold transition-colors mb-8 shadow-sm text-[10px] uppercase tracking-widest"
                        style={{ fontFamily: MONO }}
                    >
                        <Plus size={16} />
                        NEW DISCUSSION
                    </button>
                ) : (
                    /* CREATE THREAD FORM */
                    <div className="p-6 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 animate-in slide-in-from-top-2 mb-8">
                        <div className="mb-6 flex items-center justify-between pb-4 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                            <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>New Discussion</h3>
                            <button onClick={() => setShowCreate(false)} className="text-[#6B7194] hover:text-[#1A1D2E] dark:text-[#8B90B8] dark:hover:text-[#E8EAF2]">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-2" style={{ fontFamily: MONO }}>TITLE</label>
                                <input
                                    className="w-full px-4 py-3 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#1A1D2E] dark:text-[#E8EAF2] focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-all placeholder:text-[#6B7194]/50 dark:placeholder:text-[#8B90B8]/50"
                                    placeholder="Topic Title"
                                    value={newThreadTitle}
                                    onChange={(e) => setNewThreadTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-2" style={{ fontFamily: MONO }}>CONTENT</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#1A1D2E] dark:text-[#E8EAF2] focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-all placeholder:text-[#6B7194]/50 dark:placeholder:text-[#8B90B8]/50 resize-none min-h-[120px]"
                                    placeholder="What's on your mind?"
                                    value={newThreadContent}
                                    onChange={(e) => setNewThreadContent(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleCreateThread}
                                    disabled={!newThreadTitle.trim() || !newThreadContent.trim()}
                                    className="w-full px-6 py-4 bg-[#3B4FD8] hover:bg-[#2f3fab] text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-[10px] uppercase tracking-widest"
                                    style={{ fontFamily: MONO }}
                                >
                                    POST DISCUSSION
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Initial Loading State */}
                {loading && threads.length === 0 && (
                    <div className="flex justify-center p-8">
                        <div className="w-8 h-8 border-[3px] border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 border-t-[#3B4FD8] dark:border-t-[#6C7EF5] animate-spin"></div>
                    </div>
                )}

                {/* Thread List */}
                <div className="space-y-4">
                    {threads.map(thread => (
                        <div key={thread._id} className="group relative bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 p-5 hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] hover:shadow-md transition-all cursor-pointer"
                            onClick={() => dispatch(setDiscussionMaximized(true))} /* For now, clicking expands full view as per request */
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 border border-[#3B4FD8]/20 overflow-hidden bg-[#F7F8FF] dark:bg-[#0A0B10]">
                                        {thread.createdBy?.profile?.avatar ? (
                                            <img src={thread.createdBy.profile.avatar} alt={thread.createdBy.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8]">
                                                {thread.createdBy?.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-[#1A1D2E] dark:text-[#E8EAF2] uppercase tracking-widest truncate max-w-[120px]" style={{ fontFamily: MONO }}>
                                            {thread.createdBy?.name}
                                        </span>
                                        <span className="text-[9px] font-bold text-[#6B7194]/70 dark:text-[#8B90B8]/70 uppercase tracking-widest" style={{ fontFamily: MONO }}>
                                            {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                                {thread.isPinned && (
                                    <span className="text-[9px] font-bold px-2 py-1 border border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 text-[#3B4FD8] dark:text-[#6C7EF5] uppercase tracking-widest" style={{ fontFamily: MONO }}>
                                        PINNED
                                    </span>
                                )}
                            </div>

                            <h4 className="text-lg font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-2 line-clamp-2 leading-snug group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors" style={{ fontFamily: SERIF }}>
                                {thread.title}
                            </h4>
                            <p className="text-sm text-[#1A1D2E]/70 dark:text-[#E8EAF2]/70 line-clamp-2 mb-4 leading-relaxed">
                                {thread.content}
                            </p>

                            <div className="flex items-center justify-between text-[#6B7194] dark:text-[#8B90B8] border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pt-3">
                                <div className="flex items-center gap-6">
                                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>
                                        <ThumbsUp size={14} className="text-[#3B4FD8] dark:text-[#6C7EF5]" />
                                        {thread.upvotes?.length || 0}
                                    </span>
                                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>
                                        <MessageCircle size={14} className="text-[#F5A623]" />
                                        {thread.replyCount || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && hasMore && threads.length > 0 && (
                        <div className="py-6 text-center text-[#6B7194] dark:text-[#8B90B8] text-[10px] font-bold uppercase tracking-widest animate-pulse" style={{ fontFamily: MONO }}>
                            LOADING MORE...
                        </div>
                    )}

                    {!loading && threads.length === 0 && (
                        <div className="text-center py-12 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-white dark:bg-[#1A1D2E]">
                            <div className="w-16 h-16 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 flex items-center justify-center mx-auto mb-4 text-[#6B7194] dark:text-[#8B90B8]">
                                <MessageSquare size={32} />
                            </div>
                            <p className="text-lg font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-1" style={{ fontFamily: SERIF }}>No discussions yet</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Be the first to start a conversation!</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default DiscussionSidebar;
