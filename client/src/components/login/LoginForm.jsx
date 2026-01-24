import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleSelector from './RoleSelector';
import SocialLogin from './SocialLogin';
import { roles } from './data';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('student');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const roleMap = {
                'student': 'STUDENT',
                'faculty': 'FACULTY',
                'admin': 'ADMIN'
            };

            const result = await login(email, password);

            if (result.success) {
                // Redirect based on role
                if (result.user.role === 'FACULTY' || result.user.role === 'ADMIN') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const selectedRoleData = roles.find(r => r.id === selectedRole);

    return (
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
            <div className="bg-white dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h2>
                    <p className="text-gray-500 dark:text-gray-400">Choose your role to continue</p>
                </div>

                {/* Role Selector */}
                <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full py-4 pl-12 pr-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-white/10 transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full py-4 pl-12 pr-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-white/10 transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded bg-gray-50 dark:bg-white/10 border-gray-300 dark:border-white/20 text-teal-500 focus:ring-teal-500"
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

                {/* Divider - Only for Student */}
                {selectedRole === 'student' && (
                    <>
                        <div className="flex items-center my-8">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
                            <span className="px-4 text-sm text-gray-500">Or continue with</span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
                        </div>

                        {/* Social Login */}
                        <SocialLogin />

                        {/* Sign Up Link */}
                        <p className="text-center text-gray-600 dark:text-gray-400 mt-8 text-sm">
                            Don't have an account?{' '}
                            <a href="/signup" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                                Sign up for free
                            </a>
                        </p>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default LoginForm;
