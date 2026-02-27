import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import facultyRoutes from './routes/faculty.routes.js';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import { globalRateLimiter } from './middleware/rateLimiter.middleware.js';
import courseRoutes from './routes/course.routes.js';
import studentRoutes from './routes/student.routes.js';
import moduleRoutes from './routes/module.routes.js';
import subModuleRoutes from './routes/subModule.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import progressRoutes from './routes/progress.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import reviewRoutes from './routes/review.routes.js';
import discussionRoutes from './routes/discussion.routes.js';
import companyRoutes from './routes/company.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Load environment variables
dotenv.config();

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5000',
            process.env.FRONTEND_URL,
            process.env.RENDER_EXTERNAL_URL
        ].filter(Boolean); // Remove undefined/null values

        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('render.com')) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

// rate limit middleware
app.use(globalRateLimiter)

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/module', moduleRoutes);
app.use('/api/submodule', subModuleRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/submission', submissionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadRoutes);


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'Here is some data from the backend', localTime: new Date().toISOString() });
});

// Debug endpoint to test login request body
app.post('/api/test-login', (req, res) => {
    console.log('=== TEST LOGIN ENDPOINT ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers['content-type']);
    res.json({
        success: true,
        receivedBody: req.body,
        bodyKeys: Object.keys(req.body),
        contentType: req.headers['content-type']
    });
});

// Serve static files from the React client
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
