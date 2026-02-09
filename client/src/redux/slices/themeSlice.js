import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    }
    return 'dark';
};

const initialState = {
    theme: getInitialTheme(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', state.theme);

            // Directly manipulating DOM here for immediate effect, 
            // though ideally this should be a side effect subscriber
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

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
