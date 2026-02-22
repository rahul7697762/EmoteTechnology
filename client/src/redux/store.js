import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
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
import companyReducer from './slices/companySlice';
import applicationReducer from './slices/applicationSlice';
import resumeReducer from './slices/resumeSlice';

const appReducer = combineReducers({
    auth: authReducer,
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
    company: companyReducer,
    application: applicationReducer,
    resume: resumeReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'auth/logout/fulfilled') {
        state = undefined;
    }
    return appReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer,
});

export default store;
