import { Submission } from "../models/submission.model.js";
import { Assessment } from "../models/assessment.model.js";
import { ModuleProgress } from "../models/moduleProgress.model.js";
import { Question } from "../models/question.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";
import { uploadFileToBunny } from "../services/bunny.service.js";
import { Module } from "../models/module.model.js";

// Get all submissions for a course (grouped by assessment)
export const getSubmissionsByCourse = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;

    // Get all assessments for this course
    const assessments = await Assessment.find({ courseId, deletedAt: null });

    // Get submissions for each assessment
    const submissionsData = await Promise.all(
        assessments.map(async (assessment) => {
            const submissions = await Submission.find({
                assessmentId: assessment._id,
                deletedAt: null
            })
                .populate('userId', 'name email profile.avatar')
                .sort({ submittedAt: -1 });

            const pendingCount = submissions.filter(s => s.status === 'PENDING_REVIEW').length;
            const passedCount = submissions.filter(s => s.status === 'PASSED').length;
            const failedCount = submissions.filter(s => s.status === 'FAILED').length;

            return {
                assessment: {
                    _id: assessment._id,
                    title: assessment.title,
                    type: assessment.type,
                    totalMarks: assessment.totalMarks,
                    passingMarks: assessment.passingMarks
                },
                stats: {
                    total: submissions.length,
                    pending: pendingCount,
                    passed: passedCount,
                    failed: failedCount
                },
                submissions
            };
        })
    );

    res.status(200).json({
        success: true,
        data: submissionsData
    });
});

// Get submissions for a specific assessment
export const getSubmissionsByAssessment = catchAsync(async (req, res, next) => {
    const { assessmentId } = req.params;
    const { status } = req.query; // Optional filter by status

    const query = {
        assessmentId,
        deletedAt: null
    };

    if (status) {
        query.status = status;
    }

    const submissions = await Submission.find(query)
        .populate('userId', 'name email profile.avatar')
        .populate('assessmentId', 'title type totalMarks passingMarks questionPdfUrl')
        .sort({ submittedAt: -1 });

    res.status(200).json({
        success: true,
        data: submissions
    });
});

// Get My Submissions for an Assessment (Student)
export const getMySubmissions = catchAsync(async (req, res, next) => {
    const { assessmentId } = req.params;
    const userId = req.user._id;

    const submissions = await Submission.find({
        assessmentId,
        userId,
        deletedAt: null
    }).sort({ submittedAt: -1 });

    res.status(200).json({
        success: true,
        data: submissions
    });
});

// Review and grade a submission (for PDF submissions)
export const reviewSubmission = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { score, status } = req.body; // status: 'PASSED' or 'FAILED'

    const submission = await Submission.findById(id);
    if (!submission) {
        return next(new AppError("Submission not found", 404));
    }

    // Only allow review of PDF submissions or manual override
    if (submission.submissionType === 'QUIZ' && submission.status !== 'PENDING_REVIEW') {
        return next(new AppError("Quiz submissions are auto-graded", 400));
    }

    // Update submission
    submission.score = score;
    submission.status = status;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    submission.evaluatedAt = new Date();

    await submission.save();

    let moduleId;
    let isModuleCompleted = false;

    // If Passed, update Module Completion
    if (status === 'PASSED') {
        const assessment = await Assessment.findById(submission.assessmentId);
        if (assessment) {
            moduleId = assessment.moduleId;

            // Update Module Progress (Assessment Passed ONLY)
            await ModuleProgress.findOneAndUpdate(
                {
                    userId: submission.userId,
                    moduleId: assessment.moduleId,
                    courseId: assessment.courseId
                },
                {
                    assessmentPassed: true,
                    // isCompleted: true, // REMOVED: Do not force completion here.
                    // completedAt: new Date()
                },
                { upsert: true, new: true }
            );

            // Check and update overall module completion
            // Dynamically import to avoid circular dependency
            const { checkModuleCompletion } = await import('./progress.controller.js');
            const completionResult = await checkModuleCompletion(submission.userId, assessment.moduleId, assessment.courseId);

            if (completionResult?.isModuleCompleted) {
                isModuleCompleted = true;
            }
        }
    }

    res.status(200).json({
        success: true,
        data: {
            ...submission.toObject(),
            moduleId,
            isModuleCompleted
        },
        message: `Submission ${status.toLowerCase()} successfully`
    });
});

// Get Submissions for an Assessment (Faculty View)
export const getSubmissions = catchAsync(async (req, res, next) => {
    const { assessmentId } = req.params;
    const { status } = req.query;

    const query = { assessmentId };
    if (status) query.status = status;

    const submissions = await Submission.find(query)
        .populate('userId', 'name email avatar')
        .sort({ submittedAt: -1 });

    res.status(200).json({
        success: true,
        count: submissions.length,
        data: submissions
    });
});

export const getSubmissionById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const submission = await Submission.findById(id)
        .populate('userId', 'name email')
        .populate('assessmentId', 'title totalMarks passingMarks questionPdfUrl');

    if (!submission) {
        return next(new AppError("Submission not found", 404));
    }

    res.status(200).json({
        success: true,
        data: submission
    });
});

