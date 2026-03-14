
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../../redux/slices/courseSlice';
import { Star, X } from 'lucide-react';

const RatingReview = ({ courseId, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { isSubmittingReview, error } = useSelector((state) => state.course);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;

        const result = await dispatch(createReview({
            courseId,
            rating,
            title,
            comment
        }));

        if (createReview.fulfilled.match(result)) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Rate this Course
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center justify-center space-y-2 mb-4">
                        <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        size={32}
                                        className={`${(hoverRating || rating) >= star
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-slate-100 text-slate-300 dark:fill-slate-800 dark:text-slate-700'
                                            } transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {hoverRating || rating ? (
                                <>
                                    {(hoverRating || rating) === 1 && "Poor"}
                                    {(hoverRating || rating) === 2 && "Fair"}
                                    {(hoverRating || rating) === 3 && "Good"}
                                    {(hoverRating || rating) === 4 && "Very Good"}
                                    {(hoverRating || rating) === 5 && "Excellent"}
                                </>
                            ) : "Select a rating"}
                        </p>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Summarize your experience"
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Review
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you like or dislike?"
                                rows={4}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                            {typeof error === 'string' ? error : 'Failed to submit review'}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={rating === 0 || isSubmittingReview}
                            className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
                        >
                            {isSubmittingReview ? (
                                <span className="flex items-center justify-center">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                                    Submitting...
                                </span>
                            ) : (
                                "Submit Review"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingReview;
