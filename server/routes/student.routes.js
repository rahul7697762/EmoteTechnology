import express from "express";
import { Enrollment } from "../models/enrollment.model.js";
import { Assessment } from "../models/assessment.model.js";
import Link from "../models/course.model.js";
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
        const courses = enrollments.map(enrollment => {
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

        let upcomingQuizzes = [];

        if (assessments.length > 0) {
            // Format for frontend
            upcomingQuizzes = assessments.map((assessment, index) => {
                // Mock date logic: Future dates based on index
                const mockDate = new Date();
                mockDate.setDate(mockDate.getDate() + (index + 1));

                const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

                return {
                    id: assessment._id,
                    title: assessment.title,
                    month: months[mockDate.getMonth()],
                    day: String(mockDate.getDate()).padStart(2, '0'),
                    time: mockDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    active: index === 0 // First one active
                };
            });
        } else {
            // Fallback mock data for demo if no real assessments exist
            const mockDate = new Date();
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

            upcomingQuizzes = [
                {
                    id: 'mock1',
                    title: 'Mid-term Assessment: Global Economics',
                    month: months[mockDate.getMonth()],
                    day: String(mockDate.getDate() + 2).padStart(2, '0'),
                    time: '10:00 AM',
                    active: true
                },
                {
                    id: 'mock2',
                    title: 'Final Project Submission: React JS',
                    month: months[mockDate.getMonth()],
                    day: String(mockDate.getDate() + 5).padStart(2, '0'),
                    time: '11:59 PM',
                    active: false
                }
            ];
        }

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
<<<<<<< HEAD
                status: enrollment.completed ? 'COMPLETED' : 'ACTIVE',
=======
                status: enrollment.status,
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae
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
        // Fetch completed enrollments
        const enrollments = await Enrollment.find({
            userId: req.user._id,
            completed: true
        })
            .populate("courseId", "title")
            .sort({ updatedAt: -1 });

        const certificates = enrollments.map(enrollment => {
            const course = enrollment.courseId;
            if (!course) return null;

            return {
                id: enrollment._id,
                courseName: course.title,
                issueDate: new Date(enrollment.updatedAt).toLocaleDateString(),
                grade: 95, // Mock grade for now basically random or high score
                url: "#" // Placeholder for actual certificate URL
            };
        }).filter(item => item !== null);

        res.status(200).json({
            success: true,
            data: certificates
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
    // In a real app, calculate this from UserActivity logs
    // For now, return mock data
    const mockData = {
        currentStreak: 4,
        activity: [2, 4, 1, 5, 3, 0, 0] // M, T, W, T, F, S, S (hours or lessons)
    };

    res.status(200).json({
        success: true,
        data: mockData
    });
});

// @desc    Get Student Dashboard Stats
// @route   GET /api/student/dashboard-stats
// @access  Private (Student)
router.get("/dashboard-stats", protect, restrictTo("STUDENT"), async (req, res) => {
    // In a real app, aggregate this from Enrollments, Submissions, and Logged Time
    const mockStats = {
        hoursSpent: 12, // Mocked
        assignments: 4, // Mocked
        goalProgress: 75 // Mocked
    };

    res.status(200).json({
        success: true,
        data: mockStats
    });
});

export default router;
