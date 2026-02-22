import express from 'express';
import { createJob, getAllJobs, getJobById, updateJob, closeJob, getJobApplications } from '../controllers/job.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes
router.use(protect);

// Company routes
router.post('/', restrictTo('COMPANY', 'ADMIN'), createJob);
router.put('/:id', restrictTo('COMPANY', 'ADMIN'), updateJob);
router.patch('/:id/close', restrictTo('COMPANY', 'ADMIN'), closeJob);
router.get('/:id/applications', restrictTo('COMPANY', 'ADMIN'), getJobApplications);

export default router;