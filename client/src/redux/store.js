import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import moduleReducer from './slices/moduleSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        module: moduleReducer,
        ui: uiReducer,
    },
});

export default store;
