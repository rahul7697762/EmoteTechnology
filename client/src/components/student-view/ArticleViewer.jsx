
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { completeLesson } from '../../redux/slices/progressSlice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ArticleViewer = ({ lesson, courseId }) => {
    const dispatch = useDispatch();
    const { lessonProgress, isLoading } = useSelector((state) => state.progress);
    const progress = lessonProgress[lesson._id];



    const handleMarkCompleted = async () => {
        try {
            await dispatch(completeLesson({
                subModuleId: lesson._id,
                courseId
            })).unwrap();
            toast.success("Lesson marked as completed!");
        } catch (error) {
            toast.error("Failed to mark as completed");
        }
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#0F172A]">
            <div className="max-w-3xl mx-auto px-6 py-10 lg:py-16">
                <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                            <BookOpen size={20} />
                            <span className="text-xs font-bold uppercase tracking-wider">Reading Material</span>
                        </div>
                        {progress?.isCompleted && (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                                <CheckCircle size={16} /> Completed
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                        {lesson.title}
                    </h1>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                    prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                    prose-a:text-violet-600 dark:prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {lesson.content || "> *No content available for this lesson.*"}
                    </ReactMarkdown>
                </div>

                {/* Mark as Completed Button */}
                <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                    <button
                        onClick={handleMarkCompleted}
                        disabled={progress?.isCompleted}
                        className={`
                            px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center gap-2
                            ${progress?.isCompleted
                                ? 'bg-green-100 text-green-700 cursor-default shadow-none dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-violet-500/25'
                            }
                        `}
                    >
                        {progress?.isCompleted ? (
                            <>
                                <CheckCircle size={20} /> Completed
                            </>
                        ) : (
                            "Mark as Completed"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleViewer;
