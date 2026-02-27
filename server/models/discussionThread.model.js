import mongoose from "mongoose";

const discussionThreadSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    content: {
        type: String,
        required: true,
        maxlength: 5000
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    replyCount: {
        type: Number,
        default: 0
    },

    isPinned: {
        type: Boolean,
        default: false
    },

    isLocked: {
        type: Boolean,
        default: false
    },

    isFAQ: {
        type: Boolean,
        default: false
    },

    bestReplyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiscussionReply",
        default: null
    },

    status: {
        type: String,
        enum: ["ACTIVE", "HIDDEN", "DELETED"],
        default: "ACTIVE"
    }

}, { timestamps: true });

discussionThreadSchema.index({ courseId: 1, createdAt: -1 });
discussionThreadSchema.index({ isPinned: -1 });

export const DiscussionThread = mongoose.model("DiscussionThread", discussionThreadSchema);
