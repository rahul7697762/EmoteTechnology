import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut, Sun, Moon, ArrowLeft, Menu, Home } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/uiSlice';
import { toggleSidebar } from '../../redux/slices/uiSlice';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.ui);
    const { isLoggingOut } = useSelector((state) => state.auth);
    const { isSidebarCollapsed: isCollapsed } = useSelector((state) => state.ui);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'My Courses', path: '/my-courses' },
        { icon: PlusCircle, label: 'Create Course', path: '/create-course' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-[#1a1c23] border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto z-20 hidden md:flex flex-col transition-all duration-300`}>
            {/* Header */}
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
                {isCollapsed ? (
                    <div className="flex flex-col gap-4 items-center">
                        <button onClick={() => dispatch(toggleSidebar())} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <Menu size={24} />
                        </button>
                        <Link to="/" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-teal-600 dark:text-teal-400">
                            <Home size={24} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <button onClick={() => dispatch(toggleSidebar())} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-300">
                            <Menu size={20} />
                        </button>
                        <Link to="/">
                            <h1 className="text-xl font-bold bg-linear-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                                EmoteTech
                            </h1>
                        </Link>
                    </>
                )}
            </div>

            <nav className="mt-2 px-4 space-y-2 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-teal-500/10 text-teal-500 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                            }`
                        }
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon size={20} />
                        {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className={`p-4 border-t border-gray-100 dark:border-gray-800 space-y-2 ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3 w-full text-left'} text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl transition-colors`}
                    title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    {!isCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>
                <button
                    onClick={() => dispatch(logout())}
                    disabled={isLoggingOut}
                    className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3 w-full text-left'} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors disabled:opacity-50`}
                    title="Logout"
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span>{isLoggingOut ? 'Logging...' : 'Logout'}</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
