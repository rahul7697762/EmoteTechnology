import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

/**
 * Send token response
 */
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile,
            isVerified: user.isVerified
        }
    });
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */

// Validation rules
const signupValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('phone')
        .optional()
        .trim(),
];

// Controller function - SIMPLIFIED FOR TESTING
const signupHandler = async (req, res) => {
    console.log('===== SIGNUP HANDLER HIT =====');
    console.log('Request body:', JSON.stringify(req.body));

    try {
        const { name, email, password } = req.body;

        console.log('About to create user with:', { name, email });

        // Simple user creation - no profile, no phone
        const user = await User.create({
            name: name,
            email: email,
            password: password,
            role: 'STUDENT'
        });

        console.log('User created successfully:', user._id);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            userId: user._id
        });
    } catch (error) {
        console.error('===== SIGNUP ERROR =====');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);

        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack
        });
    }
};

// Export validation and handler separately
export { signupValidation, signupHandler };

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
export const login = [
    // Validation middleware
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    body('role')
        .optional()
        .isIn(['STUDENT', 'FACULTY', 'ADMIN'])
        .withMessage('Invalid role'),

    // Controller function
    async (req, res) => {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { email, password, role } = req.body;

            // Check if user exists and select password
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Check if password matches
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // If role is specified, verify it matches
            if (role && user.role !== role) {
                return res.status(403).json({
                    success: false,
                    message: `This account is not registered as ${role}`
                });
            }

            // Check account status
            if (user.accountStatus !== 'ACTIVE') {
                return res.status(403).json({
                    success: false,
                    message: `Account is ${user.accountStatus.toLowerCase()}. Please contact support.`
                });
            }

            // Update last login
            user.lastLoginAt = new Date();
            await user.save({ validateBeforeSave: false });

            // Send token response
            sendTokenResponse(user, 200, res);
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error logging in',
                error: error.message
            });
        }
    }
];

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                isVerified: user.isVerified,
                accountStatus: user.accountStatus,
                lastLoginAt: user.lastLoginAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
export const logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
