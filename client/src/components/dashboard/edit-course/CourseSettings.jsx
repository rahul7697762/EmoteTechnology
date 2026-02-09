import React from 'react';
import {
    Layers, ChevronDown, DollarSign, Tag,
    Image as ImageIcon, Video, Loader2, Save
} from 'lucide-react';

const CourseSettings = ({
    formData,
    handleInputChange,
    thumbnailPreview,
    handleThumbnailChange,
    videoPreview,
    handleVideoChange,
    thumbnailInputRef,
    videoInputRef
}) => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Course Settings</h2>

                <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
                            <input
                                type="text" name="title" value={formData.title} onChange={handleInputChange}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                            <textarea
                                name="description" value={formData.description} onChange={handleInputChange} rows="4"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                            <div className="relative">
                                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                <select
                                    name="category" value={formData.category} onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none appearance-none text-sm"
                                >
                                    <option value="TECH" className="dark:bg-slate-800">Technology</option>
                                    <option value="NON-TECH" className="dark:bg-slate-800">Non-Technology</option>
                                    <option value="ASSESSMENT" className="dark:bg-slate-800">Assessment</option>
                                    <option value="SOFT-SKILLS" className="dark:bg-slate-800">Soft Skills</option>
                                    <option value="LANGUAGES" className="dark:bg-slate-800">Languages</option>
                                    <option value="BUSINESS" className="dark:bg-slate-800">Business</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Level</label>
                            <div className="relative">
                                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                <select
                                    name="level" value={formData.level} onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none appearance-none text-sm"
                                >
                                    <option value="BEGINNER" className="dark:bg-slate-800">Beginner</option>
                                    <option value="INTERMEDIATE" className="dark:bg-slate-800">Intermediate</option>
                                    <option value="ADVANCED" className="dark:bg-slate-800">Advanced</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                <select
                                    name="currency" value={formData.currency} onChange={handleInputChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none appearance-none text-sm"
                                >
                                    <option value="INR" className="dark:bg-slate-800">INR (₹)</option>
                                    <option value="USD" className="dark:bg-slate-800">USD ($)</option>
                                    <option value="EUR" className="dark:bg-slate-800">EUR (€)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Price</label>
                            <input
                                type="number" name="price" value={formData.price} onChange={handleInputChange}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Discount (%)</label>
                            <input
                                type="number" name="discount" value={formData.discount} onChange={handleInputChange}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Media Update Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Course Thumbnail</label>
                            <div
                                onClick={() => thumbnailInputRef.current?.click()}
                                className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-violet-500 cursor-pointer overflow-hidden relative group"
                            >
                                {thumbnailPreview ? (
                                    <>
                                        <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                            Change Image
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                        <ImageIcon size={32} />
                                        <span className="text-xs mt-2">Upload Image</span>
                                    </div>
                                )}
                                <input type="file" ref={thumbnailInputRef} onChange={handleThumbnailChange} className="hidden" accept="image/*" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Preview Video</label>
                            <div
                                onClick={() => videoInputRef.current?.click()}
                                className="aspect-video bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-violet-500 cursor-pointer overflow-hidden relative group"
                            >
                                {videoPreview ? (
                                    <video src={videoPreview} className="w-full h-full object-cover" controls />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                        <Video size={32} />
                                        <span className="text-xs mt-2">Upload Video</span>
                                    </div>
                                )}
                                <input type="file" ref={videoInputRef} onChange={handleVideoChange} className="hidden" accept="video/*" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSettings;
