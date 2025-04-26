import axios from 'axios';
import { getToken } from '../../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Service xử lý các API liên quan đến người dùng
 */
class UserService {
  /**
   * Lấy thông tin người dùng
   * @param {string} id - ID người dùng
   * @returns {Promise} - Promise chứa thông tin người dùng
   */
  async getUser(id) {
    try {
      const token = getToken();
      
      const response = await axios.get(`${API_URL}/users/${id}`, {
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
   * Cập nhật thông tin người dùng
   * @param {string} id - ID người dùng
   * @param {Object} userData - Thông tin người dùng cần cập nhật
   * @returns {Promise} - Promise chứa thông tin người dùng đã cập nhật
   */
  async updateUser(id, userData) {
    try {
      const token = getToken();
      
      const response = await axios.put(`${API_URL}/users/${id}`, userData, {
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
   * Thay đổi mật khẩu
   * @param {string} id - ID người dùng
   * @param {string} currentPassword - Mật khẩu hiện tại
   * @param {string} newPassword - Mật khẩu mới
   * @param {string} confirmPassword - Xác nhận mật khẩu mới
   * @returns {Promise} - Promise chứa thông báo
   */
  async changePassword(id, currentPassword, newPassword, confirmPassword) {
    try {
      const token = getToken();
      
      const response = await axios.put(
        `${API_URL}/users/${id}/password`,
        {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Lấy danh sách địa chỉ của người dùng
   * @param {string} userId - ID người dùng
   * @returns {Promise} - Promise chứa danh sách địa chỉ
   */
  async getUserAddresses(userId) {
    try {
      const token = getToken();
      
      const response = await axios.get(`${API_URL}/users/${userId}/addresses`, {
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
   * Thêm địa chỉ mới cho người dùng
   * @param {string} userId - ID người dùng
   * @param {Object} addressData - Thông tin địa chỉ
   * @returns {Promise} - Promise chứa thông tin địa chỉ đã thêm
   */
  async addUserAddress(userId, addressData) {
    try {
      const token = getToken();
      
      const response = await axios.post(
        `${API_URL}/users/${userId}/addresses`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Cập nhật địa chỉ của người dùng
   * @param {string} userId - ID người dùng
   * @param {string} addressId - ID địa chỉ
   * @param {Object} addressData - Thông tin địa chỉ cần cập nhật
   * @returns {Promise} - Promise chứa thông tin địa chỉ đã cập nhật
   */
  async updateUserAddress(userId, addressId, addressData) {
    try {
      const token = getToken();
      
      const response = await axios.put(
        `${API_URL}/users/${userId}/addresses/${addressId}`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Xóa địa chỉ của người dùng
   * @param {string} userId - ID người dùng
   * @param {string} addressId - ID địa chỉ
   * @returns {Promise} - Promise chứa thông báo
   */
  async deleteUserAddress(userId, addressId) {
    try {
      const token = getToken();
      
      const response = await axios.delete(
        `${API_URL}/users/${userId}/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  /**
   * Lấy danh sách đơn hàng của người dùng
   * @param {string} userId - ID người dùng
   * @param {Object} params - Các tham số query (page, limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách đơn hàng
   */
  async getUserOrders(userId, params = {}) {
    try {
      const token = getToken();
      
      const response = await axios.get(`${API_URL}/users/${userId}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
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

export default new UserService();