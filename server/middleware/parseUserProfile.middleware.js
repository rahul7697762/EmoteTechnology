
/**
 * Middleware to parse JSON string fields from FormData (multer)
 * specific for user profile update
 */
export const parseUserProfileData = (req, res, next) => {
    try {
        if (req.body.profile && typeof req.body.profile === 'string') {
            req.body.profile = JSON.parse(req.body.profile);
        }
        if (req.body.facultyProfile && typeof req.body.facultyProfile === 'string') {
            req.body.facultyProfile = JSON.parse(req.body.facultyProfile);
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON data in profile fields'
        });
    }
};
