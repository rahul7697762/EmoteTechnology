import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import moduleReducer from './slices/moduleSlice';
import uiReducer from './slices/uiSlice';
import paymentReducer from './slices/paymentSlice';
import progressReducer from './slices/progressSlice';
import certificateReducer from './slices/certificateSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        module: moduleReducer,
        ui: uiReducer,
        payment: paymentReducer,
        progress: progressReducer,
        certificate: certificateReducer
    },
});

export default store;
