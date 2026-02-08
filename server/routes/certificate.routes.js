import express from 'express';
import {
    getMyCertificates,
    getCertificateByCourse,
    verifyCertificate,
    manualIssue
} from '../controllers/certificate.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public verification
router.get('/verify/:certificateNumber', verifyCertificate);

// Protected Routes
router.use(protect);

router.get('/me', getMyCertificates);
router.get('/course/:courseId', getCertificateByCourse);

// Admin Only
router.post('/issue', restrictTo('ADMIN', 'INSTRUCTOR'), manualIssue);

export default router;
