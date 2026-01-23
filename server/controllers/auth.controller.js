import User from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateRandomOTP } from '../utils/generateRandomOTP.js';
import { sendEmail } from '../utils/sendMail.js';
import { otpMailTemplate, verificationMailTemplate, welcomeMailTemplate } from '../constants/mailTemplates.js';


/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */

// Signup controller function
export const signup = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // checking is email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        // hashing the password for security 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // user object creation
        const user = {
            name,
            email,
            password: hashedPassword,
            role: role || 'STUDENT',
            profile: { phone },
            lastLoginAt: new Date()
        }

        // creating new user in the database 
        const newUser = await User.create(user);

        // sending token in cookie
        generateToken(newUser._id, res);

        // remove the password field before sending response
        newUser.password = undefined;

        // sending a welcome email to the user
        sendEmail(user.email, 'Welcome to Emote Tech.', welcomeMailTemplate(user.name));

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */

// Login controller function
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // checking if user exists
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email, User not found'
            });
        }

        // comparing passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        //checkng if user account is active
        if(user.accountStatus !== "ACTIVE"){
            return res.status(403).json({
                success: false,
                message: `Your account is ${user.accountStatus}. Please contact support.`
            });
        }

        // updating last login time
        user.lastLoginAt = new Date();
        await user.save();

        // sending token in cookie
        generateToken(user._id, res);

        // remove the password field before sending response
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */

// getme controller function for fetching current user details
export const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.log('Error in getMe:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */

// Logout controller function for logging out user
export const logout = (req, res) => {
    // Clear the auth token cookie
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/"
    });
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

/**
 * @route   POST /api/auth/forget-password
 * @desc    Handle forget password
 * @access  Public
 */

// Implementation for forget password
export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // check is user exists 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User with this email does not exist'
            });
        }

        // generate OTP for verification
        const otp = generateRandomOTP();

        // sending mail with OTP to user
        sendEmail(user.email, 'Password Reset OTP', otpMailTemplate(user.name, otp));

        // saving OPT and its expiry to user
        user.passwordResetOtp = otp;
        user.passwordResetOTPExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'OTP sent to email successfully',
            otp // In production, do not send OTP in response
        });
    } catch (error) {
        console.error('Forget Password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Handle verify OTP
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // check is user exists 
        const user = await User.findOne({ email }).select('+passwordResetOtp').select('+passwordResetOTPExpires');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User with this email does not exist'
            });
        }

        // verify OTP and its expiry
        if (user.passwordResetOtp !== otp || Date.now() > user.passwordResetOTPExpires) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // generate reset token for password change
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

        // removing OTP fields after successful verification
        user.passwordResetOtp = undefined;
        user.passwordResetOTPExpires = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            resetToken // frontend will use this for password change
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Change password using reset token
 * @access  Public
 */

export const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // validate input
        if (!resetToken || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Reset token and new password are required'
            });
        }

        // find user with valid reset token
        const user = await User.findOne({
            resetToken,
            resetTokenExpiry: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // clear reset token fields
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

/**
 * @route   GET /api/auth/send-verification-email
 * @desc    Send email verification link to user 
 * @access  Private
 */

export const sendVerificationEmail = async (req, res) => {
    const user = req.user;
    try {
        // generating verification Token for email verification
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // saving verification token and its expiry to user
        user.emailVerificationToken = verificationToken;
        user.emailVerificationTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        // creating verification link
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        // sending verification email to user
        sendEmail(user.email, 'Email Verification - Emote Tech.', verificationMailTemplate(user.name, verificationLink));

        return res.status(200).json({
            success: true,
            message: "Verification email sent successfully"
        })
    } catch (error) {
        console.error('Send Verification Email error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}


/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email using verification token  
 * @access  Public
 */

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        // finding user with valid verification token
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        // updating user email verification status
        user.isVerified = true;

        //removing verification token fields
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        console.error('Email Verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};