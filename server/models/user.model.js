import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

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
        avatar: String,
        bio: {
            type: String,
            default: "",
            maxlength: 500,
        },
        phone: String,
        country: String,
        timezone: String,
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

    deletedAt: Date,

    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

}, {
    timestamps: true
}
);

/* =======================
   PASSWORD METHODS
======================= */

// Hash password before saving
userSchema.pre('save', async function () {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return;
    }

    // Check if password exists
    if (!this.password) {
        throw new Error('Password is required');
    }

    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


/* =======================
   INDEXES
======================= */

// Auth & identity
userSchema.index({ email: 1 }, { unique: true });
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