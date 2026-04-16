import { Notification } from '../models/notification.model.js';
import { FcmToken } from '../models/FcmToken.js';

export const storeFcmToken = async (req, res) => {
    try {
        const { token, deviceInfo } = req.body;
        // userId is optional depending on if user is logged in
        let userId = req.user?.id || null;
        
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' });
        }

        // Check if token exists
        let existing = await FcmToken.findOne({ token });
        if (existing) {
            // Update user ID if it's now logged in, or update timestamp
            if (userId && !existing.userId) {
                existing.userId = userId;
            }
            if (deviceInfo) {
               existing.deviceInfo = deviceInfo;
            }
            await existing.save();
        } else {
            await FcmToken.create({ token, userId, deviceInfo });
        }

        res.status(200).json({ success: true, message: 'FCM Token stored successfully' });
    } catch (error) {
        console.error('Error storing FCM token:', error);
        res.status(500).json({
            success: false,
            message: 'Error storing FCM token'
        });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications'
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notification'
        });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notifications'
        });
    }
};
