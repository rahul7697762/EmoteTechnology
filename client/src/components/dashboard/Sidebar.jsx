import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'My Courses', path: '/my-courses' },
        { icon: PlusCircle, label: 'Create Course', path: '/create-course' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-[#1a1c23] border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto z-20 hidden md:block">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                    EmoteTechnology
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Faculty Portal</p>
            </div>

            <nav className="mt-6 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-teal-500/10 text-teal-500 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="absolute bottom-8 left-0 right-0 px-4">
                <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-colors mb-2"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
