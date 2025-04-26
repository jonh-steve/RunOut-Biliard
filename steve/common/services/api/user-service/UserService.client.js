import apiClient from '../api-client';

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
      return await apiClient.get(`/users/${id}`);
    } catch (error) {
      throw error;
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
      return await apiClient.put(`/users/${id}`, userData);
    } catch (error) {
      throw error;
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
      return await apiClient.put(`/users/${id}/password`, {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy danh sách địa chỉ của người dùng
   * @param {string} userId - ID người dùng
   * @returns {Promise} - Promise chứa danh sách địa chỉ
   */
  async getUserAddresses(userId) {
    try {
      return await apiClient.get(`/users/${userId}/addresses`);
    } catch (error) {
      throw error;
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
      return await apiClient.post(`/users/${userId}/addresses`, addressData);
    } catch (error) {
      throw error;
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
      return await apiClient.put(`/users/${userId}/addresses/${addressId}`, addressData);
    } catch (error) {
      throw error;
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
      return await apiClient.delete(`/users/${userId}/addresses/${addressId}`);
    } catch (error) {
      throw error;
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
      return await apiClient.get(`/users/${userId}/orders`, { params });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy chi tiết đơn hàng của người dùng
   * @param {string} userId - ID người dùng
   * @param {string} orderId - ID đơn hàng
   * @returns {Promise} - Promise chứa chi tiết đơn hàng
   */
  async getUserOrder(userId, orderId) {
    try {
      return await apiClient.get(`/users/${userId}/orders/${orderId}`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy danh sách sản phẩm yêu thích của người dùng
   * @param {string} userId - ID người dùng
   * @param {Object} params - Các tham số query (page, limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách sản phẩm yêu thích
   */
  async getUserWishlist(userId, params = {}) {
    try {
      return await apiClient.get(`/users/${userId}/wishlist`, { params });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Thêm sản phẩm vào danh sách yêu thích
   * @param {string} userId - ID người dùng
   * @param {string} productId - ID sản phẩm
   * @returns {Promise} - Promise chứa thông báo
   */
  async addToWishlist(userId, productId) {
    try {
      return await apiClient.post(`/users/${userId}/wishlist`, { product_id: productId });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Xóa sản phẩm khỏi danh sách yêu thích
   * @param {string} userId - ID người dùng
   * @param {string} productId - ID sản phẩm
   * @returns {Promise} - Promise chứa thông báo
   */
  async removeFromWishlist(userId, productId) {
    try {
      return await apiClient.delete(`/users/${userId}/wishlist/${productId}`);
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();