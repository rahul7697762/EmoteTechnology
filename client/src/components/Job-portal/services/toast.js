// job-portal/services/toast.js
import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#0d9488',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
  }),
  
  error: (message) => toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#dc2626',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
  }),
  
  loading: (message) => toast.loading(message, {
    position: 'top-right',
  }),
  
  dismiss: (toastId) => toast.dismiss(toastId),
};

// job-portal/components/Toast.jsx
import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return React.createElement(Toaster, {
    position: 'top-right',
    toastOptions: {
      duration: 3000,
      style: {
        background: '#363636',
        color: '#fff',
      },
      success: {
        duration: 3000,
        theme: {
          primary: 'green',
          secondary: 'black',
        },
      },
      error: {
        duration: 4000,
      },
    },
  });
};

export default ToastProvider;