import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import { Certificate } from '../models/certificate.model.js';
import { Enrollment } from '../models/enrollment.model.js';
import { Assessment } from '../models/assessment.model.js';
import { Submission } from '../models/submission.model.js';
import User from '../models/user.model.js';
import Course from '../models/course.model.js';
import { Notification } from '../models/notification.model.js';
import { uploadFileToBunny } from '../services/bunny.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

/* =========================================
   HELPER: GENERATE PDF
   Returns a Buffer containing the PDF
========================================= */
const generateCertificatePDF = async ({ studentName, courseTitle, certificateNumber, issueDate }) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margin: 0
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // -- Background & Border --
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

        // Ornamental Border
        const margin = 20;
        doc.rect(margin, margin, doc.page.width - (margin * 2), doc.page.height - (margin * 2))
            .strokeColor('#1e40af') // Blue-800
            .lineWidth(5)
            .stroke();

        doc.rect(margin + 5, margin + 5, doc.page.width - ((margin + 5) * 2), doc.page.height - ((margin + 5) * 2))
            .strokeColor('#fbbf24') // Amber-400
            .lineWidth(2)
            .stroke();

        // -- Header --
        doc.moveDown(4);
        doc.font('Helvetica-Bold').fontSize(40).fillColor('#1e3a8a').text('CERTIFICATE', { align: 'center' });
        doc.font('Helvetica').fontSize(20).fillColor('#64748b').text('OF COMPLETION', { align: 'center', characterSpacing: 5 });

        // -- Body --
        doc.moveDown(2);
        doc.fontSize(16).fillColor('#475569').text('This certifies that', { align: 'center' });

        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(36).fillColor('#0f172a').text(studentName, { align: 'center' });

        doc.moveDown(1);
        doc.font('Helvetica').fontSize(16).fillColor('#475569').text('has successfully completed the course', { align: 'center' });

        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(28).fillColor('#1e40af').text(courseTitle, { align: 'center' });

        // -- Footer Details --
        const bottomY = doc.page.height - 130;

        // Issue Date
        doc.fontSize(12).fillColor('#64748b').text(`Date Issued: ${issueDate}`, 100, bottomY);

        // Certificate Number
        doc.fontSize(12).text(`Certificate ID: ${certificateNumber}`, doc.page.width - 300, bottomY, { align: 'right' });

        // Automated Signature (Mock)
        doc.moveTo(doc.page.width / 2 - 100, bottomY - 10).lineTo(doc.page.width / 2 + 100, bottomY - 10).strokeColor('#cbd5e1').lineWidth(1).stroke();
        doc.fontSize(14).font('Helvetica-Oblique').text('Emote Technology', 0, bottomY - 35, { align: 'center', width: doc.page.width });
        doc.fontSize(10).font('Helvetica').text('(Presigned Verification)', 0, bottomY, { align: 'center', width: doc.page.width });

        doc.end();
    });
};


/* =========================================
   CORE: ISSUE CERTIFICATE
   Generates, Uploads, Saves, Notifies
========================================= */
const issueCertificate = async (userId, courseId) => {
    const user = await User.findById(userId).select('name email');
    const course = await Course.findOne({ _id: courseId, deletedAt: null }).select('title');

    if (!user || !course) throw new Error("Invalid user or course for certificate issuance");

    // 1. Generate Unique Identifiers
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    const timestamp = Date.now();
    const certificateNumber = `CERT-${timestamp}-${randomSuffix}`;

    // Hash for verification (URL safe)
    const verificationHash = crypto
        .createHash('sha256')
        .update(certificateNumber + (process.env.CERT_SECRET || 'secret'))
        .digest('hex');

    // 2. Generate PDF
    const issueDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const pdfBuffer = await generateCertificatePDF({
        studentName: user.name,
        courseTitle: course.title,
        certificateNumber,
        issueDate
    });

    // 3. Upload to BunnyCDN
    const fileName = `${certificateNumber}.pdf`;
    const certificateUrl = await uploadFileToBunny('certificates', pdfBuffer, fileName);

    // 4. Save Record
    const certificate = await Certificate.create({
        userId,
        courseId,
        certificateNumber,
        certificateUrl,
        verificationHash,
        status: 'ACTIVE'
    });

    // 5. Update Enrollment Status (Double check assurance)
    await Enrollment.findOneAndUpdate(
        { userId, courseId },
        {
            status: 'COMPLETED',
            completedAt: new Date(),
        }
    );

    // 6. Notify User
    await Notification.create({
        userId,
        type: 'CERTIFICATE_ISSUED',
        title: 'Certificate Issued! 🎓',
        message: `Congratulations! You have successfully completed "${course.title}". Your certificate is ready to download.`,
        metadata: { courseId }
    });

    return certificate;
};


