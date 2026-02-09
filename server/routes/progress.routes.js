
import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
    initializeProgress,
    updateProgress,
    markAsCompleted,
    getVideoProgress,
    getCourseProgress,
    resetProgress
} from "../controllers/progress.controller.js";

const router = Router();

router.use(protect); // All routes require login

router.post("/init", initializeProgress);
router.post("/update", updateProgress); // Heartbeat
router.post("/complete", markAsCompleted); // Manual completion (Article/Video)

router.get("/video/:subModuleId", getVideoProgress);
router.get("/course/:courseId", getCourseProgress);

// Admin/Debug route
router.post("/reset", restrictTo("ADMIN"), resetProgress);

export default router;
