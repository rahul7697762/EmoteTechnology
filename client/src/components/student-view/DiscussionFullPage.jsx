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

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
        <div className={`${isEmbedded ? 'relative h-full' : 'fixed inset-0 z-50 bg-[#F7F8FF] dark:bg-[#0A0B10] animate-in fade-in slide-in-from-bottom-10 duration-300'} overflow-hidden flex flex-col`}>

            {/* TOP BAR */}
            <div className="h-20 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-white dark:bg-[#1A1D2E] flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 flex items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5]">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] leading-none" style={{ fontFamily: SERIF }}>Class Discussions</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mt-2" style={{ fontFamily: MONO }}>Connect with your peers and instructors</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search - Visual only for now */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8] dark:text-[#6C7EF5]" size={16} />
                        <input
                            type="text"
                            placeholder="SEARCH DISCUSSIONS"
                            className="bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none py-3 pl-12 pr-4 w-72 text-[10px] font-bold tracking-widest text-[#1A1D2E] dark:text-[#E8EAF2] focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-colors placeholder:text-[#6B7194] dark:placeholder:text-[#8B90B8]"
                            style={{ fontFamily: MONO }}
                        />
                    </div>

                    <button
                        onClick={() => dispatch(setDiscussionMaximized(false))}
                        className="p-3 text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-[#3B4FD8]/10 dark:hover:bg-[#6C7EF5]/10 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none flex items-center gap-2 transition-colors"
                        style={{ fontFamily: MONO }}
                    >
                        <Minimize2 size={18} />
                        <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">MINIMIZE</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-[#F7F8FF] dark:bg-[#0A0B10]">

                {/* LEFT: Thread List */}
                <div
                    onScroll={handleScroll}
                    className={`col-span-1 lg:col-span-8 overflow-y-auto p-4 lg:p-8 custom-scrollbar ${expandedThreadId ? 'hidden lg:block' : ''}`}
                >

                    {/* Controls & Filters */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <div className="flex bg-[#F7F8FF] dark:bg-[#0A0B10] p-1 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none">
                            {['latest', 'top', 'unanswered'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedSort(filter)}
                                    className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest rounded-none transition-all ${selectedSort === filter
                                        ? 'bg-[#3B4FD8] text-white shadow-sm'
                                        : 'text-[#6B7194] dark:text-[#8B90B8] hover:text-[#1A1D2E] dark:hover:text-[#E8EAF2]'
                                        }`}
                                    style={{ fontFamily: MONO }}
                                >
                                    {filter === 'latest' ? 'NEWEST' : filter.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowCreate(!showCreate)}
                            className="px-6 py-3 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] rounded-none font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm transition-colors"
                            style={{ fontFamily: MONO }}
                        >
                            {showCreate ? <X size={18} /> : <Plus size={18} />}
                            {showCreate ? 'CANCEL' : 'CREATE DISCUSSION'}
                        </button>
                    </div>

                    {/* Create Form */}
                    {showCreate && (
                        <div className="mb-8 bg-white dark:bg-[#1A1D2E] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none overflow-hidden shadow-sm animate-in slide-in-from-top-4">
                            <div className="p-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>Start a New Discussion</h3>
                                <button onClick={() => setShowCreate(false)} className="text-[#6B7194] hover:text-[#1A1D2E] dark:text-[#8B90B8] dark:hover:text-[#E8EAF2] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 p-2 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-2" style={{ fontFamily: MONO }}>TITLE</label>
                                        <input
                                            className="w-full text-xl font-bold bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none px-6 py-4 focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-all placeholder:text-[#6B7194]/50 dark:placeholder:text-[#8B90B8]/50 text-[#1A1D2E] dark:text-[#E8EAF2]"
                                            style={{ fontFamily: SERIF }}
                                            placeholder="What's this discussion about?"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-2" style={{ fontFamily: MONO }}>CONTENT</label>
                                        <textarea
                                            className="w-full min-h-[160px] bg-[#F7F8FF] dark:bg-[#0A0B10] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none p-6 text-[#1A1D2E] dark:text-[#E8EAF2] resize-none focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-all placeholder:text-[#6B7194]/50 dark:placeholder:text-[#8B90B8]/50"
                                            placeholder="Elaborate on your question or thought..."
                                            value={content}
                                            onChange={e => setContent(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-4 pt-4">
                                        <button
                                            onClick={() => setShowCreate(false)}
                                            className="px-6 py-4 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#1A1D2E] dark:text-[#E8EAF2] font-bold hover:bg-[#F7F8FF] dark:hover:bg-[#0A0B10] rounded-none transition-colors text-[10px] uppercase tracking-widest"
                                            style={{ fontFamily: MONO }}
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            onClick={handleCreate}
                                            disabled={!title.trim() || !content.trim()}
                                            className="px-8 py-4 bg-[#3B4FD8] hover:bg-[#2f3fab] text-white font-bold rounded-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] uppercase tracking-widest"
                                            style={{ fontFamily: MONO }}
                                        >
                                            POST DISCUSSION
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Thread Cards */}
                    <div className="space-y-6">
                        {threads.map((thread) => (
                            <div key={thread._id} className="bg-white dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 rounded-none flex hover:border-[#3B4FD8]/30 dark:hover:border-[#6C7EF5]/30 transition-colors shadow-sm">
                                {/* Vote Column */}
                                <div className="flex flex-col items-center gap-2 p-4 min-w-[4rem] bg-[#F7F8FF] dark:bg-[#0A0B10] border-r border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                                    <button
                                        onClick={() => handleUpvote(thread._id)}
                                        className="text-[#6B7194] dark:text-[#8B90B8] hover:text-[#F5A623] hover:bg-[#F5A623]/10 p-2 rounded-none transition-colors"
                                    >
                                        <ChevronUp size={28} className={thread.upvotes?.includes('ME') ? 'text-[#F5A623]' : ''} />
                                    </button>
                                    <span className="font-bold text-lg text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: MONO }}>
                                        {thread.upvotes?.length || 0}
                                    </span>
                                    <button className="text-[#6B7194] dark:text-[#8B90B8] hover:text-[#F5A623] hover:bg-[#F5A623]/10 p-2 rounded-none transition-colors">
                                        <ChevronDown size={28} />
                                    </button>
                                </div>

                                {/* Content Column */}
                                <div className="flex-1 p-6">
                                    {/* Meta */}
                                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-4" style={{ fontFamily: MONO }}>
                                        <div className="w-6 h-6 border border-[#3B4FD8]/20 overflow-hidden bg-[#F7F8FF] dark:bg-[#0A0B10]">
                                            {thread.createdBy?.profile?.avatar ? (
                                                <img src={thread.createdBy.profile.avatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#3B4FD8] dark:text-[#6C7EF5]">
                                                    {thread.createdBy?.name?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[#1A1D2E] dark:text-[#E8EAF2] hover:underline cursor-pointer">
                                            {thread.createdBy?.name}
                                        </span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                                        {thread.isPinned && (
                                            <span className="ml-[2px] px-2 py-1 border border-[#3B4FD8]/30 text-[#3B4FD8] dark:border-[#6C7EF5]/30 dark:text-[#6C7EF5]">
                                                PINNED
                                            </span>
                                        )}
                                        {thread.isFAQ && (
                                            <span className="ml-[2px] px-2 py-1 border border-[#10B981]/30 text-[#10B981] flex items-center gap-2">
                                                <HelpCircle size={12} /> FAQ
                                            </span>
                                        )}
                                    </div>

                                    {/* Title & Preview */}
                                    <h3
                                        onClick={() => setExpandedThreadId(thread._id)}
                                        className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3 cursor-pointer hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                                        style={{ fontFamily: SERIF }}
                                    >
                                        {thread.title}
                                    </h3>
                                    <p className="text-[#1A1D2E]/70 dark:text-[#E8EAF2]/70 text-base line-clamp-2 mb-6 leading-relaxed">
                                        {thread.content}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => setExpandedThreadId(thread._id)}
                                            className="flex items-center gap-2 text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#F7F8FF] dark:hover:bg-[#0A0B10] px-3 py-2 border border-transparent hover:border-[#3B4FD8]/20 dark:hover:border-[#6C7EF5]/20 transition-colors"
                                        >
                                            <MessageCircle size={18} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>{thread.replyCount} COMMENTS</span>
                                        </button>

                                        {isFaculty && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); dispatch(toggleThreadPin(thread._id)); }}
                                                    className={`p-2 border transition-colors ${thread.isPinned ? 'text-[#3B4FD8] border-[#3B4FD8]/30 bg-[#3B4FD8]/5 dark:text-[#6C7EF5] dark:border-[#6C7EF5]/30' : 'text-[#6B7194] dark:text-[#8B90B8] border-transparent hover:border-[#3B4FD8]/20 dark:hover:border-[#6C7EF5]/20'}`}
                                                    title={thread.isPinned ? "Unpin" : "Pin"}
                                                >
                                                    <Pin size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); dispatch(toggleThreadFAQ(thread._id)); }}
                                                    className={`p-2 border transition-colors ${thread.isFAQ ? 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/5' : 'text-[#6B7194] dark:text-[#8B90B8] border-transparent hover:border-[#10B981]/20'}`}
                                                    title={thread.isFAQ ? "Unmark FAQ" : "Mark as FAQ"}
                                                >
                                                    <HelpCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); dispatch(toggleThreadLock(thread._id)); }}
                                                    className={`p-2 border transition-colors ${thread.isLocked ? 'text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/5' : 'text-[#6B7194] dark:text-[#8B90B8] border-transparent hover:border-[#EF4444]/20'}`}
                                                    title={thread.isLocked ? "Unlock" : "Lock"}
                                                >
                                                    <Lock size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete thread?')) dispatch(deleteThread(thread._id)); }}
                                                    className="p-2 border border-transparent text-[#6B7194] dark:text-[#8B90B8] hover:text-[#EF4444] hover:border-[#EF4444]/20 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && hasMore && (
                            <div className="py-8 text-center text-[#6B7194] dark:text-[#8B90B8] text-[10px] font-bold uppercase tracking-widest animate-pulse" style={{ fontFamily: MONO }}>
                                LOADING MORE DISCUSSIONS...
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Selected Thread Detail (or Trending Sidebar if none selected) */}
                <div className={`col-span-1 lg:col-span-4 bg-white dark:bg-[#1A1D2E] border-l border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 ${expandedThreadId ? 'block' : 'hidden lg:block'}`}>
                    {expandedThreadId ? (
                        <ThreadViewer
                            threadId={expandedThreadId}
                            onClose={() => setExpandedThreadId(null)}
                            isFaculty={isFaculty}
                        />
                    ) : (
                        <div className="p-8">
                            <h3 className="text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-6" style={{ fontFamily: MONO }}>
                                COMMUNITY RULES
                            </h3>
                            <div className="space-y-4 text-sm text-[#1A1D2E]/80 dark:text-[#E8EAF2]/80 font-medium">
                                <p className="p-4 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#F7F8FF] dark:bg-[#0A0B10]"><span className="text-[#3B4FD8] font-bold mr-2">01.</span> Be respectful to others.</p>
                                <p className="p-4 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#F7F8FF] dark:bg-[#0A0B10]"><span className="text-[#3B4FD8] font-bold mr-2">02.</span> Keep discussions relevant to the course.</p>
                                <p className="p-4 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#F7F8FF] dark:bg-[#0A0B10]"><span className="text-[#3B4FD8] font-bold mr-2">03.</span> No spam or self-promotion.</p>
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
        <div className="h-full flex flex-col bg-white dark:bg-[#1A1D2E]">
            {/* Header */}
            <div className="p-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 hover:bg-[#F7F8FF] dark:hover:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] rounded-none lg:hidden">
                        <X size={20} />
                    </button>
                    <span className="font-bold text-[10px] uppercase tracking-widest text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: MONO }}>THREAD DETAILS</span>
                </div>
                {thread.isLocked && <span className="text-[10px] font-bold border border-[#EF4444]/30 text-[#EF4444] px-3 py-1 uppercase tracking-widest flex items-center gap-2" style={{ fontFamily: MONO }}><Lock size={12} /> LOCKED</span>}
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {/* OP */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 border border-[#3B4FD8]/20 bg-[#F7F8FF] dark:bg-[#0A0B10] overflow-hidden">
                            {thread.createdBy?.profile?.avatar ? <img src={thread.createdBy.profile.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex justify-center items-center font-bold text-[#3B4FD8] dark:text-[#6C7EF5]">{thread.createdBy?.name?.[0]}</div>}
                        </div>
                        <div>
                            <p className="font-bold text-lg text-[#1A1D2E] dark:text-[#E8EAF2] flex items-center gap-3" style={{ fontFamily: SERIF }}>
                                {thread.createdBy?.name}
                                {thread.createdBy?.role === 'FACULTY' && <span className="border border-[#F5A623] text-[#F5A623] text-[9px] font-bold px-2 py-1 uppercase tracking-widest" style={{ fontFamily: MONO }}>INSTRUCTOR</span>}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mt-1" style={{ fontFamily: MONO }}>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</p>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>{thread.title}</h2>
                    <div className="prose prose-lg dark:prose-invert text-[#1A1D2E]/80 dark:text-[#E8EAF2]/80 leading-relaxed font-medium">
                        {thread.content}
                    </div>
                </div>

                <div className="h-px bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10 my-8" />

                {/* Replies */}
                <div className="space-y-8">
                    {activeThreadReplies.map(reply => (
                        <div key={reply._id} className={`flex gap-4 ${reply.parentReplyId ? 'ml-8 md:ml-12 border-l-2 border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 pl-6' : ''} ${(thread.bestReplyId?._id === reply._id || thread.bestReplyId === reply._id) ? 'bg-[#F2A323]/5 p-6 border border-[#F5A623]/30' : ''}`}>
                            <div className="w-8 h-8 border border-[#3B4FD8]/20 bg-[#F7F8FF] dark:bg-[#0A0B10] shrink-0 overflow-hidden">
                                {reply.createdBy?.profile?.avatar ? (
                                    <img src={reply.createdBy.profile.avatar} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#3B4FD8] dark:text-[#6C7EF5] uppercase" style={{ fontFamily: MONO }}>
                                        {reply.createdBy?.name?.[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-base text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>{reply.createdBy?.name}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>{formatDistanceToNow(new Date(reply.createdAt))} AGO</span>
                                        {(thread.bestReplyId?._id === reply._id || thread.bestReplyId === reply._id) && (
                                            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#F5A623] border border-[#F5A623]/30 bg-[#F5A623]/5 px-2 py-1" style={{ fontFamily: MONO }}>
                                                <Star size={12} fill="currentColor" /> BEST ANSWER
                                            </span>
                                        )}
                                    </div>

                                    {isFaculty && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => dispatch(markBestReply({ threadId: thread._id, replyId: reply._id }))}
                                                className={`p-2 border transition-colors ${(thread.bestReplyId?._id === reply._id || thread.bestReplyId === reply._id) ? 'text-[#F5A623] border-[#F5A623]/30 bg-[#F5A623]/5' : 'text-[#6B7194] border-transparent hover:border-[#F5A623]/30 hover:text-[#F5A623]'}`}
                                                title="Mark as Best Answer"
                                            >
                                                <Star size={16} fill={(thread.bestReplyId?._id === reply._id || thread.bestReplyId === reply._id) ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                onClick={() => { if (window.confirm('Delete reply?')) dispatch(deleteReply(reply._id)); }}
                                                className="p-2 border border-transparent text-[#6B7194] hover:text-[#EF4444] hover:border-[#EF4444]/30 transition-colors"
                                                title="Delete Reply"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-base text-[#1A1D2E]/80 dark:text-[#E8EAF2]/80 mb-4 leading-relaxed font-medium">{reply.content}</p>

                                {/* Reply Action - Hide if locked */}
                                {!thread.isLocked && (
                                    <button
                                        onClick={() => initiateReply(reply)}
                                        className="text-[10px] font-bold text-[#3B4FD8] dark:text-[#6C7EF5] uppercase tracking-widest hover:underline flex items-center gap-2"
                                        style={{ fontFamily: MONO }}
                                    >
                                        REPLY
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reply Box - Conditional Render based on Lock Status */}
            {!thread.isLocked ? (
                <div className="p-6 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#F7F8FF] dark:bg-[#0A0B10]">
                    {replyingTo && (
                        <div className="flex items-center justify-between border border-[#3B4FD8]/20 bg-white dark:bg-[#1A1D2E] px-4 py-3 mb-4 text-[10px] uppercase font-bold tracking-widest" style={{ fontFamily: MONO }}>
                            <span className="text-[#6B7194] dark:text-[#8B90B8]">
                                REPLYING TO <span className="text-[#3B4FD8] dark:text-[#6C7EF5]">{replyingTo.name}</span>
                            </span>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="text-[#6B7194] hover:text-[#1A1D2E] dark:hover:text-[#E8EAF2]"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    <div className="relative">
                        <textarea
                            className="w-full bg-white dark:bg-[#1A1D2E] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none p-4 text-[#1A1D2E] dark:text-[#E8EAF2] focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-all placeholder:text-[#6B7194]/50 pr-16 resize-none"
                            rows="4"
                            placeholder="Write a comment..."
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                        />
                        <button
                            onClick={handleReply}
                            disabled={!replyContent.trim()}
                            className="absolute bottom-4 right-4 p-4 bg-[#3B4FD8] text-white rounded-none hover:bg-[#2f3fab] disabled:opacity-50 transition-colors"
                        >
                            <MessageSquare size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-6 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#F7F8FF] dark:bg-[#0A0B10] text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#EF4444] flex items-center justify-center gap-3" style={{ fontFamily: MONO }}>
                        <Lock size={16} />
                        THIS THREAD HAS BEEN LOCKED BY AN INSTRUCTOR.
                    </p>
                </div>
            )}
        </div>
    );
};

export default DiscussionFullPage;
