import React, { useState } from 'react';
import CompanyLayout from '../components/company-dashboard/CompanyLayout';
import SecurityTab from '../components/setting/SecurityTab';
import CompanyNotificationsTab from '../components/company-dashboard/CompanyNotificationsTab';
import DeleteAccountTab from '../components/setting/DeleteAccountTab';
import CompanyProfile from './job-portal/CompanyProfile';
import { User, Shield, Bell, Trash2 } from 'lucide-react';

const CompanySettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Password', icon: Shield },
    { id: 'danger', label: 'Delete Account', icon: Trash2 },
  ];

  return (
    <CompanyLayout>
      <div className="mb-0">
        {/* Header content moved inside layout if needed, but here we follow Settings.jsx style */}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 p-3 shadow-lg shadow-gray-200/50 dark:shadow-none sticky top-24">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === tab.id
                      ? 'bg-linear-to-r from-teal-500/10 to-emerald-500/10 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <span className={`${activeTab === tab.id ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-500'}`}>
                      <Icon size={18} />
                    </span>
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* CompanyProfile handles its own container style, might need adjusting if it duplicates shadows */}
              <CompanyProfile />
            </div>
          )}

          {activeTab === 'notifications' && <CompanyNotificationsTab />}

          {activeTab === 'security' && <SecurityTab />}

          {activeTab === 'danger' && <DeleteAccountTab />}
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanySettingsPage;
