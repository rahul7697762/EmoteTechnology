import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../redux/slices/authSlice';
import Navbar from '../components/landing/Navbar';
import LoginBranding from '../components/login/LoginBranding';
import LoginBackground from '../components/login/LoginBackground';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const dispatch = useDispatch();
    const { user, isVerifyEmailLoading } = useSelector((state) => state.auth);

    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Verifying your email...');

    const verificationAttempted = React.useRef(false);

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. Token is missing.');
                return;
            }

            if (verificationAttempted.current) return;
            verificationAttempted.current = true;

            try {
                const message = await dispatch(verifyEmail(token)).unwrap();
                setStatus('success');
                setMessage(message || 'Email verified successfully!');
            } catch (error) {
                setStatus('error');
                const errorMessage = error?.message || (typeof error === 'string' ? error : 'Verification failed. The link might be expired or invalid.');
                setMessage(errorMessage);
            }
        };

        verify();
    }, [token, dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex overflow-hidden pt-20">
            <Navbar />
            <div className="dark:block hidden">
                <LoginBackground />
            </div>

            <LoginBranding />

            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white dark:bg-[#1a1c23] rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90 text-center">

                        <div className="mb-6 flex justify-center">
                            {status === 'loading' && (
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                    <Loader className="text-blue-500 animate-spin" size={32} />
                                </div>
                            )}
                            {status === 'success' && (
                                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="text-green-500" size={32} />
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                    <XCircle className="text-red-500" size={32} />
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold bg-linear-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-4">
                            {status === 'loading' ? 'Verifying Email' : status === 'success' ? 'Verified!' : 'Verification Failed'}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            {message}
                        </p>

                        {status !== 'loading' && (
                            <Link
                                to={user ? (user.role === 'STUDENT' ? '/student-dashboard' : '/dashboard') : '/login'}
                                className="w-full py-3 bg-linear-to-r from-teal-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {user ? 'Continue to Dashboard' : 'Continue to Login'} <ArrowRight size={20} />
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyEmail;
