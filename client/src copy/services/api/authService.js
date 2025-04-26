import axiosInstance from './axiosConfig';

/**
 * Đăng nhập người dùng
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu người dùng
 * @returns {Promise<Object>} - Thông tin người dùng và token
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    
    const { token, refreshToken, user } = response.data;
    
    // Lưu token vào localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    return { user, token };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
};

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - Thông tin người dùng
 * @param {string} userData.name - Tên người dùng
 * @param {string} userData.email - Email người dùng
 * @param {string} userData.password - Mật khẩu người dùng
 * @returns {Promise<Object>} - Thông tin người dùng đã đăng ký
 */
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
  }
};

/**
 * Đăng xuất người dùng
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      await axiosInstance.post('/auth/logout', { refreshToken });
    }
    
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Logout error:', error);
    // Xóa token dù có lỗi
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 * @returns {Promise<Object>} - Thông tin người dùng
 */
export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
  }
};

/**
 * Yêu cầu đặt lại mật khẩu
 * @param {string} email - Email người dùng
 * @returns {Promise<Object>} - Thông báo kết quả
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể yêu cầu đặt lại mật khẩu');
  }
};

/**
 * Đặt lại mật khẩu
 * @param {string} token - Token đặt lại mật khẩu
 * @param {string} password - Mật khẩu mới
 * @returns {Promise<Object>} - Thông báo kết quả
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể đặt lại mật khẩu');
  }
};