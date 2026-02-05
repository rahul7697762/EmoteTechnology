import express from "express";
import { enrollInCourse } from "../controllers/enrollment.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, restrictTo("STUDENT"), enrollInCourse);

export default router;