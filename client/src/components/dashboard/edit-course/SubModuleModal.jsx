import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, FileText, Video, Eye, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SubModuleModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState('VIDEO'); // VIDEO | ARTICLE
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreviewName, setVideoPreviewName] = useState('');
    const [articleContent, setArticleContent] = useState('');

    const fileInputRef = useRef(null);

    // Initial Data Load (for Edit Mode)
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setActiveTab(initialData.type || 'VIDEO');
            setIsPreview(initialData.isPreview || false);
            setArticleContent(initialData.content || '');

            if (initialData.type === 'VIDEO' && initialData.video) {
                setVideoPreviewName('Current Video: ' + (initialData.video.url ? initialData.video.url.split('/').pop() : 'Processed Video'));
            }
        } else {
            // Reset for Add Mode
            setTitle('');
            setDescription('');
            setActiveTab('VIDEO');
            setIsPreview(false);
            setVideoFile(null);
            setVideoPreviewName('');
            setArticleContent('');
        }
    }, [initialData, isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500 * 1024 * 1024) { // 500MB
                toast.error("File size exceeds 500MB limit");
                return;
            }
            setVideoFile(file);
            setVideoPreviewName(file.name);
        }
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', activeTab);
        formData.append('isPreview', isPreview);

        if (activeTab === 'VIDEO') {
            if (videoFile) {
                formData.append('video', videoFile);
            } else if (!initialData) {
                toast.error("Please upload a video");
                return;
            }
        } else {
            if (!articleContent.trim()) {
                toast.error("Article content is required");
                return;
            }
            formData.append('content', articleContent);
        }

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl w-full max-w-7xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col h-[95vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {initialData ? 'Edit Lesson' : 'Add New Lesson'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Form Side */}
                    <div className="flex-1 p-8 overflow-y-auto border-r border-slate-200 dark:border-slate-700 space-y-8">

                        {/* Title & Desc */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Lesson Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Introduction to Hooks"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 dark:text-white transition-all text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief summary of this lesson..."
                                    rows={3}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 dark:text-white resize-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Lesson Type</label>
                            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('VIDEO')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'VIDEO'
                                        ? 'bg-white dark:bg-slate-700 text-violet-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <Video size={20} /> Video Lesson
                                </button>
                                <button
                                    onClick={() => setActiveTab('ARTICLE')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'ARTICLE'
                                        ? 'bg-white dark:bg-slate-700 text-violet-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <FileText size={20} /> Article / Text
                                </button>
                            </div>
                        </div>

                        {/* Conditional Inputs */}
                        {activeTab === 'VIDEO' ? (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Video File</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group min-h-[200px]"
                                >
                                    <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={32} />
                                    </div>
                                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                                        {videoPreviewName || "Click to upload video"}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">MP4, MOV, WebM up to 500MB</p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="video/*"
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300 flex flex-col h-[500px]">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Article Content (Markdown supported)
                                </label>
                                <textarea
                                    value={articleContent}
                                    onChange={(e) => setArticleContent(e.target.value)}
                                    placeholder="# Introduction&#10;&#10;Write your content in **Markdown**..."
                                    className="flex-1 w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-violet-500 dark:text-white resize-none"
                                />
                            </div>
                        )}

                        {/* Settings */}
                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="preview"
                                checked={isPreview}
                                onChange={(e) => setIsPreview(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                            />
                            <label htmlFor="preview" className="text-base text-slate-700 dark:text-slate-300 select-none">
                                Set as <strong>Free Preview</strong> (publicly accessible)
                            </label>
                        </div>
                    </div>

                    {/* Preview Side */}
                    <div className="w-1/2 bg-slate-50 dark:bg-[#0F172A] p-8 border-l border-slate-200 dark:border-slate-700 hidden lg:flex flex-col">
                        <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                            <Eye size={16} /> Live Preview
                        </div>

                        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative flex flex-col">
                            {/* Browser Mockup Header */}
                            <div className="h-10 bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 flex items-center px-4 gap-2 shrink-0">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            </div>

                            {/* Preview Body */}
                            <div className="p-8 h-full overflow-y-auto">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{title || "Lesson Title"}</h1>

                                {activeTab === 'VIDEO' ? (
                                    <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white/50 mb-6 shadow-md">
                                        {videoFile ? (
                                            <div className="text-center">
                                                <Video size={48} className="mx-auto mb-2 opacity-50" />
                                                <span className="text-lg font-medium">Video Ready</span>
                                                <p className="text-sm opacity-70 mt-1">{videoFile.name}</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Video size={48} className="mx-auto mb-2 opacity-30" />
                                                <span className="text-base">No Video Selected</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                                        {articleContent ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {articleContent}
                                            </ReactMarkdown>
                                        ) : (
                                            <p className='text-slate-400 italic'>Start typing to see article preview...</p>
                                        )}
                                    </div>
                                )}

                                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Description</h4>
                                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {description || "Lesson description will appear here."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-3 text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-8 py-3 text-base font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 size={20} className="animate-spin" />}
                        {initialData ? 'Save Changes' : 'Create Lesson'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SubModuleModal;
