import { Router } from "express";
import {
    createSubModule,
    getSubModulesByModule,
    getSubModuleById,
    updateSubModule,
    publishSubModule,
    unpublishSubModule,
    deleteSubModule,
    reorderSubModules,
    getPreviewSubModules
} from "../controllers/subModule.controller.js";
import {
    createSubModuleValidation,
    updateSubModuleValidation,
    reorderSubModulesValidation
} from "../validators/subModule.validator.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { upload } from "../middleware/upload.middleware.js";

const router = Router();

/* =======================
   BASE: /api/submodule
   ======================= */

// 1. Create SubModule
router.post('/',
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    upload.single('video'),
    createSubModuleValidation,
    validate,
    createSubModule
);

// 2. Get All SubModules of a Module
router.get('/module/:moduleId',
    protect,
    getSubModulesByModule
);

// 9. Get Preview SubModules (Public)
router.get('/preview/:courseId',
    getPreviewSubModules
);

// 8. Reorder SubModules (Drag & Drop)
router.patch('/reorder',
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    reorderSubModulesValidation,
    validate,
    reorderSubModules
);

// 3. Get SubModule by ID
router.get('/:id',
    protect,
    getSubModuleById
);

// 4. Update SubModule
router.patch('/:id',
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    upload.single('video'),
    updateSubModuleValidation,
    validate,
    updateSubModule
);

// 5. Publish
router.patch('/:id/publish',
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    publishSubModule
);

// 6. Unpublish
router.patch('/:id/unpublish',
    protect,
    restrictTo('FACULTY', 'ADMIN'),
    unpublishSubModule
);

// 7. Delete
router.delete('/:id',
    protect,
    restrictTo('FACULTY', 'ADMIN'), // Added Faculty as per request logic (owner)
    deleteSubModule
);

export default router;
