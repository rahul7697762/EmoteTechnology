import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, Save, Eye, EyeOff, Check, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { changePassword } from '../../redux/slices/authSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

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
        if (strength === 0) return 'bg-[#1A1D2E]/10 dark:bg-[#F7F8FF]/10';
        if (strength <= 2) return 'bg-[#E25C5C]';
        if (strength === 3) return 'bg-[#F5A623]';
        return 'bg-[#2DC653]';
    };

    const getStrengthText = () => {
        if (strength === 0) return 'Very Weak';
        if (strength <= 2) return 'Weak';
        if (strength === 3) return 'Good';
        return 'Strong';
    };

    const inputClasses = "w-full pl-4 pr-12 py-3 bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-[#1A1D2E] dark:text-[#E8EAF2] focus:border-[#3B4FD8] dark:focus:border-[#6C7EF5] outline-none transition-colors text-sm font-mono";

    return (
        <div className="bg-white dark:bg-[#252A41] border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-8 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5">
                <div className="flex items-center gap-4 mb-2">
                    <Shield className="w-6 h-6 text-[#3B4FD8] dark:text-[#6C7EF5]" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold" style={{ fontFamily: SERIF }}>Security & Password</h2>
                </div>
                <p className="text-[#6B7194] dark:text-[#8B90B8] text-[10px] uppercase tracking-widest mt-3 font-semibold" style={{ fontFamily: MONO }}>Manage your password and security preferences.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-8 space-y-8">
                <div className="space-y-6 max-w-lg">
                    {/* Current Password */}
                    <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className={inputClasses}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50 hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                            >
                                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>New Password</label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className={inputClasses}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50 hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                            >
                                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Password Strength Meter */}
                        {passwordData.newPassword && (
                            <div className="space-y-3 pt-4 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 mt-6">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>
                                    <span className="text-[#6B7194] dark:text-[#8B90B8]">Password Strength</span>
                                    <span className={
                                        strength <= 2 ? 'text-[#E25C5C]' :
                                            strength === 3 ? 'text-[#F5A623]' : 'text-[#2DC653]'
                                    }>{getStrengthText()}</span>
                                </div>
                                <div className="h-1 w-full bg-[#1A1D2E]/10 dark:bg-[#F7F8FF]/10 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                        style={{ width: `${(strength / 4) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Requirements List */}
                                <div className="grid grid-cols-2 gap-3 pt-3" style={{ fontFamily: MONO }}>
                                    <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold ${requirements.length ? 'text-[#2DC653]' : 'text-[#6B7194] dark:text-[#8B90B8]'}`}>
                                        {requirements.length ? <Check size={14} strokeWidth={3} /> : <div className="w-3.5 h-3.5 border border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 bg-[#F7F8FF] dark:bg-[#1A1D2E]" />}
                                        8+ characters
                                    </div>
                                    <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold ${requirements.number ? 'text-[#2DC653]' : 'text-[#6B7194] dark:text-[#8B90B8]'}`}>
                                        {requirements.number ? <Check size={14} strokeWidth={3} /> : <div className="w-3.5 h-3.5 border border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 bg-[#F7F8FF] dark:bg-[#1A1D2E]" />}
                                        One number
                                    </div>
                                    <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold ${requirements.uppercase ? 'text-[#2DC653]' : 'text-[#6B7194] dark:text-[#8B90B8]'}`}>
                                        {requirements.uppercase ? <Check size={14} strokeWidth={3} /> : <div className="w-3.5 h-3.5 border border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 bg-[#F7F8FF] dark:bg-[#1A1D2E]" />}
                                        One uppercase
                                    </div>
                                    <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold ${requirements.special ? 'text-[#2DC653]' : 'text-[#6B7194] dark:text-[#8B90B8]'}`}>
                                        {requirements.special ? <Check size={14} strokeWidth={3} /> : <div className="w-3.5 h-3.5 border border-[#3B4FD8]/30 dark:border-[#6C7EF5]/30 bg-[#F7F8FF] dark:bg-[#1A1D2E]" />}
                                        Special char
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-3">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className={inputClasses}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B4FD8]/50 dark:text-[#6C7EF5]/50 hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-start pt-8 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10">
                    <button
                        type="submit"
                        disabled={isChangingPassword || strength < 4}
                        className="flex items-center space-x-3 px-8 py-3.5 bg-[#F5A623] hover:bg-[#d9911a] text-[#1A1D2E] font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-70 disabled:pointer-events-none"
                        style={{ fontFamily: MONO }}
                    >
                        {isChangingPassword ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>{isChangingPassword ? 'Updating Password...' : 'Update Password'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SecurityTab;
