import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
        toast.success("Preference updated");
    };

    return (
        <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-8 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5">
                <h2 className="text-2xl font-bold" style={{ fontFamily: SERIF }}>Notification Preferences</h2>
                <p className="text-[#6B7194] dark:text-[#8B90B8] text-[10px] uppercase tracking-widest mt-2 font-semibold" style={{ fontFamily: MONO }}>Manage what emails you receive.</p>
            </div>
            <div className="p-8 space-y-4">
                {[
                    { id: 'emailAlerts', title: 'Email Alerts', desc: 'Receive important updates about your account.' },
                    { id: 'courseUpdates', title: 'Course Updates', desc: 'Get notified when new content is added to your enrolled courses.' },
                    { id: 'marketing', title: 'Marketing', desc: 'Receive offers and promotions.' },
                    { id: 'securityAlerts', title: 'Security Alerts', desc: 'Get notified of any suspicious activity.' }
                ].map((item, index) => (
                    <div key={item.id} className={`flex items-center justify-between p-6 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#F7F8FF] dark:bg-[#1A1D2E] hover:border-[#3B4FD8]/20 dark:hover:border-[#6C7EF5]/20 transition-colors`}>
                        <div className="pr-6">
                            <h3 className="font-semibold text-lg mb-1" style={{ fontFamily: SERIF }}>{item.title}</h3>
                            <p className="text-[#6B7194] dark:text-[#8B90B8] text-xs font-mono">{item.desc}</p>
                        </div>
                        <button
                            onClick={() => handleNotificationChange(item.id)}
                            className={`w-12 h-6 shrink-0 transition-colors relative border ${notifications[item.id] ? 'bg-[#3B4FD8] dark:bg-[#6C7EF5] border-[#3B4FD8] dark:border-[#6C7EF5]' : 'bg-[#E8EAF2] dark:bg-[#252A41] border-[#3B4FD8]/20 dark:border-[#6C7EF5]/30'}`}
                        >
                            <span className={`absolute top-0.5 left-1 bg-white dark:bg-[#E8EAF2] w-4 h-4 transition-transform transform ${notifications[item.id] ? 'translate-x-[22px]' : 'translate-x-0'}`}></span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsTab;
