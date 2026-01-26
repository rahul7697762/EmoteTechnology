import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeeklyStreak = () => {
    const [streakData, setStreakData] = useState({
        currentStreak: 0,
        activity: [0, 0, 0, 0, 0, 0, 0] // 7 days
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');

                const response = await axios.get(`${apiUrl}/student/weekly-streak`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

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

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    // Find the max value to scale bars relative to highest activity
    const maxActivity = Math.max(...streakData.activity, 1);

    return (
        <div className="bg-[#1a1c23] text-white p-6 rounded-3xl relative overflow-hidden shadow-lg min-h-[180px]">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10">
                <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">Weekly Streak</p>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    {streakData.currentStreak} Days Strong! <span className="text-2xl animate-pulse">🔥</span>
                </h3>

                <div className="flex items-end justify-between h-16 gap-2">
                    {streakData.activity.map((val, index) => {
                        const heightPercent = Math.max((val / maxActivity) * 100, 10); // Min 10% height
                        const isToday = index === new Date().getDay() - 1; // Approx check, handled better in real app
                        const isHighActivity = val >= 3;

                        return (
                            <div key={index} className="w-1/7 flex flex-col items-center gap-1 flex-1">
                                <div
                                    className={`w-full rounded-t-sm transition-all duration-500 ${isHighActivity
                                            ? 'bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]'
                                            : val > 0
                                                ? 'bg-teal-500/50'
                                                : 'bg-gray-700/30'
                                        }`}
                                    style={{ height: `${heightPercent}%` }}
                                ></div>
                                {/* <span className="text-[9px] text-gray-500">{days[index]}</span> */}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WeeklyStreak;
