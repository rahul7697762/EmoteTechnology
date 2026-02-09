import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.theme);
    const { isLoggingOut } = useSelector((state) => state.auth);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'My Courses', path: '/my-courses' },
        { icon: PlusCircle, label: 'Create Course', path: '/create-course' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-[#1a1c23] border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto z-20 hidden md:block">
            <div className="p-6 flex items-center gap-4">
                <Link to="/" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                    <ArrowLeft size={20} />
                </Link>
                <Link to="/">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        EmoteTech
                    </h1>
                </Link>
            </div>

            <nav className="mt-2 px-4 space-y-2">
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
                    onClick={() => dispatch(toggleTheme())}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-colors mb-2"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                    onClick={() => dispatch(logout())}
                    disabled={isLoggingOut}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors disabled:opacity-50"
                >
                    <LogOut size={20} />
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
