import mongoose from "mongoose";
import slugify from "slugify";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    // Human-readable identifier for course (SEO friendly)
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    thumbnail: String,
    previewVideo: String,

    category: {
        type: String,
        required: true,
        enum: ["TECH", "NON-TECH", "ASSESSMENT", "SOFT-SKILLS", "LANGUAGES", "BUSINESS"]
    },

    tags: [String],

    level: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
        default: "BEGINNER"
    },

    language: {
        type: String,
        default: "English"
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    currency: {
        type: String,
        enum: ["USD", "EUR", "INR"],
        required: true,
        default: "USD"
    },

    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
    }],

    totalDuration: {
        type: Number,
        default: 0
    },

    totalLectures: {
        type: Number,
        default: 0
    },

    requirements: [String],
    learningOutcomes: [String],

    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },

    publishedAt: Date,

    enrolledCount: {
        type: Number,
        default: 0
    },

    certificateEnabled: {
        type: Boolean,
        default: true
    },

    status: {
        type: String,
        enum: ["DRAFT", "UNDER_REVIEW", "PUBLISHED", "REJECTED"],
        default: "DRAFT"
    },

<<<<<<< HEAD
    rejectionReason: String
=======
    rejectionReason: String,

    deletedAt: Date
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae


}, {
    timestamps: true,
<<<<<<< HEAD
=======
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae
});



/* =======================
INDEXES
======================= */


// Browsing & filtering
courseSchema.index({ category: 1 });
courseSchema.index({ tags: 1 });
<<<<<<< HEAD
=======
courseSchema.index({ deletedAt: 1 }); // Soft delete index
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae

// Sorting
courseSchema.index({ "rating.average": -1 });

/* =======================
HOOKS & VIRTUALS
======================= */

// Auto-generate slug
courseSchema.pre("validate", async function () {
    if (!this.slug) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");

        const baseSlug = slugify(this.title, {
            lower: true,
            strict: true
        });

        this.slug = `${baseSlug}-${year}-${month}`;
    }
});
// Ensure unique slug
courseSchema.pre("save", async function () {
    if (!this.isNew) return;

    let uniqueSlug = this.slug;
    let counter = 1;

    while (await mongoose.models.Course.exists({ slug: uniqueSlug })) {
        uniqueSlug = `${this.slug}-${counter}`;
        counter++;
    }

    this.slug = uniqueSlug;
});

// Final price after discount
courseSchema.virtual("finalPrice").get(function () {
    return this.price - (this.price * this.discount) / 100;
});


const Course = mongoose.model("Course", courseSchema);
export default Course;
