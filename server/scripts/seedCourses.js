import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Course from '../models/course.model.js';
import User from '../models/user.model.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Assuming the script is in server/scripts and .env is in server/
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug: Check if URI is loaded
if (!process.env.MONGODB_URL && !process.env.MONGODB_URI) {
    console.error("MONGODB_URL is not defined.");
    console.log("Loaded Env Vars:", Object.keys(process.env));
    process.exit(1);
}

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URL || process.env.MONGODB_URI;
        if (!uri) throw new Error("MongoDB URI not found in env vars");
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

import { Module } from '../models/module.model.js';
import { SubModule } from '../models/subModule.model.js';

const seedCourses = async () => {
    await connectDB();

    try {
        // Find a faculty user
        let instructor = await User.findOne({ role: 'FACULTY' });

        // If no faculty, find any user
        if (!instructor) {
            console.log("No FACULTY found, looking for any user...");
            instructor = await User.findOne({});
        }

        if (!instructor) {
            console.log("No users found. Please sign up a user first.");
            process.exit(1);
        }

        console.log(`Using instructor: ${instructor.name} (${instructor._id})`);

        // Clear existing dummy courses to ensure clean seed
        await Course.deleteMany({ title: { $in: ["Complete Python Bootcamp: Go from zero to hero", "The Web Developer Bootcamp 2024", "Machine Learning A-Z: AI, Python & R", "Digital Marketing Masterclass"] } });

        const dummyCourses = [
            {
                title: "Complete Python Bootcamp: Go from zero to hero",
                description: "Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games.",
                category: "TECH",
                level: "BEGINNER",
                price: 19.99,
                currency: "USD",
                thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
                instructor: instructor._id,
                createdBy: instructor._id,
                status: "PUBLISHED",
                tags: ["python", "coding", "basics"]
            },
            {
                title: "The Web Developer Bootcamp 2024",
                description: "The only course you need to learn web development - HTML, CSS, JS, Node, and more!",
                category: "TECH",
                level: "BEGINNER",
                price: 24.99,
                currency: "USD",
                thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
                instructor: instructor._id,
                createdBy: instructor._id,
                status: "PUBLISHED",
                tags: ["html", "css", "javascript"]
            },
            {
                title: "Machine Learning A-Z: AI, Python & R",
                description: "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts.",
                category: "TECH",
                level: "ADVANCED",
                price: 29.99,
                currency: "USD",
                thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
                instructor: instructor._id,
                createdBy: instructor._id,
                status: "PUBLISHED",
                tags: ["ai", "python", "data science"]
            },
            {
                title: "Digital Marketing Masterclass",
                description: "Master Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics & More!",
                category: "NON-TECH",
                level: "INTERMEDIATE",
                price: 14.99,
                currency: "USD",
                thumbnail: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=80",
                instructor: instructor._id,
                createdBy: instructor._id,
                status: "PUBLISHED",
                tags: ["marketing", "seo", "social media"]
            }
        ];

        for (const cData of dummyCourses) {
            // Check if exists to avoid dupes
            const existing = await Course.findOne({ title: cData.title });
            if (existing) {
                console.log(`Course already exists: ${cData.title}`);
                continue;
            }

            console.log(`Creating Course: ${cData.title}`);
            const course = await Course.create(cData);

            // Create Modules
            const moduleIds = [];
            for (let i = 1; i <= 3; i++) {
                const module = await Module.create({
                    courseId: course._id,
                    title: `Module ${i}: Introduction to Section ${i}`,
                    order: i,
                    status: "PUBLISHED"
                });

                // Create SubModules
                for (let j = 1; j <= 3; j++) {
                    await SubModule.create({
                        courseId: course._id,
                        moduleId: module._id,
                        title: `Lesson ${j}: Key Concepts`,
                        type: j === 1 ? "VIDEO" : "ARTICLE", // first is video
                        content: "This is some dummy content for the lesson.",
                        order: j,
                        status: "PUBLISHED",
                        isPreview: j === 1 // first lesson is preview
                    });
                }
                // Update module subModules count (optional if not handled by hooks)
                module.subModulesCount = 3;
                await module.save();

                moduleIds.push(module._id);
            }

            // Update Course with Modules
            course.modules = moduleIds;
            await course.save();
        }

        console.log("Dummy courses seeding completed!");
        process.exit();

    } catch (error) {
        console.error("Error seeding courses:", error);
        process.exit(1);
    }
};

seedCourses();
