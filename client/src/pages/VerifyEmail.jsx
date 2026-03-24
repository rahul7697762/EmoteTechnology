import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../redux/slices/authSlice';
import Navbar from '../components/landing/Navbar';
import LoginBranding from '../components/login/LoginBranding';
import LoginBackground from '../components/login/LoginBackground';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

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
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] flex overflow-hidden pt-20 transition-colors duration-300">
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
                    <div className="bg-white dark:bg-[#252A41] p-10 shadow-sm border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-center">

                        <div className="mb-6 flex justify-center">
                            {status === 'loading' && (
                                <div className="w-16 h-16 bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5 flex items-center justify-center border border-[#3B4FD8]/15 dark:border-[#6C7EF5]/15">
                                    <Loader className="text-[#3B4FD8] dark:text-[#6C7EF5] animate-spin" size={32} strokeWidth={1.5} />
                                </div>
                            )}
                            {status === 'success' && (
                                <div className="w-16 h-16 bg-[#2DC653]/10 flex items-center justify-center border border-[#2DC653]/30">
                                    <CheckCircle className="text-[#2DC653]" size={32} strokeWidth={1.5} />
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="w-16 h-16 bg-[#E25C5C]/10 flex items-center justify-center border border-[#E25C5C]/30">
                                    <XCircle className="text-[#E25C5C]" size={32} strokeWidth={1.5} />
                                </div>
                            )}
                        </div>

                        <h2 className="text-3xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-4" style={{ fontFamily: SERIF }}>
                            {status === 'loading' ? 'Verifying Email' : status === 'success' ? 'Verified!' : 'Verification Failed'}
                        </h2>

                        <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm mb-10 tracking-widest uppercase font-semibold" style={{ fontFamily: MONO }}>
                            {message}
                        </p>

                        {status !== 'loading' && (
                            <Link
                                to={user ? (user.role === 'STUDENT' ? '/student-dashboard' : '/dashboard') : '/login'}
                                className="w-full py-4 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-3 border border-[#1A1D2E]/10"
                                style={{ fontFamily: MONO }}
                            >
                                {user ? 'Continue to Dashboard' : 'Continue to Login'} <ArrowRight size={16} strokeWidth={2.5} />
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyEmail;
