import React from 'react';
import { useSelector } from 'react-redux';
import { ClipboardList, Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/slices/uiSlice';
import StudentSidebar from '../components/student-dashboard/StudentSidebar';
import MyApplications from '../components/Job-portal/pages/MyApplications';
import NotificationBell from '../components/common/NotificationBell';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const StudentApplications = () => {
  const { isSidebarCollapsed } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#1A1D2E] dark:text-[#E8EAF2] font-sans flex transition-colors duration-300">
      <StudentSidebar />

      <main className={`flex-1 p-4 md:p-8 lg:p-12 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center mb-6">
            <button 
                onClick={() => dispatch(toggleSidebar())} 
                className="p-2 -ml-2 text-[#1A1D2E] dark:text-[#E8EAF2] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors cursor-pointer"
            >
                <Menu size={24} />
            </button>
        </div>

        <div className="mb-8 p-6 bg-white dark:bg-[#1A1D2E] rounded-none border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex flex-col md:flex-row items-start md:items-center gap-6 animate-in fade-in slide-in-from-top-4 relative group">
          
          {/* Accent Line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3B4FD8] dark:bg-[#6C7EF5]"></div>

          <div className="p-4 bg-[#F7F8FF] dark:bg-[#0A0B10] text-[#3B4FD8] dark:text-[#6C7EF5] rounded-none border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20">
            <ClipboardList size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-2" style={{ fontFamily: SERIF }}>My Applications</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Manage and track your job applications</p>
          </div>
          <div className="ml-auto pr-4">
            <NotificationBell />
          </div>
        </div>

        <div className="animate-in slide-in-from-bottom-4">
          <MyApplications />
        </div>
      </main>
    </div>
  );
};

export default StudentApplications;
