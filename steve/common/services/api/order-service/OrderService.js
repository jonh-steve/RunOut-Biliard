import axios from 'axios';
import { getToken } from '../../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Service xử lý các API liên quan đến đơn hàng
 */
class OrderService {
  /**
   * Tạo đơn hàng mới
   * @param {Object} orderData - Thông tin đơn hàng
   * @returns {Promise} - Promise chứa thông tin đơn hàng đã tạo
   */
  async createOrder(orderData) {
    try {
      const token = getToken();
      
      const response = await axios.post(`${API_URL}/orders`, orderData, {
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
   * Lấy danh sách đơn hàng của người dùng
   * @param {Object} params - Các tham số query (page, limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách đơn hàng
   */
  async getOrders(params = {}) {
    try {
      const token = getToken();
      
      const response = await axios.get(`${API_URL}/orders`, {
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
   * Lấy chi tiết đơn hàng
   * @param {string} id - ID đơn hàng
   * @returns {Promise} - Promise chứa chi tiết đơn hàng
   */
  async getOrder(id) {
    try {
      const token = getToken();
      
      const response = await axios.get(`${API_URL}/orders/${id}`, {
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
   * Hủy đơn hàng
   * @param {string} id - ID đơn hàng
   * @param {string} reason - Lý do hủy đơn hàng
   * @returns {Promise} - Promise chứa thông báo
   */
  async cancelOrder(id, reason) {
    try {
      const token = getToken();
      
      const response = await axios.post(
        `${API_URL}/orders/${id}/cancel`,
        { reason },
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
   * Thanh toán đơn hàng
   * @param {string} id - ID đơn hàng
   * @param {Object} paymentData - Thông tin thanh toán
   * @returns {Promise} - Promise chứa thông tin thanh toán
   */
  async payOrder(id, paymentData) {
    try {
      const token = getToken();
      
      const response = await axios.post(
        `${API_URL}/orders/${id}/pay`,
        paymentData,
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
   * Lấy lịch sử đơn hàng
   * @param {string} id - ID đơn hàng
   * @returns {Promise} - Promise chứa lịch sử đơn hàng
   */
  async getOrderHistory(id) {
    try {
      const token = getToken();
      
      const response = await axios.get(`${API_URL}/orders/${id}/history`, {
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
   * Lấy các phương thức thanh toán có sẵn
   * @returns {Promise} - Promise chứa danh sách phương thức thanh toán
   */
  async getPaymentMethods() {
    try {
      const token = getToken();
      
      const response = await axios.get(`${API_URL}/payment-methods`, {
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
   * Lấy các phương thức vận chuyển có sẵn
   * @param {Object} addressData - Thông tin địa chỉ giao hàng
   * @returns {Promise} - Promise chứa danh sách phương thức vận chuyển
   */
  async getShippingMethods(addressData) {
    try {
      const token = getToken();
      
      const response = await axios.post(
        `${API_URL}/shipping-methods`,
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

export default new OrderService();