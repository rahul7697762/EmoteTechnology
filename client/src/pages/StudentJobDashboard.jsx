import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { LayoutDashboard } from 'lucide-react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import JobDashboard from '../components/Job-portal/components/JobDashboard';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const StudentJobDashboard = () => {
  const { isSidebarCollapsed } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] font-sans flex transition-colors duration-300">
      <StudentSidebar />

      <main className={`flex-1 p-8 lg:p-12 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="mb-8 p-6 bg-white dark:bg-[#1A1D2E] rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 relative group">
          
          {/* Accent Line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3B4FD8] dark:bg-[#6C7EF5]"></div>

          <div className="p-4 bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#3B4FD8] dark:text-[#6C7EF5] rounded-none border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-2" style={{ fontFamily: SERIF }}>Job Dashboard</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Track your job search progress and recommended roles</p>
          </div>
        </div>

        <div className="animate-in slide-in-from-bottom-4">
          <JobDashboard />
        </div>
      </main>
    </div>
  );
};

export default StudentJobDashboard;
