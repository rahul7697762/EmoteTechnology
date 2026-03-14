import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companyReducer from './slices/companySlice';
import courseReducer from './slices/courseSlice';
import moduleReducer from './slices/moduleSlice';
import uiReducer from './slices/uiSlice';
import paymentReducer from './slices/paymentSlice';
import progressReducer from './slices/progressSlice';
import certificateReducer from './slices/certificateSlice';
import assessmentReducer from './slices/assessmentSlice';
import submissionReducer from './slices/submissionSlice';
import discussionReducer from './slices/discussionSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';
import resumeReducer from './slices/resumeSlice';
import themeReducer from './slices/themeSlice';

const appReducer = combineReducers({
    auth: authReducer,
    company: companyReducer,
    course: courseReducer,
    module: moduleReducer,
    ui: uiReducer,
    payment: paymentReducer,
    progress: progressReducer,
    certificate: certificateReducer,
    assessment: assessmentReducer,
    submission: submissionReducer,
    discussion: discussionReducer,
    job: jobReducer,
    application: applicationReducer,
    resume: resumeReducer,
    theme: themeReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'auth/logout/fulfilled' || action.type === 'auth/logout') {
        state = undefined;
    }
    return appReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
