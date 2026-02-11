import { Assessment } from "../models/assessment.model.js";
import { Module } from "../models/module.model.js";
import { Question } from "../models/question.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

import { uploadFileToBunny, deleteFileFromBunny } from "../services/bunny.service.js";

// Create Assessment
export const createAssessment = catchAsync(async (req, res, next) => {
    const { courseId, moduleId } = req.body;

    // 1. Check if module exists
    const module = await Module.findById(moduleId);
    if (!module) {
        return next(new AppError("Module not found", 404));
    }

    // 2. Check if assessment already exists for this module
    const existingAssessment = await Assessment.findOne({ moduleId, deletedAt: null });
    if (existingAssessment) {
        return next(new AppError("An assessment already exists for this module", 400));
    }

    // 3. Handle File Upload (Target: 'assignments' folder in BunnyCDN)
    let questionPdfUrl = null;
    if (req.file) {
        const fileName = `assignment-${Date.now()}-${req.file.originalname}`;
        questionPdfUrl = await uploadFileToBunny("assignments", req.file.buffer, fileName);
    }

    // 4. Create Assessment
    const assessmentData = {
        ...req.body,
        questionPdfUrl
    };

    const assessment = await Assessment.create(assessmentData);

    // 4. Update Module to hasAssessment = true
    module.hasAssessment = true;
    await module.save();

    res.status(201).json({
        success: true,
        data: assessment
    });
});

// Get Assessment for Faculty (with questions)
export const getAssessmentForFaculty = catchAsync(async (req, res, next) => {
    const { moduleId } = req.params;

    const assessment = await Assessment.findOne({ moduleId, deletedAt: null });

    if (!assessment) {
        return res.status(200).json({ success: true, data: null });
    }

    // specific check for faculty/admin? middleware handles auth, but ownship check maybe needed?
    // Assuming course middleware or logic handles that.

    // Fetch questions if it's a QUIZ
    let questions = [];
    if (assessment.type === 'QUIZ') {
        questions = await Question.find({ assessmentId: assessment._id }).sort({ order: 1 });
    }

    res.status(200).json({
        success: true,
        data: {
            ...assessment.toObject(),
            questions
        }
    });
});

// Get Assessment by ID (Faculty/Admin)
export const getAssessmentById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
        return next(new AppError("Assessment not found", 404));
    }

    // Fetch questions if it's a QUIZ
    let questions = [];
    if (assessment.type === 'QUIZ') {
        questions = await Question.find({ assessmentId: assessment._id }).sort({ order: 1 });
    }

    res.status(200).json({
        success: true,
        data: {
            ...assessment.toObject(),
            questions
        }
    });
});

// Update Assessment
export const updateAssessment = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let assessment = await Assessment.findById(id);
    if (!assessment) {
        return next(new AppError("Assessment not found", 404));
    }

    const { title, type } = req.body;

    // Handle File Update
    let questionPdfUrl = assessment.questionPdfUrl;

    if (req.file) {
        // 1. Delete old file if exists
        if (assessment.questionPdfUrl) {
            try {
                let oldUrl = assessment.questionPdfUrl;
                // Basic check to extract path relative to storage zone
                // URL structure: https://{pullzone}.b-cdn.net/{path} or https://{storage}.bunnycdn.com/{zone}/{path}
                // Our upload service returns: https://{pullzone}/{path}

                // We need to extract {path}
                const urlObj = new URL(oldUrl);
                // pathname = /directory/filename
                // deleteFileFromBunny expects "directory/filename"
                const relativePath = urlObj.pathname.substring(1);

                // Decode URI component in case of spaces/special chars
                await deleteFileFromBunny(decodeURIComponent(relativePath));
            } catch (err) {
                console.error("Failed to delete old assessment PDF:", err);
                // Proceed with upload
            }
        }

        // 2. Upload new file
        const fileName = `assignment-${Date.now()}-${req.file.originalname}`;
        questionPdfUrl = await uploadFileToBunny("assignments", req.file.buffer, fileName);
    }

    // Update fields
    if (title) assessment.title = title;
    // Type usually shouldn't change after creation as it implies different data structure, but allowing if needed
    if (type) assessment.type = type;
    if (questionPdfUrl) assessment.questionPdfUrl = questionPdfUrl;

    // Allow updating totalMarks and passingMarks (auto-calculated from frontend)
    if (req.body.totalMarks !== undefined) assessment.totalMarks = req.body.totalMarks;
    if (req.body.passingMarks !== undefined) assessment.passingMarks = req.body.passingMarks;

    await assessment.save();

    res.status(200).json({
        success: true,
        data: assessment
    });
});

// Delete Assessment
export const deleteAssessment = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const assessment = await Assessment.findById(id);
    if (!assessment) {
        return next(new AppError("Assessment not found", 404));
    }

    // Soft delete
    assessment.deletedAt = new Date();
    await assessment.save();

    // Update Module
    await Module.findByIdAndUpdate(assessment.moduleId, { hasAssessment: false });

    res.status(200).json({
        success: true,
        message: "Assessment deleted successfully"
    });
});

// Toggle Publish Status
export const togglePublishStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const assessment = await Assessment.findById(id);
    if (!assessment) {
        return next(new AppError("Assessment not found", 404));
    }

    // Toggle status
    const newStatus = assessment.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    assessment.status = newStatus;

    // Update publishedAt
    if (newStatus === 'PUBLISHED') {
        assessment.publishedAt = new Date();
    }

    await assessment.save();

    res.status(200).json({
        success: true,
        data: assessment,
        message: `Assessment ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'} successfully`
    });
});

// --- Questions Management ---

export const addQuestion = catchAsync(async (req, res, next) => {
    const { assessmentId } = req.params;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return next(new AppError("Assessment not found", 404));

    // Get highest order
    const lastQuestion = await Question.findOne({ assessmentId }).sort({ order: -1 });
    const order = lastQuestion ? lastQuestion.order + 1 : 1;

    const question = await Question.create({
        ...req.body,
        assessmentId,
        order
    });

    res.status(201).json({
        success: true,
        data: question
    });
});

export const updateQuestion = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const question = await Question.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!question) return next(new AppError("Question not found", 404));

    res.status(200).json({
        success: true,
        data: question
    });
});

export const deleteQuestion = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) return next(new AppError("Question not found", 404));

    res.status(200).json({
        success: true,
        message: "Question deleted"
    });
});

// Student: Get Assessment
export const getAssessmentForStudent = catchAsync(async (req, res, next) => {
    const { moduleId } = req.params;

    const assessment = await Assessment.findOne({ moduleId, deletedAt: null });

    if (!assessment) {
        return next(new AppError("Assessment not found", 404));
    }

    // Check if previous module completed? 
    // Usually locking is handled at module level access, but double check here?
    // For now, let's assume if they can get the ID via UI (which checks lock), they can access.
    // Or stricter: Check Module Locking Status here again.

    let questions = [];
    if (assessment.type === 'QUIZ') {
        // Exclude correctAnswer!
        questions = await Question.find({ assessmentId: assessment._id })
            .select('-correctAnswer -explanation') // Hide answers
            .sort({ order: 1 });
    }

    res.status(200).json({
        success: true,
        data: {
            ...assessment.toObject(),
            questions
        }
    });
});
