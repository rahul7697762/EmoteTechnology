import React from 'react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const WelcomeBanner = ({ user, stats }) => {
    return (
        <div className="bg-[#3B4FD8] text-white p-6 md:p-10 mb-6 md:mb-8 flex flex-col md:flex-row items-center justify-between relative shadow-sm rounded-none border-b-4 border-[#1A1D2E]/20 overflow-hidden">
            {/* abstract accent shape */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rotate-45 pointer-events-none"></div>
            
            {/* content */}
            <div className="z-10 w-full md:w-auto md:max-w-xl text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: SERIF }}>
                    Welcome back, {user?.name?.split(' ')[0] || 'Alex'}!
                </h1>
                <p className="text-white/80 text-xs md:text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: MONO }}>
                    You've completed <span className="font-bold text-[#F5A623]">{stats?.goalProgress || 0}%</span> of your weekly goals. Keep up the momentum!
                </p>
            </div>

            <div className="flex w-full md:w-auto gap-4 mt-8 md:mt-0 z-10">
                <div className="border border-white/20 p-4 md:p-6 text-center flex-1 md:min-w-[140px] flex flex-col justify-center bg-white/5 hover:bg-white/10 transition-colors">
                    <h3 className="text-3xl md:text-4xl font-bold text-white leading-none" style={{ fontFamily: SERIF }}>{stats?.hoursSpent || 0}</h3>
                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-white/60 tracking-[0.2em] mt-3" style={{ fontFamily: MONO }}>Hours Spent</p>
                </div>
                <div className="border border-white/20 p-4 md:p-6 text-center flex-1 md:min-w-[140px] flex flex-col justify-center bg-white/5 hover:bg-white/10 transition-colors">
                    <h3 className="text-3xl md:text-4xl font-bold text-[#F5A623] leading-none" style={{ fontFamily: SERIF }}>{stats?.assignments || 0}</h3>
                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-white/60 tracking-[0.2em] mt-3" style={{ fontFamily: MONO }}>Assignments</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeBanner;
