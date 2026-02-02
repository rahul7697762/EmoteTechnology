import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { deleteAccount } from '../../redux/slices/authSlice';

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
        <div className="bg-white dark:bg-[#1a1c23] rounded-3xl border border-red-200 dark:border-red-900/30 shadow-xl shadow-red-100/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="p-8 border-b border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/5">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Delete Account</h2>
                <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">Irreversible actions for your account.</p>
            </div>
            <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-red-100 dark:border-red-900/20 bg-red-50/30 dark:bg-red-900/10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Account</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-1 leading-relaxed">
                            Permanently remove your account and all of its content from the EmoteTechnology platform.
                            <span className="font-bold text-red-500 block mt-1">This action cannot be undone.</span>
                        </p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white dark:bg-transparent border-2 border-red-500 text-red-600 dark:text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-sm disabled:opacity-70 disabled:transform-none"
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
