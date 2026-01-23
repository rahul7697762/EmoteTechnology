import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getDashboardStats, getFacultyCourses, upsertCourse, getCourseDetails } from '../controllers/faculty.controller.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

router.get('/dashboard-stats', getDashboardStats);
router.get('/my-courses', getFacultyCourses);
router.post('/save-course', upsertCourse);
router.get('/course/:id', getCourseDetails);

export default router;
