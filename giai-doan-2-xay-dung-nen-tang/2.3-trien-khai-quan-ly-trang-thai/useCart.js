import { useContext } from 'react';
import { CartContext } from './CartContext';

/**
 * Custom hook để sử dụng CartContext
 * 
 * @returns {Object} Cart context value
 * @property {Array} items - Các sản phẩm trong giỏ hàng
 * @property {number} totalItems - Tổng số lượng sản phẩm
 * @property {number} totalPrice - Tổng giá trị giỏ hàng
 * @property {boolean} isLoading - Trạng thái loading
 * @property {string} error - Thông báo lỗi
 * @property {Function} addItem - Hàm thêm sản phẩm vào giỏ hàng
 * @property {Function} updateItemQuantity - Hàm cập nhật số lượng sản phẩm
 * @property {Function} removeItem - Hàm xóa sản phẩm khỏi giỏ hàng
 * @property {Function} clearCart - Hàm xóa tất cả sản phẩm khỏi giỏ hàng
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};