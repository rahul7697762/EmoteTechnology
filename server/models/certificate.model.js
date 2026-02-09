<<<<<<< HEAD
=======
import mongoose from 'mongoose';

>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae
const certificateSchema = new mongoose.Schema({
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

    certificateNumber: {
        type: String,
        required: true,
        unique: true
    },

    verificationHash: {
        type: String,
        required: true,
        unique: true
    },

    certificateUrl: {
        type: String,
        required: true
    },

    issuedAt: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["ACTIVE", "REVOKED"],
        default: "ACTIVE"
    },

    revokedAt: Date,
    revokedReason: String
}, {
    timestamps: true
});


/* =======================
   INDEXES
======================= */

// One certificate per user per course
certificateSchema.index(
    { userId: 1, courseId: 1 },
    { unique: true }
);

// Public verification
<<<<<<< HEAD
certificateSchema.index({ certificateNumber: 1 });
certificateSchema.index({ verificationHash: 1 });
=======
// certificateSchema.index({ certificateNumber: 1 }); // Already indexed by schema definition
// certificateSchema.index({ verificationHash: 1 }); // Already indexed by schema definition
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae

// Revocation lookup
certificateSchema.index({ status: 1 });

export const Certificate = mongoose.model('Certificate', certificateSchema);