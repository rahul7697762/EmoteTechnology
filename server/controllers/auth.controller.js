import User from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import { generateRandomOTP } from '../utils/generateRandomOTP.js';


/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */

// Signup controller function
export const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

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
            profile: { phone },
            lastLoginAt: new Date()
        }

        // creating new user in the database 
        const newUser = await User.create(user);

        // sending token in cookie
        generateToken(newUser._id, res);

        // remove the password field before sending response
        newUser.password = undefined;

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

        if(!user){
            return res.status(400).json({
                success: false,
                message: 'Invalid email, User not found'
            });
        }

        // comparing passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return  res.status(400).json({
                success: false,
                message: 'Invalid password'
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
    }catch (error) {
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
    try{
        const { email } = req.body;

        // check is user exists 
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User with this email does not exist'
            });
        } 
        
        // generate OTP for verification
        const otp = generateRandomOTP();

        // Here, you would typically send the OTP to the user's email.
        // For this example, we'll just return it in the response.
        // todo

        // saving OPT and its expiry to user
        user.passwordResetOtp = otp;
        user.passwordResetOTPExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'OTP sent to email successfully',
            otp // In production, do not send OTP in response
        });
    }catch(error){        
        console.error('Forget Password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

export const verifyOTP = async (req, res) => {
    try{
        const { email, otp } = req.body;

        // check is user exists 
        const user = await User.findOne({ email }).select('+passwordResetOtp').select('+passwordResetOTPExpires');
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User with this email does not exist'
            });
        }

        // verify OTP and its expiry
        if(user.passwordResetOtp !== otp || Date.now() > user.passwordResetOTPExpires){
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // removing OTP fields after successful verification
        user.passwordResetOtp = undefined;
        user.passwordResetOTPExpires = undefined;
        await user.save(); 

        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });
    }catch(error){        
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};