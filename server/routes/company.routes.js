import express from 'express';
import { getProfile, createOrUpdateProfile, getCompanyJobs, getCompanyStats } from '../controllers/companyController.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { uploadCompanyFiles } from '../middleware/upload.middleware.js';

const router = express.Router();

// All routes require authentication and company role
router.use(protect);
router.use(restrictTo('COMPANY', 'ADMIN'));

// Company profile routes
router.get('/profile', getProfile);
router.post(
  '/profile',
  uploadCompanyFiles,
  createOrUpdateProfile
);

// Company job routes
router.get('/jobs', getCompanyJobs);
router.get('/stats', getCompanyStats);

export default router;