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
// Course content ordering - Unique only for active modules
moduleSchema.index(
    { courseId: 1, order: 1 },
    {
        unique: true,
        partialFilterExpression: { deletedAt: null } // Ignore deleted modules
    }
);

// Filter published modules
moduleSchema.index({ courseId: 1, status: 1 });

// Soft delete
moduleSchema.index({ deletedAt: 1 });

// Virtual for subModules
moduleSchema.virtual('subModules', {
    ref: 'SubModule',
    localField: '_id',
    foreignField: 'moduleId',
    options: { sort: { order: 1 } }
});

// Configure toJSON and toObject
moduleSchema.set('toObject', { virtuals: true });
moduleSchema.set('toJSON', { virtuals: true });

export const Module = mongoose.model("Module", moduleSchema);