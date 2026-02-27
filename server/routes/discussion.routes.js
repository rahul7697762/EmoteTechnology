import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    createThread,
    getCourseThreads,
    getThreadDetails,
    deleteThread,
    toggleThreadPin,
    toggleThreadLock,
    upvoteThread,
    createReply,
    getReplies,
    deleteReply,
    upvoteReply,
    markBestReply,
    toggleThreadFAQ,
    getUnansweredThreads
} from "../controllers/discussion.controller.js";

const router = Router();

// --- THREAD ROUTES ---
router.post('/thread', protect, createThread);
router.get('/course/:courseId', protect, getCourseThreads);
router.get('/thread/:threadId', protect, getThreadDetails);
router.delete('/thread/:id', protect, deleteThread);
router.patch('/thread/:id/pin', protect, toggleThreadPin);
router.patch('/thread/:id/lock', protect, toggleThreadLock);
router.post('/thread/:id/upvote', protect, upvoteThread);

// --- REPLY ROUTES ---
router.post('/reply', protect, createReply);
router.get('/replies/:threadId', protect, getReplies);
router.delete('/reply/:id', protect, deleteReply);
router.post('/reply/:id/upvote', protect, upvoteReply);
router.patch('/thread/:threadId/reply/:replyId/best', protect, markBestReply);

// --- MORE THREAD ROUTES ---
router.patch('/thread/:id/faq', protect, toggleThreadFAQ);
router.get('/course/:courseId/unanswered', protect, getUnansweredThreads);

export default router;
