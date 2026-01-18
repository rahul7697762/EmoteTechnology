import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: String,
        enum: [
            "COURSE_UPDATE",
            "NEW_MODULE",
            "ASSESSMENT_PUBLISHED",
            "DISCUSSION_REPLY",
            "CERTIFICATE_ISSUED",
            "SYSTEM"
        ],
        required: true
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    /* =======================
       CONTEXT / DEEP LINKING
    ======================= */
    metadata: {
        courseId: mongoose.Schema.Types.ObjectId,
        moduleId: mongoose.Schema.Types.ObjectId,
        subModuleId: mongoose.Schema.Types.ObjectId,
        threadId: mongoose.Schema.Types.ObjectId
    },

    isRead: {
        type: Boolean,
        default: false
    },

    readAt: Date,

    deliveryChannels: {
        inApp: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        push: { type: Boolean, default: false }
    },

    deletedAt: Date
}, {
    timestamps: true
});

/* =======================
   INDEXES
======================= */

// User inbox (most common query)
notificationSchema.index({ userId: 1, createdAt: -1 });

// Unread count badge
notificationSchema.index({ userId: 1, isRead: 1 });

// Cleanup & moderation
notificationSchema.index({ deletedAt: 1 });

// Type-based analytics
notificationSchema.index({ type: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);
