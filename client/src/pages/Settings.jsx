import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../redux/slices/authSlice';
import api from '../utils/api';
import Sidebar from '../components/dashboard/Sidebar';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import { User, Mail, Phone, MapPin, Briefcase, Award, Loader2, Camera, Save } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); // profile, notifications, security, danger

    // Profile State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        phone: '',
        country: '',
        avatar: '',
        // Faculty specific
        expertise: [],
        yearsOfExperience: 0
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification State
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        courseUpdates: true,
        marketing: false,
        securityAlerts: true
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.profile?.bio || '',
                phone: user.profile?.phone || '',
                country: user.profile?.country || '',
                avatar: user.profile?.avatar || '',
                expertise: user.facultyProfile?.expertise || [],
                yearsOfExperience: user.facultyProfile?.yearsOfExperience || 0
            });
            setPreviewUrl(user.profile?.avatar || null);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExpertiseChange = (e) => {
        const value = e.target.value;
        const expertiseArray = value.split(',').map(item => item.trim());
        setFormData(prev => ({
            ...prev,
            expertise: expertiseArray
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        // In a real app, you'd auto-save or have a save button for this
        toast.success("Preference updated");
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);

            // Profile object
            const profileData = {
                bio: formData.bio,
                phone: formData.phone,
                country: formData.country
            };
            formDataToSend.append('profile', JSON.stringify(profileData));

            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile);
            }

            // Faculty specific
            if (user.role === 'FACULTY') {
                const facultyData = {
                    expertise: formData.expertise,
                    yearsOfExperience: formData.yearsOfExperience
                };
                formDataToSend.append('facultyProfile', JSON.stringify(facultyData));
            }

            const response = await api.put('/users/profile', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Profile updated successfully!');
                dispatch(getMe());
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsSaving(true);
        try {
            const response = await api.put('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (response.data.success) {
                toast.success('Password changed successfully');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        const password = prompt("Please enter your password to confirm deletion:");
        if (!password) return;

        try {
            const response = await api.delete('/users/deleteMe', { data: { password } });
            if (response.data.success) {
                toast.success('Account deleted successfully');
                window.location.href = '/login';
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete account');
        }
    };

    const SidebarComponent = user?.role === 'STUDENT' ? StudentSidebar : Sidebar;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex font-sans transition-colors duration-300">
            <Toaster position="top-right" />
            <SidebarComponent />

            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen scrollbar-hide">
                <div className="max-w-5xl mx-auto pb-20">
                    <header className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-600 p-8 text-white shadow-xl shadow-teal-500/20">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                            <p className="text-teal-100 mt-2 text-lg font-medium">
                                Manage your personal information and preferences.
                            </p>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-white/5 opacity-30"></div>
                    </header>

                    <div className="flex flex-col lg:flex-row gap-8">
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
                            {activeTab === 'profile' && (
                                <div className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
                                    <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Details</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your personal information.</p>
                                        </div>
                                    </div>
                                    <form onSubmit={handleProfileSubmit} className="p-8 space-y-8">
                                        {/* Avatar Section */}
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-gray-50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                            <div className="relative group shrink-0">
                                                <div className="w-28 h-28 rounded-full overflow-hidden bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-700 shadow-lg ring-2 ring-teal-100 dark:ring-teal-500/20">
                                                    {previewUrl ? (
                                                        <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800">
                                                            <User size={40} />
                                                        </div>
                                                    )}
                                                </div>
                                                <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-full backdrop-blur-[2px]">
                                                    <Camera size={24} />
                                                </label>
                                                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </div>
                                            <div className="text-center sm:text-left flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Photo</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                                                    We recommend an image of at least 400x400px.
                                                </p>
                                                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                                    <label htmlFor="avatar-upload" className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold cursor-pointer transition-all shadow-sm">
                                                        Upload New
                                                    </label>
                                                    {previewUrl && (
                                                        <button type="button" onClick={() => { setPreviewUrl(null); setAvatarFile(null); }} className="px-5 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-semibold transition-all">
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                        <User size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                        <Mail size={18} />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        readOnly
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-gray-500 cursor-not-allowed font-medium"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                        <Phone size={18} />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Country</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                        <MapPin size={18} />
                                                    </div>
                                                    <select
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none font-medium"
                                                    >
                                                        <option value="">Select Country</option>
                                                        {['India', 'United States', 'United Kingdom', 'Canada', 'Australia'].map(c => (
                                                            <option key={c} value={c}>{c}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {user?.role === 'FACULTY' && (
                                                <>
                                                    <div className="md:col-span-2 space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expertise</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                                <Briefcase size={18} />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={Array.isArray(formData.expertise) ? formData.expertise.join(', ') : formData.expertise || ''}
                                                                onChange={handleExpertiseChange}
                                                                placeholder="e.g. Computer Science, Machine Learning (comma separated)"
                                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Years of Experience</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                                <Award size={18} />
                                                            </div>
                                                            <input
                                                                type="number"
                                                                name="yearsOfExperience"
                                                                value={formData.yearsOfExperience}
                                                                onChange={handleInputChange}
                                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bio</label>
                                                <textarea
                                                    name="bio"
                                                    value={formData.bio}
                                                    onChange={handleInputChange}
                                                    rows="4"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none font-medium"
                                                    placeholder="Tell us a bit about yourself..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-gray-800">
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="flex items-center space-x-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all font-bold shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                                            >
                                                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                                <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
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
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
                                    <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security & Password</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your password and security preferences.</p>
                                    </div>
                                    <form onSubmit={handlePasswordSubmit} className="p-8 space-y-8">
                                        <div className="space-y-6 max-w-lg">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                                />
                                                <p className="text-xs text-gray-400 pl-1">Must be at least 6 characters long.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-start pt-6 border-t border-gray-100 dark:border-gray-800">
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="flex items-center space-x-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all font-bold shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                                            >
                                                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                                <span>{isSaving ? 'Updating Password...' : 'Update Password'}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Danger Zone Tab */}
                            {activeTab === 'danger' && (
                                <div className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-red-200 dark:border-red-900/30 shadow-xl shadow-red-100/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
                                    <div className="p-8 border-b border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/5">
                                        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Delete Account</h2>
                                        <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">Irreversible actions for your account.</p>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-red-100 dark:border-red-900/20 bg-red-50/30 dark:bg-red-900/10">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Account</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-1 leading-relaxed">
                                                    Permanently remove your account and all of its content from the EmoteTechnology platform.
                                                    <span className="font-bold text-red-500 block mt-1">This action cannot be undone.</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleDeleteAccount}
                                                className="shrink-0 px-6 py-3 bg-white dark:bg-transparent border-2 border-red-500 text-red-600 dark:text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-sm"
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
