import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import SocialLogin from './SocialLogin';
import toast from 'react-hot-toast';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isLoggingIn } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect');
    const from = redirectPath || location.state?.from || null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await dispatch(login({ email, password })).unwrap();

            if (response && response.user) {
                const { user } = response
                toast.success('Login successful!');

                if ((user.role || '').toUpperCase() === 'COMPANY' || (user.role || '').toUpperCase() === 'EMPLOYER') {
                    navigate('/company/dashboard');
                    return;
                }

                if ((user.role || '').toUpperCase() === 'FACULTY' || (user.role || '').toUpperCase() === 'ADMIN') {
                    navigate('/dashboard');
                    return;
                }

                if ((user.role || '').toUpperCase() === 'STUDENT') {
                    if (from) {
                        navigate(from);
                        return;
                    }
                    navigate('/student-dashboard');
                    return;
                }

                if (from) {
                    navigate(from);
                    return;
                }
                navigate('/');
            }
        } catch (err) {
            console.error('Login failed:', err);
            toast.error(err?.message || err || 'Login failed. Please try again.');
        }
    };

    const inputClasses = "w-full py-3.5 pl-12 pr-4 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15 text-[#1A1D2E] dark:text-[#E8EAF2] placeholder-[#6B7194] dark:placeholder-[#8B90B8] focus:outline-none focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] transition-colors";

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                <div className="w-10 h-10 bg-[#3B4FD8] dark:bg-[#6C7EF5] flex items-center justify-center">
                    <Sparkles size={18} className="text-white dark:text-[#1A1D2E]" />
                </div>
                <span className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>
                    Emote<span className="italic text-[#3B4FD8] dark:text-[#6C7EF5]">Technology</span>
                </span>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 p-8 shadow-2xl">
                <div className="text-center mb-8 pb-6 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                    <h2 className="text-3xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: SERIF }}>Sign In</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClasses}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`${inputClasses} pr-12`}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7194] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-[#3E435E] dark:text-[#A7ACC8] cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded-none bg-[#F7F8FF] dark:bg-[#1A1D2E] border-[#3B4FD8]/20 text-[#3B4FD8] accent-[#3B4FD8]"
                            />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="text-[#3B4FD8] dark:text-[#6C7EF5] font-semibold hover:underline transition-colors" style={{ fontFamily: MONO }}>
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className={`
                            w-full py-4 text-xs font-semibold uppercase tracking-widest text-[#1A1D2E] dark:text-[#1A1D2E] flex items-center justify-center gap-2
                            bg-[#F5A623] hover:bg-[#d9911a] transition-colors disabled:opacity-70 mt-2
                        `}
                        style={{ fontFamily: MONO }}
                    >
                        {isLoggingIn ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Sign in To Account
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="flex items-center my-8">
                    <div className="flex-1 h-px bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10"></div>
                    <span className="px-4 text-xs tracking-wider uppercase text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Or continue with</span>
                    <div className="flex-1 h-px bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10"></div>
                </div>

                {/* Social Login */}
                <SocialLogin />

                {/* Sign Up Link */}
                <p className="text-center text-[#6B7194] dark:text-[#8B90B8] mt-8 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#3B4FD8] dark:text-[#6C7EF5] font-semibold hover:underline transition-colors">
                        Sign up for free
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default LoginForm;
