import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, clearError } from '../../redux/slices/courseSlice';
import { Star, X } from 'lucide-react';
import { showToast } from '../../components/Job-portal/services/toast';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const RatingReview = ({ courseId, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { isSubmittingReview, error } = useSelector((state) => state.course);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (isOpen) {
            dispatch(clearError());
        }
    }, [isOpen, dispatch]);

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
            showToast.success("Review submitted successfully!");
            onClose();
        } else {
            showToast.error(result.payload || "Failed to submit review");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1D2E]/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1A1D2E] rounded-none shadow-2xl border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                    <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                        Rate this Course
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors rounded-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex items-center space-x-2">
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
                                        size={36}
                                        className={`${(hoverRating || rating) >= star
                                            ? 'fill-[#F5A623] text-[#F5A623]'
                                            : 'fill-[#F7F8FF] text-[#6B7194]/30 dark:fill-[#0A0B10] dark:text-[#8B90B8]/30'
                                            } transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                            {hoverRating || rating ? (
                                <>
                                    {(hoverRating || rating) === 1 && "POOR"}
                                    {(hoverRating || rating) === 2 && "FAIR"}
                                    {(hoverRating || rating) === 3 && "GOOD"}
                                    {(hoverRating || rating) === 4 && "VERY GOOD"}
                                    {(hoverRating || rating) === 5 && "EXCELLENT"}
                                </>
                            ) : "SELECT A RATING"}
                        </p>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-2" style={{ fontFamily: MONO }}>
                                TITLE
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Summarize your experience"
                                className="w-full px-4 py-3 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-all placeholder:text-[#6B7194]/50 dark:placeholder:text-[#8B90B8]/50"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest mb-2" style={{ fontFamily: MONO }}>
                                REVIEW
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you like or dislike?"
                                rows={4}
                                className="w-full px-4 py-3 border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 rounded-none bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] focus:ring-0 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-all resize-none placeholder:text-[#6B7194]/50 dark:placeholder:text-[#8B90B8]/50"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={rating === 0 || isSubmittingReview}
                            className="w-full py-4 px-6 bg-[#3B4FD8] hover:bg-[#2f3fab] text-white font-bold rounded-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[10px] uppercase tracking-widest shadow-sm"
                            style={{ fontFamily: MONO }}
                        >
                            {isSubmittingReview ? (
                                <span className="flex items-center justify-center gap-3">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin"></span>
                                    SUBMITTING...
                                </span>
                            ) : (
                                "SUBMIT REVIEW"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingReview;
