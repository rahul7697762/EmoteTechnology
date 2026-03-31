import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { completeLesson } from '../../redux/slices/progressSlice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F7F8FF] dark:bg-[#0A0B10]">
            <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
                <div className="mb-12 pb-8 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 text-[#3B4FD8] dark:text-[#6C7EF5] bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 px-3 py-1.5 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                            <BookOpen size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>Reading Material</span>
                        </div>
                        {progress?.isCompleted && (
                            <span className="flex items-center gap-2 bg-[#3B4FD8] text-white font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 shadow-sm border border-[#3B4FD8]/20" style={{ fontFamily: MONO }}>
                                <CheckCircle size={14} /> COMPLETED
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] leading-tight" style={{ fontFamily: SERIF }}>
                        {lesson.title}
                    </h1>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-headings:text-[#1A1D2E] dark:prose-headings:text-[#E8EAF2]
                    prose-p:text-[#1A1D2E]/80 dark:prose-p:text-[#E8EAF2]/80 prose-p:leading-relaxed
                    prose-a:text-[#3B4FD8] dark:prose-a:text-[#6C7EF5] prose-a:font-bold prose-a:underline-offset-4 hover:prose-a:text-[#F5A623]
                    prose-img:rounded-none prose-img:border prose-img:border-[#3B4FD8]/10 dark:prose-img:border-[#6C7EF5]/10 prose-img:shadow-md prose-img:my-10
                    prose-strong:text-[#1A1D2E] dark:prose-strong:text-[#E8EAF2]
                    prose-blockquote:border-l-[4px] prose-blockquote:border-[#3B4FD8] dark:prose-blockquote:border-[#6C7EF5] prose-blockquote:bg-[#3B4FD8]/5 dark:prose-blockquote:bg-[#6C7EF5]/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:font-medium prose-blockquote:italic
                    prose-pre:bg-[#1A1D2E] prose-pre:text-[#E8EAF2] prose-pre:rounded-none prose-pre:border prose-pre:border-[#3B4FD8]/20
                ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {lesson.content || "> *No content available for this lesson.*"}
                    </ReactMarkdown>
                </div>

                {/* Mark as Completed Button */}
                <div className="mt-20 pt-10 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex justify-center">
                    <button
                        onClick={handleMarkCompleted}
                        disabled={progress?.isCompleted}
                        className={`
                            px-12 py-5 font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-3 rounded-none border border-transparent shadow-sm
                            ${progress?.isCompleted
                                ? 'bg-[#3B4FD8] text-white cursor-default'
                                : 'bg-[#F5A623] text-[#1A1D2E] hover:bg-[#d9911a] hover:border-[#F5A623]/20'
                            }
                        `}
                        style={{ fontFamily: MONO }}
                    >
                        {progress?.isCompleted ? (
                            <>
                                <CheckCircle size={16} /> COMPLETED
                            </>
                        ) : (
                            "MARK AS COMPLETED"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleViewer;
