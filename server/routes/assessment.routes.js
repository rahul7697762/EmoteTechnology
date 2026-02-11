import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
    createAssessment,
    getAssessmentForFaculty,
    getAssessmentById,
    updateAssessment,
    deleteAssessment,
    togglePublishStatus,
    getAssessmentForStudent,
    addQuestion,
    updateQuestion,
    deleteQuestion
} from "../controllers/assessment.controller.js";

import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Assessment CRUD (Faculty/Admin)
router.post("/", protect, restrictTo("ADMIN", "FACULTY"), upload.single('questionPdf'), createAssessment);
router.get("/module/:moduleId", protect, restrictTo("ADMIN", "FACULTY"), getAssessmentForFaculty);
router.get("/:id", protect, restrictTo("ADMIN", "FACULTY"), getAssessmentById);
router.put("/:id", protect, restrictTo("ADMIN", "FACULTY"), upload.single('questionPdf'), updateAssessment);
router.patch("/:id/publish", protect, restrictTo("ADMIN", "FACULTY"), togglePublishStatus);
router.delete("/:id", protect, restrictTo("ADMIN", "FACULTY"), deleteAssessment);

// Student Route
router.get("/module/:moduleId/attempt", protect, getAssessmentForStudent);

// Questions CRUD
router.post("/:assessmentId/questions", protect, restrictTo("ADMIN", "FACULTY"), addQuestion);
router.put("/questions/:id", protect, restrictTo("ADMIN", "FACULTY"), updateQuestion);
router.delete("/questions/:id", protect, restrictTo("ADMIN", "FACULTY"), deleteQuestion);

export default router;
