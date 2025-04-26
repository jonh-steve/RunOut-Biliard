import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import Layout from '../components/layout/Layout';
import './AuthPage.css';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isLoading, error, resetPassword } = useContext(AuthContext);
  
  // Determine which form to show based on URL
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path === '/register') return 'register';
    if (path === '/forgot-password') return 'forgot-password';
    return 'login';
  });
  
  // Form states
  const { values: loginValues, handleChange: handleLoginChange, handleSubmit: handleLoginSubmit, errors: loginErrors } = 
    useForm({
      initialValues: { email: '', password: '' },
      validate: (values) => {
        const errors = {};
        if (!values.email) errors.email = 'Email là bắt buộc';
        else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email không hợp lệ';
        if (!values.password) errors.password = 'Mật kh��u là bắt buộc';
        return errors;
      },
      onSubmit: async (values) => {
        const success = await login(values.email, values.password);
        if (success) {
          const redirectTo = location.state?.from?.pathname || '/';
          navigate(redirectTo);
        }
      }
    });
  
  const { values: registerValues, handleChange: handleRegisterChange, handleSubmit: handleRegisterSubmit, errors: registerErrors } = 
    useForm({
      initialValues: { name: '', email: '', password: '', confirmPassword: '' },
      validate: (values) => {
        const errors = {};
        if (!values.name) errors.name = 'Họ tên là bắt buộc';
        if (!values.email) errors.email = 'Email là bắt buộc';
        else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email không hợp lệ';
        if (!values.password) errors.password = 'Mật khẩu là bắt buộc';
        else if (values.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        if (!values.confirmPassword) errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Mật khẩu không khớp';
        return errors;
      },
      onSubmit: async (values) => {
        const success = await register(values.name, values.email, values.password);
        if (success) {
          navigate('/');
        }
      }
    });
  
  const { values: forgotValues, handleChange: handleForgotChange, handleSubmit: handleForgotSubmit, errors: forgotErrors } = 
    useForm({
      initialValues: { email: '' },
      validate: (values) => {
        const errors = {};
        if (!values.email) errors.email = 'Email là bắt buộc';
        else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email không hợp lệ';
        return errors;
      },
      onSubmit: async (values) => {
        const success = await resetPassword(values.email);
        if (success) {
          // Show success message
          alert('Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.');
        }
      }
    });
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Update URL without reloading
    const path = tab === 'login' ? '/login' : 
                 tab === 'register' ? '/register' : '/forgot-password';
    navigate(path, { replace: true });
  };
  
  return (
    <Layout>
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabChange('login')}
            >
              Đăng nhập
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => handleTabChange('register')}
            >
              Đăng ký
            </button>
          </div>
          
          <div className="auth-content">
            {activeTab === 'login' && (
              <div className="auth-form">
                <h2>Đăng nhập</h2>
                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label htmlFor="login-email">Email</label>
                    <input
                      type="email"
                      id="login-email"
                      name="email"
                      value={loginValues.email}
                      onChange={handleLoginChange}
                      placeholder="Nhập email của bạn"
                    />
                    {loginErrors.email && <div className="form-error">{loginErrors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="login-password">Mật khẩu</label>
                    <input
                      type="password"
                      id="login-password"
                      name="password"
                      value={loginValues.password}
                      onChange={handleLoginChange}
                      placeholder="Nhập mật khẩu của bạn"
                    />
                    {loginErrors.password && <div className="form-error">{loginErrors.password}</div>}
                  </div>
                  
                  <div className="form-options">
                    <label className="remember-me">
                      <input type="checkbox" name="remember" />
                      <span>Ghi nhớ đăng nhập</span>
                    </label>
                    <button 
                      type="button" 
                      className="forgot-password-link"
                      onClick={() => handleTabChange('forgot-password')}
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="auth-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                  </button>
                </form>
                
                <div className="social-login">
                  <p>Hoặc đăng nhập với</p>
                  <div className="social-buttons">
                    <button className="social-button facebook">
                      <i className="fab fa-facebook-f"></i>
                      Facebook
                    </button>
                    <button className="social-button google">
                      <i className="fab fa-google"></i>
                      Google
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'register' && (
              <div className="auth-form">
                <h2>Đăng ký tài khoản</h2>
                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleRegisterSubmit}>
                  <div className="form-group">
                    <label htmlFor="register-name">Họ tên</label>
                    <input
                      type="text"
                      id="register-name"
                      name="name"
                      value={registerValues.name}
                      onChange={handleRegisterChange}
                      placeholder="Nhập họ tên của bạn"
                    />
                    {registerErrors.name && <div className="form-error">{registerErrors.name}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="register-email">Email</label>
                    <input
                      type="email"
                      id="register-email"
                      name="email"
                      value={registerValues.email}
                      onChange={handleRegisterChange}
                      placeholder="Nhập email của bạn"
                    />
                    {registerErrors.email && <div className="form-error">{registerErrors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="register-password">Mật khẩu</label>
                    <input
                      type="password"
                      id="register-password"
                      name="password"
                      value={registerValues.password}
                      onChange={handleRegisterChange}
                      placeholder="Nhập mật khẩu của bạn"
                    />
                    {registerErrors.password && <div className="form-error">{registerErrors.password}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      id="register-confirm-password"
                      name="confirmPassword"
                      value={registerValues.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Nhập lại mật khẩu của bạn"
                    />
                    {registerErrors.confirmPassword && <div className="form-error">{registerErrors.confirmPassword}</div>}
                  </div>
                  
                  <div className="form-options">
                    <label className="terms-conditions">
                      <input type="checkbox" name="terms" required />
                      <span>Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link> và <Link to="/privacy">Chính sách bảo mật</Link></span>
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="auth-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                  </button>
                </form>
                
                <div className="social-login">
                  <p>Hoặc đăng ký với</p>
                  <div className="social-buttons">
                    <button className="social-button facebook">
                      <i className="fab fa-facebook-f"></i>
                      Facebook
                    </button>
                    <button className="social-button google">
                      <i className="fab fa-google"></i>
                      Google
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'forgot-password' && (
              <div className="auth-form">
                <h2>Quên mật khẩu</h2>
                <p className="forgot-password-info">
                  Vui lòng nhập địa chỉ email của bạn. Bạn sẽ nhận được một liên kết để tạo mật khẩu mới qua email.
                </p>
                
                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleForgotSubmit}>
                  <div className="form-group">
                    <label htmlFor="forgot-email">Email</label>
                    <input
                      type="email"
                      id="forgot-email"
                      name="email"
                      value={forgotValues.email}
                      onChange={handleForgotChange}
                      placeholder="Nhập email của bạn"
                    />
                    {forgotErrors.email && <div className="form-error">{forgotErrors.email}</div>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="auth-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                  </button>
                  
                  <div className="back-to-login">
                    <button 
                      type="button"
                      onClick={() => handleTabChange('login')}
                    >
                      <i className="fas fa-arrow-left"></i> Quay lại đăng nhập
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;