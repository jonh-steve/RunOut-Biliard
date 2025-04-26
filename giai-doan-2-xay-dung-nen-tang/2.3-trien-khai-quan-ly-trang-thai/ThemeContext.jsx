import React, { createContext, useState, useEffect, useCallback } from 'react';

// Tạo context
export const ThemeContext = createContext(null);

// Các theme có sẵn
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Key để lưu theme trong localStorage
const THEME_STORAGE_KEY = 'app_theme';

/**
 * ThemeProvider component
 * 
 * Cung cấp context cho việc quản lý theme trong toàn bộ ứng dụng.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} ThemeProvider component
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(THEMES.LIGHT);
  const [systemTheme, setSystemTheme] = useState(null);
  
  // Lấy theme từ localStorage khi component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    if (storedTheme) {
      setTheme(storedTheme);
    }
    
    // Kiểm tra theme của hệ thống
    if (window.matchMedia) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSystemTheme(isDarkMode ? THEMES.DARK : THEMES.LIGHT);
      
      // Lắng nghe sự thay đổi theme của hệ thống
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);
  
  // Cập nhật theme trong DOM
  useEffect(() => {
    const currentTheme = theme === THEMES.SYSTEM ? systemTheme : theme;
    
    if (currentTheme === THEMES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, systemTheme]);
  
  /**
   * Thay đổi theme
   * @param {string} newTheme - Theme mới (light, dark, system)
   */
  const changeTheme = useCallback((newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  }, []);
  
  /**
   * Chuyển đổi giữa light và dark theme
   */
  const toggleTheme = useCallback(() => {
    const newTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    changeTheme(newTheme);
  }, [theme, changeTheme]);
  
  // Tính toán theme hiện tại (n���u là system thì sử dụng systemTheme)
  const currentTheme = theme === THEMES.SYSTEM ? systemTheme : theme;
  
  // Kiểm tra xem có đang sử dụng dark mode hay không
  const isDarkMode = currentTheme === THEMES.DARK;
  
  // Giá trị context
  const value = {
    theme,
    currentTheme,
    isDarkMode,
    changeTheme,
    toggleTheme,
    THEMES,
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};