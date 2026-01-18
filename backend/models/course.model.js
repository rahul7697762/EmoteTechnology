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
        index: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    thumbnail: String,
    previewVideoUrl: String,

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

    rejectionReason: String


}, {
    timestamps: true,
});



/* =======================
INDEXES
======================= */

// Unique & SEO
courseSchema.index({ slug: 1 }, { unique: true });

// Browsing & filtering
courseSchema.index({ category: 1 });
courseSchema.index({ tags: 1 });

// Faculty dashboard
courseSchema.index({ createdBy: 1 });

// Sorting
courseSchema.index({ "rating.average": -1 });

/* =======================
HOOKS & VIRTUALS
======================= */

// Auto-generate slug
courseSchema.pre("validate", function (next) {
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
  next();
});
// Ensure unique slug
courseSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  let uniqueSlug = this.slug;
  let counter = 1;

  while (await mongoose.models.Course.exists({ slug: uniqueSlug })) {
    uniqueSlug = `${this.slug}-${counter}`;
    counter++;
  }

  this.slug = uniqueSlug;
  next();
});

// Final price after discount
courseSchema.virtual("finalPrice").get(function () {
    return this.price - (this.price * this.discount) / 100;
});


export const Course = mongoose.model("Course", courseSchema);