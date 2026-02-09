import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    }
    return 'dark';
};

const initialState = {
    isSidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
    theme: getInitialTheme()
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
            localStorage.setItem('sidebarCollapsed', state.isSidebarCollapsed);
        },
        setSidebarCollapsed: (state, action) => {
            state.isSidebarCollapsed = action.payload;
            localStorage.setItem('sidebarCollapsed', action.payload);
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', state.theme);
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(state.theme);
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', state.theme);
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(state.theme);
        }
    }
});

export const { toggleSidebar, setSidebarCollapsed, toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
