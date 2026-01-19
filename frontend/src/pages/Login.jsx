import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Shield, GraduationCap, Users, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roles = [
    {
        id: 'admin',
        label: 'Admin',
        description: 'Manage platform',
        icon: Shield,
        gradient: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-500/30',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/50',
    },
    {
        id: 'student',
        label: 'Student',
        description: 'Learn & grow',
        icon: GraduationCap,
        gradient: 'from-teal-500 to-cyan-500',
        glow: 'shadow-teal-500/30',
        bg: 'bg-teal-500/10',
        border: 'border-teal-500/50',
    },
    {
        id: 'faculty',
        label: 'Faculty',
        description: 'Teach & inspire',
        icon: Users,
        gradient: 'from-orange-500 to-amber-500',
        glow: 'shadow-orange-500/30',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/50',
    },
];

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('student');

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert(`Login as ${selectedRole.toUpperCase()}\nEmail: ${email}`);
        }, 1500);
    };

    const selectedRoleData = roles.find(r => r.id === selectedRole);

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-teal-500/15 rounded-full blur-[100px]"></div>
            </div>

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex flex-1 relative z-10 flex-col justify-between p-12">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                        <Zap size={26} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">
                        Emote<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Technology</span>
                    </span>
                </motion.div>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-lg"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Sparkles size={16} className="text-teal-400" />
                        <span className="text-sm text-gray-300">Welcome back!</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                        Unlock Your
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">
                            Full Potential
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Access world-class courses, expert mentorship, and a thriving community of learners. Your journey to mastery starts here.
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-8"
                >
                    {[
                        { value: '10K+', label: 'Learners' },
                        { value: '500+', label: 'Courses' },
                        { value: '4.9', label: 'Rating' },
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                                {stat.value}
                            </div>
                            <div className="text-gray-500 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                            <Zap size={22} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            Emote<span className="text-teal-400">Technology</span>
                        </span>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
                            <p className="text-gray-400">Choose your role to continue</p>
                        </div>

                        {/* Role Selector */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                const isSelected = selectedRole === role.id;
                                return (
                                    <motion.button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRole(role.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300
                                            ${isSelected
                                                ? `bg-gradient-to-br ${role.gradient} border-transparent shadow-xl ${role.glow}`
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }
                                        `}
                                    >
                                        <Icon
                                            size={26}
                                            className={isSelected ? 'text-white' : 'text-gray-400'}
                                        />
                                        <span className={`text-sm font-semibold mt-2 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                            {role.label}
                                        </span>
                                        <span className={`text-xs mt-1 ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                                            {role.description}
                                        </span>
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${role.gradient}`}></div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                );
                            })}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full py-4 pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded bg-white/10 border-white/20 text-teal-500 focus:ring-teal-500/50"
                                    />
                                    Remember me
                                </label>
                                <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className={`
                                    w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2
                                    bg-gradient-to-r ${selectedRoleData?.gradient} shadow-xl ${selectedRoleData?.glow}
                                    hover:shadow-2xl transition-all disabled:opacity-70
                                `}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Sign in as {selectedRoleData?.label}
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center my-8">
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className="px-4 text-sm text-gray-500">Or continue with</span>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all">
                                <Github size={20} />
                                GitHub
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-center text-gray-400 mt-8 text-sm">
                            Don't have an account?{' '}
                            <a href="#" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                                Sign up for free
                            </a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
