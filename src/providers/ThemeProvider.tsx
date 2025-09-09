'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { type Theme, ThemeContext } from './ThemeContext';
import useLocalStorage from '../hooks/useLocalStorage';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [localTheme, setLocalTheme] = useLocalStorage('theme');
  const [theme, setTheme] = useState<Theme>(
    localTheme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }
    setLocalTheme(theme);
  }, [setLocalTheme, theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export { ThemeContext };
