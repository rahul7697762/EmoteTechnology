import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// Get MongoDB URI from arguments or env
const args = process.argv.slice(2);
const mongoUri = args[0] || process.env.MONGO_URI;

if (!mongoUri) {
    console.error('Error: Please provide MongoDB URI as an argument.');
    console.error('Usage: node scripts/create_admin.js <YOUR_MONGODB_URI>');
    process.exit(1);
}

const createAdmin = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to database...');

        const adminEmail = 'admin@emotetech.com';
        const password = 'AdminPassword123!';

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        // Create admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            name: 'System Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
            accountStatus: 'ACTIVE',
            profile: {
                bio: 'System Administrator',
                title: 'Admin'
            }
        });

        console.log('Admin user created successfully!');
        console.log('Email:', adminEmail);
        console.log('Password:', password);

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
