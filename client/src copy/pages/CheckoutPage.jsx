import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { formatCurrency } from '../utils/formatUtils';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // Redirect if cart is empty
  useEffect(() => {
    if (!cart?.items?.length) {
      navigate('/cart');
    }
  }, [cart, navigate]);
  
  // Initialize form with user data if authenticated
  const initialValues = isAuthenticated ? {
    fullName: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    district: user.district || '',
    ward: user.ward || '',
    notes: ''
  } : {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: ''
  };
  
  // Form validation and submission
  const { values, handleChange, handleSubmit, errors } = useForm({
    initialValues,
    validate: (values) => {
      const errors = {};
      if (!values.fullName) errors.fullName = 'Họ tên là bắt buộc';
      if (!values.email) errors.email = 'Email là bắt buộc';
      else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email không hợp lệ';
      if (!values.phone) errors.phone = 'Số điện thoại là bắt buộc';
      else if (!/^[0-9]{10}$/.test(values.phone)) errors.phone = 'Số điện thoại không hợp lệ';
      if (!values.address) errors.address = 'Địa chỉ là bắt buộc';
      if (!values.city) errors.city = 'Tỉnh/Thành phố là bắt buộc';
      if (!values.district) errors.district = 'Quận/Huyện là bắt buộc';
      if (!values.ward) errors.ward = 'Phường/Xã là bắt buộc';
      return errors;
    },
    onSubmit: async (values) => {
      // Prepare order data
      const orderData = {
        customer: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: `${values.address}, ${values.ward}, ${values.district}, ${values.city}`
        },
        items: cart.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shipping: {
          method: shippingMethod,
          fee: shippingFee
        },
        payment: {
          method: paymentMethod
        },
        subtotal,
        total,
        notes: values.notes
      };
      
      // TODO: Send order to API
      console.log('Order placed:', orderData);
      
      // Simulate API call
      setTimeout(() => {
        // Generate random order number
        const randomOrderNumber = 'ORD' + Math.floor(100000 + Math.random() * 900000);
        setOrderNumber(randomOrderNumber);
        setOrderPlaced(true);
        clearCart();
      }, 1500);
    }
  });
  
  // Calculate order summary
  const subtotal = cart?.items?.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0) || 0;
  
  // Shipping fee based on method
  const shippingFee = shippingMethod === 'express' ? 50000 : 
                      shippingMethod === 'standard' ? 30000 : 0;
  
  // Free shipping for orders over 500,000 VND
  const finalShippingFee = subtotal > 500000 ? 0 : shippingFee;
  
  // Total
  const total = subtotal + finalShippingFee;
  
  // If order is placed successfully
  if (orderPlaced) {
    return (
      <Layout>
        <div className="checkout-page">
          <div className="order-success">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Đặt hàng thành công!</h1>
            <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.</p>
            <div className="order-details">
              <p>Mã đơn hàng: <strong>{orderNumber}</strong></p>
              <p>Một email xác nhận đã được gửi đến <strong>{values.email}</strong></p>
            </div>
            <div className="order-actions">
              <button 
                onClick={() => navigate('/orders')} 
                className="view-order-btn"
              >
                Xem đơn hàng
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="continue-shopping-btn"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="checkout-page">
        <h1>Thanh toán</h1>
        
        <div className="checkout-container">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h2>Thông tin giao hàng</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Họ tên <span className="required">*</span></label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                    />
                    {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                  </div>
                </div>
                
                <div className="form-row two-columns">
                  <div className="form-group">
                    <label htmlFor="email">Email <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address">Địa chỉ <span className="required">*</span></label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      placeholder="Số nhà, tên đường"
                    />
                    {errors.address && <div className="form-error">{errors.address}</div>}
                  </div>
                </div>
                
                <div className="form-row three-columns">
                  <div className="form-group">
                    <label htmlFor="city">Tỉnh/Thành phố <span className="required">*</span></label>
                    <select
                      id="city"
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      {/* Add more cities */}
                    </select>
                    {errors.city && <div className="form-error">{errors.city}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="district">Quận/Huyện <span className="required">*</span></label>
                    <select
                      id="district"
                      name="district"
                      value={values.district}
                      onChange={handleChange}
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {values.city === 'Hồ Chí Minh' && (
                        <>
                          <option value="Quận 1">Quận 1</option>
                          <option value="Quận 2">Quận 2</option>
                          <option value="Quận 3">Quận 3</option>
                          {/* Add more districts */}
                        </>
                      )}
                    </select>
                    {errors.district && <div className="form-error">{errors.district}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="ward">Phường/Xã <span className="required">*</span></label>
                    <select
                      id="ward"
                      name="ward"
                      value={values.ward}
                      onChange={handleChange}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {values.district === 'Quận 1' && (
                        <>
                          <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                          <option value="Phường Bến Thành">Phường Bến Thành</option>
                          <option value="Phường Cầu Kho">Phường Cầu Kho</option>
                          {/* Add more wards */}
                        </>
                      )}
                    </select>
                    {errors.ward && <div className="form-error">{errors.ward}</div>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="notes">Ghi chú đơn hàng</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h2>Phương thức vận chuyển</h2>
                
                <div className="shipping-methods">
                  <label className="shipping-method">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                    />
                    <div className="shipping-method-info">
                      <div className="shipping-method-name">Giao hàng tiêu chuẩn</div>
                      <div className="shipping-method-description">Nhận hàng trong 3-5 ngày</div>
                      <div className="shipping-method-price">
                        {subtotal > 500000 ? 'Miễn phí' : formatCurrency(30000)}
                      </div>
                    </div>
                  </label>
                  
                  <label className="shipping-method">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    <div className="shipping-method-info">
                      <div className="shipping-method-name">Giao hàng nhanh</div>
                      <div className="shipping-method-description">Nhận hàng trong 1-2 ngày</div>
                      <div className="shipping-method-price">
                        {subtotal > 500000 ? 'Miễn phí' : formatCurrency(50000)}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="form-section">
                <h2>Phương thức thanh toán</h2>
                
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div className="payment-method-info">
                      <div className="payment-method-name">Thanh toán khi nhận hàng (COD)</div>
                      <div className="payment-method-description">Thanh toán bằng tiền mặt khi nhận hàng</div>
                    </div>
                  </label>
                  
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="payment"
                      value="bank-transfer"
                      checked={paymentMethod === 'bank-transfer'}
                      onChange={() => setPaymentMethod('bank-transfer')}
                    />
                    <div className="payment-method-info">
                      <div className="payment-method-name">Chuyển khoản ngân hàng</div>
                      <div className="payment-method-description">Thông tin tài khoản sẽ được gửi qua email</div>
                    </div>
                  </label>
                  
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="payment"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={() => setPaymentMethod('credit-card')}
                    />
                    <div className="payment-method-info">
                      <div className="payment-method-name">Thẻ tín dụng/Ghi nợ</div>
                      <div className="payment-method-description">Thanh toán an toàn với Visa, Mastercard, JCB</div>
                    </div>
                  </label>
                  
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                    />
                    <div className="payment-method-info">
                      <div className="payment-method-name">Ví MoMo</div>
                      <div className="payment-method-description">Thanh toán qua ví điện tử MoMo</div>
                    </div>
                  </label>
                </div>
                
                {paymentMethod === 'credit-card' && (
                  <div className="credit-card-form">
                    <div className="form-row two-columns">
                      <div className="form-group">
                        <label htmlFor="card-number">Số thẻ</label>
                        <input
                          type="text"
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="card-name">Tên chủ thẻ</label>
                        <input
                          type="text"
                          id="card-name"
                          placeholder="NGUYEN VAN A"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row three-columns">
                      <div className="form-group">
                        <label htmlFor="expiry-month">Tháng hết hạn</label>
                        <select id="expiry-month">
                          <option value="">MM</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="expiry-year">Năm hết hạn</label>
                        <select id="expiry-year">
                          <option value="">YY</option>
                          {[...Array(10)].map((_, i) => {
                            const year = new Date().getFullYear() + i;
                            return <option key={i} value={year}>{year}</option>;
                          })}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="checkout-actions">
                <button type="submit" className="place-order-btn">
                  Đặt hàng
                </button>
              </div>
            </form>
          </div>
          
          <div className="order-summary">
            <h2>Tổng đơn hàng</h2>
            
            <div className="order-items">
              {cart?.items?.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image || '/assets/placeholder.png'} alt={item.name} />
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    {item.options && Object.entries(item.options).length > 0 && (
                      <div className="item-options">
                        {Object.entries(item.options).map(([key, value]) => (
                          <span key={key}>
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="item-price">{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="total-row">
                <span>Phí vận chuyển:</span>
                <span>{finalShippingFee > 0 ? formatCurrency(finalShippingFee) : 'Miễn phí'}</span>
              </div>
              
              <div className="total-row grand-total">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;