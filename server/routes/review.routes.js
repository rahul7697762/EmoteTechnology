
import express from 'express';
import { createReview, getCourseReviews, checkReviewStatus } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/course/:courseId', getCourseReviews);

// Protected routes
router.post('/', protect, createReview);
router.get('/check/:courseId', protect, checkReviewStatus);

export default router;
