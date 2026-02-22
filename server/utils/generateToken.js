import jwt from 'jsonwebtoken';


/**
 * Generate JWT Token and set it in cookie
 */
export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    })

    // Cookie settings - adjust for development vs production
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction, // Only secure in production
        path: "/"
    }

    res.cookie("jwt", token, cookieOptions);
    return token;
};