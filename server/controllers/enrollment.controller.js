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

        // 3. Create Enrollment
        // For now, assuming free access or handling payment externally.
        // If course is paid, we would implement payment gateway verify here.
        const enrollment = await Enrollment.create({
            userId,
            courseId,
            accessType: course.price && course.price > 0 ? "PAID" : "FREE",
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
