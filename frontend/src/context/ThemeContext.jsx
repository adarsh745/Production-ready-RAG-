import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const ACCENT_COLORS = {
  purple: { primary: '#7C3AED', glow: 'rgba(124,58,237,0.4)', name: 'Purple' },
  blue: { primary: '#3B82F6', glow: 'rgba(59,130,246,0.4)', name: 'Blue' },
  pink: { primary: '#EC4899', glow: 'rgba(236,72,153,0.4)', name: 'Pink' },
  cyan: { primary: '#06B6D4', glow: 'rgba(6,182,212,0.4)', name: 'Cyan' },
  emerald: { primary: '#10B981', glow: 'rgba(16,185,129,0.4)', name: 'Emerald' },
  orange: { primary: '#F97316', glow: 'rgba(249,115,22,0.4)', name: 'Orange' },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  const [accentColor, setAccentColorState] = useState(() => {
    return localStorage.getItem('accentColor') || 'purple';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply CSS custom properties when accent color changes
  useEffect(() => {
    const root = window.document.documentElement;
    const colorObj = ACCENT_COLORS[accentColor] || ACCENT_COLORS.purple;
    root.style.setProperty('--color-primary', colorObj.primary);
    root.style.setProperty('--color-primary-glow', colorObj.glow);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  };

  const setAccentColor = (color) => {
    if (ACCENT_COLORS[color]) {
      setAccentColorState(color);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark,
        accentColor,
        setAccentColor,
        ACCENT_COLORS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
