import React from 'react';
import { useSelector } from 'react-redux';
import { ClipboardList } from 'lucide-react';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import MyApplications from '../components/Job-portal/pages/MyApplications';

const StudentApplications = () => {
  const { isSidebarCollapsed } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white font-sans">
      <StudentSidebar />

      <main className={`p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="mb-8 p-4 bg-white dark:bg-[#1a1c23] rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Applications</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage and track your job applications.</p>
          </div>
        </div>

        <MyApplications />
      </main>
    </div>
  );
};

export default StudentApplications;
