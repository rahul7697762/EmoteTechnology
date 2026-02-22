import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Bell, Mail, MessageSquare, Briefcase } from 'lucide-react';

const CompanyNotificationsTab = () => {
  // Notification State - Mocked
  const [notifications, setNotifications] = useState({
    newApplicant: true,
    jobExpiry: true,
    candidateMessages: true,
    marketing: false,
    securityAlerts: true
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    // In a real app, dispatch update here
    toast.success("Preference updated");
  };

  const notificationItems = [
    {
      id: 'newApplicant',
      title: 'New Applicant Alerts',
      desc: 'Get notified immediately when someone applies to your jobs.',
      icon: UsersIcon
    },
    {
      id: 'candidateMessages',
      title: 'Candidate Messages',
      desc: 'Receive email alerts for new messages from candidates.',
      icon: MessageSquare
    },
    {
      id: 'jobExpiry',
      title: 'Job Post Expiry',
      desc: 'Get reminded before your job postings expire.',
      icon: Briefcase
    },
    {
      id: 'securityAlerts',
      title: 'Security Alerts',
      desc: 'Get notified of any suspicious activity on your account.',
      icon: shieldIcon
    },
    {
      id: 'marketing',
      title: 'Product Updates & Tips',
      desc: 'Receive hiring tips and platform updates.',
      icon: Mail
    }
  ];

  return (
    <div className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your email alert settings.</p>
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8 space-y-4">
        {notificationItems.map(item => (
          <div key={item.id} className="flex items-start md:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => handleNotificationChange(item.id)}
              className={`shrink-0 w-12 h-6 rounded-full transition-colors relative ${notifications[item.id] ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform transform ${notifications[item.id] ? 'translate-x-6' : 'translate-x-0'}`}></span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper icons
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

const shieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);


export default CompanyNotificationsTab;
