import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription for:', email);
    setEmail('');
    // Show success message
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-column">
            <h3>Shop App</h3>
            <p>Cung cấp các sản phẩm chất lượng cao với giá cả hợp lý. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3>Liên kết nhanh</h3>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/products">Sản phẩm</Link></li>
              <li><Link to="/about">Giới thiệu</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Hỗ trợ khách hàng</h3>
            <ul>
              <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
              <li><Link to="/shipping-policy">Chính sách vận chuyển</Link></li>
              <li><Link to="/return-policy">Chính sách đổi trả</Link></li>
              <li><Link to="/privacy-policy">Chính sách bảo mật</Link></li>
              <li><Link to="/terms">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Liên hệ</h3>
            <address>
              <p><i className="fas fa-map-marker-alt"></i> 123 Đường ABC, Quận XYZ, TP. HCM</p>
              <p><i className="fas fa-phone"></i> (84) 123 456 789</p>
              <p><i className="fas fa-envelope"></i> info@shopapp.com</p>
            </address>
            
            <h3>Đăng ký nhận tin</h3>
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Đăng ký</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Shop App. Tất cả các quyền được bảo lưu.</p>
          <div className="payment-methods">
            <img src="/assets/payment-visa.png" alt="Visa" />
            <img src="/assets/payment-mastercard.png" alt="Mastercard" />
            <img src="/assets/payment-paypal.png" alt="PayPal" />
            <img src="/assets/payment-momo.png" alt="MoMo" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;