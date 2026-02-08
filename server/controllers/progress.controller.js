
import Progress from "../models/progress.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { SubModule } from "../models/subModule.model.js";
import Course from "../models/course.model.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { tryIssueCertificate } from './certificate.controller.js';

// Helper: Recalculate and update enrollment progress
const recalculateEnrollmentProgress = async (userId, courseId) => {
    // 1. Get all submodules for the course
    const totalSubModules = await SubModule.countDocuments({
        courseId,
        status: "PUBLISHED", // Only count published lessons
        deletedAt: null
    });

    if (totalSubModules === 0) return {
        progressPercentage: 0,
        completedLessons: 0,
        totalLessons: 0,
        isCompleted: false
    };

    // 2. Count completed submodules for the user
    const completedProgress = await Progress.countDocuments({
        userId,
        courseId,
        isCompleted: true
    });

    // 3. Calculate percentage
    const progressPercentage = Math.round((completedProgress / totalSubModules) * 100);

    // 4. Update specific enrollment
    let isCourseCompleted = false;
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (enrollment) {
        enrollment.progressPercentage = progressPercentage;

        // Mark course as completed if 100%
        if (progressPercentage === 100 && enrollment.status !== 'COMPLETED') {
            enrollment.status = 'COMPLETED';
            enrollment.completedAt = new Date();
            isCourseCompleted = true;
        } else if (enrollment.status === 'COMPLETED') {
            isCourseCompleted = true;
        }

        await enrollment.save();
    }

    // 5. Try Issue Certificate
    const certificate = await tryIssueCertificate(userId, courseId);

    return {
        progressPercentage,
        completedLessons: completedProgress,
        totalLessons: totalSubModules,
        isCourseCompleted,
        certificate
    };
};

export const initializeProgress = catchAsync(async (req, res, next) => {
    const { courseId, moduleId, subModuleId } = req.body;
    const userId = req.user.id;

    // Fetch submodule to get duration
    const subModule = await SubModule.findById(subModuleId);
    if (!subModule) {
        return next(new AppError("Submodule not found", 404));
    }

    // Check if progress already exists
    let progress = await Progress.findOne({ userId, subModuleId });

    if (!progress) {
        progress = await Progress.create({
            userId,
            courseId,
            moduleId,
            subModuleId,
            totalDuration: subModule.video?.duration || 0
        });
    }

    res.status(200).json({
        success: true,
        data: progress
    });
});

export const updateProgress = catchAsync(async (req, res, next) => {
    const { subModuleId, watchedDelta, currentTime } = req.body;
    const userId = req.user.id;

    // 1. Get submodule to check type
    const subModule = await SubModule.findById(subModuleId);
    if (!subModule) {
        return next(new AppError("Lesson not found", 404));
    }

    // 2. Only allow heartbeat updates for VIDEO type
    if (subModule.type !== 'VIDEO') {
        return next(new AppError("Heartbeat updates only allowed for video content", 400));
    }

    // 3. Find or create progress (safety net)
    let progress = await Progress.findOne({ userId, subModuleId });

    if (!progress) {
        // Should ideally be initialized first, but handle if missing
        progress = new Progress({
            userId,
            courseId: subModule.courseId,
            moduleId: subModule.moduleId,
            subModuleId,
            totalDuration: subModule.video?.duration || 0
        });
    }

    // 4. Update fields
    const now = new Date();
    const MAX_DELTA = 15; // 15 seconds max allowed per heartbeat
    const MIN_HEARTBEAT_INTERVAL = 3000; // 3 seconds

    // Calculate elapsed time from last heartbeat for throttling
    if (progress.lastHeartbeatAt) {
        const timeSinceLastHeartbeat = now.getTime() - new Date(progress.lastHeartbeatAt).getTime();

        // 4a. Throttle check: Reject if too frequent
        if (timeSinceLastHeartbeat < MIN_HEARTBEAT_INTERVAL) {
            return next(new AppError("Updates are too frequent", 429));
        }
    }

    // 4b. Validate Delta
    const delta = watchedDelta || 0;

    // Reject negative or unrealistically large deltas
    if (delta < 0 || delta > MAX_DELTA) {
        // Silently ignore or warn, but don't crash. For now, clamp it or return error? 
        // User requested "Reject insane deltas" with 400.
        return next(new AppError("Invalid progress delta", 400));
    }

    // 4c. Seek Detection / Continuity Check
    // If currentTime is significantly forward from lastWatchedTime + delta, it was a seek (or cheat).
    // We allow seeking, but we must NOT count the jumped time as watched.
    // The frontend should reset delta on seek, so a large jump with small delta is valid seeking.
    // However, if they send large delta to cover the seek, we blocked it above with MAX_DELTA.
    // So implicit seeking support is already handled by MAX_DELTA cap.

    // 4d. Physics Check: Global Cap
    // progress.watchedDuration cannot exceed (Now - CreatedAt) ideally, but users might re-watch.
    // So we just stick to incremental capping.

    // Update fields
    progress.watchedDuration += delta;
    progress.lastWatchedTime = currentTime;
    progress.lastHeartbeatAt = now;

    // Segment-based Tracking (10s chunks)
    const SEGMENT_SIZE = 10;
    const currentSegment = Math.floor(currentTime / SEGMENT_SIZE);

    // Add current segment if not already watched
    if (!progress.viewedSegments.includes(currentSegment)) {
        progress.viewedSegments.push(currentSegment);
    }

    // Also add previous segment if we just crossed boundary (e.g. 19.9 -> 20.1)
    // This helps with edge cases where updates happen right at boundary
    const prevTime = currentTime - delta;
    const prevSegment = Math.floor(prevTime / SEGMENT_SIZE);
    if (!progress.viewedSegments.includes(prevSegment)) {
        progress.viewedSegments.push(prevSegment);
    }

    let courseProgressStats = null;

    // 5. Calculate completion
    // Cap at 100%
    if (progress.totalDuration > 0) {
        const totalSegments = Math.ceil(progress.totalDuration / SEGMENT_SIZE);
        const watchedSegmentsCount = progress.viewedSegments.length;

        // Calculate percentage based on segments if enough duration, otherwise fallback/mix
        // Using segments is more accurate for "skipping around"
        const percentage = (watchedSegmentsCount / totalSegments) * 100;

        progress.completionPercentage = Math.min(percentage, 100);

        // Mark complete if > 90%
        if (progress.completionPercentage >= 90 && !progress.isCompleted) {
            progress.isCompleted = true;
            await progress.save(); // Save again to update completion status

            // Trigger enrollment sync and capture result
            courseProgressStats = await recalculateEnrollmentProgress(userId, progress.courseId);
        }
    }

    await progress.save();

    res.status(200).json({
        success: true,
        data: {
            completionPercentage: progress.completionPercentage,
            isCompleted: progress.isCompleted,
            // Include overall stats if available (meaning lesson just completed)
            ...courseProgressStats
        }
    });
});

