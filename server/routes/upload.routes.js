import express from 'express';
import { uploadResume, getMyResumes, getResumeById, deleteResume } from '../controllers/resume.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { uploadResume as uploadResumeMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Resume upload routes (for students)
router.post(
  '/resume',
  restrictTo('STUDENT'),
  (req, res, next) => {
    uploadResumeMiddleware(req, res, (err) => {
      if (err) {
        console.error('Multer capture error:', err.message);
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  uploadResume
);

router.get('/resumes', restrictTo('STUDENT'), getMyResumes);
router.get('/resumes/:id', restrictTo('STUDENT'), getResumeById);
router.delete('/resumes/:id', restrictTo('STUDENT'), deleteResume);

export default router;