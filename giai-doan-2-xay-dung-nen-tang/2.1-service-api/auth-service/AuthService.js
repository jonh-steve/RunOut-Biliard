import axios from 'axios';
import { getToken, setToken, removeToken } from '../../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      if (response.data.token) {
        setToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Đăng ký
   * @param {Object} userData - Thông tin đăng ký
   * @returns {Promise} - Promise chứa thông tin người dùng và token
   */
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.token) {
        setToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Đăng xuất
   */
  logout() {
    removeToken();
  }
  
  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Promise} - Promise chứa thông tin người dùng
   */
  async getCurrentUser() {
    try {
      const token = getToken();
      
      if (!token) {
        return null;
      }
      
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Quên mật khẩu
   * @param {string} email - Email người dùng
   * @returns {Promise} - Promise chứa thông báo
   */
  async forgotPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
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
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Xử lý lỗi
   * @param {Error} error - Lỗi từ API
   * @returns {Object} - Object chứa thông tin lỗi
   */
  handleError(error) {
    if (error.response) {
      // Lỗi từ server với status code
      return {
        message: error.response.data.message || 'Đã xảy ra lỗi',
        errors: error.response.data.errors || {},
        status: error.response.status,
      };
    } else if (error.request) {
      // Lỗi không nhận được response
      return {
        message: 'Không thể kết nối đến server',
        status: 0,
      };
    } else {
      // Lỗi khác
      return {
        message: error.message,
        status: 0,
      };
    }
  }
}

export default new AuthService();