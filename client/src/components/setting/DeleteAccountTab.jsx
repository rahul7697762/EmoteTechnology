import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteAccount } from '../../redux/slices/authSlice';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const DeleteAccountTab = () => {
    const dispatch = useDispatch();
    const { isDeletingAccount } = useSelector((state) => state.auth);

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        const password = prompt("Please enter your password to confirm deletion:");
        if (!password) return;

        try {
            await dispatch(deleteAccount(password)).unwrap();
            toast.success('Account deleted successfully');
            window.location.href = '/login';
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to delete account');
        }
    };

    return (
        <div className="bg-white dark:bg-[#252A41] border border-[#E25C5C]/20 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-8 border-b border-[#E25C5C]/20 bg-[#E25C5C]/5 flex items-center gap-4">
                <AlertTriangle size={24} className="text-[#E25C5C]" strokeWidth={1.5} />
                <div>
                    <h2 className="text-2xl font-bold text-[#E25C5C]" style={{ fontFamily: SERIF }}>Delete Account</h2>
                    <p className="text-[#E25C5C]/70 text-[10px] uppercase tracking-widest mt-1 font-semibold" style={{ fontFamily: MONO }}>Irreversible actions for your account.</p>
                </div>
            </div>
            <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 border border-[#E25C5C]/20 bg-[#F7F8FF] dark:bg-[#1A1D2E]">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3" style={{ fontFamily: SERIF }}>Delete Account Data</h3>
                        <p className="text-[#6B7194] dark:text-[#8B90B8] text-sm leading-relaxed" style={{ fontFamily: MONO }}>
                            Permanently remove your account and all of its content from the platform.
                            <span className="font-bold text-[#E25C5C] block mt-4 uppercase tracking-widest text-[10px]">Warning: This action cannot be undone.</span>
                        </p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        className="shrink-0 flex items-center gap-3 px-8 py-3.5 bg-transparent border-2 border-[#E25C5C] text-[#E25C5C] hover:bg-[#E25C5C] hover:text-white transition-colors disabled:opacity-70 disabled:pointer-events-none font-bold text-xs uppercase tracking-widest"
                        style={{ fontFamily: MONO }}
                    >
                        {isDeletingAccount && <Loader2 size={16} className="animate-spin" />}
                        {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountTab;
