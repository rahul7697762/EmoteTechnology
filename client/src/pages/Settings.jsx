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
import { User, Bell, Shield, AlertTriangle } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const Settings = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('profile'); // profile, notifications, security, danger

    const { isSidebarCollapsed } = useSelector((state) => state.ui);

    const SidebarComponent = user?.role === 'STUDENT' ? StudentSidebar : Sidebar;

    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] flex transition-colors duration-300">
            <SidebarComponent />

            <main className={`flex-1 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} md:py-8 md:pr-8 pl-6 overflow-y-auto h-screen scrollbar-hide transition-all duration-300`}>
                <div className="pb-20 max-w-7xl mx-auto">
                    <div className="mb-8 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-6 mt-8">
                        <h1 className="text-4xl font-semibold mb-2" style={{ fontFamily: SERIF }}>Account Settings</h1>
                        <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm uppercase tracking-widest font-semibold" style={{ fontFamily: MONO }}>
                            Manage your personal information and preferences
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Settings Navigation */}
                        <div className="w-full lg:w-72 shrink-0">
                            <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 p-4 shadow-sm sticky top-8">
                                <nav className="space-y-2">
                                    {[
                                        { id: 'profile', icon: <User size={16} />, label: 'Profile' },
                                        { id: 'notifications', icon: <Bell size={16} />, label: 'Notifications' },
                                        { id: 'security', icon: <Shield size={16} />, label: 'Security' },
                                        { id: 'danger', icon: <AlertTriangle size={16} />, label: 'Delete Account' }
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-4 px-4 py-3.5 transition-colors text-[10px] font-bold uppercase tracking-widest ${activeTab === item.id
                                                ? 'bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/10 text-[#3B4FD8] dark:text-[#6C7EF5] border-l-2 border-[#3B4FD8] dark:border-[#6C7EF5]'
                                                : 'text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] border-l-2 border-transparent'
                                                }`}
                                            style={{ fontFamily: MONO }}
                                        >
                                            <span className={`${activeTab === item.id ? 'text-[#3B4FD8] dark:text-[#6C7EF5]' : 'text-[#6B7194] dark:text-[#8B90B8]'}`}>
                                                {item.icon}
                                            </span>
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 w-full max-w-3xl">
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
