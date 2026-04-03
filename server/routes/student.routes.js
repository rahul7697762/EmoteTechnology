import express from "express";
import { Enrollment } from "../models/enrollment.model.js";
import { Assessment } from "../models/assessment.model.js";
import Link from "../models/course.model.js";
import Progress from "../models/progress.model.js";
import { Submission } from "../models/submission.model.js";
import { Certificate } from "../models/certificate.model.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

// @desc    Get In-Progress Courses for Student
// @route   GET /api/student/in-progress-courses
// @access  Private (Student)
router.get("/in-progress-courses", protect, restrictTo("STUDENT"), async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            userId: req.user._id,
            status: "ACTIVE"
        })
            .populate({
                path: "courseId",
                select: "title thumbnail level slug" // Select necessary fields
            })
            .sort({ updatedAt: -1 }); // Recently accessed first

        // Format for frontend
        const courses = enrollments
            .filter(enrollment => enrollment.courseId)
            .map(enrollment => {
                const course = enrollment.courseId;
                return {
                    _id: course._id,
                    title: course.title,
                    thumbnail: course.thumbnail,
                    progress: enrollment.progressPercentage,
                    lastAccessed: new Date(enrollment.updatedAt).toLocaleDateString(), // Simple formatting
                    status: enrollment.progressPercentage > 80 ? "High Priority" : "On Track", // Simple logic
                    color: "teal", // Default color
                    active: true,
                    actionText: "Resume Learning"
                };
            });

        res.status(200).json({
            success: true,
            data: courses
        });

    } catch (error) {
        console.error("Error fetching in-progress courses:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch in-progress courses"
        });
    }
});

// @desc    Get Upcoming Quizzes for Student
// @route   GET /api/student/upcoming-quizzes
// @access  Private (Student)
router.get("/upcoming-quizzes", protect, restrictTo("STUDENT"), async (req, res) => {
    try {
        // 1. Get user enrollments
        const enrollments = await Enrollment.find({
            userId: req.user._id,
            status: "ACTIVE"
        });

        const courseIds = enrollments.map(e => e.courseId);

        // 2. Find assessments for these courses
        // Note: In a real app, we would query based on a specific schedule/dueDate. 
        // Since Assessment model currently has 'publishedAt' but not a specific 'dueDate' for the student,
        // we will mock the "upcoming" logic by fetching recent assessments and projecting a future date for demo.

        const assessments = await Assessment.find({
            courseId: { $in: courseIds },
            status: "PUBLISHED"
        })
            .limit(5)
            .populate("courseId", "title");

        const submittedAssessments = await Submission.find({ userId: req.user._id }).select('assessmentId');
        const submittedIds = submittedAssessments.map(s => s.assessmentId.toString());

        const pendingAssessments = assessments.filter(a => !submittedIds.includes(a._id.toString()));

        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        const upcomingQuizzes = pendingAssessments.map((assessment, index) => {
            const date = assessment.publishedAt || assessment.createdAt || new Date();
            
            return {
                id: assessment._id,
                title: assessment.title,
                month: months[date.getMonth()],
                day: String(date.getDate()).padStart(2, '0'),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                active: index === 0
            };
        });

        res.status(200).json({
            success: true,
            data: upcomingQuizzes
        });
    } catch (error) {
        console.error("Error fetching upcoming quizzes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch quizzes"
        });
    }
});

// @desc    Get All Enrolled Courses for Student
// @route   GET /api/student/enrolled-courses
// @access  Private (Student)
router.get("/enrolled-courses", protect, restrictTo("STUDENT"), async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            userId: req.user._id
        })
            .populate({
                path: "courseId",
                select: "title thumbnail level slug lessons" // Select necessary fields
            })
            .sort({ updatedAt: -1 });

        const courses = enrollments.map(enrollment => {
            const course = enrollment.courseId;
            // Handle case where course might be deleted
            if (!course) return null;

            return {
                _id: course._id,
                title: course.title,
                thumbnail: course.thumbnail,
                progress: enrollment.progressPercentage,
                status: enrollment.status,
                totalLessons: course.lessons ? course.lessons.length : 0,
                lastAccessed: enrollment.updatedAt
            };
        }).filter(item => item !== null);

        res.status(200).json({
            success: true,
            data: courses
        });

    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled courses"
        });
    }
});

