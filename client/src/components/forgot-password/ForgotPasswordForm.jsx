import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
        >
            <div className="bg-white dark:bg-[#1a1c23] rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-2">
                        Forgot Password?
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Enter your email address to receive a verification code.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-800 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all dark:text-white"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isForgotPasswordLoading}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isForgotPasswordLoading ? (
                            <Loader className="animate-spin" size={24} />
                        ) : (
                            <>
                                Send Verification Code <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="text-center mt-6">
                        <Link to="/login" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ForgotPasswordForm;
