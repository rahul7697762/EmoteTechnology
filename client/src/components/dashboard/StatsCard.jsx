import React from 'react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const StatsCard = ({ title, value, icon: Icon, trend, color = "indigo" }) => {
    const colorVariants = {
        indigo: "bg-[#3B4FD8]/5 text-[#3B4FD8] dark:bg-[#6C7EF5]/5 dark:text-[#6C7EF5]",
        emerald: "bg-[#2DC653]/5 text-[#2DC653]",
        blue: "bg-[#3B4FD8]/5 text-[#3B4FD8] dark:bg-[#6C7EF5]/5 dark:text-[#6C7EF5]",
        purple: "bg-[#3B4FD8]/5 text-[#3B4FD8] dark:bg-[#6C7EF5]/5 dark:text-[#6C7EF5]",
        amber: "bg-[#F5A623]/10 text-[#F5A623]",
    };

    return (
        <div className="bg-white dark:bg-[#252A41] p-6 lg:p-8 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>{title}</p>
                    <h3 className="text-4xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>{value}</h3>
                </div>
                <div className={`p-4 shrink-0 transition-colors ${colorVariants[color] || colorVariants.indigo}`}>
                    <Icon size={28} strokeWidth={1.5} />
                </div>
            </div>
            {trend && (
                <div className="mt-6 flex items-center text-xs font-semibold tracking-wider uppercase" style={{ fontFamily: MONO }}>
                    <span className={trend >= 0 ? "text-[#2DC653]" : "text-[#E25C5C]"}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </span>
                    <span className="text-[#6B7194] dark:text-[#8B90B8] ml-2">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
