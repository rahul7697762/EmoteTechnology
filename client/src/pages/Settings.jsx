import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../redux/slices/authSlice';
import api from '../utils/api';
import Sidebar from '../components/dashboard/Sidebar';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import ProfileTab from '../components/setting/ProfileTab';
import NotificationsTab from '../components/setting/NotificationsTab';
import SecurityTab from '../components/setting/SecurityTab';
import DeleteAccountTab from '../components/setting/DeleteAccountTab';
import { User } from 'lucide-react';

const Settings = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('profile'); // profile, notifications, security, danger



    const SidebarComponent = user?.role === 'STUDENT' ? StudentSidebar : Sidebar;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex font-sans transition-colors duration-300">
            <SidebarComponent />

            <main className="flex-1 md:ml-64 md:py-8 md:pr-8 pl-6 overflow-y-auto h-screen scrollbar-hide">
                <div className="pb-20">
                    <div className="flex flex-col lg:flex-row gap-8 mt-8">
                        {/* Settings Navigation */}
                        <div className="w-full lg:w-72 flex-shrink-0">
                            <div className="bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 p-3 shadow-lg shadow-gray-200/50 dark:shadow-none sticky top-8">
                                <nav className="space-y-1">
                                    {[
                                        { id: 'profile', icon: <User size={18} />, label: 'Profile' },
                                        { id: 'notifications', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>, label: 'Notifications' },
                                        { id: 'security', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>, label: 'Security' },
                                        { id: 'danger', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>, label: 'Delete Account' }
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === item.id
                                                ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <span className={`${activeTab === item.id ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-500'}`}>
                                                {item.icon}
                                            </span>
                                            <span>{item.label}</span>
                                            {activeTab === item.id && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                                            )}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && <ProfileTab />}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && <NotificationsTab />}

                            {/* Security Tab */}
                            {activeTab === 'security' && <SecurityTab />}

                            {/* Danger Zone Tab */}
                            {activeTab === 'danger' && <DeleteAccountTab />}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
