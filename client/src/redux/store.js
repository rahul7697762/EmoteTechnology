import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import themeReducer from './slices/themeSlice';
import moduleReducer from './slices/moduleSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        theme: themeReducer,
        module: moduleReducer,
    },
});

export default store;
