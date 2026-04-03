import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const { isForgotPasswordLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        try {
            await dispatch(forgotPassword(email)).unwrap();
            // Navigate to OTP verification page with email
            navigate('/verify-otp', { state: { email } });
        } catch (error) {
            toast.error(error?.message || (typeof error === 'string' ? error : 'Failed to send OTP'));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            <div className="bg-white dark:bg-[#1A1D2E] rounded-none p-8 md:p-10 border-2 border-[#1A1D2E] dark:border-[#6C7EF5]/20 shadow-[8px_8px_0_#1A1D2E] dark:shadow-[8px_8px_0_#3B4FD8] transition-all duration-300 relative overflow-hidden group">
                {/* Accent Lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#3B4FD8] dark:bg-[#6C7EF5]"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#F5A623] translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:-translate-y-0 transition-transform duration-500 opacity-20"></div>

                <div className="text-left mb-10">
                    <h2 className="text-4xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-3 uppercase tracking-tight" style={{ fontFamily: SERIF }}>
                        Forgot Password?
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#1A1D2E] dark:text-[#E8EAF2] uppercase tracking-widest mb-2 block" style={{ fontFamily: MONO }}>
                            Email Address <span className="text-[#E25C5C]">*</span>
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7194] dark:text-[#8B90B8] group-focus-within:text-[#3B4FD8] dark:group-focus-within:text-[#6C7EF5] transition-colors" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#F7F8FF] dark:bg-[#0A0B10] border-2 border-[#1A1D2E]/10 dark:border-[#6C7EF5]/20 focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] focus:outline-none transition-colors dark:text-white rounded-none font-mono text-sm"
                                placeholder="your@gmail.com"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isForgotPasswordLoading}
                        className="w-full py-4 bg-[#3B4FD8] dark:bg-[#6C7EF5] text-white rounded-none font-bold text-sm uppercase tracking-widest hover:bg-[#1A1D2E] dark:hover:bg-white dark:hover:text-[#1A1D2E] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#3B4FD8] dark:border-[#6C7EF5] hover:border-[#1A1D2E] dark:hover:border-white"
                        style={{ fontFamily: MONO }}
                    >
                        {isForgotPasswordLoading ? (
                            <Loader className="animate-spin" size={20} />
                        ) : (
                            <>
                                GET CODE <ArrowRight size={18} strokeWidth={2.5} />
                            </>
                        )}
                    </button>

                    <div className="text-center mt-8 border-t border-[#1A1D2E]/10 dark:border-[#6C7EF5]/10 pt-6">
                        <Link to="/login" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors" style={{ fontFamily: MONO }}>
                            <ArrowLeft size={16} className="mr-2" strokeWidth={2.5} />
                            Return to Login
                        </Link>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ForgotPasswordForm;
