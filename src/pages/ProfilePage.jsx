import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { AuthContext } from '../context/AuthContext';
import UserService from '../services/api/UserService';
import OrderService from '../services/api/OrderService';
import { useForm } from '../hooks/useForm';
import { formatDate } from '../utils/formatUtils';
import './ProfilePage.css';

const ProfilePage = () => {
  const { tab = 'profile' } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUserProfile, logout } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState(tab);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
    }
  }, [isAuthenticated, navigate]);
  
  // Update URL when tab changes
  useEffect(() => {
    navigate(`/profile/${activeTab}`, { replace: true });
  }, [activeTab, navigate]);
  
  // Fetch user orders
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      const fetchOrders = async () => {
        setIsLoading(true);
        try {
          const response = await OrderService.getUserOrders();
          setOrders(response.data || []);
        } catch (err) {
          setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
          console.error('Error fetching orders:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);
  
  // Fetch user addresses
  useEffect(() => {
    if (activeTab === 'addresses' && isAuthenticated) {
      const fetchAddresses = async () => {
        setIsLoading(true);
        try {
          const response = await UserService.getUserAddresses();
          setAddresses(response.data || []);
        } catch (err) {
          setError('Không thể tải danh sách địa chỉ. Vui lòng thử lại sau.');
          console.error('Error fetching addresses:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAddresses();
    }
  }, [activeTab, isAuthenticated]);
  
  // Profile form
  const { values: profileValues, handleChange: handleProfileChange, handleSubmit: handleProfileSubmit, errors: profileErrors, setValues: setProfileValues } = 
    useForm({
      initialValues: {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatar: user?.avatar || '',
        bio: user?.bio || ''
      },
      validate: (values) => {
        const errors = {};
        if (!values.name) errors.name = 'Họ tên là bắt buộc';
        if (!values.email) errors.email = 'Email là bắt buộc';
        else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email không hợp lệ';
        if (values.phone && !/^[0-9]{10}$/.test(values.phone)) errors.phone = 'Số điện thoại không hợp lệ';
        return errors;
      },
      onSubmit: async (values) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');
        
        try {
          await updateUserProfile(values);
          setSuccessMessage('Cập nhật thông tin thành công!');
          
          // Hide success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        } catch (err) {
          setError('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
          console.error('Error updating profile:', err);
        } finally {
          setIsLoading(false);
        }
      }
    });
  
  // Update profile form when user data changes
  useEffect(() => {
    if (user) {
      setProfileValues({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        bio: user.bio || ''
      });
    }
  }, [user, setProfileValues]);
  
  // Password change form
  const { values: passwordValues, handleChange: handlePasswordChange, handleSubmit: handlePasswordSubmit, errors: passwordErrors, resetForm: resetPasswordForm } = 
    useForm({
      initialValues: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      validate: (values) => {
        const errors = {};
        if (!values.currentPassword) errors.currentPassword = 'Mật khẩu hiện tại là bắt buộc';
        if (!values.newPassword) errors.newPassword = 'Mật khẩu mới là bắt buộc';
        else if (values.newPassword.length < 6) errors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
        if (!values.confirmPassword) errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        else if (values.newPassword !== values.confirmPassword) errors.confirmPassword = 'Mật khẩu không khớp';
        return errors;
      },
      onSubmit: async (values) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');
        
        try {
          await UserService.changePassword(values.currentPassword, values.newPassword);
          setSuccessMessage('Đổi mật khẩu thành công!');
          resetPasswordForm();
          
          // Hide success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        } catch (err) {
          setError('Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.');
          console.error('Error changing password:', err);
        } finally {
          setIsLoading(false);
        }
      }
    });
  
  // Address form
  const { values: addressValues, handleChange: handleAddressChange, handleSubmit: handleAddressSubmit, errors: addressErrors, resetForm: resetAddressForm } = 
    useForm({
      initialValues: {
        fullName: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        isDefault: false
      },
      validate: (values) => {
        const errors = {};
        if (!values.fullName) errors.fullName = 'Họ tên là bắt buộc';
        if (!values.phone) errors.phone = 'Số điện thoại là bắt buộc';
        else if (!/^[0-9]{10}$/.test(values.phone)) errors.phone = 'Số điện thoại không hợp lệ';
        if (!values.address) errors.address = 'Địa chỉ là bắt buộc';
        if (!values.city) errors.city = 'Tỉnh/Thành phố là bắt buộc';
        if (!values.district) errors.district = 'Quận/Huyện là bắt buộc';
        if (!values.ward) errors.ward = 'Phường/Xã là bắt buộc';
        return errors;
      },
      onSubmit: async (values) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');
        
        try {
          await UserService.addAddress(values);
          setSuccessMessage('Thêm địa chỉ thành công!');
          resetAddressForm();
          
          // Refresh addresses
          const response = await UserService.getUserAddresses();
          setAddresses(response.data || []);
          
          // Hide success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        } catch (err) {
          setError('Không thể thêm địa chỉ. Vui lòng thử lại sau.');
          console.error('Error adding address:', err);
        } finally {
          setIsLoading(false);
        }
      }
    });
  
  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      setIsLoading(true);
      setError(null);
      
      try {
        await UserService.deleteAddress(addressId);
        
        // Refresh addresses
        const response = await UserService.getUserAddresses();
        setAddresses(response.data || []);
        
        setSuccessMessage('Xóa địa chỉ thành công!');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        setError('Không thể xóa địa chỉ. Vui lòng thử lại sau.');
        console.error('Error deleting address:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Handle set default address
  const handleSetDefaultAddress = async (addressId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await UserService.setDefaultAddress(addressId);
      
      // Refresh addresses
      const response = await UserService.getUserAddresses();
      setAddresses(response.data || []);
      
      setSuccessMessage('Đã đặt địa chỉ mặc định!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Không thể đặt địa chỉ mặc định. Vui lòng thử lại sau.');
      console.error('Error setting default address:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
      navigate('/');
    }
  };
  
  if (!isAuthenticated) {
    return null; // Will redirect to login
  }
  
  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                <img src={user?.avatar || '/assets/default-avatar.png'} alt={user?.name} />
              </div>
              <div className="user-details">
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
            
            <nav className="profile-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="fas fa-user"></i>
                Thông tin cá nhân
              </button>
              <button 
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="fas fa-shopping-bag"></i>
                Đơn hàng của tôi
              </button>
              <button 
                className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <i className="fas fa-map-marker-alt"></i>
                Sổ địa chỉ
              </button>
              <button 
                className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <i className="fas fa-lock"></i>
                Đổi mật khẩu
              </button>
              <button 
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="fas fa-cog"></i>
                Cài đặt
              </button>
              <button 
                className="nav-item logout"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                Đăng xuất
              </button>
            </nav>
          </div>
          
          <div className="profile-content">
            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            
            {activeTab === 'profile' && (
              <div className="profile-section">
                <h2>Thông tin cá nhân</h2>
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="name">Họ tên</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileValues.name}
                      onChange={handleProfileChange}
                    />
                    {profileErrors.name && <div className="form-error">{profileErrors.name}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileValues.email}
                      onChange={handleProfileChange}
                      disabled
                    />
                    {profileErrors.email && <div className="form-error">{profileErrors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileValues.phone}
                      onChange={handleProfileChange}
                    />
                    {profileErrors.phone && <div className="form-error">{profileErrors.phone}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="avatar">URL ảnh đại diện</label>
                    <input
                      type="text"
                      id="avatar"
                      name="avatar"
                      value={profileValues.avatar}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bio">Giới thiệu</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileValues.bio}
                      onChange={handleProfileChange}
                      rows="4"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Cập nhật thông tin'}
                  </button>
                </form>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="profile-section">
                <h2>Đơn hàng của tôi</h2>
                
                {isLoading ? (
                  <div className="loading-spinner">Đang tải đơn hàng...</div>
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-shopping-bag"></i>
                    <p>Bạn chưa có đơn hàng nào</p>
                    <Link to="/products" className="btn btn-primary">Mua sắm ngay</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-id">
                            <span>Mã đơn hàng:</span>
                            <strong>{order.orderNumber}</strong>
                          </div>
                          <div className="order-date">
                            <span>Ngày đặt:</span>
                            <strong>{formatDate(order.createdAt)}</strong>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                              {order.status === 'PENDING' && 'Chờ xác nhận'}
                              {order.status === 'PROCESSING' && 'Đang xử lý'}
                              {order.status === 'SHIPPED' && 'Đang giao hàng'}
                              {order.status === 'DELIVERED' && 'Đã giao hàng'}
                              {order.status === 'CANCELLED' && 'Đã hủy'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="order-items">
                          {order.items.slice(0, 2).map(item => (
                            <div key={item.id} className="order-item">
                              <div className="item-image">
                                <img src={item.image || '/assets/placeholder.png'} alt={item.name} />
                              </div>
                              <div className="item-details">
                                <div className="item-name">{item.name}</div>
                                <div className="item-quantity">x{item.quantity}</div>
                              </div>
                              <div className="item-price">{formatCurrency(item.price)}</div>
                            </div>
                          ))}
                          
                          {order.items.length > 2 && (
                            <div className="more-items">
                              +{order.items.length - 2} sản phẩm khác
                            </div>
                          )}
                        </div>
                        
                        <div className="order-footer">
                          <div className="order-total">
                            <span>Tổng tiền:</span>
                            <strong>{formatCurrency(order.total)}</strong>
                          </div>
                          <div className="order-actions">
                            <Link to={`/orders/${order.id}`} className="btn btn-outline">
                              Xem chi tiết
                            </Link>
                            {order.status === 'PENDING' && (
                              <button className="btn btn-danger">Hủy đơn hàng</button>
                            )}
                            {order.status === 'DELIVERED' && (
                              <button className="btn btn-primary">Đánh giá</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div className="profile-section">
                <h2>Sổ địa chỉ</h2>
                
                {isLoading && !addresses.length ? (
                  <div className="loading-spinner">Đang tải địa chỉ...</div>
                ) : (
                  <>
                    <div className="addresses-list">
                      {addresses.length === 0 ? (
                        <div className="empty-state">
                          <i className="fas fa-map-marker-alt"></i>
                          <p>Bạn chưa có địa chỉ nào</p>
                        </div>
                      ) : (
                        addresses.map(address => (
                          <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                            {address.isDefault && (
                              <div className="default-badge">Mặc định</div>
                            )}
                            
                            <div className="address-header">
                              <h3>{address.fullName}</h3>
                              <div className="address-actions">
                                <button 
                                  className="edit-btn"
                                  onClick={() => {
                                    // TODO: Implement edit address
                                    alert('Chức năng đang được phát triển');
                                  }}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="delete-btn"
                                  onClick={() => handleDeleteAddress(address.id)}
                                  disabled={isLoading}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            </div>
                            
                            <div className="address-content">
                              <p><strong>Điện thoại:</strong> {address.phone}</p>
                              <p><strong>Địa chỉ:</strong> {address.address}, {address.ward}, {address.district}, {address.city}</p>
                            </div>
                            
                            {!address.isDefault && (
                              <button 
                                className="set-default-btn"
                                onClick={() => handleSetDefaultAddress(address.id)}
                                disabled={isLoading}
                              >
                                Đặt làm mặc định
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="add-address">
                      <h3>Thêm địa chỉ mới</h3>
                      <form onSubmit={handleAddressSubmit} className="address-form">
                        <div className="form-row two-columns">
                          <div className="form-group">
                            <label htmlFor="fullName">Họ tên</label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={addressValues.fullName}
                              onChange={handleAddressChange}
                            />
                            {addressErrors.fullName && <div className="form-error">{addressErrors.fullName}</div>}
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={addressValues.phone}
                              onChange={handleAddressChange}
                            />
                            {addressErrors.phone && <div className="form-error">{addressErrors.phone}</div>}
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="address">Địa chỉ</label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={addressValues.address}
                            onChange={handleAddressChange}
                            placeholder="Số nhà, tên đường"
                          />
                          {addressErrors.address && <div className="form-error">{addressErrors.address}</div>}
                        </div>
                        
                        <div className="form-row three-columns">
                          <div className="form-group">
                            <label htmlFor="city">Tỉnh/Thành phố</label>
                            <select
                              id="city"
                              name="city"
                              value={addressValues.city}
                              onChange={handleAddressChange}
                            >
                              <option value="">Chọn Tỉnh/Thành phố</option>
                              <option value="Hà Nội">Hà Nội</option>
                              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                              <option value="Đà Nẵng">Đà Nẵng</option>
                              {/* Add more cities */}
                            </select>
                            {addressErrors.city && <div className="form-error">{addressErrors.city}</div>}
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="district">Quận/Huyện</label>
                            <select
                              id="district"
                              name="district"
                              value={addressValues.district}
                              onChange={handleAddressChange}
                            >
                              <option value="">Chọn Quận/Huyện</option>
                              {addressValues.city === 'Hồ Chí Minh' && (
                                <>
                                  <option value="Quận 1">Quận 1</option>
                                  <option value="Quận 2">Quận 2</option>
                                  <option value="Quận 3">Quận 3</option>
                                  {/* Add more districts */}
                                </>
                              )}
                            </select>
                            {addressErrors.district && <div className="form-error">{addressErrors.district}</div>}
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="ward">Phường/Xã</label>
                            <select
                              id="ward"
                              name="ward"
                              value={addressValues.ward}
                              onChange={handleAddressChange}
                            >
                              <option value="">Chọn Phường/Xã</option>
                              {addressValues.district === 'Quận 1' && (
                                <>
                                  <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                                  <option value="Phường Bến Thành">Phường Bến Thành</option>
                                  <option value="Phường Cầu Kho">Phường Cầu Kho</option>
                                  {/* Add more wards */}
                                </>
                              )}
                            </select>
                            {addressErrors.ward && <div className="form-error">{addressErrors.ward}</div>}
                          </div>
                        </div>
                        
                        <div className="form-group checkbox">
                          <label>
                            <input
                              type="checkbox"
                              name="isDefault"
                              checked={addressValues.isDefault}
                              onChange={handleAddressChange}
                            />
                            Đặt làm địa chỉ mặc định
                          </label>
                        </div>
                        
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Đang xử lý...' : 'Thêm địa chỉ'}
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'password' && (
              <div className="profile-section">
                <h2>Đổi mật khẩu</h2>
                <form onSubmit={handlePasswordSubmit} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordValues.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.currentPassword && <div className="form-error">{passwordErrors.currentPassword}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">Mật khẩu mới</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordValues.newPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.newPassword && <div className="form-error">{passwordErrors.newPassword}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordValues.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    {passwordErrors.confirmPassword && <div className="form-error">{passwordErrors.confirmPassword}</div>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </button>
                </form>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="profile-section">
                <h2>Cài đặt</h2>
                
                <div className="settings-group">
                  <h3>Thông báo</h3>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-name">Thông báo qua email</div>
                      <div className="setting-description">Nhận thông báo về đơn hàng, khuyến mãi qua email</div>
                    </div>
                    <div className="toggle">
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-name">Thông báo qua SMS</div>
                      <div className="setting-description">Nhận thông báo về đơn hàng qua tin nhắn SMS</div>
                    </div>
                    <div className="toggle">
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-name">Thông báo khuyến mãi</div>
                      <div className="setting-description">Nhận thông báo về chương trình khuyến mãi, giảm giá</div>
                    </div>
                    <div className="toggle">
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="settings-group">
                  <h3>Quyền riêng tư</h3>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-name">Hiển thị thông tin cá nhân</div>
                      <div className="setting-description">Cho phép hiển thị thông tin cá nhân với người dùng khác</div>
                    </div>
                    <div className="toggle">
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <div className="setting-name">Lưu lịch sử tìm kiếm</div>
                      <div className="setting-description">Lưu lịch sử tìm kiếm để gợi ý tốt hơn</div>
                    </div>
                    <div className="toggle">
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="settings-group">
                  <h3>Tài khoản</h3>
                  
                  <div className="setting-item danger">
                    <div className="setting-info">
                      <div className="setting-name">Vô hiệu hóa tài khoản</div>
                      <div className="setting-description">Tạm thời vô hiệu hóa tài khoản của bạn</div>
                    </div>
                    <button 
                      className="btn btn-outline-danger"
                      onClick={() => {
                        if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản? Bạn có thể kích hoạt lại sau.')) {
                          // TODO: Implement disable account
                          alert('Chức năng đang được phát triển');
                        }
                      }}
                    >
                      Vô hiệu hóa
                    </button>
                  </div>
                  
                  <div className="setting-item danger">
                    <div className="setting-info">
                      <div className="setting-name">Xóa tài khoản</div>
                      <div className="setting-description">Xóa vĩnh viễn tài khoản và dữ liệu của bạn</div>
                    </div>
                    <button 
                      className="btn btn-danger"
                      onClick={() => {
                        if (window.confirm('CẢNH BÁO: Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?')) {
                          // TODO: Implement delete account
                          alert('Chức năng đang được phát triển');
                        }
                      }}
                    >
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary save-settings"
                  onClick={() => {
                    setSuccessMessage('Lưu cài đặt thành công!');
                    
                    // Hide success message after 3 seconds
                    setTimeout(() => {
                      setSuccessMessage('');
                    }, 3000);
                  }}
                >
                  Lưu cài đặt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper function for formatting currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export default ProfilePage;
