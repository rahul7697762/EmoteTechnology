import Application from '../models/application.model.js';
import Job from '../models/job.model.js';
import Resume from '../models/resume.model.js';
import Company from '../models/company.model.js';

export const createApplication = async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is accepting applications
    if (job.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Job is no longer accepting applications'
      });
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: job._id,
      candidate: req.userId
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Create application
    const application = await Application.create({
      job: job._id,
      candidate: req.userId,
      resume: req.body.resumeId,
      coverLetter: req.body.coverLetter,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      linkedin: req.body.linkedin,
      portfolio: req.body.portfolio,
      answers: req.body.answers,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        source: 'web'
      }
    });

    // Update job application count
    job.applicationCount += 1;
    if (!job.metadata) {
      job.metadata = {
        lastApplicationAt: new Date()
      };
    } else {
      job.metadata.lastApplicationAt = new Date();
    }
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.userId })
      .populate('job', 'title company location jobType salaryMin salaryMax')
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'companyName logo'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId });

    if (!company) {
      return res.status(403).json({
        success: false,
        message: 'Company profile required'
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if company owns the job
    if (application.job.company.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.status = req.body.status;
    if (req.body.notes) {
      application.notes = req.body.notes;
    }
    if (req.body.rating) {
      application.rating = req.body.rating;
    }
    if (req.body.interviewDate) {
      application.interviewDate = req.body.interviewDate;
    }
    if (req.body.feedback) {
      application.feedback = req.body.feedback;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      candidate: req.userId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw application in current status'
      });
    }

    await application.deleteOne();

    // Update job application count
    await Job.findByIdAndUpdate(application.job, {
      $inc: { applicationCount: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};