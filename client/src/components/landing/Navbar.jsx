import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Search, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/uiSlice';
import { useState } from 'react';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { theme } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const goToDashboard = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        const role = (user.role || '').toUpperCase();
        if (role === 'STUDENT') { navigate('/student-dashboard'); return; }
        if (role === 'COMPANY' || role === 'EMPLOYER') { navigate('/company/dashboard'); return; }
        navigate('/dashboard');
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'AI Interview', path: '/ai-interview' },
    ];

    return (
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

                    {/* Desktop nav */}
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
                                    className={`text-sm font-medium transition-colors relative pb-0.5 ${location.pathname === item.path
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

                        {/* Removed Search Component */}
                    </motion.div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="hidden md:block p-1.5 text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                        </button>

                        <div className="hidden md:block">
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={goToDashboard}
                                className="px-5 py-2 bg-[#F5A623] dark:bg-[#F9C74F] text-white dark:text-[#1A1D2E] text-sm font-medium tracking-wide hover:bg-[#d9911a] dark:hover:bg-[#F5A623] transition-colors"
                            >
                                {user ? 'Dashboard' : 'Get Started'}
                            </motion.button>
                        </div>

                        <button
                            className="md:hidden p-1.5 text-[#6B7194] dark:text-[#8B90B8]"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#F7F8FF] dark:bg-[#1A1D2E] border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/8 overflow-hidden"
                    >
                        <div className="px-6 py-8 space-y-6">
                            {/* Removed Search Component from Mobile Menu */}

                            <div className="flex flex-col space-y-0">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => { navigate(item.path); toggleMobileMenu(); }}
                                        className={`text-left py-3.5 font-medium transition-colors border-b border-[#3B4FD8]/8 dark:border-[#6C7EF5]/6 ${location.pathname === item.path
                                            ? 'text-[#3B4FD8] dark:text-[#6C7EF5]'
                                            : 'text-[#6B7194] dark:text-[#8B90B8] hover:text-[#1A1D2E] dark:hover:text-[#E8EAF2]'
                                            }`}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span
                                    className="text-[10px] tracking-[0.2em] uppercase text-[#6B7194] dark:text-[#8B90B8]"
                                    style={{ fontFamily: MONO }}
                                >
                                    Appearance
                                </span>
                                <button
                                    onClick={() => dispatch(toggleTheme())}
                                    className="p-1.5 text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                                >
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                </button>
                            </div>

                            <button
                                onClick={() => { goToDashboard(); toggleMobileMenu(); }}
                                className="w-full py-3.5 bg-[#F5A623] dark:bg-[#F9C74F] text-white dark:text-[#1A1D2E] font-medium tracking-wide hover:bg-[#d9911a] transition-colors"
                            >
                                {user ? 'Dashboard' : 'Get Started'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
