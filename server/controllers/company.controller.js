import Company from '../models/company.model.js';
import Job from '../models/job.model.js';
import Application from '../models/application.model.js';

export const getProfile = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId })
      .populate('user', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

export const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      companyName,
      tagline,
      description,
      website,
      industry,
      size,
      founded,
      location,
      headquarters,
      contactEmail,
      contactPhone,
      socialLinks,
      benefits,
      techStack,
      hiringManager
    } = req.body;

    // Check if profile exists
    let company = await Company.findOne({ user: req.userId });
    const isNew = !company;

    if (company) {
      // Update existing profile
      if (companyName !== undefined) company.companyName = companyName;
      if (tagline !== undefined) company.tagline = tagline;
      if (description !== undefined) company.description = description;
      if (website !== undefined) company.website = website;
      if (industry !== undefined) company.industry = industry;
      if (size !== undefined) company.size = size;
      if (founded !== undefined) company.founded = founded;
      if (location !== undefined) company.location = location;
      if (headquarters !== undefined) company.headquarters = headquarters;
      if (contactEmail !== undefined) company.contactEmail = contactEmail;
      if (contactPhone !== undefined) company.contactPhone = contactPhone;

      if (socialLinks) {
        company.socialLinks = {
          ...company.socialLinks,
          ...JSON.parse(socialLinks)
        };
      }

      if (benefits) {
        company.benefits = JSON.parse(benefits);
      }

      if (techStack) {
        company.techStack = JSON.parse(techStack);
      }

      if (hiringManager) {
        company.hiringManager = JSON.parse(hiringManager);
      }

      // Handle logo upload
      if (req.files?.logo) {
        const logo = req.files.logo[0];
        company.logo = {
          url: logo.location || `/uploads/${logo.filename}`,
          originalName: logo.originalname,
          size: logo.size,
          mimetype: logo.mimetype
        };
      }

      // Handle cover image upload
      if (req.files?.coverImage) {
        const coverImage = req.files.coverImage[0];
        company.coverImage = {
          url: coverImage.location || `/uploads/${coverImage.filename}`,
          originalName: coverImage.originalname,
          size: coverImage.size,
          mimetype: coverImage.mimetype
        };
      }
    } else {
      // Create new profile
      company = new Company({
        user: req.userId,
        companyName,
        tagline,
        description,
        website,
        industry,
        size,
        founded,
        location,
        headquarters,
        contactEmail,
        contactPhone,
        socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
        benefits: benefits ? JSON.parse(benefits) : [],
        techStack: techStack ? JSON.parse(techStack) : [],
        hiringManager: hiringManager ? JSON.parse(hiringManager) : {}
      });

      // Handle file uploads
      if (req.files?.logo) {
        const logo = req.files.logo[0];
        company.logo = {
          url: logo.location || `/uploads/${logo.filename}`,
          originalName: logo.originalname,
          size: logo.size,
          mimetype: logo.mimetype
        };
      }

      if (req.files?.coverImage) {
        const coverImage = req.files.coverImage[0];
        company.coverImage = {
          url: coverImage.location || `/uploads/${coverImage.filename}`,
          originalName: coverImage.originalname,
          size: coverImage.size,
          mimetype: coverImage.mimetype
        };
      }
    }

    await company.save();

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? 'Company profile created' : 'Company profile updated',
      company
    });
  } catch (error) {
    console.error('Create or update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const jobs = await Job.find({ company: company._id })
      .sort({ createdAt: -1 })
      .populate('company', 'companyName logo');

    res.status(200).json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

export const getCompanyStats = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    // Get job statistics
    const jobs = await Job.find({ company: company._id });

    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.status === 'ACTIVE').length,
      totalApplications: 0,
      pendingApplications: 0
    };

    // Get application statistics
    for (const job of jobs) {
      const applications = await Application
        .find({ job: job._id });

      stats.totalApplications += applications.length;
      stats.pendingApplications += applications.filter(app =>
        app.status === 'PENDING').length;
    }

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get company stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};