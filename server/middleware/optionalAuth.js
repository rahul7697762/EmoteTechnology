import jwt from 'jsonwebtoken';

export const extractOptionalUserId = (req, res, next) => {
    // If there is a token, try to decode it, but don't fail if there isn't one
    let token = req.cookies?.token;
    
    // Also check Auth header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Ignore token error, allow anonymous
             console.log('OptionalAuth: Token attached but invalid or expired');
        }
    }
    
    next();
};
