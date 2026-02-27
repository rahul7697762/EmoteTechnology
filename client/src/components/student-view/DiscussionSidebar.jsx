import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseThreads, setDiscussionMaximized, createThread, resetDiscussionList } from '../../redux/slices/discussionSlice';
import { MessageSquare, Maximize2, X, Plus, ThumbsUp, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
                ? `w-full h-full flex flex-col bg-white dark:bg-[#0F172A]`
                : `
                fixed inset-y-0 right-0 z-30 bg-white dark:bg-[#0F172A] border-l border-slate-200 dark:border-slate-800 shadow-xl
                transform transition-transform duration-300 ease-in-out flex flex-col
                translate-x-0
                lg:relative lg:shadow-none lg:z-0 lg:transition-none
            `}
            style={isEmbedded ? {} : { width: isMobile ? '100%' : (typeof width === 'string' ? width : `${width}px`) }}
        >
            {/* HEADER */}
            <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/50 dark:bg-[#0F172A]/50 backdrop-blur-sm">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <MessageSquare size={18} className="text-violet-600" />
                    Discussions
                </h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => dispatch(setDiscussionMaximized(true))}
                        className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Maximize"
                    >
                        <Maximize2 size={18} />
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <div
                className="flex-1 overflow-y-auto p-4 custom-scrollbar"
                onScroll={handleScroll}
            >

                {/* Create Thread Toggle */}
                {!showCreate ? (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors mb-6 shadow-sm shadow-violet-200 dark:shadow-none"
                    >
                        <Plus size={18} />
                        New Discussion
                    </button>
                ) : (
                    /* CREATE THREAD FORM */
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Discussion</h3>
                            <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <input
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400"
                                placeholder="Topic Title"
                                value={newThreadTitle}
                                onChange={(e) => setNewThreadTitle(e.target.value)}
                                autoFocus
                            />
                            <textarea
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 resize-none min-h-[100px]"
                                placeholder="What's on your mind?"
                                value={newThreadContent}
                                onChange={(e) => setNewThreadContent(e.target.value)}
                            />
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleCreateThread}
                                    disabled={!newThreadTitle.trim() || !newThreadContent.trim()}
                                    className="w-full px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    Post Discussion
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Initial Loading State */}
                {loading && threads.length === 0 && (
                    <div className="flex justify-center p-4">
                        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Thread List */}
                <div className="space-y-4">
                    {threads.map(thread => (
                        <div key={thread._id} className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => dispatch(setDiscussionMaximized(true))} /* For now, clicking expands full view as per request */
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                        {thread.createdBy?.profile?.avatar ? (
                                            <img src={thread.createdBy.profile.avatar} alt={thread.createdBy.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                {thread.createdBy?.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[120px]">
                                        {thread.createdBy?.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400">• {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                                </div>
                                {thread.isPinned && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 rounded-full">PINNED</span>
                                )}
                            </div>

                            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 line-clamp-2 leading-tight group-hover:text-violet-600 transition-colors">
                                {thread.title}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                                {thread.content}
                            </p>

                            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 text-xs">
                                        <ThumbsUp size={14} />
                                        {thread.upvotes?.length || 0}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs">
                                        <MessageCircle size={14} />
                                        {thread.replyCount || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && hasMore && threads.length > 0 && (
                        <div className="py-4 text-center text-slate-500 text-xs animate-pulse">
                            Loading more...
                        </div>
                    )}

                    {!loading && threads.length === 0 && (
                        <div className="text-center py-10">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <MessageSquare size={24} />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">No discussions yet.</p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Be the first to start a conversation!</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default DiscussionSidebar;
