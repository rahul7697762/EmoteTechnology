import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Award, ClipboardList, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';

const StudentSidebar = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);
    const { isLoggingOut } = useSelector((state) => state.auth);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student-dashboard' },
        { icon: BookOpen, label: 'My Courses', path: '/student-courses' },
        { icon: Award, label: 'Certificates', path: '/student-certificates' },
        { icon: ClipboardList, label: 'Upcoming Quizzes', path: '/student-quizzes' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-[#1a1c23] border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto z-20 hidden md:block">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10v6" /><path d="M20 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" /><path d="M12 2v6" /><path d="M12 18v2" /></svg>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                        EMT Portal
                    </h1>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider">ACADEMIC SUITE</p>
                </div>
            </div>

            <div className="px-6 mb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
            </div>

            <nav className="px-4 space-y-1 mb-8">
                {navItems.slice(0, 4).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                            }`
                        }
                    >
                        <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-6 mb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Personal</p>
            </div>

            <nav className="px-4 space-y-1">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                        }`
                    }
                >
                    <Settings size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="absolute bottom-8 left-0 right-0 px-4 space-y-2">
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-xl transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                    onClick={() => dispatch(logout())}
                    disabled={isLoggingOut}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium disabled:opacity-50"
                >
                    <LogOut size={20} />
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
            </div>
        </aside>
    );
};

export default StudentSidebar;
