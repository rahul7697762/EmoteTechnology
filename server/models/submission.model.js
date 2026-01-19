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

    answers: [
        {
            questionId: mongoose.Schema.Types.ObjectId,
            answer: mongoose.Schema.Types.Mixed,
            isCorrect: Boolean,
            marksObtained: Number
        }
    ],

    score: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["PASSED", "FAILED"],
        required: true
    },

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
