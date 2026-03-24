import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Bell, Mail, MessageSquare, Briefcase } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
    toast.success("Preference updated", {
        style: {
            borderRadius: '0px',
            fontFamily: MONO,
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 'bold'
        }
    });
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
    <div className="bg-white dark:bg-[#252A41] rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="p-6 md:p-8 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#F7F8FF] dark:bg-[#1A1D2E]">
        <div className="flex items-center gap-5">
          <div className="p-3 bg-white dark:bg-[#252A41] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#3B4FD8] dark:text-[#6C7EF5]">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>NOTIFICATION PREFERENCES</h2>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6B7194] dark:text-[#8B90B8] mt-1" style={{ fontFamily: MONO }}>Manage your email alert settings.</p>
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8 space-y-4">
        {notificationItems.map(item => (
          <div key={item.id} className="flex items-start md:items-center justify-between p-5 rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] hover:bg-[#F7F8FF] dark:hover:bg-[#1A1D2E] transition-all hover:shadow-md gap-4 group">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-[#1A1D2E] dark:text-[#E8EAF2] flex items-center gap-2" style={{ fontFamily: SERIF }}>
                {item.title}
              </h3>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mt-1" style={{ fontFamily: MONO }}>{item.desc}</p>
            </div>
            <button
              onClick={() => handleNotificationChange(item.id)}
              className={`shrink-0 w-12 h-6 border transition-colors relative flex items-center ${notifications[item.id] ? 'bg-[#3B4FD8] dark:bg-[#6C7EF5] border-[#3B4FD8] dark:border-[#6C7EF5]' : 'bg-[#F7F8FF] dark:bg-[#1A1D2E] border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 group-hover:border-[#3B4FD8] dark:group-hover:border-[#6C7EF5]'}`}
            >
              <span className={`absolute h-4 w-4 transition-all duration-300 ${notifications[item.id] ? 'right-1 bg-white' : 'left-1 bg-[#6B7194] dark:bg-[#8B90B8]'}`}></span>
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
