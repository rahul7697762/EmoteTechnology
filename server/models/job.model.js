import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  responsibilities: String,
  benefits: String,
  salaryMin: Number,
  salaryMax: Number,
  salaryCurrency: {
    type: String,
    default: 'USD'
  },
  location: {
    type: String,
    required: true
  },
  remote: {
    type: Boolean,
    default: false
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Temporary', 'Volunteer'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['Intern', 'Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [String],
  deadline: Date,
  applicationInstructions: String,
  hiringProcess: String,
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },
  applicationQuestions: [String],
  showQuestions: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['PUBLIC', 'UNLISTED', 'DRAFT'],
    default: 'PUBLIC'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'CLOSED', 'FILLED', 'DRAFT'],
    default: 'ACTIVE'
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  metadata: {
    type: {
      lastApplicationAt: Date,
      lastViewedAt: Date
    },
    default: {}
  }
}, {
  timestamps: true,
  minimize: false // Ensure empty metadata object is saved
});

// Index for search and filtering
jobSchema.index({
  title: 'text',
  description: 'text',
  requirements: 'text',
  location: 'text',
  tags: 'text'
});

jobSchema.index({ company: 1, createdAt: -1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ jobType: 1, experienceLevel: 1, location: 1, salaryMin: 1, salaryMax: 1 });

// Virtual for isActive
jobSchema.virtual('isActive').get(function () {
  if (this.status !== 'ACTIVE') return false;
  if (this.deadline && new Date(this.deadline) < new Date()) return false;
  return true;
});

const Job = mongoose.model('Job', jobSchema);
export default Job;