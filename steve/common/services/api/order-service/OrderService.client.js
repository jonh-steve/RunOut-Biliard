import apiClient from '../api-client';

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
      return await apiClient.post('/orders', orderData);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy danh sách đơn hàng của người dùng
   * @param {Object} params - Các tham số query (page, limit, v.v.)
   * @returns {Promise} - Promise chứa danh sách đơn hàng
   */
  async getOrders(params = {}) {
    try {
      return await apiClient.get('/orders', { params });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy chi tiết đơn hàng
   * @param {string} id - ID đơn hàng
   * @returns {Promise} - Promise chứa chi tiết đơn hàng
   */
  async getOrder(id) {
    try {
      return await apiClient.get(`/orders/${id}`);
    } catch (error) {
      throw error;
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
      return await apiClient.post(`/orders/${id}/cancel`, { reason });
    } catch (error) {
      throw error;
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
      return await apiClient.post(`/orders/${id}/pay`, paymentData);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy lịch sử đơn hàng
   * @param {string} id - ID đơn hàng
   * @returns {Promise} - Promise chứa lịch sử đơn hàng
   */
  async getOrderHistory(id) {
    try {
      return await apiClient.get(`/orders/${id}/history`);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy các phương thức thanh toán có sẵn
   * @returns {Promise} - Promise chứa danh sách phương thức thanh toán
   */
  async getPaymentMethods() {
    try {
      return await apiClient.get('/payment-methods');
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Lấy các phương thức vận chuyển có sẵn
   * @param {Object} addressData - Thông tin địa chỉ giao hàng
   * @returns {Promise} - Promise chứa danh sách phương thức vận chuyển
   */
  async getShippingMethods(addressData) {
    try {
      return await apiClient.post('/shipping-methods', addressData);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Tính toán chi phí vận chuyển
   * @param {Object} data - Dữ liệu để tính toán (địa chỉ, sản phẩm, v.v.)
   * @returns {Promise} - Promise chứa thông tin chi phí vận chuyển
   */
  async calculateShipping(data) {
    try {
      return await apiClient.post('/shipping/calculate', data);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Tính toán thuế
   * @param {Object} data - Dữ liệu để tính toán (địa chỉ, sản phẩm, v.v.)
   * @returns {Promise} - Promise chứa thông tin thuế
   */
  async calculateTax(data) {
    try {
      return await apiClient.post('/tax/calculate', data);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Áp dụng mã giảm giá
   * @param {string} code - Mã giảm giá
   * @param {Object} cartData - Dữ liệu giỏ hàng
   * @returns {Promise} - Promise chứa thông tin giảm giá
   */
  async applyCoupon(code, cartData) {
    try {
      return await apiClient.post('/coupons/apply', { code, cart: cartData });
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Kiểm tra trạng thái thanh toán
   * @param {string} orderId - ID đơn hàng
   * @param {string} paymentId - ID thanh toán
   * @returns {Promise} - Promise chứa trạng thái thanh toán
   */
  async checkPaymentStatus(orderId, paymentId) {
    try {
      return await apiClient.get(`/orders/${orderId}/payments/${paymentId}/status`);
    } catch (error) {
      throw error;
    }
  }
}

export default new OrderService();