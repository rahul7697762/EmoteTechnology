import { body, param } from 'express-validator';

export const createSubModuleValidation = [
    body('courseId').notEmpty().withMessage('Course ID is required'),
    body('moduleId').notEmpty().withMessage('Module ID is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('type').isIn(['VIDEO', 'ARTICLE']).withMessage('Type must be VIDEO or ARTICLE'),
    // Optional video fields validation if type is VIDEO could be done here or controller
];

export const updateSubModuleValidation = [
    param('id').isMongoId().withMessage('Invalid SubModule ID')
];

export const reorderSubModulesValidation = [
    body('moduleId').notEmpty().withMessage('Module ID is required'),
    body('subModules').isArray({ min: 1 }).withMessage('subModules array is required'),
    body('subModules.*.subModuleId').notEmpty().withMessage('subModuleId is required'),
    body('subModules.*.order').isInt().withMessage('Order must be an integer')
];
