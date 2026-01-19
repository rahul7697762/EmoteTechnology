import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import cookieParser from 'cookie-parser'; // Ensure this is imported

/**
 * Protect middleware - Verifies JWT token and authenticates user
 */
export const protect = async (req, res, next) => {
    try {
        // Ensure req.cookies is defined
        if (!req.cookies || !req.cookies.jwt) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const token = req.cookies.jwt;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute", error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

/**
 * Restrict middleware - Restricts access to specific roles
 */
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.'
            });
        }
        next();
    };
};
