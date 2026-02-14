import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import cookieParser from 'cookie-parser'; // Ensure this is imported

/**
 * Protect middleware - Verifies JWT token and authenticates user
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Try to get token from Authorization header first
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Fallback to JWT cookie
        else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            console.log('--- Auth Debug ---');
            console.log('Path:', req.path);
            console.log('Authorization Header:', req.headers.authorization ? 'Present' : 'Missing');
            console.log('Cookies present:', req.cookies ? Object.keys(req.cookies) : 'None');
            console.log('------------------');
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                console.log('Auth failed: User not found for ID', decoded.userId);
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            req.user = user;
            req.userId = user._id;
            next();
        } catch (error) {
            console.log('Token verification failed:', error.message);
            console.log('Token provided:', token.substring(0, 10) + '...');
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Session expired, please login again" });
            }
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }
    } catch (error) {
        console.error("Error in protect middleware:", error);
        return res.status(401).json({ message: "Not authorized" });
    }
};

/**
 * Restrict middleware - Restricts access to specific roles
 */
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        console.log(`Checking role access: User role=${req.user?.role}, Required roles=${roles}, Allowed=${roles.includes(req.user?.role)}`);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Your role (${req.user.role}) does not have permission. Required roles: ${roles.join(', ')}`
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
