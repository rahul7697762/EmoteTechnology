import Resume from '../models/Resume.js';
import fs from 'fs';
import path from 'path';
import { uploadJobFileToBunny } from '../services/bunny.service.js';

// Ensure upload directories exist (for local fallbacks like logos/avatars)
const uploadDirs = [
  'uploads',
  'uploads/resumes',
  'uploads/logos',
  'uploads/covers',
  'uploads/avatars'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: 'Only PDF and DOC/DOCX files are allowed'
      });
    }

    // Validate file size (10MB - sync with middleware)
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        message: 'File size must be less than 10MB'
      });
    }

    // Upload to Bunny CDN using the shared service
    // Pass 'resumes' as the folder name
    const bunnyResult = await uploadJobFileToBunny(req.file, 'resumes');

    // Check for existing resumes (optional: deactivate old ones)
    const existingResume = await Resume.findOne({
      user: req.userId,
      isActive: true
    });

    if (existingResume) {
      existingResume.isActive = false;
      await existingResume.save();
    }

    // Create resume record with Bunny CDN URL
    const resume = await Resume.create({
      user: req.userId,
      originalName: req.file.originalname,
      fileName: path.basename(bunnyResult.url),
      filePath: bunnyResult.url, // Store CDN URL as path for compatibility
      fileUrl: bunnyResult.url,
      size: req.file.size, // Use size from the request file object
      mimetype: req.file.mimetype
    });

    // TODO: Parse resume content (you can integrate with a resume parsing service)

    res.status(201).json({
      message: 'Resume uploaded successfully to Bunny CDN',
      resume
    });
  } catch (error) {
    console.error('Resume upload crash:', error);
    res.status(500).json({
      message: 'Server error during CDN upload',
      error: error.message,
      stack: error.stack
    });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found'
      });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!resume) {
      return res.status(404).json({
        message: 'Resume not found'
      });
    }

    // For Bunny CDN, you might want to call a delete function if implemented
    // For now, we just delete the database record
    await resume.deleteOne();

    res.json({
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};