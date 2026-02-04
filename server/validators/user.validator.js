import { body } from "express-validator";

export const updateUserProfileValidation = [

    // Name (optional)
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),

    // Profile object (optional)
    body("profile")
        .optional()
        .isObject()
        .withMessage("Profile must be an object"),

    body("profile.bio")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Bio cannot exceed 500 characters"),

    body("profile.avatar")
        .optional()
        .isURL()
        .withMessage("Avatar must be a valid URL"),

    body("profile.phone")
        .optional({ nullable: true, checkFalsy: true })
        .isMobilePhone()
        .withMessage("Please provide a valid phone number"),

    body("profile.country")
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ min: 2 })
        .withMessage("Country name must be valid"),

    // Faculty profile (optional, role checked in controller)
    body("facultyProfile")
        .optional()
        .isObject()
        .withMessage("Faculty profile must be an object"),

    body("facultyProfile.expertise")
        .optional()
        .isArray()
        .withMessage("Expertise must be an array"),

    body("facultyProfile.expertise.*")
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Expertise items must be non-empty strings"),

    body("facultyProfile.yearsOfExperience")
        .optional()
        .isInt({ min: 0, max: 60 })
        .withMessage("Years of experience must be between 0 and 60"),
];

export const updateUserAccountStatusValidation = [
    body("accountStatus")
        .notEmpty().withMessage("Account status is required")
        .isIn(["ACTIVE", "SUSPENDED", "DEACTIVATED"])
        .withMessage("Account status must be one of: ACTIVE, SUSPENDED, DEACTIVATED"),
];

export const deleteMeValidation = [
    body("password")
        .notEmpty().withMessage("Password is required")
];
