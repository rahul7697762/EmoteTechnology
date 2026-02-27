import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  tagline: String,
  description: {
    type: String,
    required: true
  },
  website: String,
  industry: {
    type: String,
    required: true
  },
  size: String,
  founded: Number,
  location: {
    type: String,
    required: true
  },
  headquarters: String,
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: String,
  logo: {
    url: String,
    publicId: String,
    originalName: String,
    size: Number,
    mimetype: String
  },
  coverImage: {
    url: String,
    publicId: String,
    originalName: String,
    size: Number,
    mimetype: String
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  benefits: [String],
  techStack: [String],
  hiringManager: {
    name: String,
    email: String,
    phone: String,
    role: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  totalJobsPosted: {
    type: Number,
    default: 0
  },
  stats: {
    totalApplications: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search
companySchema.index({
  companyName: 'text',
  description: 'text',
  industry: 'text',
  location: 'text'
});

const Company = mongoose.model('Company', companySchema);
export default Company;