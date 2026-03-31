import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, Briefcase, Award, Loader2, Camera, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../../redux/slices/authSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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

        const profileData = {
            bio: formData.bio,
            phone: formData.phone,
            country: formData.country
        };
        formDataToSend.append('profile', JSON.stringify(profileData));

        if (avatarFile) {
            formDataToSend.append('avatar', avatarFile);
        }

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
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to update profile');
        }
    };

    const inputClasses = "w-full pl-10 pr-4 py-3 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#1A1D2E] dark:text-[#E8EAF2] focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-colors text-sm font-mono";

    return (
        <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-8 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: SERIF }}>Profile Details</h2>
                    <p className="text-[#6B7194] dark:text-[#8B90B8] text-[10px] uppercase tracking-widest mt-2 font-semibold" style={{ fontFamily: MONO }}>Update your personal information.</p>
                </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-8 space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-[#F7F8FF] dark:bg-[#1A1D2E] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                    <div className="relative group shrink-0">
                        <div className="w-28 h-28 overflow-hidden bg-white dark:bg-[#252A41] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#3B4FD8]/40 dark:text-[#6C7EF5]/40 bg-[#F7F8FF] dark:bg-[#1A1D2E]">
                                    <User size={40} strokeWidth={1.5} />
                                </div>
                            )}
                        </div>
                        <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-[#1A1D2E]/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                            <Camera size={24} />
                        </label>
                        <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: SERIF }}>Profile Photo</h3>
                        <p className="text-[#6B7194] dark:text-[#8B90B8] text-[10px] uppercase tracking-widest mb-6" style={{ fontFamily: MONO }}>
                            We recommend an image of at least 400x400px.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            <label htmlFor="avatar-upload" className="px-6 py-2.5 bg-[#3B4FD8] text-white hover:bg-[#2e3ea8] text-[10px] uppercase tracking-widest font-semibold cursor-pointer transition-colors" style={{ fontFamily: MONO }}>
                                Upload New
                            </label>
                            {previewUrl && (
                                <button type="button" onClick={() => { setPreviewUrl(null); setAvatarFile(null); }} className="px-6 py-2.5 border border-[#E25C5C]/30 text-[#E25C5C] hover:bg-[#E25C5C]/10 text-[10px] uppercase tracking-widest font-semibold transition-colors" style={{ fontFamily: MONO }}>
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 pt-4">
                    <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50">
                                <User size={16} />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={inputClasses}
                                style={{ fontFamily: MONO }}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50">
                                <Mail size={16} />
                            </div>
                            <input
                                type="email"
                                value={formData.email}
                                readOnly
                                className="w-full pl-10 pr-4 py-3 bg-[#F7F8FF]/50 dark:bg-[#1A1D2E]/50 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#6B7194] dark:text-[#8B90B8] cursor-not-allowed text-sm"
                                style={{ fontFamily: MONO }}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Phone</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50">
                                <Phone size={16} />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={inputClasses}
                                style={{ fontFamily: MONO }}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Country</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50">
                                <MapPin size={16} />
                            </div>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className={`${inputClasses} appearance-none`}
                                style={{ fontFamily: MONO }}
                            >
                                <option value="">Select Country</option>
                                {['India', 'United States', 'United Kingdom', 'Canada', 'Australia'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {user?.role === 'FACULTY' && (
                        <>
                            <div className="md:col-span-2 space-y-3">
                                <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Expertise</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50">
                                        <Briefcase size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        value={Array.isArray(formData.expertise) ? formData.expertise.join(', ') : formData.expertise || ''}
                                        onChange={handleExpertiseChange}
                                        placeholder="e.g. Computer Science, UI/UX"
                                        className={inputClasses}
                                        style={{ fontFamily: MONO }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Years of Experience</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50">
                                        <Award size={16} />
                                    </div>
                                    <input
                                        type="number"
                                        name="yearsOfExperience"
                                        value={formData.yearsOfExperience}
                                        onChange={handleInputChange}
                                        className={inputClasses}
                                        style={{ fontFamily: MONO }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="md:col-span-2 space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-3 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#1A1D2E] dark:text-[#E8EAF2] focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-colors resize-none text-sm"
                            placeholder="Tell us a bit about yourself..."
                            style={{ fontFamily: MONO }}
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                    <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="flex items-center space-x-3 px-8 py-3.5 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-70 disabled:pointer-events-none"
                        style={{ fontFamily: MONO }}
                    >
                        {isUpdatingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>{isUpdatingProfile ? 'Saving Changes...' : 'Save Changes'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileTab;
