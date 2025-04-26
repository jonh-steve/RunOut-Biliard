import React from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { NotificationProvider } from './NotificationContext';
import { ThemeProvider } from './ThemeContext';
import NotificationContainer from './Notification';

/**
 * AppProviders component
 * 
 * Kết hợp tất cả các providers để sử dụng trong ứng dụng.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} AppProviders component
 */
const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            {children}
            <NotificationContainer />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProviders;