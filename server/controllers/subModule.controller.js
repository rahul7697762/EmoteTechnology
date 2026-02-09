import { SubModule } from "../models/subModule.model.js";
import { Module } from "../models/module.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";
import { uploadFileToBunny, deleteFileFromBunny } from "../services/bunny.service.js";
import { getVideoDurationInSeconds } from "../utils/video.utils.js";

// 1. Create SubModule
export const createSubModule = async (req, res) => {
    try {
        const { courseId, moduleId, title, description, type, isPreview, content } = req.body;

        // --- Access Control ---
<<<<<<< HEAD
        const course = await Course.findById(courseId);
=======
        const course = await Course.findOne({ _id: courseId, deletedAt: null });
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae
        if (!course) return res.status(404).json({ message: "Course not found" });

        if (req.user.role !== 'ADMIN' && course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // --- Video Handling ---
        let videoData = {};
        if (type === 'VIDEO' && req.file) {
            const videoFile = req.file;

            // 1. Get Duration
            const duration = await getVideoDurationInSeconds(videoFile.buffer);

            // 2. Upload to Bunny
            const directoryPath = `course_${courseId}/module_${moduleId}`;
            const fileName = `${Date.now()}_${videoFile.originalname}`;
            const videoUrl = await uploadFileToBunny(directoryPath, videoFile.buffer, fileName);

            videoData = {
                url: videoUrl,
                provider: 'BUNNY_CDN',
                duration: duration || 0
            };
        } else if (type === 'VIDEO' && req.body.video) {
            // If manual URL provided or non-file update
            try {
                videoData = typeof req.body.video === 'string' ? JSON.parse(req.body.video) : req.body.video;
            } catch (e) {
                videoData = req.body.video;
            }
        }

        // --- Order Calculation (Append) ---
        // Robust calculation using all items (including deleted)
        const lastItem = await SubModule.findOne({ moduleId }).sort({ order: -1 });
        const newOrder = lastItem ? lastItem.order + 1 : 1;

        const subModule = await SubModule.create({
            courseId,
            moduleId,
            title,
            description,
            type,
            video: videoData,
            content,
            isPreview: isPreview || false,
            order: newOrder,
            status: 'DRAFT'
        });

        // --- Update Module Count ---
        await Module.findByIdAndUpdate(moduleId, { $inc: { subModulesCount: 1 } });

        res.status(201).json({ success: true, data: subModule });

    } catch (error) {
        console.error("error in createSubModule", error);
        res.status(500).json({ message: error.message });
    }
};

// 2. Get All SubModules of a Module (Filtered)
export const getSubModulesByModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const query = { moduleId, deletedAt: null };

        // Student View: Only Published
        if (req.user.role === 'STUDENT') {
            query.status = 'PUBLISHED';
        }

        const subModules = await SubModule.find(query).sort({ order: 1 });

        res.status(200).json({ success: true, count: subModules.length, data: subModules });
    } catch (error) {
        console.error("error in getSubModulesByModule", error);
        res.status(500).json({ message: error.message });
    }
};

// 3. Get SubModule By ID (Detail)
export const getSubModuleById = async (req, res) => {
    try {
        const subModule = await SubModule.findOne({ _id: req.params.id, deletedAt: null });
        if (!subModule) return res.status(404).json({ message: "Lesson not found" });

        // Access Check
        if (req.user.role === 'STUDENT') {
            if (subModule.status !== 'PUBLISHED') return res.status(403).json({ message: "Lesson not available" });

            const isEnrolled = await Enrollment.findOne({
                courseId: subModule.courseId,
                userId: req.user._id,
                status: 'ACTIVE'
            });
            if (!isEnrolled) return res.status(403).json({ message: "Enrollment required" });
        } else if (req.user.role === 'FACULTY') {
<<<<<<< HEAD
            const course = await Course.findById(subModule.courseId);
=======
            const course = await Course.findOne({ _id: subModule.courseId, deletedAt: null });
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae
            if (course.instructor.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });
        }

        res.status(200).json({ success: true, data: subModule });
    } catch (error) {
        console.error("error in getSubModuleById", error);
        res.status(500).json({ message: error.message });
    }
};

