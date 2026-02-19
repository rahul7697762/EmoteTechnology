
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from server root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Models
import { DiscussionThread } from '../models/discussionThread.model.js';
import { DiscussionReply } from '../models/discussionReply.model.js';
import { Enrollment } from '../models/enrollment.model.js';
import User from '../models/user.model.js';
import Course from '../models/course.model.js';

const TARGET_COURSE_ID = '697dde1809e55c20afe67015';

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Connection Error:", error);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // 1. Verify Course Exists
        console.log(`Checking for course: ${TARGET_COURSE_ID}`);
        // Cast to ObjectId
        if (!mongoose.Types.ObjectId.isValid(TARGET_COURSE_ID)) {
            throw new Error('Invalid Course ID format');
        }

        // Note: Models might be registered with different names if not imported correctly, but usually fine.
        // Let's create dummy users if possible or find existing ones.

        let users = await User.find({ role: 'STUDENT' }).limit(5);
        if (users.length < 3) {
            console.log("Not enough users found. Creating dummy users...");
            // Create some dummy users if needed? Or just use what we have.
            // For now let's assume there are SOME users. If not, we might fail.
            // Let's create dummy users to be safe.
            const dummyUsers = [
                { name: "Alice Student", email: `alice_${Date.now()}@test.com`, password: "password123", role: "STUDENT" },
                { name: "Bob Learner", email: `bob_${Date.now()}@test.com`, password: "password123", role: "STUDENT" },
                { name: "Charlie Dev", email: `charlie_${Date.now()}@test.com`, password: "password123", role: "STUDENT" }
            ];

            for (const u of dummyUsers) {
                const newUser = await User.create(u);
                users.push(newUser);
                console.log(`Created user: ${newUser.name}`);
            }
        }

        console.log(`Using ${users.length} users for seeding.`);

        // 2. Ensure they are enrolled (optional but good for consistency)
        for (const user of users) {
            const enrollment = await Enrollment.findOne({ userId: user._id, courseId: TARGET_COURSE_ID });
            if (!enrollment) {
                await Enrollment.create({
                    userId: user._id,
                    courseId: TARGET_COURSE_ID,
                    accessType: 'FREE', // or PAID
                    status: 'ACTIVE'
                });
                console.log(`Enrolled ${user.name} in course.`);
            }
        }

        // 3. Create Threads
        const threadsData = [
            {
                title: "Welcome to the course! Introduce yourselves.",
                content: "Hi everyone! I'm excited to start this journey. Where is everyone from? What do you hope to learn?",
                createdBy: users[0]._id,
                isPinned: true
            },
            {
                title: "Help with Module 2 Assignment",
                content: "I'm stuck on the second part of the assignment in Module 2. Has anyone figured out the correct approach for the sorting algorithm?",
                createdBy: users[1]._id
            },
            {
                title: "Great resource for React Hooks",
                content: "Found this amazing article that explains `useReducer` really well: [link]. Highly recommend checking it out!",
                createdBy: users[2]._id,
                upvotes: [users[0]._id, users[1]._id] // Pre-upvoted
            }
        ];

        console.log("Creating threads...");
        const createdThreads = [];
        for (const t of threadsData) {
            const thread = await DiscussionThread.create({ ...t, courseId: TARGET_COURSE_ID });
            createdThreads.push(thread);
            console.log(`Created thread: ${thread.title}`);
        }

        // 4. Create Replies
        const thread1 = createdThreads[0]; // Intro thread
        const thread2 = createdThreads[1]; // Help thread

        const repliesData = [
            {
                threadId: thread1._id,
                content: "Hi! I'm Bob from California. Looking forward to mastering MERN stack.",
                createdBy: users[1]._id
            },
            {
                threadId: thread1._id,
                content: "Hello! Charlie here from London. I want to build my own SaaS.",
                createdBy: users[2]._id
            },
            {
                threadId: thread2._id,
                content: "Try using the built-in .sort() method with a custom comparator function.",
                createdBy: users[0]._id,
                upvotes: [users[2]._id]
            }
        ];

        console.log("Creating replies...");
        const createdReplies = [];
        for (const r of repliesData) {
            const reply = await DiscussionReply.create(r);
            createdReplies.push(reply);
            // Update reply count manually or trust the controller/app logic? The controller does it. 
            // Since we are seeding directly, we should update the thread's reply count.
            await DiscussionThread.findByIdAndUpdate(r.threadId, { $inc: { replyCount: 1 } });
            console.log(`Created reply by ${r.createdBy}`);
        }

        // 5. Create Nested Replies (Reply to Reply)
        // Reply to Bob's intro
        const parentReply = createdReplies[0];

        const nestedReplyData = {
            threadId: thread1._id,
            parentReplyId: parentReply._id,
            content: "Welcome Bob! California is great.",
            createdBy: users[2]._id
        };

        console.log("Creating nested reply...");
        const nestedReply = await DiscussionReply.create(nestedReplyData);
        await DiscussionThread.findByIdAndUpdate(thread1._id, { $inc: { replyCount: 1 } });
        console.log("Nested reply created.");

        // 6. Create 10 More Random Threads
        console.log("Creating 10 more random threads...");
        const titles = [
            "Best practices for API design?",
            "How to handle auth state persistence?",
            "Favorite VS Code extensions?",
            "Deploying to Vercel vs Netlify",
            "Understanding MongoDB Aggregation",
            "Tips for mobile responsiveness",
            "Redux Toolkit vs Context API",
            "Error handling strategies",
            "Optimizing React performance",
            "Career advice for junior devs"
        ];

        for (let i = 0; i < 10; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const title = titles[i] || `Discussion Topic ${i + 1}`;

            const thread = await DiscussionThread.create({
                courseId: TARGET_COURSE_ID,
                title: title,
                content: `This is a demo discussion thread about ${title}. What do you all think?`,
                createdBy: randomUser._id,
                upvotes: users.slice(0, Math.floor(Math.random() * users.length)).map(u => u._id)
            });

            // Add 0-3 random replies
            const numReplies = Math.floor(Math.random() * 4);
            for (let j = 0; j < numReplies; j++) {
                const replyUser = users[Math.floor(Math.random() * users.length)];
                await DiscussionReply.create({
                    threadId: thread._id,
                    content: `Interesting point! I agree with this regarding ${title}.`,
                    createdBy: replyUser._id
                });
            }
            // Update reply count
            await DiscussionThread.findByIdAndUpdate(thread._id, { $inc: { replyCount: numReplies } });
            console.log(`Created additional thread: ${title}`);
        }

        console.log("Seeding complete!");
        process.exit(0);

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
