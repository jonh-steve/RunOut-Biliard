import React from 'react';
import PropTypes from 'prop-types';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';

/**
 * Provider tổng hợp các context trong ứng dụng
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children components
 */
const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;