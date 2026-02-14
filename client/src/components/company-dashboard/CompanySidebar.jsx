import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Users, Building, Settings, LogOut, Sun, Moon, Menu, Home, Briefcase } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme, toggleSidebar } from '../../redux/slices/uiSlice';

const CompanySidebar = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { isLoggingOut } = useSelector((state) => state.auth);
  const { isSidebarCollapsed: isCollapsed } = useSelector((state) => state.ui);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company/dashboard' },
    { icon: Building, label: 'Company Profile', path: '/company/profile' },
    { icon: PlusCircle, label: 'Post a Job', path: '/company/post-job' },
    { icon: Users, label: 'Manage Applicants', path: '/company/applicants' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-[#1a1c23] border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto z-20 hidden md:flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        {isCollapsed ? (
          <div className="flex flex-col gap-4 items-center">
            <button onClick={() => dispatch(toggleSidebar())} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <Menu size={24} />
            </button>
            <NavLink to="/" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-teal-600 dark:text-teal-400">
              <Home size={24} />
            </NavLink>
          </div>
        ) : (
          <>
            <button onClick={() => dispatch(toggleSidebar())} className="p-2 -ml-2 mr-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-300">
              <Menu size={20} />
            </button>

            <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                <Briefcase size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  EMT Jobs
                </h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider">EMPLOYER PORTAL</p>
              </div>
            </NavLink>
          </>
        )}
      </div>

      {!isCollapsed && (
        <div className="px-6 mb-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
        </div>
      )}

      <nav className={`px-4 space-y-1 mb-8 ${isCollapsed ? 'mt-4' : ''}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="px-6 mb-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Personal</p>
        </div>
      )}

      <nav className="px-4 space-y-1 flex-1">
        <NavLink
          to="/company/settings"
          className={({ isActive }) =>
            `flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
            }`
          }
          title={isCollapsed ? 'Settings' : ''}
        >
          <Settings size={20} className="group-hover:scale-110 transition-transform" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      <div className={`p-4 space-y-2 ${isCollapsed ? 'items-center flex flex-col' : 'absolute bottom-8 left-0 right-0 px-4'}`}>
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3 w-full text-left'} text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-xl transition-colors`}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button
          onClick={() => dispatch(logout())}
          disabled={isLoggingOut}
          className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3 w-full text-left'} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium disabled:opacity-50`}
          title="Logout"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>{isLoggingOut ? 'Logging...' : 'Logout'}</span>}
        </button>
      </div>
    </aside>
  );
};

export default CompanySidebar;
