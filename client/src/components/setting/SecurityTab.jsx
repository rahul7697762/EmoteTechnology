import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Save, Eye, EyeOff, Check, X, Shield, Lock } from 'lucide-react';
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

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [strength, setStrength] = useState(0);
    const [requirements, setRequirements] = useState({
        length: false,
        number: false,
        uppercase: false,
        special: false
    });

    useEffect(() => {
        validatePassword(passwordData.newPassword);
    }, [passwordData.newPassword]);

    const validatePassword = (pass) => {
        const reqs = {
            length: pass.length >= 8,
            number: /\d/.test(pass),
            uppercase: /[A-Z]/.test(pass),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
        };
        setRequirements(reqs);
        setStrength(Object.values(reqs).filter(Boolean).length);
    };

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
        if (strength < 4) {
            toast.error("Please meet all password requirements");
            return;
        }

        try {
            await dispatch(changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })).unwrap();

            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowCurrent(false);
            setShowNew(false);
            setShowConfirm(false);
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to change password');
        }
    };

    const getStrengthColor = () => {
        if (strength === 0) return 'bg-gray-200 dark:bg-gray-700';
        if (strength <= 2) return 'bg-red-500';
        if (strength === 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        if (strength === 0) return 'Very Weak';
        if (strength <= 2) return 'Weak';
        if (strength === 3) return 'Good';
        return 'Strong';
    };

    return (
        <div className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-teal-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security & Password</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password and security preferences.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-8 space-y-8">
                <div className="space-y-6 max-w-lg">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Password Strength Meter */}
                        {passwordData.newPassword && (
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                    <span>Password Strength</span>
                                    <span className={
                                        strength <= 2 ? 'text-red-500' :
                                            strength === 3 ? 'text-yellow-500' : 'text-green-500'
                                    }>{getStrengthText()}</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                        style={{ width: `${(strength / 4) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Requirements List */}
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    <div className={`flex items-center gap-2 text-xs ${requirements.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {requirements.length ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                                        At least 8 characters
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${requirements.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {requirements.number ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                                        Contains a number
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${requirements.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {requirements.uppercase ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                                        Contains uppercase
                                    </div>
                                    <div className={`flex items-center gap-2 text-xs ${requirements.special ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {requirements.special ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                                        Contains special char
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-start pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        type="submit"
                        disabled={isChangingPassword || strength < 4}
                        className="flex items-center space-x-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all font-bold shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:shadow-none bg-gradient-to-r from-teal-500 to-emerald-500"
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
