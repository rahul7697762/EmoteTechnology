import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const NotificationsTab = () => {
    // Notification State - Mocked for now as per backend limitation
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        courseUpdates: true,
        marketing: false,
        securityAlerts: true
    });

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        // In a real app, you'd auto-save or have a save button for this
        // dispatch(updateNotifications({ [key]: !notifications[key] }));
        toast.success("Preference updated");
    };

    return (
        <div className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage what emails you receive.</p>
            </div>
            <div className="p-8 space-y-6">
                {[
                    { id: 'emailAlerts', title: 'Email Alerts', desc: 'Receive important updates about your account.' },
                    { id: 'courseUpdates', title: 'Course Updates', desc: 'Get notified when new content is added to your enrolled courses.' },
                    { id: 'marketing', title: 'Marketing', desc: 'Receive offers and promotions.' },
                    { id: 'securityAlerts', title: 'Security Alerts', desc: 'Get notified of any suspicious activity.' }
                ].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                        <button
                            onClick={() => handleNotificationChange(item.id)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.id] ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform transform ${notifications[item.id] ? 'translate-x-6' : 'translate-x-0'}`}></span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsTab;
