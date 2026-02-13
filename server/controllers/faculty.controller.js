import Course from '../models/course.model.js';
import User from '../models/user.model.js';
import { Module } from '../models/module.model.js';
import { SubModule } from '../models/subModule.model.js';
import Payment from '../models/payment.model.js';

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch all courses created by this user (including deleted for historical revenue)
        const allCourses = await Course.find({ createdBy: userId });

        // Filter for active (non-deleted) courses for display stats
        const currentCourses = allCourses.filter(c => !c.deletedAt);

        // 1. Total Courses Created (Existing Portfolio)
        const totalCourses = currentCourses.length;

        // 2. Active (Published) Courses
        const activeCourses = currentCourses.filter(c => c.status === 'PUBLISHED').length;

        // 3. Total Students (Sum of enrolledCount from current courses)
        const totalStudents = currentCourses.reduce((sum, course) => sum + (course.enrolledCount || 0), 0);

        // 4. Total Revenue (Calculated from actual completed payments)
        const courseIds = allCourses.map(c => c._id);
        const payments = await Payment.find({
            courseId: { $in: courseIds },
            status: 'paid'
        });

        const totalRevenue = payments.reduce((sum, payment) => {
            let amount = payment.amount || 0;
            // Normalize currency to USD
            // Assuming 1 USD = 84 INR approx
            if (payment.currency === 'INR') {
                amount = amount / 84;
            }
            return sum + amount;
        }, 0);


        // 5. Average Rating (Weighted by number of ratings from current courses)
        const { totalRatingValues, totalRatingCounts } = currentCourses.reduce((acc, course) => {
            const avg = course.rating?.average || 0;
            const count = course.rating?.count || 0;
            return {
                totalRatingValues: acc.totalRatingValues + (avg * count),
                totalRatingCounts: acc.totalRatingCounts + count
            };
        }, { totalRatingValues: 0, totalRatingCounts: 0 });

        const averageRating = totalRatingCounts > 0
            ? (totalRatingValues / totalRatingCounts).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                totalCourses,
                activeCourses,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                averageRating
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getFacultyCourses = async (req, res) => {
    try {
        const userId = req.user._id;
        const courses = await Course.find({ createdBy: userId, deletedAt: null })
            .select('title thumbnail price discount enrolledCount rating status createdAt slug')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        console.error('Error fetching faculty courses:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getCourseDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const course = await Course.findOne({ _id: id, createdBy: userId, deletedAt: null });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Fetch modules
        const modules = await Module.find({ courseId: id }).sort({ order: 1 });

        // Fetch submodules for all modules
        const moduleIds = modules.map(m => m._id);
        const subModules = await SubModule.find({ moduleId: { $in: moduleIds } }).sort({ order: 1 });

        // Assemble hierarchy
        const fullModules = modules.map(m => {
            const items = subModules.filter(sm => sm.moduleId.toString() === m._id.toString());
            // Transform submodule to match frontend structure if needed
            // Frontend expects: { id, type, title, meta, color }
            // Backend has: { _id, type, title, description, video, content, etc }

            const transformedItems = items.map(item => ({
                id: item._id, // Keep primitive id for keying? frontend uses number or string
                type: item.type.toLowerCase(),
                title: item.title,
                meta: item.type === 'VIDEO' ? `VIDEO LESSON • ${(item.video?.duration / 60).toFixed(0)} min` :
                    item.type === 'ARTICLE' ? `READING MATERIAL` : 'CONTENT',
                color: item.type === 'VIDEO' ? 'blue' :
                    item.type === 'ARTICLE' ? 'red' : 'gray',
                // Keep raw data too for editing
                ...item.toObject()
            }));

            return {
                ...m.toObject(),
                id: m._id, // Ensure ID is available as 'id' for frontend compatibility
                items: transformedItems
            };
        });

        res.status(200).json({
            success: true,
            data: {
                course,
                modules: fullModules
            }
        });

    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const upsertCourse = async (req, res) => {
    try {
        const userId = req.user._id;
        const { course: courseData, modules: modulesData } = req.body;

        let course;

        // 1. Create or Update Course
        if (courseData._id && courseData._id !== 'new') {
            course = await Course.findOne({ _id: courseData._id, createdBy: userId, deletedAt: null });
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            // Allow updating fields
            course.title = courseData.title || course.title;
            course.description = courseData.description || course.description || "No description";
            course.price = courseData.price || 0;
            course.status = courseData.status || course.status;
            course.thumbnail = courseData.thumbnail || course.thumbnail;
            // Ensure other required fields have defaults if missing in update
            course.category = courseData.category || course.category || "TECH";
            course.difficulty = courseData.difficulty || "BEGINNER";

            await course.save();

        } else {
            // New Course
            course = await Course.create({
                ...courseData,
                createdBy: userId,
                instructor: userId, // Set instructor as the creator
                // Defaults for required fields if not provided
                description: courseData.description || "New Course Description",
                price: courseData.price || 0,
                category: courseData.category || "TECH",
            });
        }

        const courseId = course._id;

        // 2. Sync Modules (Full Wipe & Replace Strategy for Simplicity/Consistency)
        // In production, might want 'upsert' logic to preserve IDs of unchanged items

        // Find existing modules to delete (and their submodules)
        const existingModules = await Module.find({ courseId });
        const existingModuleIds = existingModules.map(m => m._id);

        // Delete all existing modules and submodules for this course
        // This is drastic but ensures order and content matches exactly what's on frontend
        // Note: Ideally, we should diff, but frontend sends full state

        await SubModule.deleteMany({ courseId });
        await Module.deleteMany({ courseId });

        // Re-create Modules and SubModules
        if (modulesData && modulesData.length > 0) {
            for (let i = 0; i < modulesData.length; i++) {
                const mData = modulesData[i];

                const newModule = await Module.create({
                    courseId,
                    title: mData.title,
                    description: mData.description,
                    order: i,
                    status: 'PUBLISHED' // Default to published for now relative to course
                });

                if (mData.items && mData.items.length > 0) {
                    const subModuleDocs = mData.items.map((item, idx) => ({
                        courseId,
                        moduleId: newModule._id,
                        title: item.title,
                        type: mapFrontendTypeToDb(item.type),
                        order: idx,
                        status: 'PUBLISHED',
                        // Map other fields
                        video: item.type === 'video' ? { url: 'placeholder', duration: 0 } : undefined,
                        content: item.type === 'pdf' ? 'PDF Content Placeholder' : undefined
                    }));

                    await SubModule.insertMany(subModuleDocs);
                }
            }
        }

        res.status(200).json({
            success: true,
            message: 'Course saved successfully',
            data: {
                courseId: course._id
            }
        });

    } catch (error) {
        console.error('Error saving course:', error);
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};

// Helper
function mapFrontendTypeToDb(type) {
    if (!type) return 'ARTICLE';
    const t = type.toLowerCase();
    if (t === 'video') return 'VIDEO';
    if (t === 'quiz') return 'QUIZ';
    return 'ARTICLE'; // Default mainly for PDF/Text
}
