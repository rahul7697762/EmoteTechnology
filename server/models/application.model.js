import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  coverLetter: String,
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  linkedin: String,
  portfolio: String,
  status: {
    type: String,
    enum: ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'],
    default: 'PENDING'
  },
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  interviewDate: Date,
  feedback: String,
  answers: [{
    question: String,
    answer: String
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: String
  }
}, {
  timestamps: true
});

// Index for quick queries
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ candidate: 1, createdAt: -1 });
applicationSchema.index({ job: 1, status: 1, createdAt: -1 });
applicationSchema.index({ status: 1, createdAt: -1 });

// Pre-save to check for existing application
applicationSchema.pre('save', async function (next) {
  const existing = await this.constructor.findOne({
    job: this.job,
    candidate: this.candidate
  });

  if (existing && existing._id.toString() !== this._id.toString()) {
    const error = new Error('You have already applied to this job');
    error.status = 409;
    return next(error);
  }
  next();
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;