// 4. Update SubModule
export const updateSubModule = async (req, res) => {
    try {
<<<<<<< HEAD
        const { title, description, content, isPreview} = req.body;
=======
        const { title, description, content, isPreview } = req.body;
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae
        const subModule = await SubModule.findOne({ _id: req.params.id, deletedAt: null });

        if (!subModule) return res.status(404).json({ message: "Lesson not found" });

        // Check Owner (could be middleware, but explicit here for safety)
        if (req.user.role !== 'ADMIN') {
<<<<<<< HEAD
            const course = await Course.findById(subModule.courseId);
=======
            const course = await Course.findOne({ _id: subModule.courseId, deletedAt: null });
>>>>>>> f2a47aa7e7ac002499aa6eed3f692796daf5f1ae
            if (course.instructor.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });
        }

        if (title) subModule.title = title;
        if (description !== undefined) subModule.description = description;
        if (content !== undefined) subModule.content = content;
        if (isPreview !== undefined) subModule.isPreview = isPreview;

        // Handle Video Update (if new file uploaded or new URL provided)
        if (req.file) {
            const videoFile = req.file;

            // 1. Delete Previous Video (if exists and is Bunny)
            if (subModule.video && subModule.video.url && subModule.video.provider === 'BUNNY_CDN') {
                try {
                    const oldVideoPath = new URL(subModule.video.url).pathname.substring(1);
                    await deleteFileFromBunny(oldVideoPath);
                } catch (error) {
                    console.log("Error deleting old video:", error);
                    // Continue even if delete fails
                }
            }

            // 2. Get Duration
            const duration = await getVideoDurationInSeconds(videoFile.buffer);

            // 3. Upload New
            const directoryPath = `course_${subModule.courseId}/module_${subModule.moduleId}`;
            const fileName = `${Date.now()}_${videoFile.originalname}`;
            const videoUrl = await uploadFileToBunny(directoryPath, videoFile.buffer, fileName);
            subModule.video = {
                url: videoUrl,
                provider: 'BUNNY_CDN',
                duration: duration || 0
            };
        }

        await subModule.save();
        res.status(200).json({ success: true, data: subModule });
    } catch (error) {
        console.error("error in updateSubModule", error);
        res.status(500).json({ message: error.message });
    }
};

// 5. Publish
export const publishSubModule = async (req, res) => {
    try {
        const subModule = await SubModule.findOneAndUpdate(
            { _id: req.params.id, deletedAt: null },
            { status: 'PUBLISHED' },
            { new: true }
        );
        if (!subModule) return res.status(404).json({ message: "Lesson not found" });
        res.status(200).json({ success: true, data: subModule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Unpublish
export const unpublishSubModule = async (req, res) => {
    try {
        const subModule = await SubModule.findOneAndUpdate(
            { _id: req.params.id, deletedAt: null },
            { status: 'DRAFT' },
            { new: true }
        );
        if (!subModule) return res.status(404).json({ message: "Lesson not found" });
        res.status(200).json({ success: true, data: subModule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 7. Delete (Soft + Decrement Count)
export const deleteSubModule = async (req, res) => {
    try {
        const subModule = await SubModule.findOneAndUpdate(
            { _id: req.params.id, deletedAt: null },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!subModule) return res.status(404).json({ message: "Lesson not found" });

        // Decrement Count
        await Module.findByIdAndUpdate(subModule.moduleId, { $inc: { subModulesCount: -1 } });

        res.status(200).json({ success: true, message: "Lesson deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 8. Reorder (3-Pass Robust)
export const reorderSubModules = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { moduleId, subModules } = req.body; // [{ subModuleId, order }]

        // Pass 1: Temp
        const tempOps = subModules.map((item, index) => ({
            updateOne: {
                filter: { _id: item.subModuleId },
                update: { order: 1000000 + index + Math.floor(Math.random() * 10000) }
            }
        }));
        await SubModule.bulkWrite(tempOps, { session });

        // Pass 2: Evict Zombies
        const targetOrders = subModules.map(m => m.order);
        const obstacles = await SubModule.find({ moduleId, order: { $in: targetOrders } }).session(session);

        if (obstacles.length > 0) {
            const obstacleOps = obstacles.map((obs, idx) => ({
                updateOne: {
                    filter: { _id: obs._id },
                    update: { order: -1 * (Date.now() + idx + Math.floor(Math.random() * 10000)) }
                }
            }));
            await SubModule.bulkWrite(obstacleOps, { session });
        }

        // Pass 3: Final
        const finalOps = subModules.map((item) => ({
            updateOne: {
                filter: { _id: item.subModuleId },
                update: { order: item.order }
            }
        }));
        await SubModule.bulkWrite(finalOps, { session });

        await session.commitTransaction();
        res.status(200).json({ success: true, message: "Lessons reordered successfully" });

    } catch (error) {
        await session.abortTransaction();
        console.error("error in reorderSubModules", error);
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

// 9. Preview (Public)
export const getPreviewSubModules = async (req, res) => {
    try {
        const { courseId } = req.params;
        const subModules = await SubModule.find({
            courseId,
            deletedAt: null,
            status: 'PUBLISHED',
            isPreview: true
        }).sort({ moduleId: 1, order: 1 });

        res.status(200).json({ success: true, data: subModules });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
