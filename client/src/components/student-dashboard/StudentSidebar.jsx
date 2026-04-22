import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Award, ClipboardList, Settings, LogOut, Sun, Moon, Menu, Home, Layers } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme, toggleSidebar } from '../../redux/slices/uiSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const StudentSidebar = () => {
    const dispatch = useDispatch();
    const { theme, isSidebarCollapsed: isCollapsed } = useSelector((state) => state.ui);
    const { isLoggingOut } = useSelector((state) => state.auth);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student-dashboard' },
        { icon: ClipboardList, label: 'My Applications', path: '/student/applications' },
        { icon: BookOpen, label: 'My Courses', path: '/student-courses' },
        { icon: Award, label: 'Certificates', path: '/student-certificates' },
        { icon: ClipboardList, label: 'Upcoming Quizzes', path: '/student-quizzes' },
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
            <aside className={`${isCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'} bg-[#F7F8FF] dark:bg-[#1A1D2E] border-r border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 h-screen fixed left-0 top-0 overflow-y-auto z-30 flex flex-col transition-all duration-300`}>
            {/* Header */}
            <div className={`p-6 flex items-center border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 mb-6 ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
                {isCollapsed ? (
                    <div className="flex flex-col gap-6 items-center">
                        <button onClick={() => dispatch(toggleSidebar())} className="text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors">
                            <Menu size={24} />
                        </button>
                        <NavLink to="/courses" className="p-3 bg-[#3B4FD8]/10 text-[#3B4FD8] dark:bg-[#6C7EF5]/10 dark:text-[#6C7EF5] transition-colors">
                            <Home size={20} />
                        </NavLink>
                    </div>
                ) : (
                    <>
                        <button onClick={() => dispatch(toggleSidebar())} className="p-2 -ml-2 hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors text-[#6B7194] dark:text-[#8B90B8]">
                            <Menu size={20} />
                        </button>

                        <NavLink to="/courses" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 bg-[#3B4FD8] flex items-center justify-center text-white font-bold shadow-sm">
                                <Layers size={20} strokeWidth={2} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] leading-tight" style={{ fontFamily: SERIF }}>
                                    EMT Portal
                                </h1>
                                <p className="text-[10px] text-[#F5A623] font-bold tracking-[0.2em]" style={{ fontFamily: MONO }}>ACADEMIC SUITE</p>
                            </div>
                        </NavLink>
                    </>
                )}
            </div>

            {!isCollapsed && (
                <div className="px-6 mb-4 mt-2">
                    <p className="text-[10px] font-bold text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>Menu</p>
                </div>
            )}

            <nav className={`px-4 space-y-2 mb-8 ${isCollapsed ? 'mt-4' : ''}`}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-4 px-5 py-3'} transition-all duration-200 group border border-transparent ${isActive
                                ? 'bg-[#3B4FD8]/10 text-[#3B4FD8] dark:bg-[#6C7EF5]/10 dark:text-[#6C7EF5] font-bold border-l-2 !border-l-[#3B4FD8] dark:!border-l-[#6C7EF5]'
                                : 'text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 hover:text-[#1A1D2E] dark:hover:text-[#E8EAF2]'
                            }`
                        }
                        title={isCollapsed ? item.label : ''}
                    >
                        <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                        {!isCollapsed && <span className="text-[11px] uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>


            <div className={`p-4 mt-auto space-y-2 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 ${isCollapsed ? 'items-center flex flex-col pt-6' : 'px-4 mb-4 pt-6'}`}>
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-4 px-5 py-3 w-full text-left'} text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 hover:text-[#1A1D2E] dark:hover:text-[#E8EAF2] transition-colors`}
                    title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    {!isCollapsed && <span className="text-[10px] uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>
                <button
                    onClick={() => dispatch(logout())}
                    disabled={isLoggingOut}
                    className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'space-x-4 px-5 py-3 w-full text-left'} text-[#E25C5C] hover:bg-[#E25C5C]/10 transition-colors disabled:opacity-50`}
                    title="Logout"
                >
                    <LogOut size={18} />
                    {!isCollapsed && <span className="text-[10px] uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>{isLoggingOut ? 'Logging...' : 'Logout'}</span>}
                </button>
            </div>
        </aside>
        </>
    );
};

export default StudentSidebar;
