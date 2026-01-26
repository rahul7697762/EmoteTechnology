import React from 'react';

const WelcomeBanner = ({ user, stats }) => {
    return (
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
            {/* content */}
            <div className="z-10 max-w-lg">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'Alex'}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    You've completed <span className="font-bold text-teal-600 dark:text-teal-400">{stats?.goalProgress || 0}%</span> of your weekly goals. Keep up the momentum!
                </p>
            </div>

            <div className="flex gap-4 mt-6 md:mt-0 z-10">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm text-center min-w-[120px]">
                    <h3 className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats?.hoursSpent || 0}</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1">Hours Spent</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm text-center min-w-[120px]">
                    <h3 className="text-3xl font-bold text-amber-500">{stats?.assignments || 0}</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-1">Assignments</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeBanner;
