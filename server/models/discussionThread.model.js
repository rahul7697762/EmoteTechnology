import mongoose from "mongoose";

// todo is this course wise thread or module wise thread 

const discussionThreadSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    repliesCount: {
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

    status: {
        type: String,
        enum: ["ACTIVE", "HIDDEN", "DELETED"],
        default: "ACTIVE"
    },

    deletedAt: Date
}, {
    timestamps: true
});

// INDEXS 
// Course-level discussion listing
discussionThreadSchema.index({ courseId: 1, createdAt: -1 });

// Moderation & pinned threads
discussionThreadSchema.index({ isPinned: 1 });

// Soft delete
discussionThreadSchema.index({ deletedAt: 1 });

export const DiscussionThread = mongoose.model("DiscussionThread", discussionThreadSchema);
