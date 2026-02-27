
import { Review } from "../models/review.model.js";
import Course from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";

/**
 * @route   POST /api/reviews
 * @desc    Create a new review for a course
 * @access  Private - Student (Enrolled)
 */
export const createReview = async (req, res) => {
    try {
        const { courseId, rating, title, comment } = req.body;
        const userId = req.user._id;

        // 1. Check if user is enrolled
        const enrollment = await Enrollment.findOne({
            courseId,
            userId,
            status: 'ACTIVE'
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You must be enrolled in this course to leave a review."
            });
        }

        // 2. Check removed: Students can write multiple reviews.        // 3. Create Review
        const review = await Review.create({
            userId,
            courseId,
            rating,
            title,
            comment
        });

        // 4. Update Course Rating Stats
        const stats = await Review.aggregate([
            { $match: { courseId: review.courseId, status: "ACTIVE" } },
            {
                $group: {
                    _id: '$courseId',
                    averageRating: { $avg: '$rating' },
                    numReviews: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await Course.findByIdAndUpdate(courseId, {
                rating: {
                    average: stats[0].averageRating,
                    count: stats[0].numReviews
                }
            });
        }

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review
        });

    } catch (error) {
        console.log("error in createReview controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * @route   GET /api/reviews/course/:courseId
 * @desc    Get reviews for a specific course
 * @access  Public
 */
export const getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ courseId, status: "ACTIVE" })
            .populate('userId', 'name profile.avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ courseId, status: "ACTIVE" });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log("error in getCourseReviews controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * @route   GET /api/reviews/check/:courseId
 * @desc    Check if current user has reviewed a course
 * @access  Private
 */
export const checkReviewStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const reviews = await Review.find({ courseId, userId });

        res.status(200).json({
            success: true,
            hasReviewed: reviews.length > 0,
            reviews
        });
    } catch (error) {
        console.log("error in checkReviewStatus controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
