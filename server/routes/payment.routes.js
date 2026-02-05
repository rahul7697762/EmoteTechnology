import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createOrder, getKey, verifyPayment } from '../controllers/payment.controller.js';

const router = express.Router();

router.get('/key', protect, getKey);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;
