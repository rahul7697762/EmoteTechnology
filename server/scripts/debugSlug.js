import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/course.model.js';
import User from '../models/user.model.js';
import { Module } from '../models/module.model.js';
import { SubModule } from '../models/subModule.model.js';
import fs from 'fs';

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

        // Find a published course to get a valid slug
        const course = await Course.findOne({ status: "PUBLISHED" });
        if (!course) {
            console.log("No PUBLISHED course found.");
            process.exit(0);
        }

        console.log(`Testing with Slug: ${course.slug}`);

        // Test Slug Query with Population
        const populatedCourse = await Course.findOne({ slug: course.slug, status: "PUBLISHED" })
            .populate('instructor', 'name profile.avatar facultyProfile.expertize')
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

        if (!populatedCourse) {
            fs.writeFileSync('debug_output.txt', "Course not found via slug.");
        } else {
            let output = `Course found via slug: ${populatedCourse.title}\n`;
            output += `Modules count: ${populatedCourse.modules.length}\n`;
            if (populatedCourse.modules.length > 0) {
                const firstMod = populatedCourse.modules[0];
                output += `First Module Submodules count: ${firstMod.subModules ? firstMod.subModules.length : 'undefined'}\n`;
                if (firstMod.subModules && firstMod.subModules.length > 0) {
                    output += "Submodules populated successfully.\n";
                } else {
                    output += "WARNING: Submodules NOT populated or empty.\n";
                }
            }
            fs.writeFileSync('debug_output.txt', output);
            console.log(output);
        }

    } catch (e) {
        fs.writeFileSync('debug_output.txt', `Error: ${e.message}\n${e.stack}`);
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

debug();
