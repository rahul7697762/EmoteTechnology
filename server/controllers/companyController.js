import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { uploadFileToBunny } from '../services/bunny.service.js';
 
const checkProfileCompletion = (company) => {
  const requiredFields = [
    'companyName',
    'industry',
    'location',
    'description',
    'contactEmail'
  ];
 
  const hasRequiredFields = requiredFields.every(field => {
    const value = company[field];
    return value && value.toString().trim() !== '';
  });
 
  const hasLogo = !!(company.logo && company.logo.url);
 
  return hasRequiredFields && hasLogo;
};

export const getProfile = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.userId })
      .populate('user', 'name email');

    if (!company) {
      return res.status(404).json({
        message: 'Company profile not found'
      });
    }

    console.log(`[Company] getProfile for user ${req.userId}: found company ${company._id}`);
    console.log(`[Company] Logo URL in DB: ${company.logo?.url || 'NONE'}`);
    
    const companyObj = company.toObject();
    companyObj.completed = checkProfileCompletion(company);
    
    res.json(companyObj);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const createOrUpdateProfile = async (req, res) => {
  console.log('[Company] createOrUpdateProfile called');
  console.log('[Company] req.body:', JSON.stringify(req.body, null, 2));
  console.log('[Company] req.files:', req.files ? Object.keys(req.files) : 'No files');
  
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

      // Handle logo upload to Bunny CDN
      if (req.files?.logo) {
        try {
          const logo = req.files.logo[0];
          const fileName = `logo-${logo.originalname}`;
          console.log(`[Company] Starting logo upload for company ${company._id}: ${fileName}`);
          
          const url = await uploadFileToBunny("logos", logo.buffer, fileName);
          console.log(`[Company] Logo upload successful: ${url}`);
          
          company.logo = {
            url,
            originalName: logo.originalname,
            size: logo.size,
            mimetype: logo.mimetype
          };
        } catch (uploadError) {
          console.error(`[Company] Logo upload failed for company ${company._id}:`, uploadError.message);
          return res.status(500).json({ message: `Logo upload failed: ${uploadError.message}` });
        }
      }

      // Handle cover image upload to Bunny CDN
      if (req.files?.coverImage) {
        try {
          const coverImage = req.files.coverImage[0];
          const fileName = `cover-${coverImage.originalname}`;
          console.log(`[Company] Starting cover image upload for company ${company._id}: ${fileName}`);
          
          const url = await uploadFileToBunny("covers", coverImage.buffer, fileName);
          console.log(`[Company] Cover image upload successful: ${url}`);
          
          company.coverImage = {
            url,
            originalName: coverImage.originalname,
            size: coverImage.size,
            mimetype: coverImage.mimetype
          };
        } catch (uploadError) {
          console.error(`[Company] Cover image upload failed for company ${company._id}:`, uploadError.message);
          return res.status(500).json({ message: `Cover image upload failed: ${uploadError.message}` });
        }
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

      // Handle file uploads to Bunny CDN for new profile
      if (req.files?.logo) {
        try {
          const logo = req.files.logo[0];
          const fileName = `logo-${logo.originalname}`;
          console.log(`[Company] Starting logo upload for new company: ${fileName}`);
          
          const url = await uploadFileToBunny("logos", logo.buffer, fileName);
          console.log(`[Company] Logo upload successful: ${url}`);
          
          company.logo = {
            url,
            originalName: logo.originalname,
            size: logo.size,
            mimetype: logo.mimetype
          };
        } catch (uploadError) {
          console.error(`[Company] Logo upload failed for new company:`, uploadError.message);
          return res.status(500).json({ message: `Logo upload failed: ${uploadError.message}` });
        }
      }

      if (req.files?.coverImage) {
        try {
          const coverImage = req.files.coverImage[0];
          const fileName = `cover-${coverImage.originalname}`;
          console.log(`[Company] Starting cover image upload for new company: ${fileName}`);
          
          const url = await uploadFileToBunny("covers", coverImage.buffer, fileName);
          console.log(`[Company] Cover image upload successful: ${url}`);
          
          company.coverImage = {
            url,
            originalName: coverImage.originalname,
            size: coverImage.size,
            mimetype: coverImage.mimetype
          };
        } catch (uploadError) {
          console.error(`[Company] Cover image upload failed for new company:`, uploadError.message);
          return res.status(500).json({ message: `Cover image upload failed: ${uploadError.message}` });
        }
      }
    }

    await company.save();
    const companyObj = company.toObject();
    companyObj.completed = checkProfileCompletion(company);

    res.status(company.isNew ? 201 : 200).json({
      message: company.isNew ? 'Company profile created' : 'Company profile updated',
      company: companyObj
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

    // Auto-close expired jobs before returning
    const now = new Date();
    await Job.updateMany(
      { company: company._id, status: 'ACTIVE', deadline: { $lt: now } },
      { $set: { status: 'CLOSED' } }
    );

    // Auto-delete closed jobs that have been past their deadline for 60 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const expiredJobs = await Job.find({ 
      company: company._id, 
      status: 'CLOSED', 
      deadline: { $lt: sixtyDaysAgo } 
    });

    if (expiredJobs.length > 0) {
      const expiredJobIds = expiredJobs.map(job => job._id);
      await Application.deleteMany({ job: { $in: expiredJobIds } });
      await Job.deleteMany({ _id: { $in: expiredJobIds } });
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

    // Auto-close expired jobs before calculating stats
    const now = new Date();
    await Job.updateMany(
      { company: company._id, status: 'ACTIVE', deadline: { $lt: now } },
      { $set: { status: 'CLOSED' } }
    );

    // Auto-delete closed jobs that have been past their deadline for 60 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const expiredJobs = await Job.find({ 
      company: company._id, 
      status: 'CLOSED', 
      deadline: { $lt: sixtyDaysAgo } 
    });

    if (expiredJobs.length > 0) {
      const expiredJobIds = expiredJobs.map(job => job._id);
      await Application.deleteMany({ job: { $in: expiredJobIds } });
      await Job.deleteMany({ _id: { $in: expiredJobIds } });
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