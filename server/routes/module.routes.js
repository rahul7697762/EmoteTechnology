import { Router } from "express";
import {
    createModule, getModulesByCourse, getModuleById,
    updateModule, publishModule, unpublishModule,
    deleteModule, reorderModules, getModulesSummary
} from "../controllers/module.controller.js";
import {
    createModuleValidation, updateModuleValidation,
    reorderModulesValidation
} from "../validators/module.validator.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

/* =======================
   BASE: /api/v1 (from app.js)
   ======================= */

// 1. Create Module
router.post('/:courseId/create',
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    createModuleValidation,
    validate,
    createModule
);

// 2. Get All Modules of a Course
router.get('/:courseId',
    protect, // Optional? User said "protect (optional for public preview courses)", keeping protect for now as LMS usually requires login
    getModulesByCourse
);

// 8. Get Modules Summary (with sub-module counts)
router.get('/:courseId/summary',
    protect,
    getModulesSummary
);

// 7. Reorder Modules
router.patch('/:courseId/reorder',
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    reorderModulesValidation,
    validate,
    reorderModules
);

// 3. Get Single Module by ID
router.get('/:id',
    protect,
    getModuleById
);

// 4. Update Module
router.patch('/:id',
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    updateModuleValidation,
    validate,
    updateModule
);

// 5. Publish/Unpublish Module
router.patch('/:id/publish',
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    publishModule
);

router.patch('/:id/unpublish',
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    unpublishModule
);

// 6. Delete Module (Soft Delete)
router.delete('/:id',
    protect,
    restrictTo('FACULTY', 'ADMIN'), // User said Admin only recommended, or Faculty owner. Using both.
    deleteModule
);

export default router;
