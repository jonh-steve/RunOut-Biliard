import axiosInstance from './axiosConfig';

/**
 * Lấy thông tin giỏ hàng của người dùng
 * @returns {Promise<Object>} - Thông tin giỏ hàng
 */
export const getCart = async () => {
  try {
    const response = await axiosInstance.get('/cart');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin giỏ hàng');
  }
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {string} productId - ID của sản phẩm
 * @param {number} quantity - Số lượng sản phẩm
 * @returns {Promise<Object>} - Thông tin giỏ hàng đã cập nhật
 */
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axiosInstance.post('/cart/items', {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng');
  }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {string} itemId - ID của item trong giỏ hàng
 * @param {number} quantity - Số lượng mới
 * @returns {Promise<Object>} - Thông tin giỏ hàng đã cập nhật
 */
export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await axiosInstance.put(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể cập nhật giỏ hàng');
  }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {string} itemId - ID của item trong giỏ hàng
 * @returns {Promise<Object>} - Thông tin giỏ hàng đã cập nhật
 */
export const removeFromCart = async (itemId) => {
  try {
    const response = await axiosInstance.delete(`/cart/items/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
  }
};

/**
 * Xóa toàn bộ giỏ hàng
 * @returns {Promise<Object>} - Thông báo kết quả
 */
export const clearCart = async () => {
  try {
    const response = await axiosInstance.delete('/cart');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa giỏ hàng');
  }
};

/**
 * Áp dụng mã giảm giá cho giỏ hàng
 * @param {string} couponCode - Mã giảm giá
 * @returns {Promise<Object>} - Thông tin giỏ hàng đã cập nhật với giảm giá
 */
export const applyCoupon = async (couponCode) => {
  try {
    const response = await axiosInstance.post('/cart/coupon', {
      code: couponCode,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Mã giảm giá không hợp lệ');
  }
};

/**
 * Xóa mã giảm giá khỏi giỏ hàng
 * @returns {Promise<Object>} - Thông tin giỏ hàng đã cập nhật
 */
export const removeCoupon = async () => {
  try {
    const response = await axiosInstance.delete('/cart/coupon');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể xóa mã giảm giá');
  }
};