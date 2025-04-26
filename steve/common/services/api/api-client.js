import axios from 'axios';
import { getToken, refreshToken } from '../auth/authUtils';

/**
 * Cấu hình axios instance cho các API calls
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: process.env.REACT_APP_API_TIMEOUT ? parseInt(process.env.REACT_APP_API_TIMEOUT) : 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request interceptor
 * - Thêm Authorization header với token nếu có
 * - Xử lý các cấu hình request khác
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Xử lý response data
 * - Xử lý các lỗi chung (401, 403, 500, etc.)
 * - Refresh token nếu token hết hạn
 */
apiClient.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu response trực tiếp
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Xử lý lỗi token hết hạn (401)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Thử refresh token
        const newToken = await refreshToken();
        
        // Nếu refresh token thành công, thử lại request ban đầu
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Nếu refresh token thất bại, chuyển hướng đến trang đăng nhập
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Xử lý các lỗi khác
    const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
    
    // Có thể dispatch action để hiển thị thông báo lỗi toàn cục ở đây
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default apiClient;