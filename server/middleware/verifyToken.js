import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
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
            return res.status(401).json({ 
                success: false,
                message: "Not authorized, no token" 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                return res.status(401).json({ 
                    success: false,
                    message: "Not authorized, user not found" 
                });
            }

            req.user = user;
            req.userId = user._id;
            next();
        } catch (error) {
            console.error('Token verification error:', error.message);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false,
                    message: "Session expired, please login again" 
                });
            }
            return res.status(401).json({ 
                success: false,
                message: "Not authorized, invalid token" 
            });
        }
    } catch (error) {
        console.error("Error in verifyToken middleware:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error during authentication" 
        });
    }
};
