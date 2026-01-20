import { validationResult } from "express-validator";

// Middleware to validate request using express-validator
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed, Enter correct details',
            errors: errors.array()
        });
    }
    next();
};