export const markAsCompleted = catchAsync(async (req, res, next) => {
    const { subModuleId } = req.body;
    const userId = req.user.id;

    const subModule = await SubModule.findById(subModuleId);
    if (!subModule) {
        return next(new AppError("Lesson not found", 404));
    }

    let progress = await Progress.findOne({ userId, subModuleId });

    if (!progress) {
        progress = new Progress({
            userId,
            courseId: subModule.courseId,
            moduleId: subModule.moduleId,
            subModuleId,
            totalDuration: 0 // Articles/Files might have 0 duration
        });
    }

    // Force completion
    progress.isCompleted = true;
    progress.completionPercentage = 100;
    progress.lastHeartbeatAt = new Date();

    await progress.save();

    // Update Course Level Progress and get stats
    const courseProgressStats = await recalculateEnrollmentProgress(userId, progress.courseId);

    res.status(200).json({
        success: true,
        message: "Lesson marked as completed",
        data: {
            ...progress.toObject(),
            ...courseProgressStats
        }
    });
});

export const getVideoProgress = catchAsync(async (req, res, next) => {
    const { subModuleId } = req.params;
    const userId = req.user.id;

    const progress = await Progress.findOne({ userId, subModuleId });

    if (!progress) {
        return res.status(200).json({
            success: true,
            data: {
                lastWatchedTime: 0,
                isCompleted: false
            }
        });
    }

    res.status(200).json({
        success: true,
        data: {
            lastWatchedTime: progress.lastWatchedTime,
            isCompleted: progress.isCompleted,
            completionPercentage: progress.completionPercentage
        }
    });
});

export const getCourseProgress = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Get enrollment for cached percentage
    const enrollment = await Enrollment.findOne({ userId, courseId });

    // Get detailed breakdown
    const completedLessons = await Progress.countDocuments({
        userId,
        courseId,
        isCompleted: true
    });

    const totalLessons = await SubModule.countDocuments({
        courseId,
        status: 'PUBLISHED',
        deletedAt: null
    });

    res.status(200).json({
        success: true,
        data: {
            progressPercentage: enrollment?.progressPercentage || 0,
            completedLessons,
            totalLessons,
            isCompleted: enrollment?.status === 'COMPLETED'
        }
    });
});

export const resetProgress = catchAsync(async (req, res, next) => {
    const { courseId } = req.body;
    const userId = req.user.id; // Or from body if admin

    // Delete all progress for course
    await Progress.deleteMany({ userId, courseId });

    // Reset enrollment
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (enrollment) {
        enrollment.progressPercentage = 0;
        enrollment.status = 'ACTIVE';
        enrollment.completedAt = undefined;
        await enrollment.save();
    }

    res.status(200).json({
        success: true,
        message: "Course progress reset successfully"
    });
});
