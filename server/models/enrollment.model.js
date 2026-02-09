import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
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

    accessType: {
        type: String,
        enum: ["FREE", "PAID"],
        required: true
    },

    status: {
        type: String,
        enum: ["ACTIVE", "COMPLETED", "CANCELLED", "REFUNDED"],
        default: "ACTIVE"
    },

    // update when a module is completed
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    completedAt: Date,

    paymentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    },

    enrolledAt: {
        type: Date,
        default: Date.now
    },

    deletedAt: Date
}, {
    timestamps: true
});

/* =======================
   INDEXES
======================= */

// Prevent duplicate enrollment
enrollmentSchema.index(
    { userId: 1, courseId: 1 },
    { unique: true }
);

// User dashboard (My Courses)
enrollmentSchema.index({ userId: 1 });

// Course analytics (enrolled users)
enrollmentSchema.index({ courseId: 1 });

// Filter active enrollments
enrollmentSchema.index({ status: 1 });

// Soft delete
enrollmentSchema.index({ deletedAt: 1 });

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
