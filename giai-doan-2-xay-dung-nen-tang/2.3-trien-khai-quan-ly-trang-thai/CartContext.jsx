import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

// Tạo context
export const CartContext = createContext(null);

/**
 * CartProvider component
 * 
 * Cung cấp context cho việc quản lý trạng thái giỏ hàng trong toàn bộ ứng dụng.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} CartProvider component
 */
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, user } = useAuth();
  
  // Key để lưu giỏ hàng trong localStorage
  const CART_STORAGE_KEY = 'shopping_cart';
  
  /**
   * Tính toán tổng số lượng và tổng giá trị
   */
  const calculateTotals = useCallback(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const price = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(price);
  }, [items]);
  
  /**
   * Lưu giỏ hàng vào localStorage
   */
  const saveCartToStorage = useCallback(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);
  
  /**
   * Lấy giỏ hàng từ localStorage
   */
  const loadCartFromStorage = useCallback(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      setError('Không thể tải giỏ hàng từ bộ nhớ cục bộ');
    }
  }, []);
  
  /**
   * Đồng bộ giỏ hàng với server (nếu đã đăng nhập)
   */
  const syncCartWithServer = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    // Đây là nơi bạn sẽ gọi API để đồng bộ giỏ hàng với server
    // Ví dụ: await CartService.syncCart(items);
    
    // Đoạn code này sẽ được triển khai khi có CartService
  }, [isAuthenticated, user, items]);
  
  // Tải giỏ hàng từ localStorage khi component mount
  useEffect(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);
  
  // Tính toán tổng số lượng và tổng giá trị khi items thay đổi
  useEffect(() => {
    calculateTotals();
    saveCartToStorage();
  }, [items, calculateTotals, saveCartToStorage]);
  
  // Đồng bộ giỏ hàng với server khi đăng nhập/đăng xuất
  useEffect(() => {
    syncCartWithServer();
  }, [isAuthenticated, syncCartWithServer]);
  
  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {Object} product - Thông tin sản phẩm
   * @param {number} quantity - Số lượng
   */
  const addItem = (product, quantity = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      setItems((prevItems) => {
        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = prevItems.findIndex(
          (item) => item.id === product.id
        );
        
        if (existingItemIndex !== -1) {
          // Nếu sản phẩm đã có, tăng số lượng
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += quantity;
          return updatedItems;
        } else {
          // Nếu sản phẩm chưa có, thêm mới
          return [
            ...prevItems,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity,
            },
          ];
        }
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError('Không thể thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   * @param {string} productId - ID sản phẩm
   * @param {number} quantity - Số lượng mới
   */
  const updateItemQuantity = (productId, quantity) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (quantity <= 0) {
        // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
        removeItem(productId);
        return;
      }
      
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating item quantity:', error);
      setError('Không thể cập nhật số lượng sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * @param {string} productId - ID sản phẩm
   */
  const removeItem = (productId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Không thể xóa sản phẩm khỏi giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Xóa tất cả sản phẩm khỏi giỏ hàng
   */
  const clearCart = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Không thể xóa giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Giá trị context
  const value = {
    items,
    totalItems,
    totalPrice,
    isLoading,
    error,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};