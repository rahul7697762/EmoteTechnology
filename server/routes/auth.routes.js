import express from 'express';
import {signup, login, logout, getMe, forgetPassword, verifyOTP, resetPassword, sendVerificationEmail, verifyEmail } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { forgotPasswordValidation, loginValidation, resetPasswordValidation, signupValidation, verifyOTPValidation } from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { strictRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', strictRateLimiter, signupValidation, validate, signup);
router.post('/login', strictRateLimiter, loginValidation, validate, login);
router.post('/forgot-password', strictRateLimiter, forgotPasswordValidation, validate, forgetPassword);
router.post('/verify-otp', strictRateLimiter, verifyOTPValidation, validate, verifyOTP);
router.post('/reset-password', strictRateLimiter,resetPasswordValidation,validate, resetPassword);
router.post('/verify-email', verifyEmail);


// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.get('/send-verification-email', strictRateLimiter, protect, sendVerificationEmail);

export default router;
