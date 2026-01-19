import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },

    role: {
        type: String,
        enum: ["STUDENT", "FACULTY", "ADMIN"],
        default: "STUDENT"
    },

    profile: {
        avatar:{
            type: String,
            default: null
        },
        bio: {
            type: String,
            default: "",
            maxlength: 500,
        },
        phone:{
            type: String,
            default: null
        },
        country: {
            type: String,
            default: null
        },
        timezone: {
            type: String,
            default: null
        }
    },

    facultyProfile: {
        category: {
            type: String,
            enum: ["TECH", "NON-TECH", "ASSESSMENT"],
        },
        expertise: [String],
        yearsOfExperience: Number,
        rating: {
            type: Number,
            default: 0,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },

    isVerified: {
        type: Boolean,
        default: false
    },


    accountStatus: {
        type: String,
        enum: ["ACTIVE", "SUSPENDED", "DEACTIVATED"],
        default: "ACTIVE"
    },

    lastLoginAt: {
        type: Date,
        default: null
    },

    deletedAt:{
        type: Date,
    },

    emailVerificationToken:{
        type: String,
        select: false
    },
    passwordResetOtp:{
        type: String,
        select: false
    },
    passwordResetOTPExpires:{
        type: Date,
        select: false
    },

}, {
    timestamps: true
}
);

/* =======================
   INDEXES
======================= */

// Auth & identity
userSchema.index({ email: 1, accountStatus: 1 });

// RBAC & moderation
userSchema.index({ role: 1 });
userSchema.index({ accountStatus: 1 });

// Faculty management
userSchema.index({ "facultyProfile.isApproved": 1 });
userSchema.index({ "facultyProfile.category": 1 });

// Analytics
userSchema.index({ lastActiveAt: -1 });

// Soft delete
userSchema.index({ deletedAt: 1 });

// Search
userSchema.index({
    name: "text",
    "facultyProfile.expertise": "text"
});


const User = mongoose.model("User", userSchema);
export default User;