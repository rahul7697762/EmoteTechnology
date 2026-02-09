import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/course.model.js';
import { Module } from '../models/module.model.js';
import { SubModule } from '../models/subModule.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const debug = async () => {
    try {
        const uri = process.env.MONGODB_URL || process.env.MONGODB_URI;
        if (!uri) throw new Error("No Mongo URI");

        await mongoose.connect(uri);
        console.log("Connected to DB");

        // Find a published course
        const course = await Course.findOne({ status: "PUBLISHED" });
        if (!course) {
            console.log("No PUBLISHED course found.");
            process.exit(0);
        }

        console.log(`Found Course: ${course.title} (${course._id})`);

        // Test Populate Query
        const populatedCourse = await Course.findOne({ _id: course._id })
            .populate({
                path: 'modules',
                select: 'title subModulesCount order',
                options: { sort: { order: 1 } },
                populate: {
                    path: 'subModules',
                    select: 'title type isPreview',
                    options: { sort: { order: 1 } }
                }
            });

        console.log("Modules found:", populatedCourse.modules.length);

        if (populatedCourse.modules.length > 0) {
            const firstMod = populatedCourse.modules[0];
            console.log(`Module 1: ${firstMod.title}`);
            console.log(`SubModules:`, firstMod.subModules);
        } else {
            console.log("No modules in course.");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

debug();
