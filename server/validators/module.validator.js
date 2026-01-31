import { body, param } from "express-validator";

export const createModuleValidation = [
    param('courseId').isMongoId().withMessage('Invalid Course ID'),
    body('title')
        .trim()
        .notEmpty().withMessage('Module title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('order')
        .optional()
        .isInt({ min: 1 }).withMessage('Order must be a positive integer')
];

export const updateModuleValidation = [
    param('id').isMongoId().withMessage('Invalid Module ID'),
    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Title cannot be empty')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('order')
        .optional()
        .isInt({ min: 1 }).withMessage('Order must be a positive integer')
];

export const reorderModulesValidation = [
    param('courseId').isMongoId().withMessage('Invalid Course ID'),
    body('modules')
        .isArray({ min: 1 }).withMessage('Modules array is required')
        .custom((modules) => {
            const isValid = modules.every(m => m.moduleId && m.order);
            if (!isValid) throw new Error('Each item must have moduleId and order');
            return true;
        })
];
