import { motion } from 'framer-motion';
import { Sun, Moon, Home, LayoutGrid, Briefcase, Sparkles, User as UserIcon, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/uiSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { theme } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);

    const goToDashboard = () => {
        if (!user) { navigate('/login'); return; }
        const role = (user.role || '').toUpperCase();
        if (role === 'STUDENT') { navigate('/student-dashboard'); return; }
        if (role === 'COMPANY' || role === 'EMPLOYER') { navigate('/company/dashboard'); return; }
        navigate('/dashboard');
    };

    const allNavItems = [
        { name: 'Home', path: '/', authHide: true },
        { name: 'Courses', path: '/courses' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'AI Interview', path: '/ai-interview' },
        { name: 'Blog', path: '/blog' },
    ];
    const navItems = allNavItems.filter(item => !(item.authHide && user));

    const allMobileNavItems = [
        { name: 'Home', path: '/', icon: Home, authHide: true },
        { name: 'Courses', path: '/courses', icon: LayoutGrid },
        { name: 'Jobs', path: '/jobs', icon: Briefcase },
        { name: 'Blog', path: '/blog', icon: BookOpen },
        { name: 'AI', path: '/ai-interview', icon: Sparkles },
        { name: 'Account', path: '/dashboard', icon: UserIcon, onClick: goToDashboard },
    ];
    const mobileNavItems = allMobileNavItems.filter(item => !(item.authHide && user));

    return (
        <>
            {/* ── Desktop / Top Navbar ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F7F8FF]/92 dark:bg-[#1A1D2E]/92 backdrop-blur-md border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-baseline gap-0.5 cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <span
                                className="text-[1.6rem] font-semibold leading-none text-[#3B4FD8] dark:text-[#6C7EF5]"
                                style={{ fontFamily: SERIF }}
                            >
                                Emote
                            </span>
                            <span className="text-base font-light text-[#1A1D2E] dark:text-[#E8EAF2] tracking-[0.04em]">
                                Technology
                            </span>
                        </motion.div>

                        {/* Desktop nav links */}
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hidden md:flex items-center gap-8"
                        >
                            <div className="flex items-center gap-6">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => navigate(item.path)}
                                        className={`text-sm font-medium transition-colors relative pb-0.5 ${
                                            location.pathname === item.path
                                                ? 'text-[#3B4FD8] dark:text-[#6C7EF5]'
                                                : 'text-[#6B7194] dark:text-[#8B90B8] hover:text-[#1A1D2E] dark:hover:text-[#E8EAF2]'
                                        }`}
                                    >
                                        {item.name}
                                        {location.pathname === item.path && (
                                            <motion.div
                                                layoutId="nav-underline"
                                                className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#3B4FD8] dark:bg-[#6C7EF5]"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className="p-1.5 text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                            >
                                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                            </button>

                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={goToDashboard}
                                className="px-5 py-2 bg-[#F5A623] dark:bg-[#F9C74F] text-white dark:text-[#1A1D2E] text-sm font-medium tracking-wide hover:bg-[#d9911a] dark:hover:bg-[#F5A623] transition-colors"
                            >
                                {user ? 'Dashboard' : 'Get Started'}
                            </motion.button>
                        </div>

                        {/* Mobile: theme toggle only on top bar */}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="md:hidden p-1.5 text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Bottom Tab Bar ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F7F8FF] dark:bg-[#1A1D2E] border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8 shadow-[0_-4px_24px_rgba(59,79,216,0.08)] transition-colors duration-300">
                <div className="flex justify-around items-stretch px-1">
                    {mobileNavItems.map(item => {
                        const isActive = item.path === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(item.path) && item.path !== '/dashboard';
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    if (item.onClick) item.onClick();
                                    else navigate(item.path);
                                }}
                                className={`flex flex-col items-center justify-center flex-1 py-3 gap-1 transition-all duration-200 relative ${
                                    isActive
                                        ? 'text-[#3B4FD8] dark:text-[#6C7EF5]'
                                        : 'text-[#6B7194] dark:text-[#8B90B8] active:text-[#3B4FD8]'
                                }`}
                            >
                                {/* Active indicator dot */}
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-tab-indicator"
                                        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-[#3B4FD8] dark:bg-[#6C7EF5]"
                                    />
                                )}
                                <item.icon
                                    size={20}
                                    strokeWidth={isActive ? 2.2 : 1.6}
                                />
                                <span
                                    className={`text-[9px] font-semibold tracking-wider uppercase ${
                                        isActive ? 'opacity-100' : 'opacity-60'
                                    }`}
                                    style={{ fontFamily: MONO }}
                                >
                                    {item.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Navbar;
