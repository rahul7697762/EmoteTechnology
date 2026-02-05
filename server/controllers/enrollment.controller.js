import { Enrollment } from "../models/enrollment.model.js";
import Course from "../models/course.model.js";

// @desc    Enroll in a course
// @route   POST /api/enrollment
// @access  Private (Student)
export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user._id;

        // 1. Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // 2. Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this course"
            });
        }

        if (course.price && course.price > 0) {
            return res.status(400).json({
                success: false,
                message: "This is a paid course. Please complete payment to enroll."
            });
        }

        // 3. Create Enrollment (Free only)
        const enrollment = await Enrollment.create({
            userId,
            courseId,
            accessType: "FREE",
            status: "ACTIVE",
            progressPercentage: 0
        });

        // 4. Update Course student count (optional but good for stats)
        // await Course.findByIdAndUpdate(courseId, { $inc: { studentsEnrolled: 1 } });

        res.status(201).json({
            success: true,
            message: "Successfully enrolled in course",
            data: enrollment
        });

    } catch (error) {
        console.error("Enrollment error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to enroll in course"
        });
    }
};
