import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react';

import SocialLogin from '../login/SocialLogin';

const SignupForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert(`Account created for ${name}\nEmail: ${email}\nPhone: ${phone}`);
        }, 1500);
    };

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
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">Join as a Student</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full py-4 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all"
                                placeholder="+1 (555) 000-0000"
                                required
                            />
                        </div>
                    </div>

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

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className={`
                            w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2
                            bg-gradient-to-r from-teal-500 to-cyan-500 shadow-xl shadow-teal-500/30
                            hover:shadow-2xl transition-all disabled:opacity-70
                        `}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={20} />
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-8">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="px-4 text-sm text-gray-500">Or sign up with</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                {/* Social Login */}
                <SocialLogin />

                {/* Login Link */}
                <p className="text-center text-gray-400 mt-8 text-sm">
                    Already have an account?{' '}
                    <a href="/login" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                        Sign in
                    </a>
                </p>
            </div>
        </motion.div>
    );
};

export default SignupForm;
