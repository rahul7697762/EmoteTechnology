import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCourseThreads,
    setDiscussionMaximized,
    createThread,
    toggleThreadUpvote,
    createReply,
    fetchReplies,
    toggleReplyUpvote,
    resetDiscussionList,
    deleteThread,
    deleteReply,
    toggleThreadPin,
    toggleThreadLock,
    markBestReply,
    toggleThreadFAQ,
    fetchUnansweredThreads
} from '../../redux/slices/discussionSlice';
import {
    MessageSquare, Minimize2, X, Plus, ThumbsUp, MessageCircle,
    Search, Filter, ChevronUp, ChevronDown, MoreHorizontal, Share2, Bookmark,
    Trash2, Pin, Lock, Star, CheckCircle, HelpCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DiscussionFullPage = ({ courseId, isEmbedded = false, isFaculty = false }) => {
    const dispatch = useDispatch();
    const { threads, loading, isMaximized, hasMore, currentPage } = useSelector((state) => state.discussion);
    const [selectedSort, setSelectedSort] = useState('top');
    const [showCreate, setShowCreate] = useState(false);

    // Create Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Expand Thread State
    const [expandedThreadId, setExpandedThreadId] = useState(null);

    // Infinite Scroll Handler
    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 50) { // Load when 50px from bottom
            if (!loading && hasMore) {
                if (selectedSort === 'unanswered') {
                    dispatch(fetchUnansweredThreads({ courseId, page: currentPage + 1 }));
                } else {
                    dispatch(fetchCourseThreads({ courseId, page: currentPage + 1, sort: selectedSort }));
                }
            }
        }
    };

    // Reset list on sort change
    useEffect(() => {
        if (courseId) {
            dispatch(resetDiscussionList());
            if (selectedSort === 'unanswered') {
                dispatch(fetchUnansweredThreads({ courseId, page: 1 }));
            } else {
                dispatch(fetchCourseThreads({ courseId, page: 1, sort: selectedSort }));
            }
        }
    }, [dispatch, courseId, selectedSort]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        await dispatch(createThread({ courseId, title, content }));
        setTitle('');
        setContent('');
        setShowCreate(false);
    };

    const handleUpvote = (id) => {
        dispatch(toggleThreadUpvote(id));
    };

    if (!isMaximized && !isEmbedded) return null;

    return (
        <div className={`${isEmbedded ? 'relative h-full' : 'fixed inset-0 z-50 bg-slate-50 dark:bg-[#0B1120] animate-in fade-in slide-in-from-bottom-10 duration-300'} overflow-hidden flex flex-col`}>

            {/* TOP BAR */}
            <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">Class Discussions</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Connect with your peers and instructors</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search - Visual only for now */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search discussions..."
                            className="bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-violet-500"
                        />
                    </div>

                    <button
                        onClick={() => dispatch(setDiscussionMaximized(false))}
                        className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Minimize2 size={20} />
                        <span className="hidden sm:inline text-sm font-medium">Minimize</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">

                {/* LEFT: Thread List */}
                <div
                    onScroll={handleScroll}
                    className={`col-span-1 lg:col-span-8 overflow-y-auto p-4 lg:p-8 custom-scrollbar ${expandedThreadId ? 'hidden lg:block' : ''}`}
                >

                    {/* Controls & Filters */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
                            {['latest', 'top', 'unanswered'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedSort(filter)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${selectedSort === filter
                                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {filter === 'latest' ? 'Newest' : filter}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowCreate(!showCreate)}
                            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm shadow-violet-200 dark:shadow-none transition-all"
                        >
                            {showCreate ? <X size={18} /> : <Plus size={18} />}
                            {showCreate ? 'Cancel' : 'Create Discussion'}
                        </button>
                    </div>

                    {/* Create Form */}
                    {showCreate && (
                        <div className="mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm animate-in slide-in-from-top-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Start a New Discussion</h3>
                                <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Title</label>
                                        <input
                                            className="w-full text-lg font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="What's this discussion about?"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Content</label>
                                        <textarea
                                            className="w-full min-h-[150px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-slate-700 dark:text-slate-300 resize-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Elaborate on your question or thought..."
                                            value={content}
                                            onChange={e => setContent(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            onClick={() => setShowCreate(false)}
                                            className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCreate}
                                            disabled={!title.trim() || !content.trim()}
                                            className="px-6 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 shadow-md shadow-violet-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Post Discussion
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Thread Cards */}
                    <div className="space-y-4">
                        {threads.map((thread) => (
                            <div key={thread._id} className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 rounded-xl p-1 flex gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                {/* Vote Column */}
                                <div className="flex flex-col items-center gap-1 p-3 min-w-[3rem] bg-slate-50 dark:bg-slate-800/50 rounded-l-lg border-r border-transparent">
                                    <button
                                        onClick={() => handleUpvote(thread._id)}
                                        className="text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 p-1 rounded transition-colors"
                                    >
                                        <ChevronUp size={24} className={thread.upvotes?.includes('ME') ? 'text-orange-500' : ''} />
                                    </button>
                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                                        {thread.upvotes?.length || 0}
                                    </span>
                                    <button className="text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 p-1 rounded transition-colors">
                                        <ChevronDown size={24} />
                                    </button>
                                </div>

                                {/* Content Column */}
                                <div className="flex-1 py-3 pr-4">
                                    {/* Meta */}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 overflow-hidden">
                                            {thread.createdBy?.profile?.avatar ? (
                                                <img src={thread.createdBy.profile.avatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-[9px]">
                                                    {thread.createdBy?.name?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300 hover:underline cursor-pointer">
                                            {thread.createdBy?.name}
                                        </span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                                        {thread.isPinned && (
                                            <span className="ml-2 px-1.5 py-0.5 bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 text-[10px] font-bold rounded uppercase tracking-wider">
                                                Pinned
                                            </span>
                                        )}
                                        {thread.isFAQ && (
                                            <span className="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                                                <HelpCircle size={10} /> FAQ
                                            </span>
                                        )}
                                    </div>

                                    {/* Title & Preview */}
                                    <h3
                                        onClick={() => setExpandedThreadId(thread._id)}
                                        className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                                    >
                                        {thread.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                                        {thread.content}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setExpandedThreadId(thread._id)}
                                            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 px-2 py-1 rounded-md transition-colors"
                                        >
                                            <MessageCircle size={18} />
                                            <span className="text-xs font-bold">{thread.replyCount} Comments</span>
                                        </button>

                                        {isFaculty && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); dispatch(toggleThreadPin(thread._id)); }}
                                                    className={`p-1.5 rounded-md transition-colors ${thread.isPinned ? 'text-sky-600 bg-sky-50 dark:bg-sky-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                                    title={thread.isPinned ? "Unpin" : "Pin"}
                                                >
                                                    <Pin size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); dispatch(toggleThreadFAQ(thread._id)); }}
                                                    className={`p-1.5 rounded-md transition-colors ${thread.isFAQ ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                                    title={thread.isFAQ ? "Unmark FAQ" : "Mark as FAQ"}
                                                >
                                                    <HelpCircle size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); dispatch(toggleThreadLock(thread._id)); }}
                                                    className={`p-1.5 rounded-md transition-colors ${thread.isLocked ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                                    title={thread.isLocked ? "Unlock" : "Lock"}
                                                >
                                                    <Lock size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete thread?')) dispatch(deleteThread(thread._id)); }}
                                                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && hasMore && (
                            <div className="py-4 text-center text-slate-500 text-sm animate-pulse">
                                Loading more discussions...
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Selected Thread Detail (or Trending Sidebar if none selected) */}
                <div className={`col-span-1 lg:col-span-4 bg-white dark:bg-[#1E293B] border-l border-slate-200 dark:border-slate-800 ${expandedThreadId ? 'block' : 'hidden lg:block'}`}>
                    {expandedThreadId ? (
                        <ThreadViewer
                            threadId={expandedThreadId}
                            onClose={() => setExpandedThreadId(null)}
                            isFaculty={isFaculty}
                        />
                    ) : (
                        <div className="p-6">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                                Community Rules
                            </h3>
                            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                                <p>1. Be respectful to others.</p>
                                <p>2. Keep discussions relevant to the course.</p>
                                <p>3. No spam or self-promotion.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// Internal Component for viewing a single thread and replies
const ThreadViewer = ({ threadId, onClose, isFaculty }) => {
    const dispatch = useDispatch();
    const { activeThreadReplies } = useSelector(state => state.discussion);
    const [replyContent, setReplyContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null); // { id: replyId, name: authorName }
    const thread = useSelector(state => state.discussion.threads.find(t => t._id === threadId));

    useEffect(() => {
        dispatch(fetchReplies({ threadId }));
    }, [dispatch, threadId]);

    const handleReply = async () => {
        if (!replyContent.trim()) return;

        await dispatch(createReply({
            threadId,
            content: replyContent,
            parentReplyId: replyingTo ? replyingTo.id : null
        }));

        setReplyContent('');
        setReplyingTo(null);
    };

    const initiateReply = (reply) => {
        setReplyingTo({ id: reply._id, name: reply.createdBy?.name });
    };

    if (!thread) return null;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full lg:hidden">
                    <X size={20} />
                </button>
                <span className="font-semibold text-sm">Thread Details</span>
                {thread.isLocked && <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded font-bold flex items-center gap-1"><Lock size={12} /> Locked</span>}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {/* OP */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 overflow-hidden">
                            {thread.createdBy?.profile?.avatar && <img src={thread.createdBy.profile.avatar} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                {thread.createdBy?.name}
                                {thread.createdBy?.role === 'FACULTY' && <span className="bg-violet-100 text-violet-700 text-[10px] px-1.5 py-0.5 rounded font-bold">INSTRUCTOR</span>}
                            </p>
                            <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</p>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{thread.title}</h2>
                    <div className="prose dark:prose-invert text-sm text-slate-600 dark:text-slate-300">
                        {thread.content}
                    </div>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-800 my-4" />

                {/* Replies */}
                <div className="space-y-6">
                    {activeThreadReplies.map(reply => (
                        <div key={reply._id} className={`flex gap-3 ${reply.parentReplyId ? 'ml-8 md:ml-12 border-l-2 border-slate-100 dark:border-slate-800 pl-4' : ''} ${(thread.bestReplyId?._id === reply._id || thread.bestReplyId === reply._id) ? 'bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-200 dark:border-amber-800' : ''}`}>
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 overflow-hidden">
                                {reply.createdBy?.profile?.avatar ? (
                                    <img src={reply.createdBy.profile.avatar} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {reply.createdBy?.name?.[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{reply.createdBy?.name}</span>
                                        <span className="text-[10px] text-slate-400">{formatDistanceToNow(new Date(reply.createdAt))} ago</span>
                                        {(thread.bestReplyId?._id === reply._id || thread.bestReplyId === reply._id) && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                                                <Star size={10} fill="currentColor" /> Best Answer
                                            </span>
                                        )}
                                    </div>

                                    {isFaculty && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => dispatch(markBestReply({ threadId: thread._id, replyId: reply._id }))}
                                                className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${(thread.bestReplyId?._id === reply._id || thread.bestReplyId === reply._id) ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'}`}
                                                title="Mark as Best Answer"
                                            >
                                                <Star size={14} fill={(thread.bestReplyId?._id === reply._id || thread.bestReplyId === reply._id) ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                onClick={() => { if (window.confirm('Delete reply?')) dispatch(deleteReply(reply._id)); }}
                                                className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                title="Delete Reply"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">{reply.content}</p>

                                {/* Reply Action - Hide if locked */}
                                {!thread.isLocked && (
                                    <button
                                        onClick={() => initiateReply(reply)}
                                        className="text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1"
                                    >
                                        Reply
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reply Box - Conditional Render based on Lock Status */}
            {!thread.isLocked ? (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    {replyingTo && (
                        <div className="flex items-center justify-between bg-violet-50 dark:bg-violet-900/20 px-3 py-2 rounded-lg mb-2 text-xs">
                            <span className="text-violet-700 dark:text-violet-300 font-medium">
                                Replying to <span className="font-bold">{replyingTo.name}</span>
                            </span>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <div className="relative">
                        <textarea
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-1 focus:ring-violet-500 pr-12 resize-none"
                            rows="3"
                            placeholder="Write a comment..."
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                        />
                        <button
                            onClick={handleReply}
                            disabled={!replyContent.trim()}
                            className="absolute bottom-2 right-2 p-1.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50 transition-colors"
                        >
                            <MessageSquare size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                        <Lock size={16} />
                        This thread has been locked by an instructor.
                    </p>
                </div>
            )}
        </div>
    );
};

export default DiscussionFullPage;
