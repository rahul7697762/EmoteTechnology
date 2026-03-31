import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../redux/slices/courseSlice';
import Sidebar from '../components/dashboard/Sidebar';
import {
    Upload, Image as ImageIcon, Video, X, Loader2,
    DollarSign, BookOpen, Layers, Globe, Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const CreateCourse = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isCreatingCourse } = useSelector((state) => state.course);
    const { isSidebarCollapsed } = useSelector((state) => state.ui);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'TECH',
        level: 'BEGINNER',
        language: 'English',
        price: '0',
        currency: 'INR',
        discount: '0',
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    const thumbnailInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const removeThumbnail = () => {
        setThumbnail(null);
        setThumbnailPreview(null);
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    };

    const removeVideo = () => {
        setPreviewVideo(null);
        setVideoPreview(null);
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (thumbnail) data.append('thumbnail', thumbnail);
        if (previewVideo) data.append('previewVideo', previewVideo);

        try {
            const result = await dispatch(createCourse(data)).unwrap();
            toast.success('Course created successfully!');
            navigate(`/edit-course/${result._id}`);
        } catch (error) {
            console.error('Failed to create course:', error);
            toast.error(typeof error === 'string' ? error : 'Failed to create course');
        }
    };

    const inputClasses = "w-full bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pl-11 pr-4 py-3 text-[#1A1D2E] dark:text-[#E8EAF2] placeholder-[#6B7194] dark:placeholder-[#8B90B8] focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-colors text-sm appearance-none";

    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] flex transition-colors duration-300">
            <Sidebar />

            <div className={`flex-1 p-8 overflow-y-auto h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-6">
                        <h1 className="text-4xl font-semibold mb-2" style={{ fontFamily: SERIF }}>Create New Course</h1>
                        <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm uppercase tracking-widest font-semibold" style={{ fontFamily: MONO }}>
                            Curriculum Details
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Basic Details Card */}
                            <div className="bg-white dark:bg-[#252A41] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: SERIF }}>
                                    <BookOpen size={24} className="text-[#3B4FD8] dark:text-[#6C7EF5]" strokeWidth={1.5} />
                                    Course Details
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>
                                            Course Title <span className="text-[#E25C5C]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Complete Web Development Bootcamp"
                                            className="w-full bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 px-4 py-3 text-[#1A1D2E] dark:text-[#E8EAF2] placeholder-[#6B7194] dark:placeholder-[#8B90B8] focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-colors text-sm"
                                            style={{ fontFamily: MONO }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="5"
                                            placeholder="Tell students what they'll learn..."
                                            className="w-full bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 px-4 py-3 text-[#1A1D2E] dark:text-[#E8EAF2] placeholder-[#6B7194] dark:placeholder-[#8B90B8] focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-colors text-sm resize-none"
                                            style={{ fontFamily: MONO }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>
                                                Category <span className="text-[#E25C5C]">*</span>
                                            </label>
                                            <div className="relative">
                                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50" size={18} />
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className={inputClasses}
                                                    style={{ fontFamily: MONO }}
                                                >
                                                    <option value="TECH">Technology</option>
                                                    <option value="NON-TECH">Non-Technology</option>
                                                    <option value="ASSESSMENT">Assessment</option>
                                                    <option value="SOFT-SKILLS">Soft Skills</option>
                                                    <option value="LANGUAGES">Languages</option>
                                                    <option value="BUSINESS">Business</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>
                                                Language
                                            </label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50" size={18} />
                                                <select
                                                    name="language"
                                                    value={formData.language}
                                                    onChange={handleChange}
                                                    className={inputClasses}
                                                    style={{ fontFamily: MONO }}
                                                >
                                                    <option value="English">English</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="Hindi">Hindi</option>
                                                    <option value="French">French</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Card */}
                            <div className="bg-white dark:bg-[#252A41] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: SERIF }}>
                                    <DollarSign size={24} className="text-[#F5A623]" strokeWidth={1.5} />
                                    Pricing & Level
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>
                                            Currency
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50" size={18} />
                                            <select
                                                name="currency"
                                                value={formData.currency}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                style={{ fontFamily: MONO }}
                                            >
                                                <option value="INR">INR (₹)</option>
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 px-4 py-3 text-[#1A1D2E] dark:text-[#E8EAF2] focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-colors text-sm"
                                            style={{ fontFamily: MONO }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>
                                            Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                            className="w-full bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 px-4 py-3 text-[#1A1D2E] dark:text-[#E8EAF2] focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-colors text-sm"
                                            style={{ fontFamily: MONO }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>
                                            Level
                                        </label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50" size={18} />
                                            <select
                                                name="level"
                                                value={formData.level}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                style={{ fontFamily: MONO }}
                                            >
                                                <option value="BEGINNER">Beginner</option>
                                                <option value="INTERMEDIATE">Intermediate</option>
                                                <option value="ADVANCED">Advanced</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Media */}
                        <div className="space-y-8">
                            {/* Thumbnail Upload */}
                            <div className="bg-white dark:bg-[#252A41] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm">
                                <h2 className="text-xl font-bold mb-6" style={{ fontFamily: SERIF }}>Course Thumbnail</h2>
                                <div className="space-y-4">
                                    <div
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        className={`relative aspect-video border border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center p-6 group
                                            ${thumbnailPreview
                                                ? 'border-transparent'
                                                : 'border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] bg-[#F7F8FF] dark:bg-[#1A1D2E]'
                                            }`}
                                    >
                                        {thumbnailPreview ? (
                                            <>
                                                <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-[#1A1D2E]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="bg-white p-4 text-[#1A1D2E]">
                                                        <Upload size={24} />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-[#6B7194] dark:text-[#8B90B8] group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors flex flex-col items-center">
                                                <ImageIcon size={40} className="mb-4" strokeWidth={1} />
                                                <span className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: MONO }}>Upload Thumbnail</span>
                                                <span className="text-[10px] uppercase tracking-widest mt-2 opacity-60" style={{ fontFamily: MONO }}>1280x720 recommended</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={thumbnailInputRef}
                                            onChange={handleThumbnailChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                    {thumbnailPreview && (
                                        <button type="button" onClick={removeThumbnail} className="text-[10px] font-bold uppercase tracking-widest text-[#E25C5C] hover:text-[#c44949] flex items-center gap-2" style={{ fontFamily: MONO }}>
                                            <X size={14} strokeWidth={2.5} /> Remove Image
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Preview Video Upload */}
                            <div className="bg-white dark:bg-[#252A41] p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm">
                                <h2 className="text-xl font-bold mb-6" style={{ fontFamily: SERIF }}>Preview Video</h2>
                                <div className="space-y-4">
                                    <div
                                        onClick={() => videoInputRef.current?.click()}
                                        className={`relative aspect-video border border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center p-6 group
                                            ${videoPreview
                                                ? 'border-transparent'
                                                : 'border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 hover:border-[#3B4FD8] dark:hover:border-[#6C7EF5] bg-[#F7F8FF] dark:bg-[#1A1D2E]'
                                            }`}
                                    >
                                        {videoPreview ? (
                                            <video src={videoPreview} controls className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-[#6B7194] dark:text-[#8B90B8] group-hover:text-[#3B4FD8] dark:group-hover:text-[#6C7EF5] transition-colors flex flex-col items-center">
                                                <Video size={40} className="mb-4" strokeWidth={1} />
                                                <span className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: MONO }}>Upload Video</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={videoInputRef}
                                            onChange={handleVideoChange}
                                            accept="video/*"
                                            className="hidden"
                                        />
                                    </div>
                                    {videoPreview && (
                                        <button type="button" onClick={removeVideo} className="text-[10px] font-bold uppercase tracking-widest text-[#E25C5C] hover:text-[#c44949] flex items-center gap-2" style={{ fontFamily: MONO }}>
                                            <X size={14} strokeWidth={2.5} /> Remove Video
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isCreatingCourse}
                                className="w-full bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] font-semibold py-4 px-6 transition-colors disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3 text-sm uppercase tracking-widest mt-10"
                                style={{ fontFamily: MONO }}
                            >
                                {isCreatingCourse ? <Loader2 className="animate-spin" size={20} /> : 'Create Course'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
