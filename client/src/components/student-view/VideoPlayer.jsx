
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateHeartbeat, fetchVideoProgress } from '../../redux/slices/progressSlice';
import { MonitorPlay, PlayCircle, Award, Download } from 'lucide-react';

const VideoPlayer = ({ lesson, courseId }) => {
    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const progressInterval = useRef(null);
    const lastTimeRef = useRef(0);
    const isSeekingRef = useRef(false);
    const { lessonProgress, isCompleted: isCourseCompleted, certificate } = useSelector((state) => state.progress);

    // Get progress for current lesson
    const currentProgress = lessonProgress[lesson._id];

    // 1. Initialize & Fetch Resume Point on Mount/Change
    useEffect(() => {
        if (lesson && courseId) {
            dispatch(fetchVideoProgress(lesson._id));
        }

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, [lesson._id, courseId, dispatch]);

    // 2. Resume Playback (One-time)
    useEffect(() => {
        if (currentProgress?.lastWatchedTime && videoRef.current && !videoRef.current.hasResumed) {
            videoRef.current.currentTime = currentProgress.lastWatchedTime;
            videoRef.current.hasResumed = true;
        }
    }, [currentProgress?.lastWatchedTime]);

    // 3. Heartbeat Logic
    const startHeartbeat = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);

        // Update lastTime to current time when starting/resuming
        if (videoRef.current) {
            lastTimeRef.current = Math.floor(videoRef.current.currentTime);
        }

        progressInterval.current = setInterval(() => {
            const video = videoRef.current;
            if (!video) return;

            // Strict checks: Playing, Not Ended, Not Buffering (HAVE_FUTURE_DATA), Visible, Not Seeking
            if (
                !video.paused &&
                !video.ended &&
                video.readyState >= 3 &&
                document.visibilityState === 'visible' &&
                !isSeekingRef.current
            ) {
                const currentTime = Math.floor(video.currentTime);
                const delta = currentTime - lastTimeRef.current;

                // Only send if time actually moved forward realistically (0 < delta < 10s)
                if (delta > 0 && delta <= 10) {
                    dispatch(updateHeartbeat({
                        subModuleId: lesson._id,
                        watchedDelta: delta,
                        currentTime: currentTime,
                        courseId
                    }));

                    lastTimeRef.current = currentTime;
                }
            }
        }, 5000);
    };

    const stopHeartbeat = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
    };

    const handleVideoEnded = () => {
        stopHeartbeat();
        if (videoRef.current) {
            dispatch(updateHeartbeat({
                subModuleId: lesson._id,
                watchedDelta: 0,
                currentTime: videoRef.current.duration,
                courseId
            }));
        }
    };

    // Handle Seeking Events
    const handleSeeking = () => {
        isSeekingRef.current = true;
    };

    const handleSeeked = () => {
        isSeekingRef.current = false;
        if (videoRef.current) {
            lastTimeRef.current = Math.floor(videoRef.current.currentTime);
        }
    };

    // Handle Visibility Change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopHeartbeat();
            } else if (videoRef.current && !videoRef.current.paused) {
                startHeartbeat();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    if (!lesson.video?.url) {
        return (
            <div className="w-full aspect-video bg-black flex items-center justify-center text-white/50 flex-col gap-4">
                <MonitorPlay size={64} className="opacity-50" />
                <p>Video source unavailable</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0f1c] overflow-y-auto custom-scrollbar">
            <div className="w-full bg-black shadow-lg shrink-0">
                <div className="max-w-6xl mx-auto w-full aspect-video bg-black relative">
                    <video
                        ref={videoRef}
                        src={lesson.video.url}
                        controls
                        className="w-full h-full"
                        controlsList="nodownload"
                        onPlay={startHeartbeat}
                        onPause={stopHeartbeat}
                        onEnded={handleVideoEnded}
                        onSeeking={handleSeeking}
                        onSeeked={handleSeeked}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-8">
                <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <div className="border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                            {lesson.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <PlayCircle size={16} className="text-violet-600 dark:text-violet-400" />
                                Video Lesson
                            </span>
                            <span>•</span>
                            <span>
                                {lesson.video?.duration ? `${Math.floor(lesson.video.duration / 60)} min ${String(lesson.video.duration % 60).padStart(2, '0')} sec` : 'Duration N/A'}
                            </span>
                            {currentProgress?.isCompleted && (
                                <span className="ml-auto text-green-500 font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded text-xs">
                                    COMPLETED
                                </span>
                            )}
                        </div>
                    </div>

                    {lesson.description && (
                        <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Description</h3>
                            <p>{lesson.description}</p>
                        </div>
                    )}

                    {/* Completion Certificate Banner */}
                    {isCourseCompleted && (
                        <div className="bg-linear-to-r from-teal-500/10 to-blue-500/10 border border-teal-200 dark:border-teal-900 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-teal-100 dark:bg-teal-900/40 rounded-full text-teal-600 dark:text-teal-400">
                                    <Award size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course Completed! 🎉</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">You've successfully finished this course.</p>
                                </div>
                            </div>

                            {certificate ? (
                                <button
                                    onClick={() => window.open(certificate.certificateUrl, '_blank')}
                                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-transform hover:scale-105"
                                >
                                    <Download size={18} />
                                    Download Certificate
                                </button>
                            ) : (
                                <button
                                    onClick={() => window.location.href = '/student-certificates'}
                                    className="px-6 py-2.5 bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                                >
                                    <Award size={18} />
                                    View Certificates
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
