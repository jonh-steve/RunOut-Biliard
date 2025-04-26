import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  getCart, 
  addToCart as apiAddToCart, 
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  applyCoupon as apiApplyCoupon,
  removeCoupon as apiRemoveCoupon
} from '../services/api/cartService';
import { adaptCartData } from '../services/adapters/apiAdapter';
import { useAuth } from './AuthContext';

// Tạo context
const CartContext = createContext();

/**
 * Provider cho CartContext
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children components
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Lấy giỏ hàng khi người dùng đã xác thực
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Nếu không xác thực, lấy giỏ hàng từ localStorage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (err) {
          console.error('Error parsing local cart:', err);
          localStorage.removeItem('cart');
        }
      }
    }
  }, [isAuthenticated]);

  // Lưu giỏ hàng vào localStorage khi thay đổi (chỉ khi chưa xác thực)
  useEffect(() => {
    if (!isAuthenticated && cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  /**
   * Lấy thông tin giỏ hàng
   */
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cartData = await getCart();
      setCart(adaptCartData(cartData));
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {string} productId - ID của sản phẩm
   * @param {number} quantity - Số lượng sản phẩm
   */
  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Gọi API nếu đã xác thực
        const cartData = await apiAddToCart(productId, quantity);
        setCart(adaptCartData(cartData));
      } else {
        // Xử lý local nếu chưa xác thực
        setCart(prevCart => {
          const existingItem = prevCart.items.find(item => item.productId === productId);
          
          if (existingItem) {
            // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
            const updatedItems = prevCart.items.map(item => 
              item.productId === productId 
                ? { ...item, quantity: item.quantity + quantity, total: item.price * (item.quantity + quantity) }
                : item
            );
            
            const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
            
            return {
              ...prevCart,
              items: updatedItems,
              totalItems: updatedItems.length,
              subtotal,
              total: subtotal - (prevCart.discount || 0)
            };
          } else {
            // Thêm sản phẩm mới vào giỏ hàng
            // Lưu ý: Trong trường hợp thực tế, bạn cần lấy thông tin sản phẩm từ API hoặc store
            const newItem = {
              id: `local-${Date.now()}`,
              productId,
              quantity,
              price: 0, // Giá sẽ được cập nhật sau khi lấy thông tin sản phẩm
              total: 0
            };
            
            const updatedItems = [...prevCart.items, newItem];
            const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
            
            return {
              ...prevCart,
              items: updatedItems,
              totalItems: updatedItems.length,
              subtotal,
              total: subtotal - (prevCart.discount || 0)
            };
          }
        });
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   * @param {string} itemId - ID của item trong giỏ hàng
   * @param {number} quantity - Số lượng mới
   */
  const updateCartItem = useCallback(async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Gọi API nếu đã xác thực
        const cartData = await apiUpdateCartItem(itemId, quantity);
        setCart(adaptCartData(cartData));
      } else {
        // Xử lý local nếu chưa xác thực
        setCart(prevCart => {
          const updatedItems = prevCart.items.map(item => 
            item.id === itemId 
              ? { ...item, quantity, total: item.price * quantity }
              : item
          );
          
          const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
          
          return {
            ...prevCart,
            items: updatedItems,
            subtotal,
            total: subtotal - (prevCart.discount || 0)
          };
        });
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * @param {string} itemId - ID của item trong giỏ hàng
   */
  const removeFromCart = useCallback(async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Gọi API nếu đã xác thực
        const cartData = await apiRemoveFromCart(itemId);
        setCart(adaptCartData(cartData));
      } else {
        // Xử lý local nếu chưa xác thực
        setCart(prevCart => {
          const updatedItems = prevCart.items.filter(item => item.id !== itemId);
          const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
          
          return {
            ...prevCart,
            items: updatedItems,
            totalItems: updatedItems.length,
            subtotal,
            total: subtotal - (prevCart.discount || 0)
          };
        });
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Xóa toàn bộ giỏ hàng
   */
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Gọi API nếu đã xác thực
        await apiClearCart();
      }
      
      // Luôn xóa giỏ hàng local
      setCart({ items: [], totalItems: 0, subtotal: 0, total: 0 });
      
      if (!isAuthenticated) {
        localStorage.removeItem('cart');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Áp dụng mã giảm giá
   * @param {string} couponCode - Mã giảm giá
   */
  const applyCoupon = useCallback(async (couponCode) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Gọi API nếu đã xác thực
        const cartData = await apiApplyCoupon(couponCode);
        setCart(adaptCartData(cartData));
      } else {
        // Trong trường hợp thực tế, bạn cần kiểm tra mã giảm giá từ API
        setError('Vui lòng đăng nhập để sử dụng mã giảm giá');
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Xóa mã giảm giá
   */
  const removeCoupon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isAuthenticated) {
        // Gọi API nếu đã xác thực
        const cartData = await apiRemoveCoupon();
        setCart(adaptCartData(cartData));
      } else {
        // Xử lý local nếu chưa xác thực
        setCart(prevCart => ({
          ...prevCart,
          coupon: null,
          discount: 0,
          total: prevCart.subtotal
        }));
      }
    } catch (err) {
      console.error('Error removing coupon:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Xóa lỗi
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Giá trị context
  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook để sử dụng CartContext
 * @returns {Object} - Giá trị của CartContext
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;