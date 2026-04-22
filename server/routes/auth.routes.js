import express from 'express';
import passport from 'passport';
import { 
    signup, 
    login, 
    logout, 
    getMe, 
    forgetPassword, 
    verifyOTP, 
    resetPassword, 
    sendVerificationEmail, 
    verifyEmail, 
    googleAuthCallback 
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { 
    forgotPasswordValidation, 
    resetPasswordValidation, 
    signupValidation, 
    verifyOTPValidation 
} from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { strictRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', strictRateLimiter, signupValidation, validate, signup);
router.post('/login', login);
router.post('/forgot-password', strictRateLimiter, forgotPasswordValidation, validate, forgetPassword);
router.post('/verify-otp', strictRateLimiter, verifyOTPValidation, validate, verifyOTP);
router.post('/reset-password', strictRateLimiter, resetPasswordValidation, validate, resetPassword);
router.post('/verify-email', verifyEmail);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback', 
    passport.authenticate('google', { 
        session: false, 
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_failed` 
    }), 
    googleAuthCallback
);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.get('/send-verification-email', strictRateLimiter, protect, sendVerificationEmail);

export default router;
