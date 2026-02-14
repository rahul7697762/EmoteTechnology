import { body, param, query } from "express-validator";

export const createCourseValidation = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .trim(),

    body("description")
        .notEmpty().withMessage("Description is required")
        .trim(),

    body("price")
        .notEmpty().withMessage("Price is required")
        .isNumeric().withMessage("Price must be a number")
        .isFloat({ min: 0 }).withMessage("Price must be a non-negative number")
        .custom((value) => {
            if (parseFloat(value) < 0) {
                throw new Error("Price cannot be negative");
            }
            return true;
        }),

    body("discount")
        .optional({ checkFalsy: true })
        .isNumeric().withMessage("Discount must be a number")
        .isFloat({ min: 0, max: 100 }).withMessage("Discount must be between 0 and 100"),

    body("category")
        .notEmpty().withMessage("Category is required")
        .trim()
        .isIn(["TECH", "NON-TECH", "ASSESSMENT", "SOFT-SKILLS", "LANGUAGES", "BUSINESS"]).withMessage("Invalid category"),

    body("instructor")
        .optional()
        .isMongoId().withMessage("Instructor must be a valid user ID")
        .trim(),

    body("level")
        .optional()
        .isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).withMessage("Invalid level"),

    body("language")
        .optional()
        .isString().withMessage("Language must be a string")
        .trim(),

    body("currency")
        .optional()
        .isIn(["USD", "EUR", "INR"]).withMessage("Invalid currency"),

    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array of strings"),

    body("requirements")
        .optional()
        .isArray().withMessage("Requirements must be an array of strings"),

    body("learningOutcomes")
        .optional()
        .isArray().withMessage("Learning outcomes must be an array of strings"),

    body("certificateEnabled")
        .optional()
        .isBoolean().withMessage("Certificate enabled must be a boolean"),
];

export const rejectCourseValidation = [
    body("rejectionReason")
        .notEmpty().withMessage("Rejection reason is required")
        .isString().withMessage("Rejection reason must be a string")
        .trim()
];

export const updateCourseValidation = [
    body("title").optional().notEmpty().withMessage("Title cannot be empty").trim(),
    body("description").optional().notEmpty().withMessage("Description cannot be empty").trim(),
    body("price").optional().isNumeric().isFloat({ min: 0 }).withMessage("Price must be non-negative"),
    body("discount").optional().isNumeric().isFloat({ min: 0, max: 100 }),
    body("category").optional().isIn(["TECH", "NON-TECH", "ASSESSMENT", "SOFT-SKILLS", "LANGUAGES", "BUSINESS"]),
    body("level").optional().isIn(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    body("status").optional().isIn(["DRAFT", "UNDER_REVIEW"]).withMessage("Invalid status update"),
    body("tags").optional().isArray(),
    body("requirements").optional().isArray(),
    body("learningOutcomes").optional().isArray()
];

export const statusCourseValidation = [
    body("status")
        .notEmpty().withMessage("Status is required")
        .isIn(["DRAFT", "UNDER_REVIEW", "PUBLISHED"]).withMessage("Invalid status")
];