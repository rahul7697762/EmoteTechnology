import mongoose from "mongoose";

const subModuleSchema = new mongoose.Schema({
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

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    type: {
        type: String,
        enum: ["VIDEO", "ARTICLE", "QUIZ"],
        required: true
    },

    // VIDEO FIELDS
    video: {
        url: String,

        duration: {
            type: Number // seconds
        },

        provider: {
            type: String,
            enum: ["CLOUDINARY", "AWS_S3", "VIMEO", "YOUTUBE"]
        }
    },

    // markdown / html
    content: {
        type: String
    },

    isPreview: {
        type: Boolean,
        default: false
    },

    order: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["DRAFT", "PUBLISHED"],
        default: "DRAFT"
    },

    deletedAt: Date
}, {
    timestamps: true
});

/* =======================
   INDEXES
======================= */

// Fetch submodules for a module (ordered)
subModuleSchema.index(
    { moduleId: 1, order: 1 },
    { unique: true }
);

// Course-wide lookup (progress, analytics)
subModuleSchema.index({ courseId: 1 });

// Only published content for students
subModuleSchema.index({ moduleId: 1, status: 1 });

// Preview content (free lessons)
subModuleSchema.index({ isPreview: 1 });

// Soft delete
subModuleSchema.index({ deletedAt: 1 });

export const SubModule = mongoose.model("SubModule", subModuleSchema);
