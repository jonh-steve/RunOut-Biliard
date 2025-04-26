import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../services/api/authService';
import { adaptUserData } from '../services/adapters/apiAdapter';

// Tạo context
const AuthContext = createContext();

/**
 * Provider cho AuthContext
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Khởi tạo auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(adaptUserData(userData));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        // Xóa token nếu không hợp lệ
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Đăng nhập người dùng
   * @param {string} email - Email người dùng
   * @param {string} password - Mật khẩu người dùng
   * @returns {Promise<boolean>} - Kết quả đăng nhập
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: userData } = await apiLogin(email, password);
      setUser(adaptUserData(userData));
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Đăng xuất người dùng
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await apiLogout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cập nhật thông tin người dùng
   * @param {Object} userData - Thông tin người dùng mới
   */
  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  }, []);

  /**
   * Xóa lỗi
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Giá trị context
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook để sử dụng AuthContext
 * @returns {Object} - Giá trị của AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;