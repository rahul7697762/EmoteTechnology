import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
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

    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
        required: true
    },

    subModuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubModule",
        required: true
    },

    watchedDuration: {
        type: Number, // seconds
        default: 0
    },

    lastWatchedTime: {
        type: Number, // seconds
        default: 0
    },

    totalDuration: {
        type: Number, // seconds
        required: true
    },

    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

    lastHeartbeatAt: Date,

<<<<<<< HEAD
=======
    // Segment-based tracking
    // Array of segment indices (e.g., [0, 1, 2] where each is 10s)
    viewedSegments: {
        type: [Number],
        default: []
    },

>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae
    deletedAt: Date
}, {
    timestamps: true
});


/* =======================
   INDEXES
======================= */

// One progress record per user per video
progressSchema.index(
    { userId: 1, subModuleId: 1 },
    { unique: true }
);

// Course progress aggregation
progressSchema.index({ userId: 1, courseId: 1 });

// Resume playback
progressSchema.index({ subModuleId: 1 });

// Analytics & cleanup
progressSchema.index({ updatedAt: -1 });

// Soft delete
progressSchema.index({ deletedAt: 1 });

export default mongoose.model("Progress", progressSchema);
