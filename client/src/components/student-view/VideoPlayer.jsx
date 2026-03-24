import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateHeartbeat, fetchVideoProgress } from '../../redux/slices/progressSlice';
import { MonitorPlay, PlayCircle, Award, Download } from 'lucide-react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
            <div className="w-full aspect-video bg-[#0A0B10] flex items-center justify-center text-white/50 flex-col gap-4 font-bold" style={{ fontFamily: MONO }}>
                <MonitorPlay size={64} className="text-[#6B7194]" />
                <p className="text-[10px] uppercase tracking-widest text-[#6B7194]">Video source unavailable</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-[#F7F8FF] dark:bg-[#0A0B10] overflow-y-auto custom-scrollbar">
            <div className="w-full bg-black shrink-0 relative">
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

            <div className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-10">
                <div className="bg-white dark:bg-[#252A41] rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 p-8 md:p-12">
                    <div className="border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 pb-8 mb-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-6 leading-tight" style={{ fontFamily: SERIF }}>
                            {lesson.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest" style={{ fontFamily: MONO }}>
                            <span className="flex items-center gap-2 text-[#3B4FD8] dark:text-[#6C7EF5] bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 px-3 py-1.5 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                                <PlayCircle size={14} />
                                Video Lesson
                            </span>
                            <span>
                                {lesson.video?.duration ? `${Math.floor(lesson.video.duration / 60)} MIN ${String(lesson.video.duration % 60).padStart(2, '0')} SEC` : 'DURATION N/A'}
                            </span>
                            {currentProgress?.isCompleted && (
                                <span className="ml-auto text-white bg-[#3B4FD8] px-4 py-1.5 border border-[#3B4FD8]/20 shadow-sm">
                                    COMPLETED
                                </span>
                            )}
                        </div>
                    </div>

                    {lesson.description && (
                        <div className="prose prose-slate dark:prose-invert max-w-none mb-10
                            prose-headings:font-bold prose-headings:text-[#1A1D2E] dark:prose-headings:text-[#E8EAF2]
                            prose-p:text-[#6B7194] dark:prose-p:text-[#8B90B8] prose-p:leading-relaxed
                        ">
                            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: SERIF }}>Description</h3>
                            <p className="text-base">{lesson.description}</p>
                        </div>
                    )}

                    {/* Completion Certificate Banner */}
                    {isCourseCompleted && (
                        <div className="bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-none p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white dark:bg-[#1A1D2E] border border-[#F5A623]/30 text-[#F5A623]">
                                    <Award size={36} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-2" style={{ fontFamily: SERIF }}>Course Completed! 🎉</h3>
                                    <p className="text-sm text-[#6B7194] dark:text-[#8B90B8]">You've successfully finished this course.</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                {certificate ? (
                                    <button
                                        onClick={() => window.open(certificate.certificateUrl, '_blank')}
                                        className="px-8 py-4 bg-[#3B4FD8] hover:bg-[#2f3fab] text-white font-bold rounded-none flex items-center justify-center gap-3 transition-colors text-[10px] uppercase tracking-widest shadow-sm w-full md:w-auto"
                                        style={{ fontFamily: MONO }}
                                    >
                                        <Download size={16} />
                                        Download Certificate
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = '/student-certificates'}
                                        className="px-8 py-4 bg-white dark:bg-[#1A1D2E] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#1A1D2E] dark:text-[#E8EAF2] font-bold rounded-none hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 flex items-center justify-center gap-3 transition-colors text-[10px] uppercase tracking-widest w-full md:w-auto"
                                        style={{ fontFamily: MONO }}
                                    >
                                        <Award size={16} />
                                        View Certificates
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
