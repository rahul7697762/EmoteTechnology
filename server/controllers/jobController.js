import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';

export const createJob = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId });

    if (!company) {
      return res.status(403).json({
        message: 'Company profile required to post jobs'
      });
    }

    const jobData = {
      ...req.body,
      company: company._id
    };

    // Parse tags if string
    if (typeof jobData.tags === 'string') {
      jobData.tags = JSON.parse(jobData.tags);
    }

    // Parse application questions if string
    if (jobData.applicationQuestions && typeof jobData.applicationQuestions === 'string') {
      jobData.applicationQuestions = JSON.parse(jobData.applicationQuestions);
    }

    const job = await Job.create(jobData);

    // Increment company's job count
    company.totalJobsPosted += 1;
    await company.save();

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      experienceLevel,
      minSalary,
      remote,
      sort = 'newest'
    } = req.query;

    const query = { status: 'ACTIVE', visibility: 'PUBLIC' };

    // Build search query
    if (search) {
      query.$text = { $search: search };
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (experienceLevel && experienceLevel !== 'All') {
      query.experienceLevel = experienceLevel;
    }

    if (minSalary) {
      query.salaryMin = { $gte: Number(minSalary) };
    }

    if (remote === 'true') {
      query.remote = true;
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'salary-high') sortOption = { salaryMax: -1 };
    if (sort === 'salary-low') sortOption = { salaryMin: 1 };
    if (sort === 'applicants-low') sortOption = { applicationCount: 1 };
    if (sort === 'applicants-high') sortOption = { applicationCount: -1 };

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('company', 'companyName logo location')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Job.countDocuments(query)
    ]);

    // Check if job is still active (not past deadline)
    const activeJobs = jobs.filter(job => {
      if (job.deadline && new Date(job.deadline) < new Date()) {
        return false;
      }
      return true;
    });

    res.json({
      jobs: activeJobs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('savedBy', 'name');

    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // Increment view count
    job.views += 1;
    if (!job.metadata) {
      job.metadata = { lastViewedAt: new Date() };
    } else {
      job.metadata.lastViewedAt = new Date();
    }

    try {
      await job.save();
    } catch (saveError) {
      console.error('Non-blocking error saving job metadata:', saveError.message);
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId });

    if (!company) {
      return res.status(403).json({
        message: 'Company profile required'
      });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      company: company._id
    });

    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const closeJob = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId });

    if (!company) {
      return res.status(403).json({
        message: 'Company profile required'
      });
    }

    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        company: company._id
      },
      { status: 'CLOSED' },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    res.json({
      message: 'Job closed successfully',
      job
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId });

    if (!company) {
      return res.status(403).json({
        message: 'Company profile required'
      });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      company: company._id
    });

    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    const { status, search } = req.query;
    const query = { job: job._id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Application.find(query)
      .populate('candidate', 'name email profile')
      .populate('resume')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};