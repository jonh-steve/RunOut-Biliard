import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemsCount = cart?.items?.length || 0;

  return (
    <header className="header">
      <div className="container">
        <div className="header-wrapper">
          <div className="logo">
            <Link to="/">
              <h1>Shop App</h1>
            </Link>
          </div>

          <nav className="main-nav">
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/products">Sản phẩm</Link></li>
              <li><Link to="/categories">Danh mục</Link></li>
              <li><Link to="/about">Gi���i thiệu</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
            </ul>
          </nav>

          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="Tìm kiếm..." />
              <button type="button">
                <i className="fa fa-search"></i>
              </button>
            </div>

            <div className="cart-icon">
              <Link to="/cart">
                <i className="fa fa-shopping-cart"></i>
                {cartItemsCount > 0 && (
                  <span className="cart-count">{cartItemsCount}</span>
                )}
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-menu-trigger">
                  <img 
                    src={user.avatar || '/assets/default-avatar.png'} 
                    alt={user.name} 
                    className="user-avatar" 
                  />
                  <span>{user.name}</span>
                </div>
                <div className="user-dropdown">
                  <ul>
                    <li><Link to="/profile">Tài khoản</Link></li>
                    <li><Link to="/orders">Đơn hàng</Link></li>
                    <li><Link to="/wishlist">Yêu thích</Link></li>
                    <li><button onClick={handleLogout}>Đăng xuất</button></li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-login">Đăng nhập</Link>
                <Link to="/register" className="btn btn-register">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;