// Grade PDF Submission (Faculty)
export const gradeSubmission = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { score, status, feedback } = req.body; // status: PASSED / FAILED

    const submission = await Submission.findById(id);
    if (!submission) {
        return next(new AppError("Submission not found", 404));
    }

    submission.score = score;
    submission.status = status;
    submission.reviewedBy = req.user.id;
    submission.reviewedAt = new Date();
    // submission.feedback = feedback; // Add feedback field to schema if needed, for now ignoring

    await submission.save();

    let moduleId;
    let isModuleCompleted = false;

    // If Passed, update Module Completion
    if (status === "PASSED") {
        const assessment = await Assessment.findById(submission.assessmentId);
        if (assessment) {
            moduleId = assessment.moduleId;

            // Find existing ModuleProgress or create (Assessment Passed ONLY)
            await ModuleProgress.findOneAndUpdate(
                {
                    userId: submission.userId,
                    moduleId: assessment.moduleId,
                    courseId: assessment.courseId
                },
                {
                    assessmentPassed: true,
                    // isCompleted: true, // REMOVED: Do not force completion
                    // completedAt: new Date()
                },
                { upsert: true, new: true }
            );

            // Trigger Unlock Check
            const { checkModuleCompletion } = await import('./progress.controller.js');
            const completionResult = await checkModuleCompletion(submission.userId, assessment.moduleId, assessment.courseId);

            if (completionResult?.isModuleCompleted) {
                isModuleCompleted = true;
            }

            // Also we might need to Trigger Unlock Next Module? 
            // Logic handles it on 'getCourseContent' usually, but maybe we push notification.
        }
    }

    res.status(200).json({
        success: true,
        data: {
            ...submission.toObject(),
            moduleId,
            isModuleCompleted
        }
    });
});

// Student: Submit Assessment
export const submitAssessment = catchAsync(async (req, res, next) => {
    const { assessmentId } = req.params;
    const { answers, submissionType } = req.body;
    const userId = req.user._id;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
        return next(new AppError("Assessment not found", 404));
    }

    let score = 0;
    let status = 'PENDING_REVIEW';
    let assessmentPassed = false;

    // Logic for QUIZ
    if (submissionType === 'QUIZ' || assessment.type === 'QUIZ') {
        const questions = await Question.find({ assessmentId });
        const totalQuestions = questions.length;
        let correctCount = 0;

        // Calculate score
        if (answers && questions.length > 0) {
            questions.forEach(q => {
                const studentAnswer = answers.find(a => a.questionId === q._id.toString());
                if (studentAnswer && studentAnswer.selectedOption === q.correctAnswer) {
                    correctCount++;
                    score += (q.marks || 1); // Add question marks to score
                }
            });
        }

        // Cap score at assessment total marks (sanity check)
        if (score > assessment.totalMarks) {
            score = assessment.totalMarks;
        }

        assessmentPassed = score >= assessment.passingMarks;
        status = assessmentPassed ? 'PASSED' : 'FAILED';
    }
    // Logic for PDF (Assignment)
    else if (submissionType === 'PDF' || assessment.type === 'PDF') {
        // PDF status is pending
        // assessmentPassed remains false until graded
    }

    // Handle File Upload for PDF
    let uploadedFileUrl = null;
    if (req.file) {
        // Upload to BunnyCDN
        const fileName = `submission-${assessmentId}-${userId}-${Date.now()}-${req.file.originalname}`;
        uploadedFileUrl = await uploadFileToBunny("submissions", req.file.buffer, fileName);
    } else if (req.body.fileUrl) {
        // Fallback if URL is sent directly (e.g. implementation change)
        uploadedFileUrl = req.body.fileUrl;
    }

    // Calculate attempt number
    const previousAttempts = await Submission.countDocuments({
        assessmentId,
        userId,
        deletedAt: null
    });
    const attemptNumber = previousAttempts + 1;

    // Create Submission
    const submission = await Submission.create({
        assessmentId,
        userId,
        attemptNumber,
        answers: submissionType === 'QUIZ' ? answers : [],
        // Map fileUrl/pdfUrl correctly. 
        pdfUrl: submissionType === 'PDF' ? uploadedFileUrl : null,
        submissionType: submissionType || assessment.type, // Fallback to assessment type
        score,
        status,
        submittedAt: Date.now()
    });

    let isModuleCompleted = false;

    // If Quiz Passed, update Module Progress
    if (assessmentPassed) {
        await ModuleProgress.findOneAndUpdate(
            {
                userId,
                moduleId: assessment.moduleId,
                courseId: assessment.courseId
            },
            {
                assessmentPassed: true
            },
            { upsert: true, new: true }
        );

        // Trigger generic check (Content + Assessment)
        // Dynamically import to avoid circular dependency issues if any
        const { checkModuleCompletion } = await import('./progress.controller.js');
        const completionResult = await checkModuleCompletion(userId, assessment.moduleId, assessment.courseId);

        if (completionResult?.isModuleCompleted) {
            isModuleCompleted = true;
        }
    }

    // Return result
    res.status(201).json({
        success: true,
        data: {
            ...submission.toObject(),
            passed: assessmentPassed,
            moduleId: assessment.moduleId,
            isModuleCompleted
        }
    });
});
