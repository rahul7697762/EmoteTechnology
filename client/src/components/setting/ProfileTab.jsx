import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, Briefcase, Award, Loader2, Camera, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../../redux/slices/authSlice';

const ProfileTab = () => {
    const dispatch = useDispatch();
    const { user, isUpdatingProfile } = useSelector((state) => state.auth);

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

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

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

        try {
            await dispatch(updateProfile(formDataToSend)).unwrap();
            toast.success('Profile updated successfully!');
            // No need to dispatch getMe(), updateProfile should update the user in store
        } catch (error) {
            // Error is handled in slice or we can show toast here
            toast.error(typeof error === 'string' ? error : 'Failed to update profile');
        }
    };

    return (
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
                        disabled={isUpdatingProfile}
                        className="flex items-center space-x-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all font-bold shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                    >
                        {isUpdatingProfile ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        <span>{isUpdatingProfile ? 'Saving Changes...' : 'Save Changes'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileTab;
