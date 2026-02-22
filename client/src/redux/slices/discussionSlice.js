import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async Thunks
export const fetchCourseThreads = createAsyncThunk(
    'discussion/fetchCourseThreads',
    async ({ courseId, page = 1, sort = 'top' }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/discussions/course/${courseId}?page=${page}&sort=${sort}`);
            return { ...response.data, page };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch threads');
        }
    }
);

export const createThread = createAsyncThunk(
    'discussion/createThread',
    async (threadData, { rejectWithValue }) => {
        try {
            const response = await api.post('/discussions/thread', threadData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create thread');
        }
    }
);

export const fetchThreadDetails = createAsyncThunk(
    'discussion/fetchThreadDetails',
    async (threadId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/discussions/thread/${threadId}`);
            // Also fetch replies? The API structure separates them or includes them?
            // backend getThreadDetails returns the thread. We need to fetch replies separately usually alongside.
            // But let's check controller. `getThreadDetails` returns just the thread. 
            // So we might need to dispatch `fetchReplies` separately or handle it here.
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch thread details');
        }
    }
);

export const fetchReplies = createAsyncThunk(
    'discussion/fetchReplies',
    async ({ threadId, page = 1 }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/discussions/replies/${threadId}?page=${page}`);
            return { threadId, replies: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch replies');
        }
    }
);

export const createReply = createAsyncThunk(
    'discussion/createReply',
    async (replyData, { rejectWithValue }) => {
        try {
            const response = await api.post('/discussions/reply', replyData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create reply');
        }
    }
);

export const toggleThreadUpvote = createAsyncThunk(
    'discussion/toggleThreadUpvote',
    async (threadId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/discussions/thread/${threadId}/upvote`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upvote thread');
        }
    }
);



export const deleteThread = createAsyncThunk(
    'discussion/deleteThread',
    async (threadId, { rejectWithValue }) => {
        try {
            await api.delete(`/discussions/thread/${threadId}`);
            return threadId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete thread');
        }
    }
);

export const deleteReply = createAsyncThunk(
    'discussion/deleteReply',
    async (replyId, { rejectWithValue }) => {
        try {
            await api.delete(`/discussions/reply/${replyId}`);
            return replyId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete reply');
        }
    }
);

export const toggleThreadPin = createAsyncThunk(
    'discussion/toggleThreadPin',
    async (threadId, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/discussions/thread/${threadId}/pin`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to pin thread');
        }
    }
);

export const toggleThreadLock = createAsyncThunk(
    'discussion/toggleThreadLock',
    async (threadId, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/discussions/thread/${threadId}/lock`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to lock thread');
        }
    }
);

export const markBestReply = createAsyncThunk(
    'discussion/markBestReply',
    async ({ threadId, replyId }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/discussions/thread/${threadId}/reply/${replyId}/best`);
            return response.data; // This returns the updated Thread object
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark best reply');
        }
    }
);

export const toggleThreadFAQ = createAsyncThunk(
    'discussion/toggleThreadFAQ',
    async (threadId, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/discussions/thread/${threadId}/faq`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle FAQ');
        }
    }
);

export const fetchUnansweredThreads = createAsyncThunk(
    'discussion/fetchUnansweredThreads',
    async ({ courseId, page = 1 }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/discussions/course/${courseId}/unanswered?page=${page}`);
            return { ...response.data, page };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch unanswered threads');
        }
    }
);

export const toggleReplyUpvote = createAsyncThunk(
    'discussion/toggleReplyUpvote',
    async (replyId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/discussions/reply/${replyId}/upvote`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upvote reply');
        }
    }
);


