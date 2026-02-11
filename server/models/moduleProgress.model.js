import mongoose from "mongoose";

const moduleProgressSchema = new mongoose.Schema({
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

    isCompleted: {
        type: Boolean,
        default: false
    },

    completedAt: Date,

    // Optional: caching assessment status here for quick access
    assessmentPassed: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

// Indexes for quick lookup
moduleProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });
moduleProgressSchema.index({ userId: 1, courseId: 1 });

export const ModuleProgress = mongoose.model("ModuleProgress", moduleProgressSchema);
