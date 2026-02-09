import { Router } from "express";
import {
    createCourse, getAllCourses, getCourseBySlug, searchCourses,
    getCourseReviews, getCourseById, getAllCoursesAdmin,
    approveCourse, rejectCourse, deleteCourseAdmin,
    getFacultyCourses, updateCourse, updateCourseStatus, deleteCourse,
    getFacultyCourseById
} from "../controllers/course.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import {
    createCourseValidation, rejectCourseValidation,
    updateCourseValidation, statusCourseValidation
} from "../validators/course.validation.js";
<<<<<<< HEAD
import { protect, restrictTo } from "../middleware/auth.middleware.js";
=======
import { protect, restrictTo, optionalProtect } from "../middleware/auth.middleware.js";
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae
import { validate } from "../middleware/validate.middleware.js";

const router = Router();
/*=============
 PUBLIC ROUTES
 =============*/

// Search courses (Order matters: Place before /:id)
router.get('/search', searchCourses);

// Get all published courses
router.get('/', getAllCourses);

// Get course by slug
<<<<<<< HEAD
router.get('/slug/:slug', getCourseBySlug);
=======
router.get('/slug/:slug', optionalProtect, getCourseBySlug);
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae

// Get course reviews
router.get('/:id/reviews', getCourseReviews);

// Get course by ID
<<<<<<< HEAD
router.get('/:id', getCourseById);
=======
router.get('/:id', optionalProtect, getCourseById);
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae


/*===============
STUDENTS ROUTES
=============*/


/*==============
FACULTY ROUTES
===============*/

// Get instructor courses
router.get('/faculty/my-courses', protect, restrictTo('FACULTY', 'ADMIN'), getFacultyCourses);

// Get course by ID for Faculty (Draft/Published)
router.get('/faculty/:id', protect, restrictTo('FACULTY', 'ADMIN'), getFacultyCourseById);

// create course and upload thumbnail and preview video
router.post("/",
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'previewVideo', maxCount: 1 }
    ]),
    createCourseValidation,
    validate,
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    createCourse
);

// Update course (Details + Thumbnail/Video) - Combined
router.put('/:id',
    protect, restrictTo('FACULTY', 'ADMIN'),
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'previewVideo', maxCount: 1 }
    ]),
    updateCourseValidation,
    validate,
    updateCourse
);

// Update course status (e.g. Submit for review)
router.patch('/:id/status',
    statusCourseValidation,
    validate,
    protect, restrictTo('FACULTY', 'ADMIN'),
    updateCourseStatus
);

// Delete course (Faculty Owner)
router.delete('/:id', protect, restrictTo('FACULTY', 'ADMIN'), deleteCourse);

/*================
ADMIN ROUTES
================*/

// Get all courses (Admin)
router.get('/admin/all', protect, restrictTo('ADMIN'), getAllCoursesAdmin);

// Approve course
router.patch('/:id/approve', protect, restrictTo('ADMIN'), approveCourse);

// Reject course
router.patch('/:id/reject', rejectCourseValidation, validate, protect, restrictTo('ADMIN'), rejectCourse);

// Delete course (Admin)
router.delete('/admin/:id', protect, restrictTo('ADMIN'), deleteCourseAdmin);



export default router;