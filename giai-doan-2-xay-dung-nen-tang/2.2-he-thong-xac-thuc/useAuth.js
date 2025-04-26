import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Custom hook để sử dụng AuthContext
 * 
 * @returns {Object} Auth context value
 * @property {Object} user - Thông tin người dùng hiện tại
 * @property {boolean} isAuthenticated - Trạng thái xác thực
 * @property {boolean} isLoading - Trạng thái loading
 * @property {string} error - Thông báo lỗi
 * @property {Function} login - Hàm đăng nhập
 * @property {Function} register - Hàm đăng ký
 * @property {Function} logout - Hàm đăng xuất
 * @property {Function} updateProfile - Hàm cập nhật thông tin người dùng
 * @property {Function} fetchCurrentUser - Hàm lấy thông tin người dùng hiện tại
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};