import { razorpayInstance } from '../utils/razorpay.js';
import Payment from '../models/payment.model.js';
import Course from '../models/course.model.js';
import { Enrollment } from '../models/enrollment.model.js';
import crypto from 'crypto';

// @desc    Get Razorpay Key
// @route   GET /api/payment/key
// @access  Private
export const getKey = async (req, res) => {
    try {
        res.status(200).json({
            key: process.env.RAZORPAY_API_KEY
        })
    } catch (error) {
        console.error("Error in getKey:", error);
        res.status(500).json({ success: false, message: "Unable to get key", error: error.message });
    }

}

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user._id;

        const course = await Course.findOne({ _id: courseId, deletedAt: null });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ success: false, message: "Already enrolled in this course" });
        }

        let amount = course.price;
        if (course.discount > 0) {
            amount = course.price - (course.price * course.discount) / 100;
        }

        // Use finalPrice if available and matches calculation for safety, or just trust calculation
        if (course.finalPrice && Math.abs(course.finalPrice - amount) < 1) {
            amount = course.finalPrice;
        }

        if (amount <= 0) {
            return res.status(400).json({ success: false, message: "Course is free, please use direct enrollment" });
        }

        const options = {
            amount: Math.round(amount * 100), // amount in paise, ensuring integer
            currency: course.currency || "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);

        // Create Payment record
        await Payment.create({
            userId,
            courseId,
            orderId: order.id,
            amount,
            status: 'created',
            currency: course.currency || 'INR'
        });

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).json({ success: false, message: "Unable to create order", error: error.message });
    }
}

// @desc    Verify Payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest('hex');

        const payment = await Payment.findOne({ orderId: razorpay_order_id });
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment record not found" });
        }

        if (expectedSignature === razorpay_signature) {
            // Payment successful
            payment.paymentId = razorpay_payment_id;
            payment.signature = razorpay_signature;
            payment.status = 'paid';
            await payment.save();

            // Create Enrollment
            await Enrollment.create({
                userId: payment.userId,
                courseId: payment.courseId,
                accessType: 'PAID',
                status: 'ACTIVE',
                progressPercentage: 0,
                paymentId: payment._id
            });

            // Update course student count
            await Course.findByIdAndUpdate(payment.courseId, { $inc: { enrolledCount: 1 } });

            // Since this is likely called via API from frontend, we return JSON. 
            // If it was a form post, we would redirect.
            return res.status(200).json({
                success: true,
                message: "Payment verified and course enrolled"
            });
        } else {
            // Payment failed
            payment.status = 'failed';
            await payment.save();
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

    } catch (error) {
        console.error("Error in verifyPayment:", error);
        res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
    }
}
