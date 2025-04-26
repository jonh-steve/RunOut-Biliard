import apiClient from '../api-client';
import { setToken, removeToken } from '../../auth/authUtils';

/**
 * Service xử lý các API liên quan đến xác thực
 */
class AuthService {
  /**
   * Đăng nhập
   * @param {string} email - Email người dùng
   * @param {string} password - Mật khẩu
   * @returns {Promise} - Promise chứa thông tin người dùng và token
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      
      if (response.token) {
        setToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Đăng ký
   * @param {Object} userData - Thông tin đăng ký
   * @returns {Promise} - Promise chứa thông tin người dùng và token
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      if (response.token) {
        setToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Đăng xuất
   * @returns {Promise} - Promise chứa kết quả đăng xuất
   */
  async logout() {
    try {
      // Gọi API đăng xuất nếu cần
      await apiClient.post('/auth/logout');
      
      // Xóa token khỏi local storage
      removeToken();
      
      return { success: true };
    } catch (error) {
      // Vẫn xóa token ngay cả khi API thất bại
      removeToken();
      throw error;
    }
  }
  
  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Promise} - Promise chứa thông tin người dùng
   */
  async getCurrentUser() {
    try {
      return await apiClient.get('/auth/me');
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Quên mật khẩu
   * @param {string} email - Email người dùng
   * @returns {Promise} - Promise chứa thông báo
   */
  async forgotPassword(email) {
    try {
      return await apiClient.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Đặt lại mật khẩu
   * @param {string} token - Token đặt lại mật khẩu
   * @param {string} password - Mật khẩu mới
   * @param {string} passwordConfirmation - Xác nhận mật khẩu mới
   * @returns {Promise} - Promise chứa thông báo
   */
  async resetPassword(token, password, passwordConfirmation) {
    try {
      return await apiClient.post('/auth/reset-password', {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Cập nhật thông tin người dùng
   * @param {Object} userData - Thông tin người dùng cần cập nhật
   * @returns {Promise} - Promise chứa thông tin người dùng đã cập nhật
   */
  async updateProfile(userData) {
    try {
      return await apiClient.put('/auth/profile', userData);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Thay đổi mật khẩu
   * @param {string} currentPassword - Mật khẩu hiện tại
   * @param {string} newPassword - Mật khẩu mới
   * @param {string} newPasswordConfirmation - Xác nhận mật khẩu mới
   * @returns {Promise} - Promise chứa thông báo
   */
  async changePassword(currentPassword, newPassword, newPasswordConfirmation) {
    try {
      return await apiClient.put('/auth/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();