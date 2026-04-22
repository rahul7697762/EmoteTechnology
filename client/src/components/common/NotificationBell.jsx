import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock as ClockIcon } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const bellRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bellRef.current && !bellRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }
        setIsOpen(false);
        
        // Navigation logic based on notification type
        if (notification.type === 'APPLICATION_STATUS') {
            navigate('/student/applications');
        } else if (notification.type === 'NEW_APPLICATION') {
            navigate('/company/applicants');
        } else if (notification.metadata && notification.metadata.courseId) {
            navigate(`/course/${notification.metadata.courseId}`);
        }
    };

    return (
        <div className="relative" ref={bellRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#0a0a0f]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 bg-white dark:bg-[#1a1c23] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[380px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3 opacity-50" />
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group relative cursor-pointer ${!notification.isRead ? 'bg-teal-50/10 dark:bg-teal-500/5' : ''}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${notification.type === 'APPLICATION_STATUS' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                                                }`}>
                                                {notification.type === 'APPLICATION_STATUS' ? <ClockIcon size={20} /> : <Bell size={20} />}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-6">
                                                <p className={`text-sm font-bold text-gray-900 dark:text-white mb-0.5 truncate ${!notification.isRead ? '' : 'opacity-70'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                    <ClockIcon size={12} />
                                                    <span>{new Date(notification.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(notification._id);
                                                    }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-teal-100 dark:border-teal-900/30 bg-white dark:bg-gray-800"
                                                    title="Mark as read"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-100 dark:border-gray-800 text-center bg-gray-50/30 dark:bg-gray-800/10">
                        <button className="text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-teal-500 transition-colors uppercase tracking-widest">
                            View all activities
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
