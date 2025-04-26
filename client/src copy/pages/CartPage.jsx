import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { CartContext } from '../context/CartContext';
import { formatCurrency } from '../utils/formatUtils';
import './CartPage.css';

const CartPage = () => {
  const { cart, updateCartItemQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  
  // Calculate subtotal
  const subtotal = cart?.items?.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0) || 0;
  
  // Shipping fee (free if subtotal > 500,000 VND)
  const shippingFee = subtotal > 500000 ? 0 : 30000;
  
  // Total
  const total = subtotal + shippingFee - couponDiscount;
  
  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      updateCartItemQuantity(itemId, newQuantity);
    }
  };
  
  // Handle remove item
  const handleRemoveItem = (itemId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      removeFromCart(itemId);
    }
  };
  
  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      clearCart();
    }
  };
  
  // Handle apply coupon
  const handleApplyCoupon = () => {
    // Reset previous state
    setCouponError('');
    setCouponApplied(false);
    setCouponDiscount(0);
    
    // Simple validation
    if (!couponCode.trim()) {
      setCouponError('Vui lòng nhập mã giảm giá');
      return;
    }
    
    // TODO: Call API to validate coupon
    // This is a mock implementation
    if (couponCode.toUpperCase() === 'DISCOUNT10') {
      const discount = subtotal * 0.1; // 10% discount
      setCouponDiscount(discount);
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      if (shippingFee > 0) {
        setCouponDiscount(shippingFee);
        setCouponApplied(true);
      } else {
        setCouponError('Đơn hàng của bạn đã được miễn phí vận chuyển');
      }
    } else {
      setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }
  };
  
  // Handle proceed to checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  // If cart is empty
  if (!cart?.items?.length) {
    return (
      <Layout>
        <div className="cart-page">
          <h1>Giỏ hàng</h1>
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link to="/products" className="btn btn-primary">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="cart-page">
        <h1>Giỏ hàng</h1>
        
        <div className="cart-container">
          <div className="cart-items">
            <div className="cart-header">
              <div className="cart-header-product">Sản phẩm</div>
              <div className="cart-header-price">Đơn giá</div>
              <div className="cart-header-quantity">Số lượng</div>
              <div className="cart-header-total">Thành tiền</div>
              <div className="cart-header-action"></div>
            </div>
            
            {cart.items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-product">
                  <div className="cart-item-image">
                    <img src={item.image || '/assets/placeholder.png'} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    {item.options && Object.entries(item.options).length > 0 && (
                      <div className="cart-item-options">
                        {Object.entries(item.options).map(([key, value]) => (
                          <span key={key}>
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="cart-item-price">
                  {formatCurrency(item.price)}
                </div>
                
                <div className="cart-item-quantity">
                  <div className="quantity-control">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                    />
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={item.quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="cart-item-total">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                
                <div className="cart-item-action">
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-item-btn"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
            
            <div className="cart-actions">
              <Link to="/products" className="continue-shopping">
                <i className="fas fa-arrow-left"></i>
                Tiếp tục mua sắm
              </Link>
              <button onClick={handleClearCart} className="clear-cart-btn">
                <i className="fas fa-trash"></i>
                Xóa giỏ hàng
              </button>
            </div>
          </div>
          
          <div className="cart-summary">
            <h2>Tổng giỏ hàng</h2>
            
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee > 0 ? formatCurrency(shippingFee) : 'Miễn phí'}</span>
            </div>
            
            {couponApplied && (
              <div className="summary-row discount">
                <span>Giảm giá:</span>
                <span>-{formatCurrency(couponDiscount)}</span>
              </div>
            )}
            
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            
            <div className="coupon-section">
              <h3>Mã giảm giá</h3>
              <div className="coupon-form">
                <input 
                  type="text" 
                  placeholder="Nhập mã giảm giá" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={handleApplyCoupon}>Áp dụng</button>
              </div>
              {couponError && <div className="coupon-error">{couponError}</div>}
              {couponApplied && <div className="coupon-success">Đã áp dụng mã giảm giá!</div>}
            </div>
            
            <button onClick={handleCheckout} className="checkout-btn">
              Tiến hành thanh toán
            </button>
            
            <div className="payment-methods">
              <p>Chúng tôi chấp nhận:</p>
              <div className="payment-icons">
                <img src="/assets/payment-visa.png" alt="Visa" />
                <img src="/assets/payment-mastercard.png" alt="Mastercard" />
                <img src="/assets/payment-paypal.png" alt="PayPal" />
                <img src="/assets/payment-momo.png" alt="MoMo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;