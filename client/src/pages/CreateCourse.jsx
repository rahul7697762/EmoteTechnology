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

const CreateCourse = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isCreatingCourse } = useSelector((state) => state.course);

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

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex">
            <Sidebar />

            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Course</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Fill in the basic details to start building your curriculum.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Basic Details Card */}
                            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <BookOpen size={20} className="text-violet-500" />
                                    Course Details
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Course Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Complete Web Development Bootcamp"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="5"
                                            placeholder="Tell students what they'll learn..."
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all appearance-none"
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
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                                Language
                                            </label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <select
                                                    name="language"
                                                    value={formData.language}
                                                    onChange={handleChange}
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all appearance-none"
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
                            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <DollarSign size={20} className="text-emerald-500" />
                                    Pricing & Level
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Currency
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <select
                                                name="currency"
                                                value={formData.currency}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none"
                                            >
                                                <option value="INR">INR (₹)</option>
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Level
                                        </label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <select
                                                name="level"
                                                value={formData.level}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none"
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
                            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Course Thumbnail</h2>
                                <div className="space-y-4">
                                    <div
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        className={`relative aspect-video rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group 
                                            ${thumbnailPreview
                                                ? 'border-transparent'
                                                : 'border-slate-300 dark:border-slate-600 hover:border-violet-500 dark:hover:border-violet-400 bg-slate-50 dark:bg-slate-800/50'
                                            }`}
                                    >
                                        {thumbnailPreview ? (
                                            <>
                                                <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full text-white">
                                                        <Upload size={24} />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-violet-500 transition-colors">
                                                <ImageIcon size={48} className="mb-2" />
                                                <span className="text-sm font-medium">Upload Thumbnail</span>
                                                <span className="text-xs text-slate-400 mt-1">1280x720 recommended</span>
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
                                        <button type="button" onClick={removeThumbnail} className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1">
                                            <X size={14} /> Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Preview Video Upload */}
                            <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Preview Video</h2>
                                <div className="space-y-4">
                                    <div
                                        onClick={() => videoInputRef.current?.click()}
                                        className={`relative aspect-video rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group 
                                            ${videoPreview
                                                ? 'border-transparent'
                                                : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-slate-50 dark:bg-slate-800/50'
                                            }`}
                                    >
                                        {videoPreview ? (
                                            <video src={videoPreview} controls className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors">
                                                <Video size={48} className="mb-2" />
                                                <span className="text-sm font-medium">Upload Preview Video</span>
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
                                        <button type="button" onClick={removeVideo} className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1">
                                            <X size={14} /> Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isCreatingCourse}
                                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-violet-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 text-lg"
                                >
                                    {isCreatingCourse ? <Loader2 className="animate-spin" size={24} /> : 'Create Course'}
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
