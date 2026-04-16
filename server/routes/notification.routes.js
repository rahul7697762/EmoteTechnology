import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, storeFcmToken } from '../controllers/notification.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { extractOptionalUserId } from '../middleware/optionalAuth.js'; // Assuming we create this

const router = express.Router();

router.post('/store-fcm-token', extractOptionalUserId, storeFcmToken);

router.get('/', verifyToken, getNotifications);
router.patch('/:id/read', verifyToken, markAsRead);
router.patch('/read-all', verifyToken, markAllAsRead);

export default router;
