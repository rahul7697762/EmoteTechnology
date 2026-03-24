import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Phone, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../redux/slices/authSlice';
import SocialLogin from '../login/SocialLogin';
import toast from 'react-hot-toast';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const SignupForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const role = 'STUDENT';
    const [showPassword, setShowPassword] = useState(false);
    const { isSigningUp } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = await dispatch(signup({ name, email, password, phone, role })).unwrap();

            if (user) {
                toast.success('Account created successfully!');
                const searchParams = new URLSearchParams(window.location.search);
                const redirectPath = searchParams.get('redirect');

                if (redirectPath) {
                    navigate(redirectPath);
                } else if (user.role === 'FACULTY' || user.role === 'ADMIN') {
                    navigate('/dashboard');
                } else if (user.role === 'STUDENT') {
                    navigate('/student-dashboard');
                } else if (user.role === 'EMPLOYER') {
                    navigate('/job-portal');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            console.error('Signup failed:', err);
            toast.error(err?.message || err || 'Signup failed. Please try again.');
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
                    <h2 className="text-3xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-1" style={{ fontFamily: SERIF }}>Create Account</h2>
                    <p className="text-[#6B7194] dark:text-[#8B90B8] text-xs uppercase tracking-widest font-semibold" style={{ fontFamily: MONO }}>Join as a Student</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClasses}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] mb-2" style={{ fontFamily: MONO }}>Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50" size={18} />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={inputClasses}
                                placeholder="+1 (555) 000-0000"
                                required
                            />
                        </div>
                    </div>

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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSigningUp}
                        className={`
                            w-full py-4 text-xs font-semibold uppercase tracking-widest text-[#1A1D2E] flex items-center justify-center gap-2
                            bg-[#F5A623] hover:bg-[#d9911a] transition-colors disabled:opacity-70 mt-4
                        `}
                        style={{ fontFamily: MONO }}
                    >
                        {isSigningUp ? (
                            <div className="w-5 h-5 border-2 border-[#1A1D2E]/30 border-t-[#1A1D2E] rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-8">
                    <div className="flex-1 h-px bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10"></div>
                    <span className="px-4 text-xs tracking-wider uppercase text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Or sign up with</span>
                    <div className="flex-1 h-px bg-[#3B4FD8]/10 dark:bg-[#6C7EF5]/10"></div>
                </div>

                {/* Social Login */}
                <SocialLogin />

                {/* Login Link */}
                <p className="text-center text-[#6B7194] dark:text-[#8B90B8] mt-8 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#3B4FD8] dark:text-[#6C7EF5] font-semibold hover:underline transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default SignupForm;
