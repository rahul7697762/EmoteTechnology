import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getProfile = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId })
      .populate('user', 'name email');

    if (!company) {
      return res.status(404).json({ 
        message: 'Company profile not found' 
      });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
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

    if (company) {
      // Update existing profile
      company.companyName = companyName || company.companyName;
      company.tagline = tagline || company.tagline;
      company.description = description || company.description;
      company.website = website || company.website;
      company.industry = industry || company.industry;
      company.size = size || company.size;
      company.founded = founded || company.founded;
      company.location = location || company.location;
      company.headquarters = headquarters || company.headquarters;
      company.contactEmail = contactEmail || company.contactEmail;
      company.contactPhone = contactPhone || company.contactPhone;
      
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

    res.status(company.isNew ? 201 : 200).json({
      message: company.isNew ? 'Company profile created' : 'Company profile updated',
      company
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId });
    
    if (!company) {
      return res.status(404).json({ 
        message: 'Company profile not found' 
      });
    }

    const jobs = await Job.find({ company: company._id })
      .sort({ createdAt: -1 })
      .populate('company', 'companyName logo');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const getCompanyStats = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId });
    
    if (!company) {
      return res.status(404).json({ 
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

    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};