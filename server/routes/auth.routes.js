import express from 'express';
import {signup, login, logout, getMe, forgetPassword, verifyOTP } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { forgotPasswordValidation, loginValidation, signupValidation, verifyOTPValidation } from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);
router.post('/forgot-password', forgotPasswordValidation, validate, forgetPassword);
router.post('/verify-otp', verifyOTPValidation, validate, verifyOTP);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
