import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { notificationAPI } from '../components/Job-portal/services/api';
import { showToast } from '../components/Job-portal/services/toast';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (user?._id) {
            fetchNotifications();

            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const newSocket = io(backendUrl, {
                withCredentials: true
            });

            newSocket.emit('join', user._id);

            newSocket.on('notification', (payload) => {
                console.log('📬 Live Notification received:', payload);
                
                const newNotif = {
                    _id: payload.data.notificationId || `temp-${Date.now()}`,
                    title: payload.data.title,
                    message: payload.data.message,
                    type: payload.type,
                    isRead: false,
                    createdAt: new Date().toISOString(),
                    ...payload.data
                };

                setNotifications(prev => [newNotif, ...prev].slice(0, 20));
                setUnreadCount(prev => prev + 1);
                
                // Trigger toast for specific types
                if (payload.type === 'APPLICATION_STATUS' || payload.type === 'NEW_APPLICATION') {
                    showToast.success(`${payload.data.title}: ${payload.data.message}`);
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user?._id]);

    const fetchNotifications = async () => {
        try {
            const response = await notificationAPI.getNotifications();
            const fetchedNotifs = response.data.notifications || [];
            setNotifications(fetchedNotifs);
            setUnreadCount(fetchedNotifs.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => 
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            unreadCount, 
            fetchNotifications, 
            markAsRead, 
            markAllAsRead 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
