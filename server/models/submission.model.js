import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true
    },

    attemptNumber: {
        type: Number,
        required: true
    },

    // For Quiz
    answers: [
        {
            questionId: mongoose.Schema.Types.ObjectId,
            answer: mongoose.Schema.Types.Mixed,
            isCorrect: Boolean,
            marksObtained: Number
        }
    ],

    // For PDF
    pdfUrl: String,

    submissionType: {
        type: String,
        enum: ["QUIZ", "PDF"],
        required: true
    },

    score: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["PENDING_REVIEW", "PASSED", "FAILED"],
        required: true,
        default: "PENDING_REVIEW"
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    reviewedAt: Date,

    evaluatedAt: Date,

    submittedAt: {
        type: Date,
        default: Date.now
    },

    deletedAt: Date
}, {
    timestamps: true
});

// INDEXS 
// User attempts per assessment
submissionSchema.index(
    { userId: 1, assessmentId: 1, attemptNumber: 1 },
    { unique: true }
);

// Check attempts count
submissionSchema.index({ userId: 1, assessmentId: 1 });

// Analytics
submissionSchema.index({ assessmentId: 1 });

// Soft delete
submissionSchema.index({ deletedAt: 1 });

export const Submission = mongoose.model("Submission", submissionSchema);
