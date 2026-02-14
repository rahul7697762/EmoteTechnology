import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sun, Moon, Search, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/uiSlice';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { theme } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Only consider a user authenticated when `user` exists in redux state.
    // Avoid showing "Dashboard" based solely on a stored token to ensure
    // unauthenticated users always see "Get Started" and are redirected to login.
    const goToDashboard = () => {
        if (!user) {
            navigate('/login');
            return;
        }


        // default to faculty/admin dashboard
        const role = (user.role || '').toUpperCase();
        if (role === 'STUDENT') {
            navigate('/student-dashboard');
            return;
        }
        if (role === 'COMPANY' || role === 'EMPLOYER') {
            navigate('/company/dashboard');
            return;
        }
        navigate('/dashboard');
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                            <Zap size={22} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Emote<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Technology</span>
                        </span>
                    </motion.div>

                    {/* Desktop Menu */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hidden md:flex items-center gap-6"
                    >
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 backdrop-blur-xl rounded-full px-2 py-2 border border-gray-200 dark:border-white/10">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Courses', path: '/courses' },
                                { name: 'Jobs', path: '/jobs' },
                                { name: 'AI interview', path: '/ai-interview' }
                            ].map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => navigate(item.path)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${location.pathname === item.path
                                        ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-500/5'
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-white/10 rounded-full leading-5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent sm:text-sm transition-all w-64"
                                placeholder="Search courses, jobs..."
                            />
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors hidden md:block"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="hidden md:block">
                            {user ? (
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={goToDashboard}
                                    className="group relative px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full font-semibold text-sm text-white overflow-hidden shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all hover:scale-105"
                                >
                                    <span className="relative z-10">Dashboard</span>
                                </motion.button>
                            ) : (
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={goToDashboard}
                                    className="group relative px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full font-semibold text-sm text-white overflow-hidden shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all hover:scale-105"
                                >
                                    <span className="relative z-10">Get Started</span>
                                </motion.button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 dark:text-gray-400"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-[#0a0a0f] border-t border-gray-200 dark:border-white/5 overflow-hidden"
                    >
                        <div className="px-6 py-8 space-y-6">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl leading-5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Search..."
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                {[
                                    { name: 'Home', path: '/' },
                                    { name: 'Courses', path: '/courses' },
                                    { name: 'Jobs', path: '/jobs' },
                                    { name: 'AI interview', path: '/ai-interview' }
                                ].map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            navigate(item.path);
                                            toggleMobileMenu();
                                        }}
                                        className={`text-left py-3 px-4 rounded-xl font-medium transition-colors ${location.pathname === item.path
                                            ? 'bg-teal-50 dark:bg-teal-900/10 text-teal-600 dark:text-teal-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-teal-500 dark:hover:text-teal-400'
                                            }`}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/5">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Appearance</span>
                                <button
                                    onClick={() => dispatch(toggleTheme())}
                                    className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                                >
                                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                </button>
                            </div>

                            <div className="pt-2">
                                {user ? (
                                    <button
                                        onClick={() => { goToDashboard(); toggleMobileMenu(); }}
                                        className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl font-bold text-white shadow-lg shadow-teal-500/20"
                                    >
                                        Dashboard
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { goToDashboard(); toggleMobileMenu(); }}
                                        className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl font-bold text-white shadow-lg shadow-teal-500/20"
                                    >
                                        Get Started
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