/* =========================================
   LOGIC: CHECK ELIGIBILITY & TRIGGER
   Called after progress updates
========================================= */
export const tryIssueCertificate = async (userId, courseId) => {
    try {
        console.log(`Checking certificate eligibility for User: ${userId}, Course: ${courseId}`);

        // 1. Check Enrollment & Progress
        const enrollment = await Enrollment.findOne({ userId, courseId });
        if (!enrollment) return false;

        // STRICT CHECK: Must be >= 90% (or 100% depending on business logic, sticking to 90 as per plan)
        if (enrollment.progressPercentage < 90) {
            console.log(`Progress ${enrollment.progressPercentage}% < 90%. Not eligible.`);
            return false;
        }

        // 2. Check Mandatory Assessments
        const mandatoryAssessments = await Assessment.find({
            courseId,
            isMandatory: true,
            status: 'PUBLISHED'
        }).select('_id');

        if (mandatoryAssessments.length > 0) {
            const passedSubmissions = await Submission.find({
                userId,
                assessmentId: { $in: mandatoryAssessments.map(a => a._id) },
                status: 'PASSED'
            }).distinct('assessmentId');

            if (passedSubmissions.length !== mandatoryAssessments.length) {
                console.log(`Pending mandatory assessments. Passed: ${passedSubmissions.length}/${mandatoryAssessments.length}`);
                return false;
            }
        }

        // 3. Check if already issued
        const existingCert = await Certificate.findOne({ userId, courseId });
        if (existingCert) {
            console.log("Certificate already exists.");
            return existingCert;
        }

        // 4. Issue It!
        console.log("Eligibility met. Issuing certificate...");
        const newCert = await issueCertificate(userId, courseId);
        return newCert;

    } catch (error) {
        console.error("Certificate Issuance Failed:", error);
        // Don't throw, just log. We don't want to break the progress update flow.
        return false;
    }
};


/* =========================================
   CONTROLLERS
========================================= */

// GET /api/certificates/me
export const getMyCertificates = catchAsync(async (req, res, next) => {
    const certificates = await Certificate.find({ userId: req.user.id })
        .populate('courseId', 'title thumbnail')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: certificates.length,
        data: certificates
    });
});

// GET /api/certificates/course/:courseId
export const getCertificateByCourse = catchAsync(async (req, res, next) => {
    const certificate = await Certificate.findOne({
        userId: req.user.id,
        courseId: req.params.courseId
    });

    if (!certificate) {
        return res.status(404).json({
            success: false,
            message: "No certificate found for this course."
        });
    }

    res.status(200).json({
        success: true,
        data: certificate
    });
});

// GET /api/certificates/verify/:certificateNumber
export const verifyCertificate = catchAsync(async (req, res, next) => {
    const { certificateNumber } = req.params;

    const certificate = await Certificate.findOne({
        certificateNumber,
        status: 'ACTIVE'
    })
        .populate('userId', 'name')
        .populate('courseId', 'title description');

    if (!certificate) {
        return next(new AppError("Invalid or revoked certificate.", 404));
    }

    res.status(200).json({
        success: true,
        data: {
            valid: true,
            student: certificate.userId.name,
            course: certificate.courseId.title,
            issuedAt: certificate.issuedAt,
            certificateUrl: certificate.certificateUrl
        }
    });
});

// POST /api/certificates/issue (Admin/Manual Override)
export const manualIssue = catchAsync(async (req, res, next) => {
    const { userId, courseId } = req.body;

    // Check existence
    const exists = await Certificate.findOne({ userId, courseId });
    if (exists) {
        return res.status(200).json({ success: true, message: "Certificate already exists", data: exists });
    }

    const cert = await issueCertificate(userId, courseId);

    res.status(201).json({
        success: true,
        message: "Certificate issued manually",
        data: cert
    });
});
