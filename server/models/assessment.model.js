import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        enum: ["QUIZ", "ASSIGNMENT", "CODING"],
        required: true
    },

    description: String,

    timeLimit: {
        type: Number, // minutes
    },

    maxAttempts: {
        type: Number,
        default: 1,
        min: 1
    },

    totalMarks: {
        type: Number,
        required: true
    },

    passingMarks: {
        type: Number,
        required: true
    },

    isMandatory: {
        type: Boolean,
        default: true
    },

    status: {
        type: String,
        enum: ["DRAFT", "PUBLISHED"],
        default: "DRAFT"
    },

    publishedAt: Date,

    deletedAt: Date
}, {
    timestamps: true
});

// INDEX 

// Course-level assessment listing
assessmentSchema.index({ courseId: 1 });

// Module-level assessments
assessmentSchema.index({ moduleId: 1 });

// Student-visible only
assessmentSchema.index({ status: 1 });

// Soft delete
assessmentSchema.index({ deletedAt: 1 });

export const Assessment = mongoose.model("Assessment", assessmentSchema);