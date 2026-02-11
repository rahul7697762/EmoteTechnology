import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
    getSubmissions,
    getSubmissionById,
    gradeSubmission,
    submitAssessment,
    getSubmissionsByCourse,
    getSubmissionsByAssessment,
    reviewSubmission,
    getMySubmissions
} from "../controllers/submission.controller.js";

import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Faculty Routes - Get submissions
router.get("/course/:courseId", protect, restrictTo("ADMIN", "FACULTY"), getSubmissionsByCourse);
router.get("/assessment/:assessmentId", protect, restrictTo("ADMIN", "FACULTY"), getSubmissionsByAssessment);
router.get("/:id", protect, restrictTo("ADMIN", "FACULTY"), getSubmissionById);

// Faculty Routes - Grade/Review
router.put("/:id/grade", protect, restrictTo("ADMIN", "FACULTY"), gradeSubmission);
router.patch("/:id/review", protect, restrictTo("ADMIN", "FACULTY"), reviewSubmission);

// Student Route
router.post("/:assessmentId/submit", protect, upload.single('file'), submitAssessment);
router.get("/:assessmentId/my-submissions", protect, getMySubmissions);

export default router;
