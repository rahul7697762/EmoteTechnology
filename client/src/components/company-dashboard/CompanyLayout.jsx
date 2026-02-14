import React, { useState, useRef, useEffect } from 'react';
import CompanySidebar from './CompanySidebar';
import { Search, Bell, Settings, LogOut, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Link } from 'react-router-dom';

const CompanyLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isSidebarCollapsed } = useSelector((state) => state.ui);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Default user image if none provided
  const userImage = user?.profile?.avatar;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white font-sans">
      <CompanySidebar />

      <main className={`p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Top Header Row: Search & Profile */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Bar - Optional, maybe search within company context */}
          <div className="relative w-full md:max-w-xl hidden md:block opacity-0 pointer-events-none">
            {/* Hidden placeholder to keep alignment matching Student Dashboard */}
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-xl"
            />
          </div>

          {/* Right Side: Notification & Profile */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-end ml-auto">
            <button className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0f]"></span>
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800 focus:outline-none"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="text-right hidden sm:block">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    {user?.name || 'Company User'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || 'Employer'}
                  </p>
                </div>
                {userImage ? (
                  <img
                    src={userImage}
                    alt="Profile"
                    className={`w-10 h-10 rounded-full object-cover border-2 shadow-sm transition-colors ${isProfileOpen ? 'border-teal-500' : 'border-white dark:border-gray-800'
                      }`}
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 shadow-sm transition-colors ${isProfileOpen ? 'border-teal-500 text-teal-600' : 'border-white dark:border-gray-800 text-gray-400'}`}>
                    <User size={20} />
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1a1c23] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-2">
                    <Link to="/company/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <Settings size={18} />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

export default CompanyLayout;
