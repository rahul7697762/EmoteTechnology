import mongoose from "mongoose";
import Course from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { uploadFileToBunny, deleteFileFromBunny } from "../services/bunny.service.js";
import { Review } from "../models/review.model.js";


/**
 * @route   POST /api/courses/
 * @desc    creating a new course
 * @access  Private - FACULTY | ADMIN
 */
export const createCourse = async (req, res) => {
    try {
        // getting user and destructuring course data
        const user = req.user;
        const {
            title, description, level, language, currency,
            discount, tags, requirements, learningOutcomes,
            certificateEnabled, price, category, instructor
        } = req.body;

        // uploading thumbnail and preview video to bunny CDN
        let thumbnailUrl = "";
        let previewVideoUrl = "";

        if (req.files) {
            // uploading thumbnail
            if (req.files.thumbnail && req.files.thumbnail[0]) {
                const thumbnailFile = req.files.thumbnail[0];
                const fileName = `thumbnail-${Date.now()}-${thumbnailFile.originalname}`;
                thumbnailUrl = await uploadFileToBunny("thumbnails", thumbnailFile.buffer, fileName);
            }

            // uploading preview video
            if (req.files.previewVideo && req.files.previewVideo[0]) {
                const videoFile = req.files.previewVideo[0];
                const fileName = `video-${Date.now()}-${videoFile.originalname}`;
                previewVideoUrl = await uploadFileToBunny("video", videoFile.buffer, fileName);
            }
        }

        // creating course
        const courseData = {
            title,
            description,
            category,
            price,
            instructor: instructor || user._id,
            createdBy: user._id,

            thumbnail: thumbnailUrl,
            previewVideo: previewVideoUrl,
            level,
            language,
            currency,
            discount: discount || 0,
            tags: tags || [],
            requirements: requirements || [],
            learningOutcomes: learningOutcomes || [],
            certificateEnabled: certificateEnabled !== undefined ? certificateEnabled : true,
        };

        // saving course
        const course = await Course.create(courseData);

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        });

    } catch (error) {
        console.log("error in createCourse controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   GET /api/courses/faculty/:id
 * @desc    get courses by id for faculty and admin
 * @access  Private - FACULTY | ADMIN
 */
export const getFacultyCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findOne({ _id: courseId, deletedAt: null })
            .populate('instructor', 'name profile.avatar facultyProfile.expertize')
            .populate({
                path: 'modules',
                match: { deletedAt: null },
                options: { sort: { order: 1 } },
                populate: {
                    path: 'subModules',
                    match: { deletedAt: null },
                    options: { sort: { order: 1 } }
                }
            });

        // if course not found then return 404
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        console.log("error in getFacultyCourseById controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   GET /api/courses/faculty/my-courses
 * @desc    get courses created by the logged-in faculty
 * @access  Private - FACULTY | ADMIN
 */
export const getFacultyCourses = async (req, res) => {
    try {
        const userId = req.user._id;
        const courses = await Course.find({ createdBy: userId, deletedAt: null }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            courses
        });
    } catch (error) {
        console.log("error in getInstructorCourses controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course details, thumbnail, and preview video
 * @access  Private - FACULTY (Owner) | ADMIN
 */
export const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const {
            title, description, level, language, currency,
            discount, tags, requirements, learningOutcomes,
            certificateEnabled, price, category
        } = req.body;

        let course = await Course.findOne({ _id: courseId, deletedAt: null });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Check ownership (or admin)
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: "Not authorized to update this course" });
        }

        // Handle File Uploads
        let thumbnailUrl = course.thumbnail;
        let previewVideoUrl = course.previewVideo;

        if (req.files) {
            // Update thumbnail
            if (req.files.thumbnail && req.files.thumbnail[0]) {
                // Delete old thumbnail if exists
                if (course.thumbnail) {
                    try {
                        const oldThumbnailPath = new URL(course.thumbnail).pathname.substring(1);
                        await deleteFileFromBunny(oldThumbnailPath);
                    } catch (error) {
                        console.log("Error deleting old thumbnail:", error);
                        // Continue even if delete fails
                    }
                }

                const thumbnailFile = req.files.thumbnail[0];
                const fileName = `thumbnail-${Date.now()}-${thumbnailFile.originalname}`;
                thumbnailUrl = await uploadFileToBunny("thumbnails", thumbnailFile.buffer, fileName);
            }

            // Update preview video
            if (req.files.previewVideo && req.files.previewVideo[0]) {
                // Delete old video if exists
                if (course.previewVideo) {
                    try {
                        const oldVideoPath = new URL(course.previewVideo).pathname.substring(1);
                        await deleteFileFromBunny(oldVideoPath);
                    } catch (error) {
                        console.log("Error deleting old video:", error);
                        // Continue even if delete fails
                    }
                }

                const videoFile = req.files.previewVideo[0];
                const fileName = `video-${Date.now()}-${videoFile.originalname}`;
                previewVideoUrl = await uploadFileToBunny("video", videoFile.buffer, fileName);
            }
        }

        // Prepare update object
        const updateData = {
            title, description, level, language, currency,
            discount, tags, requirements, learningOutcomes,
            certificateEnabled, price, category,
            thumbnail: thumbnailUrl,
            previewVideo: previewVideoUrl
        };


        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);


        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        console.log("error in updateCourse controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


/**
 * @route   PATCH /api/courses/:id/status
 * @desc    Change course status (e.g., Submit for Review)
 * @access  Private - FACULTY (Owner) | ADMIN
 */
export const updateCourseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user._id;

        let course = await Course.findOne({ _id: id, deletedAt: null });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (course.instructor.toString() !== userId.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        // Validation logic for transitions can go here

        course.status = status;
        await course.save();

        res.status(200).json({
            success: true,
            message: `Course status updated to ${status}`,
            course
        });

    } catch (error) {
        console.log("error in updateCourseStatus controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course (Faculty Owner)
 * @access  Private - FACULTY (Owner)
 */
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const course = await Course.findOne({ _id: id, deletedAt: null });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (course.instructor.toString() !== userId.toString() && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: "Not authorized to delete this course" });
        }

        // Check for enrollments before deleting?
        if (course.enrolledCount > 0) {
            return res.status(400).json({ success: false, message: "Cannot delete course with enrolled students. Contact Admin." });
        }

        // Soft delete
        await Course.findByIdAndUpdate(id, { deletedAt: new Date() });

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (error) {
        console.log("error in deleteCourse controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   GET /api/courses/
 * @desc    get all courses which are published and user can access
 * @access  Public
 */

export const getAllCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const courses = await Course.find({ status: "PUBLISHED", deletedAt: null })
            .select('title description category price instructor createdAt thumbnail slug rating level currency discount')
            .populate('instructor', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Course.countDocuments({ status: "PUBLISHED", deletedAt: null });

        res.status(200).json({
            success: true,
            courses,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log("error in getAllCourses controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   GET /api/courses/:id
 * @desc    get course by id
 * @access  Public
 */
export const getCourseById = async (req, res) => {
    try {
        // getting course id or slug from req params
        const { id } = req.params;

        let query = {};
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id, status: "PUBLISHED", deletedAt: null };
        } else {
            query = { slug: id, status: "PUBLISHED", deletedAt: null };
        }

        // getting course by id or slug
        let course = await Course.findOne(query)
            .populate('instructor', 'name profile.avatar facultyProfile.expertize')
            .populate({
                path: 'modules',
                match: { deletedAt: null, status: 'PUBLISHED' }, // Filter out deleted and draft modules
                select: 'title subModulesCount order',
                options: { sort: { order: 1 } },
                populate: {
                    path: 'subModules',
                    match: { deletedAt: null, status: 'PUBLISHED' }, // Filter out deleted and draft subModules
                    select: 'title type isPreview video content', // Fetch potential content
                    options: { sort: { order: 1 } }
                }
            }).lean(); // Use lean to get plain JS object for modification

        // Security & Access Control
        let isEnrolled = false;

        // Check enrollment if user is logged in
        if (req.user) {
            // Check if user is the instructor or admin (full access)
            if (req.user.role === 'ADMIN' || (course.instructor && course.instructor._id.toString() === req.user._id.toString())) {
                isEnrolled = true;
            } else {
                // Check if student is enrolled
                const enrollment = await Enrollment.findOne({
                    courseId: course._id,
                    userId: req.user._id,
                    status: 'ACTIVE'
                });
                if (enrollment) isEnrolled = true;
            }
        }

        // Scrub video/content from locked lessons ONLY if not enrolled
        if (!isEnrolled && course.modules) {
            course.modules.forEach(module => {
                if (module.subModules) {
                    module.subModules.forEach(subModule => {
                        if (!subModule.isPreview) {
                            delete subModule.video;
                            delete subModule.content;
                        }
                    });
                }
            });
        }

        res.status(200).json({
            success: true,
            course: course,
            isEnrolled // Optional: let frontend know enrollment status from this call
        });
    } catch (error) {
        console.log("error in getCourseById controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   GET /api/courses/slug/:slug
 * @desc    get course by slug
 * @access  Public
 */
export const getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        // getting course by slug with instructor and modules
        let course = await Course.findOne({ slug, status: "PUBLISHED", deletedAt: null })
            .populate('instructor', 'name profile.avatar facultyProfile.expertize')
            .populate({
                path: 'modules',
                match: { deletedAt: null, status: 'PUBLISHED' }, // Filter out deleted and draft modules
                select: 'title subModulesCount order',
                options: { sort: { order: 1 } },
                populate: {
                    path: 'subModules',
                    match: { deletedAt: null, status: 'PUBLISHED' }, // Filter out deleted and draft subModules
                    select: 'title type isPreview video content', // Fetch potential content
                    options: { sort: { order: 1 } }
                }
            }).lean(); // Use lean()

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Security & Access Control
        let isEnrolled = false;

        // Check enrollment if user is logged in
        if (req.user) {
            // Check if user is the instructor or admin (full access)
            if (req.user.role === 'ADMIN' || (course.instructor && course.instructor._id.toString() === req.user._id.toString())) {
                isEnrolled = true;
            } else {
                // Check if student is enrolled
                const enrollment = await Enrollment.findOne({
                    courseId: course._id,
                    userId: req.user._id,
                    status: 'ACTIVE'
                });
                if (enrollment) isEnrolled = true;
            }
        }

        // Scrub video/content from locked lessons ONLY if not enrolled
        if (!isEnrolled && course.modules) {
            course.modules.forEach(module => {
                if (module.subModules) {
                    module.subModules.forEach(subModule => {
                        if (!subModule.isPreview) {
                            delete subModule.video;
                            delete subModule.content;
                        }
                    });
                }
            });
        }

        res.status(200).json({
            success: true,
            course,
            isEnrolled
        });
    } catch (error) {
        console.log("error in getCourseBySlug controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


/**
 * @route   GET /api/courses/search
 * @desc    search courses by query, category, level
 * @access  Public
 */
export const searchCourses = async (req, res) => {
    try {
        const { query, category, level } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { status: "PUBLISHED", deletedAt: null };

        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } } // Added description search
            ];
        }

        if (category && category !== 'All') filter.category = category; // specific check
        if (level && level !== 'All') filter.level = level;

        const courses = await Course.find(filter)
            .select('title description category price instructor thumbnail slug rating level currency discount')
            .populate('instructor', 'name avatar') // Added population
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Course.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: courses.length,
            courses,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log("error in searchCourses controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   GET /api/courses/:id/reviews
 * @desc    get reviews for a course
 * @access  Public
 */
export const getCourseReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ courseId: id, status: "ACTIVE" })
            .populate('userId', 'name profile.avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.log("error in getCourseReviews controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   GET /api/courses/admin/all
 * @desc    get all courses (Draft, Pending, Published, Rejected) for admin
 * @access  Private - ADMIN
 */
export const getAllCoursesAdmin = async (req, res) => {
    try {
        const courses = await Course.find({ deletedAt: null })
            .populate('instructor', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            courses
        });
    } catch (error) {
        console.log("error in getAllCoursesAdmin controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   PATCH /api/courses/:id/approve
 * @desc    Approve a pending/draft course
 * @access  Private - ADMIN
 */
export const approveCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { status: "PUBLISHED", rejectionReason: null, publishedAt: Date.now() },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.status(200).json({
            success: true,
            message: "Course approved and published successfully",
            course
        });
    } catch (error) {
        console.log("error in approveCourse controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   PATCH /api/courses/:id/reject
 * @desc    Reject a course with reason
 * @access  Private - ADMIN
 */
export const rejectCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;

        const course = await Course.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { status: "REJECTED", rejectionReason },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.status(200).json({
            success: true,
            message: "Course rejected successfully",
            course
        });
    } catch (error) {
        console.log("error in rejectCourse controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/**
 * @route   DELETE /api/courses/admin/:id
 * @desc    Force delete a course
 * @access  Private - ADMIN
 */
export const deleteCourseAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(id, { deletedAt: new Date() });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // TODO: Clean up related resources (files in BunnyCDN, reviews, enrollments etc.) if hard deleting
        // Ideally invoke a service method that handles cleanup

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.log("error in deleteCourseAdmin controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

