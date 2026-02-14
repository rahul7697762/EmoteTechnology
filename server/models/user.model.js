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
        enum: ["STUDENT", "FACULTY", "ADMIN", "COMPANY"],
        default: "STUDENT"
    },

    profile: {
        avatar: {
            type: String,
            default: null
        },
        title: {
            type: String,
            default: "Student",
            maxlength: 50
        },
        bio: {
            type: String,
            default: "",
            maxlength: 500,
        },
        phone: {
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
        },
        experience: [{
      title: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String
    }],
    education: [{
      school: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      current: Boolean
    }],
     savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  isProfileComplete: {
    type: Boolean,
    default: false
  },
    },

    facultyProfile: {
        category: {
            type: String,
            enum: ["TECH", "NON-TECH", "ASSESSMENT"],
            default: null
        },
        expertise: [String],
        yearsOfExperience: {
            type: Number,
            default: null
        },
        rating: {
            type: Number,
            default: 0,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    companyProfile: {
        companyName: {
            type: String,
            required: function () {
                return this.role === "COMPANY";
            },
            trim: true,
            maxlength: 150
        },

        website: {
            type: String,
            trim: true,
            default: null
        },

        logo: {
            type: String,
            default: null
        },

        industry: {
            type: String,
            trim: true,
            default: null
        },

        companySize: {
            type: String,
            enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
            default: null
        },

        foundedYear: {
            type: Number,
            min: 1800,
            max: new Date().getFullYear(),
            default: null
        },

        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },

        /* ======================
           CONTACT DETAILS
        ====================== */
        contactEmail: {
            type: String,
            trim: true,
            lowercase: true,
            default: null
        },

        contactPhone: {
            type: String,
            trim: true,
            default: null
        },

        /* ======================
           SOCIAL LINKS
        ====================== */
        socialLinks: {
            linkedin: {
                type: String,
                trim: true
            },
            twitter: {
                type: String,
                trim: true
            },
            github: {
                type: String,
                trim: true
            }
        },

        /* ======================
           VERIFICATION
        ====================== */
        isVerified: {
            type: Boolean,
            default: false
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
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

    deletedAt: {
        type: Date,
        default: null
    },
    // to verift email 
    emailVerificationToken: {
        type: String,
        select: false
    },
    emailVerificationTokenExpires: {
        type: Date,
        select: false
    },
    // OPT when user forgets password
    passwordResetOtp: {
        type: String,
        select: false
    },
    // OPT expiry time when user forgets password 
    passwordResetOTPExpires: {
        type: Date,
        select: false
    },
    // reset token and its expiry for password change
    resetToken: {
        type: String,
        select: false
    },
    resetTokenExpiry: {
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