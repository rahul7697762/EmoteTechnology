import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { LayoutDashboard } from 'lucide-react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import JobDashboard from '../components/Job-portal/components/JobDashboard';

const StudentJobDashboard = () => {
  const { isSidebarCollapsed } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white font-sans">
      <StudentSidebar />

      <main className={`p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="mb-8 p-4 bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Track your job search progress and recommended roles.</p>
          </div>
        </div>

        <JobDashboard />
      </main>
    </div>
  );
};

export default StudentJobDashboard;
