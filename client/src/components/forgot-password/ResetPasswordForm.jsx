import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, ArrowLeft, Loader, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isResetPasswordLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Get token from previous step
    const token = location.state?.token;

    useEffect(() => {
        if (!token) {
            toast.error('Invalid session. Please try again.');
            navigate('/forgot-password');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            await dispatch(resetPassword({ password, token })).unwrap();
            navigate('/login');
        } catch (error) {
            toast.error(error?.message || (typeof error === 'string' ? error : 'Failed to reset password'));
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
                        Reset Password
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Create a strong and secure new password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                            New Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-800 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-teal-500 transition-colors" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-800 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isResetPasswordLoading}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isResetPasswordLoading ? (
                            <Loader className="animate-spin" size={24} />
                        ) : (
                            <>
                                Reset Password <CheckCircle size={20} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ResetPasswordForm;
