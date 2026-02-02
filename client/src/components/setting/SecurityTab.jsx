import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { changePassword } from '../../redux/slices/authSlice';

const SecurityTab = () => {
    const dispatch = useDispatch();
    const { isChangingPassword } = useSelector((state) => state.auth);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            await dispatch(changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })).unwrap();

            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to change password');
        }
    };

    return (
        <div className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security & Password</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your password and security preferences.</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-8 space-y-8">
                <div className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                        />
                        <p className="text-xs text-gray-400 pl-1">Must be at least 6 characters long.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="flex justify-start pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="flex items-center space-x-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all font-bold shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                    >
                        {isChangingPassword ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        <span>{isChangingPassword ? 'Updating Password...' : 'Update Password'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SecurityTab;
