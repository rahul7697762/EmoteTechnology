import { Module } from "../models/module.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import mongoose from "mongoose";
import Course from "../models/course.model.js";

// Create a new module
export const createModule = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title } = req.body;

        const course = await Course.findOne({ _id: courseId, deletedAt: null });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if user is owner or admin (Middleware mostly handles this but good for safety if reused)
        if (req.user.role !== 'ADMIN' && course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to add modules to this course" });
        }

        // Calculate order: Always append to the end
        // Find the highest order among ALL modules (including soft-deleted ones) to satisfy unique index
        const lastModule = await Module.findOne({ courseId }).sort({ order: -1 });
        const newOrder = lastModule ? lastModule.order + 1 : 1;

        const module = await Module.create({
            courseId,
            title,
            order: newOrder
        });

        // Add module reference to Course
        course.modules.push(module._id);
        await course.save();

        res.status(201).json({
            success: true,
            data: module
        });
    } catch (error) {
        console.log("error in createModule", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all modules for a course
export const getModulesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { status } = req.query;

        let query = { courseId, deletedAt: null };

        // Students can only see PUBLISHED modules
        if (req.user.role === 'STUDENT') {
            query.status = 'PUBLISHED';
        } else if (status) {
            // Admin/Faculty can filter by status
            query.status = status;
        }

        const modules = await Module.find(query).sort({ order: 1 });

        res.status(200).json({
            success: true,
            count: modules.length,
            data: modules
        });
    } catch (error) {
        console.log("error in getModulesByCourse", error);
        res.status(500).json({ message: error.message });
    }
};

// Get single module
export const getModuleById = async (req, res) => {
    try {
        const module = await Module.findOne({
            _id: req.params.id,
            deletedAt: null
        });

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        // Access Check: Students need PUBLISHED
        if (req.user.role === 'STUDENT') {
            if (module.status !== 'PUBLISHED') {
                return res.status(403).json({ message: "Module is not available" });
            }

            // Check if student is enrolled
            const isEnrolled = await Enrollment.findOne({
                courseId: module.courseId,
                userId: req.user._id,
                status: 'ACTIVE'
            });

            if (!isEnrolled) {
                return res.status(403).json({ message: "You must be enrolled to view this module" });
            }
        }

        if (req.user.role === 'FACULTY') {
            const course = await Course.findOne({ _id: module.courseId, deletedAt: null });
            if (course.instructor.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized" });
            }
        }

        res.status(200).json({
            success: true,
            data: module
        });
    } catch (error) {
        console.log("error in getModuleById", error);
        res.status(500).json({ message: error.message });
    }
};

// Update module details
export const updateModule = async (req, res) => {
    try {
        const { title, order } = req.body;
        const module = await Module.findOne({ _id: req.params.id, deletedAt: null });

        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        if (title) module.title = title;
        if (order) module.order = order;

        await module.save();

        res.status(200).json({
            success: true,
            data: module
        });
    } catch (error) {
        console.log("error in updateModule", error);
        res.status(500).json({ message: error.message });
    }
};

// Publish Module
export const publishModule = async (req, res) => {
    try {
        const module = await Module.findOneAndUpdate(
            { _id: req.params.id, deletedAt: null },
            { status: 'PUBLISHED' },
            { new: true }
        );

        if (!module) return res.status(404).json({ message: "Module not found" });

        res.status(200).json({
            success: true,
            data: module
        });
    } catch (error) {
        console.log("error in publishModule", error);
        res.status(500).json({ message: error.message });
    }
};

// Unpublish Module
export const unpublishModule = async (req, res) => {
    try {
        const module = await Module.findOneAndUpdate(
            { _id: req.params.id, deletedAt: null },
            { status: 'DRAFT' },
            { new: true }
        );

        if (!module) return res.status(404).json({ message: "Module not found" });

        res.status(200).json({
            success: true,
            data: module
        });
    } catch (error) {
        console.log("error in unpublishModule", error);
        res.status(500).json({ message: error.message });
    }
};

// Soft delete module
export const deleteModule = async (req, res) => {
    try {
        const module = await Module.findOneAndUpdate(
            { _id: req.params.id, deletedAt: null },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!module) return res.status(404).json({ message: "Module not found" });

        res.status(200).json({
            success: true,
            message: "Module deleted successfully"
        });
    } catch (error) {
        console.log("error in deleteModule", error);
        res.status(500).json({ message: error.message });
    }
};

// Reorder modules
export const reorderModules = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { courseId } = req.params;
        const { modules } = req.body; // Array of { moduleId, order }

        // Strategy: 3-Pass Strict Update
        // 1. Temp Move: Get active modules out of the way
        // 2. Clear Runway: Evict any zombies (deleted modules) squatting on target orders
        // 3. Final Move: Place active modules in correct spots

        // Pass 1: Move all changing modules to a temporary large range
        const tempOps = modules.map((item, index) => ({
            updateOne: {
                filter: { _id: item.moduleId, courseId },
                update: { order: 1000000 + index + Math.floor(Math.random() * 10000) }
            }
        }));

        await Module.bulkWrite(tempOps, { session });

        // Pass 2: Detect and Evict Obstacles
        // Any module currently holding orders 1, 2, 3... is an obstacle (likely a soft-deleted zombie)
        const targetOrders = modules.map(m => m.order);

        const obstacles = await Module.find({
            courseId,
            order: { $in: targetOrders }
        }).session(session);

        if (obstacles.length > 0) {
            const obstacleOps = obstacles.map((obs, idx) => ({
                updateOne: {
                    filter: { _id: obs._id },
                    // Move obstacle to unique negative history
                    update: { order: -1 * (Date.now() + idx + Math.floor(Math.random() * 10000)) }
                }
            }));
            await Module.bulkWrite(obstacleOps, { session });
        }

        // Pass 3: Move to final desired order
        const finalOps = modules.map((item) => ({
            updateOne: {
                filter: { _id: item.moduleId, courseId },
                update: { order: item.order }
            }
        }));

        await Module.bulkWrite(finalOps, { session });

        await session.commitTransaction();
        res.status(200).json({ success: true, message: "Modules reordered successfully" });
    } catch (error) {
        console.log("error in reorderModules", error);
        await session.abortTransaction();
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

// Get modules summary (for sidebar etc)
export const getModulesSummary = async (req, res) => {
    try {
        const { courseId } = req.params;
        // In this simple version, just returning id, title, order, and subModulesCount
        const modules = await Module.find({ courseId, deletedAt: null })
            .select('title order subModulesCount status')
            .sort({ order: 1 });

        res.status(200).json({
            success: true,
            data: modules
        });
    } catch (error) {
        console.log("error in getModulesSummary", error);
        res.status(500).json({ message: error.message });
    }
};
