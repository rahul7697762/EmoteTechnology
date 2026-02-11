import mongoose from "mongoose";
import dotenv from "dotenv";
import { Module } from "../models/module.model.js";

dotenv.config();

const updateModules = async () => {
    try {
        console.log("Connecting to Database...", process.env.MONGODB_URL ? "URI found" : "URI missing");
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to Database.");

        // 1. Update hasAssessment (default false)
        const result1 = await Module.updateMany(
            { hasAssessment: { $exists: false } },
            { $set: { hasAssessment: false } }
        );
        console.log(`Updated hasAssessment for ${result1.modifiedCount} modules.`);

        // 2. Update unlockRule (default AFTER_COMPLETION)
        // Except for the FIRST module (order: 1), which should be FREE
        // Logic: Set ALL to AFTER_COMPLETION first
        const result2 = await Module.updateMany(
            { unlockRule: { $exists: false } },
            { $set: { unlockRule: "AFTER_COMPLETION" } }
        );
        console.log(`Updated unlockRule for ${result2.modifiedCount} modules.`);

        // 3. Set first module (order 1) to FREE if not set
        // Actually, logic usually is handled dynamically (first module is always unlocked).
        // But let's explicitely set order 1 to FREE if you want.
        // The schema default is AFTER_COMPLETION.
        // Let's find modules with order 1 and set them to FREE?
        // Or leave as is. User asked to update "previous module with hasAssessment and unlockRules".
        // I think setting defaults is safer.

        console.log("Migration complete.");
        process.exit(0);

    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

updateModules();
