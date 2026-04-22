import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMe } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const OAuthCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Check if there's an error in URL params
                const params = new URLSearchParams(location.search);
                const error = params.get('error');
                
                if (error) {
                    toast.error('Google login failed. Please try again.');
                    navigate('/login');
                    return;
                }

                // Fetch user data using the cookie set by the backend
                const result = await dispatch(getMe()).unwrap();
                
                if (result) {
                    toast.success('Successfully logged in via Google!');
                    
                    const role = (result.role || '').toUpperCase();
                    
                    if (role === 'COMPANY' || role === 'EMPLOYER') {
                        navigate('/company/dashboard');
                    } else if (role === 'FACULTY' || role === 'ADMIN') {
                        navigate('/dashboard');
                    } else if (role === 'STUDENT') {
                        navigate('/student-dashboard');
                    } else {
                        navigate('/');
                    }
                }
            } catch (err) {
                console.error('OAuth sync error:', err);
                toast.error('Failed to sync account info.');
                navigate('/login');
            }
        };

        handleCallback();
    }, [dispatch, navigate, location]);

    return (
        <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#3B4FD8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-[#1A1D2E] dark:text-[#E8EAF2]">Authenticating with Google...</h2>
                <p className="text-[#6B7194] dark:text-[#8B90B8] mt-2">Please wait a moment while we set up your session.</p>
            </div>
        </div>
    );
};

export default OAuthCallback;
