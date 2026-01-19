import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    order: {
        type: Number,
        required: true
    },

    subModulesCount: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["DRAFT", "PUBLISHED"],
        default: "DRAFT"
    },

    deletedAt: Date

}, {
    timestamps: true,
})


/* =======================
   INDEXES
======================= */

// Course content ordering
moduleSchema.index(
    { courseId: 1, order: 1 },
    { unique: true }
);

// Filter published modules
moduleSchema.index({ courseId: 1, status: 1 });

// Soft delete
moduleSchema.index({ deletedAt: 1 });

export const Module = mongoose.model("Module", moduleSchema);