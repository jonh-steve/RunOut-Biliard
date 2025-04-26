import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Axios instance với cấu hình mặc định
 */
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor để thêm token vào header
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor để xử lý lỗi và refresh token
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Xử lý token hết hạn (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Không có refresh token, đăng xuất người dùng
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Gọi API để lấy token mới
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        const { token } = response.data;
        
        // Lưu token mới
        localStorage.setItem('token', token);
        
        // Thử lại request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại, đăng xuất người dùng
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Xử lý lỗi server (500)
    if (error.response?.status === 500) {
      console.error('Server error:', error);
      // Có thể hiển thị thông báo lỗi server ở đây
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;