import mongoose from "mongoose";
import { DiscussionThread } from "../models/discussionThread.model.js";
import { DiscussionReply } from "../models/discussionReply.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import Course from "../models/course.model.js";

// Check enrollment helper
const checkEnrollment = async (userId, courseId, role) => {
    if (role === 'ADMIN' || role === 'FACULTY') return true;

    // Also allow if the user is the creator of the course (for faculty who might not be "enrolled")
    const course = await Course.findById(courseId);
    if (!course) return false;

    if (course.instructor.toString() === userId.toString() || course.createdBy.toString() === userId.toString()) {
        return true;
    }

    const enrollment = await Enrollment.findOne({
        userId,
        courseId,
        status: { $in: ["ACTIVE", "COMPLETED"] }
    });
    return !!enrollment;
};

// --- THREADS ---

export const createThread = async (req, res) => {
    try {
        const { courseId, title, content } = req.body;
        const userId = req.user._id;

        const isEnrolled = await checkEnrollment(userId, courseId, req.user.role);
        if (!isEnrolled) {
            return res.status(403).json({ message: "You must be enrolled in this course to post." });
        }

        const thread = await DiscussionThread.create({
            courseId,
            title,
            content,
            createdBy: userId
        });

        res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseThreads = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { page = 1, limit = 10, sort = 'latest' } = req.query;

        // Verify course access (optional, but good practice)
        // For public courses or previews, we might relax this, but sticking to logic: // Or user middleware handles it.
        // Assuming middleware or basic check is sufficient for now or reuse checkEnrollment if exported.
        // For now, let's proceed with finding threads.

        const skip = (page - 1) * limit;

        let sortStage = {};
        if (sort === 'top') {
            sortStage = { upvotesCount: -1, createdAt: -1 };
        } else {
            // Default to latest
            sortStage = { createdAt: -1 };
        }

        const pipeline = [
            { $match: { courseId: new mongoose.Types.ObjectId(courseId), status: "ACTIVE" } },
            {
                $addFields: {
                    upvotesCount: { $size: { $ifNull: ["$upvotes", []] } },
                    // Ensure isPinned is a boolean for sorting, treating missing/null as false
                    isPinnedBool: { $ifNull: ["$isPinned", false] }
                }
            },
            { $sort: { isPinnedBool: -1, ...sortStage } },
            { $skip: Number(skip) },
            { $limit: Number(limit) },
            // Lookup createdBy details
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy"
                }
            },
            { $unwind: "$createdBy" },
            // Project necessary fields to match standard populate output + upvotesCount if needed (internal)
            {
                $project: {
                    _id: 1,
                    courseId: 1,
                    title: 1,
                    content: 1,
                    upvotes: 1,
                    replyCount: 1,
                    isPinned: 1,
                    isLocked: 1,
                    isFAQ: 1,
                    bestReplyId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "createdBy._id": 1,
                    "createdBy.name": 1,
                    "createdBy.profile.avatar": 1,
                    "createdBy.role": 1
                }
            }
        ];

        const threads = await DiscussionThread.aggregate(pipeline);

        const total = await DiscussionThread.countDocuments({ courseId, status: "ACTIVE" });

        res.json({
            threads,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


export const getThreadDetails = async (req, res) => {
    try {
        const { threadId } = req.params;

        const thread = await DiscussionThread.findById(threadId)
            .populate("createdBy", "name profile.avatar")
            .populate({
                path: "bestReplyId",
                populate: { path: "createdBy", select: "name profile.avatar" }
            });

        if (!thread) {
            return res.status(404).json({ message: "Thread not found" });
        }

        // Check enrollment via thread's courseId
        const isEnrolled = await checkEnrollment(req.user._id, thread.courseId, req.user.role);
        if (!isEnrolled) {
            return res.status(403).json({ message: "Not authorized." });
        }

        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteThread = async (req, res) => {
    try {
        const { id } = req.params;
        const thread = await DiscussionThread.findById(id);

        if (!thread) {
            return res.status(404).json({ message: "Thread not found" });
        }

        // Allow owner, admin, or course instructor
        const isOwner = thread.createdBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "ADMIN";
        // Check if faculty is instructor of the course
        const course = await Course.findById(thread.courseId);
        const isInstructor = course && (course.instructor.toString() === req.user._id.toString());

        if (!isOwner && !isAdmin && !isInstructor) {
            return res.status(403).json({ message: "Not authorized to delete this thread." });
        }

        thread.status = "DELETED";
        await thread.save();

        res.json({ message: "Thread deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleThreadPin = async (req, res) => {
    try {
        const { id } = req.params;
        // Only Faculty/Admin
        if (req.user.role !== "FACULTY" && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Not authorized." });
        }

        const thread = await DiscussionThread.findById(id);
        if (!thread) return res.status(404).json({ message: "Thread not found" });

        thread.isPinned = !thread.isPinned;
        await thread.save();

        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleThreadLock = async (req, res) => {
    try {
        const { id } = req.params;
        // Only Faculty/Admin
        if (req.user.role !== "FACULTY" && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Not authorized." });
        }

        const thread = await DiscussionThread.findById(id);
        if (!thread) return res.status(404).json({ message: "Thread not found" });

        thread.isLocked = !thread.isLocked;
        await thread.save();

        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const upvoteThread = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const thread = await DiscussionThread.findById(id);
        if (!thread) return res.status(404).json({ message: "Thread not found" });

        const isEnrolled = await checkEnrollment(userId, thread.courseId, req.user.role);
        if (!isEnrolled) return res.status(403).json({ message: "Not authorized." });

        const index = thread.upvotes.indexOf(userId);
        if (index === -1) {
            thread.upvotes.push(userId);
        } else {
            thread.upvotes.splice(index, 1);
        }

        await thread.save();
        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- REPLIES ---

export const createReply = async (req, res) => {
    try {
        const { threadId, parentReplyId, content } = req.body;
        const userId = req.user._id;

        const thread = await DiscussionThread.findById(threadId);
        if (!thread) return res.status(404).json({ message: "Thread not found" });

        if (thread.isLocked || thread.status !== 'ACTIVE') {
            return res.status(400).json({ message: "Thread is locked or not active." });
        }

        const isEnrolled = await checkEnrollment(userId, thread.courseId, req.user.role);
        if (!isEnrolled) return res.status(403).json({ message: "Not authorized." });

        const reply = await DiscussionReply.create({
            threadId,
            parentReplyId: parentReplyId || null,
            content,
            createdBy: userId
        });

        // Increment reply count
        await DiscussionThread.findByIdAndUpdate(threadId, { $inc: { replyCount: 1 } });

        // Populate creator for immediate frontend display
        await reply.populate("createdBy", "name profile.avatar");

        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReplies = async (req, res) => {
    try {
        const { threadId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const skip = (page - 1) * limit;

        // This fetches linear list. Nested structure usually handled by building tree on client or recursive population.
        // For simplicity and scalability, fetching linear and constructing tree on client is often better.
        // Or we can just fetch top level replies (parentReplyId: null) and their children?
        // Current requirement: "Paginated replies". We'll fetch all matching filters.

        const replies = await DiscussionReply.find({ threadId, status: "ACTIVE" })
            .populate("createdBy", "name profile.avatar")
            .sort({ createdAt: 1 }) // Chronological order usually best for discussions
            .skip(skip)
            .limit(Number(limit));

        res.json(replies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReply = async (req, res) => {
    try {
        const { id } = req.params;
        const reply = await DiscussionReply.findById(id);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        const isOwner = reply.createdBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "ADMIN";
        // Check instructor
        const thread = await DiscussionThread.findById(reply.threadId);
        const course = await Course.findById(thread.courseId);
        const isInstructor = course && (course.instructor.toString() === req.user._id.toString());

        if (!isOwner && !isAdmin && !isInstructor) {
            return res.status(403).json({ message: "Not authorized." });
        }

        reply.status = "DELETED";
        await reply.save();

        // Decrement reply count
        await DiscussionThread.findByIdAndUpdate(thread._id, { $inc: { replyCount: -1 } });

        res.json({ message: "Reply deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const upvoteReply = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const reply = await DiscussionReply.findById(id);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        // Check enrollment (via thread)
        const thread = await DiscussionThread.findById(reply.threadId);
        const isEnrolled = await checkEnrollment(userId, thread.courseId, req.user.role);
        if (!isEnrolled) return res.status(403).json({ message: "Not authorized." });

        const index = reply.upvotes.indexOf(userId);
        if (index === -1) {
            reply.upvotes.push(userId);
        } else {
            reply.upvotes.splice(index, 1);
        }

        await reply.save();
        res.json(reply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const markBestReply = async (req, res) => {
    try {
        const { threadId, replyId } = req.params;

        const thread = await DiscussionThread.findById(threadId);
        if (!thread) return res.status(404).json({ message: "Thread not found" });

        // Check if user is FACULTY, ADMIN, or Thread Creator
        const isFaculty = req.user.role === 'FACULTY';
        const isAdmin = req.user.role === 'ADMIN';
        const isCreator = thread.createdBy.toString() === req.user._id.toString();

        if (!isFaculty && !isAdmin && !isCreator) {
            return res.status(403).json({ message: "Not authorized to mark best answer." });
        }

        // If toggling off
        if (thread.bestReplyId && thread.bestReplyId.toString() === replyId) {
            thread.bestReplyId = null;
        } else {
            thread.bestReplyId = replyId;
        }

        await thread.save();

        // Populate details for return
        await thread.populate("bestReplyId");

        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleThreadFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== "FACULTY" && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Not authorized." });
        }

        const thread = await DiscussionThread.findById(id);
        if (!thread) return res.status(404).json({ message: "Thread not found" });

        thread.isFAQ = !thread.isFAQ;
        await thread.save();

        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUnansweredThreads = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const isEnrolled = await checkEnrollment(req.user._id, courseId, req.user.role);
        if (!isEnrolled) {
            return res.status(403).json({ message: "Not authorized." });
        }

        // Unanswered = 0 replies OR no best answer? Usually 0 replies.
        // Let's filter by replyCount = 0
        const query = { courseId, status: "ACTIVE", replyCount: 0 };

        const skip = (page - 1) * limit;

        const threads = await DiscussionThread.find(query)
            .populate("createdBy", "name profile.avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await DiscussionThread.countDocuments(query);

        res.json({
            threads,
            total,
            pages: Math.ceil(total / limit)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
