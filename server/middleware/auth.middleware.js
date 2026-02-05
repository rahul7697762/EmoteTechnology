import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import cookieParser from 'cookie-parser'; // Ensure this is imported

/**
 * Protect middleware - Verifies JWT token and authenticates user
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Session expired, please login again" });
        }
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

/**
 * Optional Protect middleware - Populates req.user if valid token exists, otherwise continues without error
 */
export const optionalProtect = async (req, res, next) => {
    try {
        let token;

        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (user) {
                req.user = user;
            }
        } catch (err) {
            // Token invalid or expired, just proceed as guest
        }
        next();
    } catch (error) {
        console.log("Error in optionalProtect", error);
        next();
    }
};
