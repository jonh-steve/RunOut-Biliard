import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

/**
 * Custom hook để sử dụng ThemeContext
 * 
 * @returns {Object} Theme context value
 * @property {string} theme - Theme hiện tại (light, dark, system)
 * @property {string} currentTheme - Theme thực tế đang được áp dụng (light, dark)
 * @property {boolean} isDarkMode - Có đang sử dụng dark mode hay không
 * @property {Function} changeTheme - Hàm thay đổi theme
 * @property {Function} toggleTheme - Hàm chuyển đổi giữa light và dark theme
 * @property {Object} THEMES - Các theme có sẵn
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};