import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const razorpayInstance = (process.env.RAZORPAY_API_KEY && process.env.RAZORPAY_API_SECRET)
    ? new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET,
    })
    : (() => {
        console.warn("⚠️  Razorpay API keys missing. Payment features will not work.");
        return null;
    })();

export { razorpayInstance };
