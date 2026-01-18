import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    title: {
        type: String,
        trim: true
    },

    comment: {
        type: String,
        trim: true,
        maxlength: 2000
    },

    isVerifiedPurchase: {
        type: Boolean,
        default: true
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


/* =======================
   INDEXES
======================= */

// One review per user per course
reviewSchema.index(
    { userId: 1, courseId: 1 },
    { unique: true }
);

// Course reviews listing
reviewSchema.index({ courseId: 1, createdAt: -1 });

// Rating filter (analytics)
reviewSchema.index({ rating: 1 });

// Moderation
reviewSchema.index({ status: 1 });

// Soft delete
reviewSchema.index({ deletedAt: 1 });

export const Review = mongoose.model("Review", reviewSchema);
