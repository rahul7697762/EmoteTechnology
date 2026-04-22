import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, Settings, LogOut, Sun, Moon, ArrowLeft, Menu, Home } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme, toggleSidebar } from '../../redux/slices/uiSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const Sidebar = () => {
    const dispatch = useDispatch();
    const { theme, isSidebarCollapsed: isCollapsed } = useSelector((state) => state.ui);
    const { isLoggingOut } = useSelector((state) => state.auth);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'My Courses', path: '/my-courses' },
        { icon: PlusCircle, label: 'Create Course', path: '/create-course' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {!isCollapsed && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
                    onClick={() => dispatch(toggleSidebar())}
                />
            )}
            <aside className={`${isCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'} bg-white dark:bg-[#252A41] border-r border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 h-screen fixed left-0 top-0 overflow-y-auto z-30 flex flex-col transition-all duration-300`}>
            {/* Header */}
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 mb-2' : 'gap-4 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 mb-2'}`}>
                {isCollapsed ? (
                    <div className="flex flex-col gap-6 items-center">
                        <button onClick={() => dispatch(toggleSidebar())} className="text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5]">
                            <Menu size={20} />
                        </button>
                        <Link to="/courses" className="text-[#3B4FD8] dark:text-[#6C7EF5] hover:opacity-80 transition-opacity">
                            <Home size={20} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <button onClick={() => dispatch(toggleSidebar())} className="p-2 -ml-2 text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors">
                            <Menu size={20} />
                        </button>
                        <Link to="/courses">
                            <h1 className="text-2xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                                Emote<span className="italic text-[#3B4FD8] dark:text-[#6C7EF5]">Tech</span>
                            </h1>
                        </Link>
                    </>
                )}
            </div>

            <nav className="px-4 space-y-1 mt-4 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center ${isCollapsed ? 'justify-center px-2 py-4' : 'space-x-4 px-4 py-3'} transition-all duration-200 ${isActive
                                ? 'bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white'
                                : 'text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/10 hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5]'
                            }`
                        }
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon size={18} />
                        {!isCollapsed && <span className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: MONO }}>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className={`p-4 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 space-y-2 ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-4 px-4 py-3 w-full text-left'} text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/10 hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors`}
                    title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    {!isCollapsed && <span className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: MONO }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>
                <button
                    onClick={() => dispatch(logout())}
                    disabled={isLoggingOut}
                    className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-4 px-4 py-3 w-full text-left'} text-[#E25C5C] hover:bg-[#E25C5C]/10 transition-colors disabled:opacity-50`}
                    title="Logout"
                >
                    <LogOut size={18} />
                    {!isCollapsed && <span className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: MONO }}>{isLoggingOut ? 'Logging...' : 'Logout'}</span>}
                </button>
            </div>
        </aside>
        </>
    );
};

export default Sidebar;