const discussionSlice = createSlice({
    name: 'discussion',
    initialState: {
        threads: [],
        activeThread: null, // The thread currently being viewed
        activeThreadReplies: [],
        totalThreads: 0,
        pages: 1,
        currentPage: 1,
        hasMore: true,
        loading: false,
        error: null,
        replyLoading: false,
        // UI State for Maximized View
        isMaximized: false
    },
    reducers: {
        clearActiveThread: (state) => {
            state.activeThread = null;
            state.activeThreadReplies = [];
        },
        setDiscussionMaximized: (state, action) => {
            state.isMaximized = action.payload;
        },
        resetDiscussionList: (state) => {
            state.threads = [];
            state.currentPage = 1;
            state.hasMore = true;
        }
    },
    extraReducers: (builder) => {
        // Fetch Threads
        builder
            .addCase(fetchCourseThreads.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseThreads.fulfilled, (state, action) => {
                state.loading = false;
                const { threads, total, pages, page } = action.payload;

                if (page === 1) {
                    state.threads = threads;
                } else {
                    // Filter duplicates just in case
                    const newThreads = threads.filter(
                        newThread => !state.threads.some(existing => existing._id === newThread._id)
                    );
                    state.threads = [...state.threads, ...newThreads];
                }

                state.totalThreads = total;
                state.pages = pages;
                state.currentPage = page;
                state.hasMore = page < pages;
            })
            .addCase(fetchCourseThreads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create Thread
        builder
            .addCase(createThread.fulfilled, (state, action) => {
                state.threads.unshift(action.payload); // Add to top
                state.totalThreads += 1;
            });

        // Fetch Thread Details
        builder
            .addCase(fetchThreadDetails.fulfilled, (state, action) => {
                state.activeThread = action.payload;
            });

        // Fetch Replies
        builder
            .addCase(fetchReplies.pending, (state) => {
                state.replyLoading = true;
            })
            .addCase(fetchReplies.fulfilled, (state, action) => {
                state.replyLoading = false;
                state.activeThreadReplies = action.payload.replies;
            })
            .addCase(fetchReplies.rejected, (state) => {
                state.replyLoading = false;
            });

        // Create Reply
        builder
            .addCase(createReply.fulfilled, (state, action) => {
                state.activeThreadReplies.push(action.payload);
                // Also update reply count in active thread if it exists
                if (state.activeThread && state.activeThread._id === action.payload.threadId) {
                    state.activeThread.replyCount = (state.activeThread.replyCount || 0) + 1;
                }
                // Update in list
                const threadInList = state.threads.find(t => t._id === action.payload.threadId);
                if (threadInList) {
                    threadInList.replyCount = (threadInList.replyCount || 0) + 1;
                }
            });

        // Upvotes (Optimistic updates could be done, but for now relying on fulfilled)
        builder.addCase(toggleThreadUpvote.fulfilled, (state, action) => {
            const updatedThread = action.payload;
            // Update in list
            const index = state.threads.findIndex(t => t._id === updatedThread._id);
            if (index !== -1) {
                state.threads[index] = updatedThread;
            }
            // Update active if same
            if (state.activeThread?._id === updatedThread._id) {
                state.activeThread = updatedThread;
            }
        });



        // Delete Thread
        builder.addCase(deleteThread.fulfilled, (state, action) => {
            state.threads = state.threads.filter(t => t._id !== action.payload);
            state.totalThreads -= 1;
            if (state.activeThread?._id === action.payload) {
                state.activeThread = null;
                state.isMaximized = false;
            }
        });

        // Delete Reply
        builder.addCase(deleteReply.fulfilled, (state, action) => {
            state.activeThreadReplies = state.activeThreadReplies.filter(r => r._id !== action.payload);
            if (state.activeThread) {
                state.activeThread.replyCount = Math.max(0, (state.activeThread.replyCount || 0) - 1);
            }
            // Update in list too
            const threadInList = state.threads.find(t => t._id === state.activeThread?._id);
            if (threadInList) {
                threadInList.replyCount = Math.max(0, (threadInList.replyCount || 0) - 1);
            }
        });

        // Toggle Pin/Lock/FAQ/BestReply (Updates Thread)
        // We can group these as they all return the updated thread
        [toggleThreadPin.fulfilled, toggleThreadLock.fulfilled, toggleThreadFAQ.fulfilled, markBestReply.fulfilled].forEach(actionType => {
            builder.addCase(actionType, (state, action) => {
                const updatedThread = action.payload;
                // Update in list
                const index = state.threads.findIndex(t => t._id === updatedThread._id);
                if (index !== -1) {
                    state.threads[index] = updatedThread;
                }
                // Update active if same
                if (state.activeThread?._id === updatedThread._id) {
                    state.activeThread = updatedThread;
                }
            });
        });

        // Fetch Unanswered
        builder.addCase(fetchUnansweredThreads.fulfilled, (state, action) => {
            state.loading = false;
            const { threads, total, pages, page } = action.payload;

            if (page === 1) {
                state.threads = threads;
            } else {
                const newThreads = threads.filter(
                    newThread => !state.threads.some(existing => existing._id === newThread._id)
                );
                state.threads = [...state.threads, ...newThreads];
            }

            state.totalThreads = total;
            state.pages = pages;
            state.currentPage = page;
            state.hasMore = page < pages;
        });
    }
});

export const { clearActiveThread, setDiscussionMaximized, resetDiscussionList } = discussionSlice.actions;
export default discussionSlice.reducer;
