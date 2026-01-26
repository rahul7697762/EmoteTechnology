import { Router } from "express";
import { deleteUserAccount, getAllUsers, getUserProfileById, updateUserAccountStatus, updateUserProfile } from "../controllers/user.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { deleteMeValidation, updateUserAccountStatusValidation, updateUserProfileValidation } from "../validators/user.validator.js";
import { validate } from "../middleware/validate.middleware.js";

import { parseUserProfileData } from "../middleware/parseUserProfile.middleware.js";

const router = Router();

// User profile routes
router.put("/profile", upload.single('avatar'), parseUserProfileData, updateUserProfileValidation, validate, protect, updateUserProfile);
// get users list only by admin
router.get("/", protect, restrictTo('ADMIN'), getAllUsers);
// get user by id only by adimin
router.get("/:id", protect, restrictTo('ADMIN'), getUserProfileById);
// update account status of user by admin
router.put("/:id/status", updateUserAccountStatusValidation, validate, protect, restrictTo('ADMIN'), updateUserAccountStatus);
// delete itself 
router.delete("/deleteMe", deleteMeValidation, validate, protect, deleteUserAccount);

export default router;
