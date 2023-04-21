import React, { useContext } from "react";

const ThemeContext = React.createContext([]);
ThemeContext.displayName = 'ThemeContext';

export default ThemeContext;

export function useThemes() {
    return useContext(ThemeContext);
}

export const ThemeProvider = ThemeContext.Provider;
export const ThemeConsumer = ThemeContext.Consumer;

// Theme constants
export const THEME = 'theme';

export const THEMES = {
    light: {
        name: 'Light',
        css: {
            body: { background: '#fff', color: '#000' },
            'a:link': { color: 'blue' }
        }
    },
    sepia: {
        name: 'Sepia',
        css: {
            body: { background: '#efe7dd', color: '#5b4636' },
            'a:link': { color: 'darkcyan' }
        }
    },
    dark: {
        name: 'Dark',
        css: {
            body: { background: '#292929', color: '#dedede' },
            'a:link': { color: 'cornflowerblue' }
        }
    },
    nord: {
        name: 'Nord',
        css: {
            body: { background: '#2e3440', color: '#d8dee9' },
            'a:link': { color: '#88c0d0' }
        }
    }
}
