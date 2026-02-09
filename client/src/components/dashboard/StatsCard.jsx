import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, color = "teal" }) => {
    const colorVariants = {
        teal: "bg-teal-500/10 text-teal-500",
        emerald: "bg-emerald-500/10 text-emerald-500",
        blue: "bg-blue-500/10 text-blue-500",
        purple: "bg-purple-500/10 text-purple-500",
        amber: "bg-amber-500/10 text-amber-500",
    };

    return (
        <div className="bg-white dark:bg-[#1a1c23] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorVariants[color] || colorVariants.teal}`}>
                    <Icon size={24} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-xs">
                    <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </span>
                    <span className="text-gray-400 ml-1">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
