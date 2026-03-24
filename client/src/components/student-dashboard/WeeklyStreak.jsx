import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const WeeklyStreak = () => {
    const [streakData, setStreakData] = useState({
        currentStreak: 0,
        activity: [0, 0, 0, 0, 0, 0, 0] // 7 days
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const response = await api.get('/student/weekly-streak');

                if (response.data.success) {
                    setStreakData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch streak", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStreak();
    }, []);

    // Find the max value to scale bars relative to highest activity
    const maxActivity = Math.max(...streakData.activity, 1);

    return (
        <div className="bg-[#1A1D2E] text-white p-8 relative overflow-hidden shadow-sm min-h-[220px] rounded-none border border-[#6C7EF5]/10">
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#3B4FD8] flex items-center justify-center opacity-20 border border-white/10 rotate-45 pointer-events-none"></div>

            <div className="relative z-10">
                <p className="text-[10px] font-bold text-[#F5A623] uppercase tracking-[0.2em] mb-4" style={{ fontFamily: MONO }}>Weekly Streak</p>
                <h3 className="text-4xl font-bold mb-8 flex items-center gap-3 text-white" style={{ fontFamily: SERIF }}>
                    {streakData.currentStreak} Days Strong!
                </h3>

                <div className="flex items-end justify-between h-20 gap-2 border-b border-white/10 pb-1">
                    {streakData.activity.map((val, index) => {
                        const heightPercent = Math.max((val / maxActivity) * 100, 10); // Min 10% height
                        const isHighActivity = val >= 3;

                        return (
                            <div key={index} className="w-1/7 flex flex-col items-center gap-1 flex-1 h-full justify-end">
                                <div
                                    className={`w-full transition-all duration-500 rounded-none ${isHighActivity
                                        ? 'bg-[#F5A623]'
                                        : val > 0
                                            ? 'bg-[#3B4FD8]'
                                            : 'bg-white/5'
                                        }`}
                                    style={{ height: `${heightPercent}%` }}
                                ></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WeeklyStreak;