// @desc    Get Student Certificates
// @route   GET /api/student/certificates
// @access  Private (Student)
router.get("/certificates", protect, restrictTo("STUDENT"), async (req, res) => {
    try {
        const certificates = await Certificate.find({ userId: req.user._id, status: "ACTIVE" })
            .populate("courseId", "title slug")
            .sort({ issuedAt: -1 });

        const formattedCertificates = certificates.map(cert => {
            const course = cert.courseId;
            if (!course) return null;

            return {
                id: cert._id,
                courseName: course.title,
                issueDate: new Date(cert.issuedAt).toLocaleDateString(),
                grade: 100, // Using max grade as placeholder
                url: cert.certificateUrl
            };
        }).filter(item => item !== null);

        res.status(200).json({
            success: true,
            data: formattedCertificates
        });

    } catch (error) {
        console.error("Error fetching certificates:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch certificates"
        });
    }
});



// @desc    Get Student Weekly Streak
// @route   GET /api/student/weekly-streak
// @access  Private (Student)
router.get("/weekly-streak", protect, restrictTo("STUDENT"), async (req, res) => {
    try {
        const progressRecords = await Progress.find({ userId: req.user._id }).select('createdAt updatedAt');
        const enrollments = await Enrollment.find({ userId: req.user._id }).select('createdAt updatedAt');
        const submissions = await Submission.find({ userId: req.user._id }).select('createdAt updatedAt');

        const oneDay = 24 * 60 * 60 * 1000;
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        const activeDays = new Set();
        const activityCounts = {};

        // Helper to process dates
        const processDate = (dateField) => {
            if (!dateField) return;
            const date = new Date(dateField);
            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            activeDays.add(startOfDay);
            activityCounts[startOfDay] = (activityCounts[startOfDay] || 0) + 1;
        };

        // Combine all activity to generate a dense log
        [...progressRecords, ...enrollments, ...submissions].forEach(record => {
            processDate(record.createdAt);
            processDate(record.updatedAt);
        });

        // Calculate current streak
        let currentStreak = 0;
        let dayToCheck = startOfToday;
        
        // If no activity today, check yesterday
        if (!activeDays.has(dayToCheck)) {
            // Keep streak alive if they had activity yesterday
            if (activeDays.has(dayToCheck - oneDay)) {
                dayToCheck = dayToCheck - oneDay;
                currentStreak++;
                dayToCheck -= oneDay;
            } else {
                currentStreak = 0;
            }
        } else {
            // Activity today
            currentStreak++;
            dayToCheck -= oneDay;
        }

        while (currentStreak > 0 && activeDays.has(dayToCheck)) {
            currentStreak++;
            dayToCheck -= oneDay;
        }

        // Calculate last 7 days activity layout [Day-6, Day-5, ... Today]
        const activity = [0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            const dayStart = startOfToday - ((6 - i) * oneDay);
            activity[i] = activityCounts[dayStart] || 0;
        }

        res.status(200).json({
            success: true,
            data: {
                currentStreak,
                activity
            }
        });
    } catch (error) {
        console.error("Error calculating weekly streak:", error);
        res.status(500).json({
            success: false,
            message: "Failed to calculate weekly streak"
        });
    }
});

// @desc    Get Student Dashboard Stats
// @route   GET /api/student/dashboard-stats
// @access  Private (Student)
router.get("/dashboard-stats", protect, restrictTo("STUDENT"), async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Calculate hours spent (Sum watchedDuration from Progress)
        const progressRecords = await Progress.find({ userId });
        const totalSeconds = progressRecords.reduce((acc, curr) => acc + (curr.watchedDuration || 0), 0);
        const hoursSpent = Math.max(0, Math.floor(totalSeconds / 3600));

        // 2. Calculate assignments completed
        const assignments = await Submission.countDocuments({ userId });

        // 3. Goal progress: average progress of active enrollments
        const activeEnrollments = await Enrollment.find({ userId, status: "ACTIVE" });
        let totalProgress = 0;
        if (activeEnrollments.length > 0) {
            totalProgress = activeEnrollments.reduce((acc, curr) => acc + (curr.progressPercentage || 0), 0);
            totalProgress = Math.floor(totalProgress / activeEnrollments.length);
        }

        const realStats = {
            hoursSpent,
            assignments,
            goalProgress: totalProgress
        };

        res.status(200).json({
            success: true,
            data: realStats
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats"
        });
    }
});

export default router;
