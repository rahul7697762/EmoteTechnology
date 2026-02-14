import express from 'express';
import { createApplication, getMyApplications, withdrawApplication, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Candidate (student) routes
router.post('/', restrictTo('STUDENT'), createApplication);
router.get('/my', restrictTo('STUDENT'), getMyApplications);
router.delete('/:id/withdraw', restrictTo('STUDENT'), withdrawApplication);

// Company routes
router.patch('/:id/status', restrictTo('COMPANY', 'ADMIN'), updateApplicationStatus);

export default router;