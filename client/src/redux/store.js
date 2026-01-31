import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import themeReducer from './slices/themeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        theme: themeReducer,
    },
});

export default store;
