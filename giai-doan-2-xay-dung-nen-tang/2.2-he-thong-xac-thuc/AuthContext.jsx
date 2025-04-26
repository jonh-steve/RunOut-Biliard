import React, { createContext, useState, useEffect, useCallback } from 'react';
import AuthService from '../services/auth-service/AuthService.client';
import { getToken, hasToken, isTokenExpired, removeToken } from './authUtils';

// Tạo context
export const AuthContext = createContext(null);

/**
 * AuthProvider component
 * 
 * Cung cấp context cho việc quản lý trạng thái xác thực trong toàn bộ ứng dụng.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Lấy thông tin người dùng hiện tại
   */
  const fetchCurrentUser = useCallback(async () => {
    if (!hasToken()) {
      setIsLoading(false);
      return;
    }

    try {
      const token = getToken();
      
      // Kiểm tra token có hết hạn không
      if (isTokenExpired(token)) {
        removeToken();
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      const userData = await AuthService.getCurrentUser();
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setError(error.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lấy thông tin người dùng khi component mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  /**
   * Đăng nhập
   * @param {string} email - Email người dùng
   * @param {string} password - Mật khẩu
   * @returns {Promise} - Promise chứa kết quả đăng nhập
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(email, password);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Đăng ký
   * @param {Object} userData - Thông tin đăng ký
   * @returns {Promise} - Promise chứa kết quả đăng ký
   */
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.register(userData);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      setError(error.message || 'Đăng ký thất bại');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Đăng xuất
   */
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await AuthService.logout();
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      // Vẫn đăng xu���t ngay cả khi API thất bại
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cập nhật thông tin người dùng
   * @param {Object} userData - Thông tin người dùng cần cập nhật
   * @returns {Promise} - Promise chứa thông tin người dùng đã cập nhật
   */
  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await AuthService.updateProfile(userData);
      
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      setError(error.message || 'Cập nhật thông tin thất bại');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Giá trị context
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};