/**
 * Các utility functions cho việc quản lý token và xác thực
 */

// Key để lưu token trong localStorage
const TOKEN_KEY = process.env.REACT_APP_AUTH_STORAGE_KEY || 'auth_token';

/**
 * Lưu token vào localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Lấy token từ localStorage
 * @returns {string|null} - JWT token hoặc null nếu không có
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Xóa token khỏi localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Kiểm tra xem token có tồn tại hay không
 * @returns {boolean} - true nếu có token, false nếu không
 */
export const hasToken = () => {
  return !!getToken();
};

/**
 * Giải mã JWT token để lấy payload
 * @param {string} token - JWT token
 * @returns {Object|null} - Payload của token hoặc null nếu token không hợp lệ
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    // JWT token có dạng: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Kiểm tra xem token có hết hạn hay không
 * @param {string} token - JWT token
 * @returns {boolean} - true nếu token hết hạn, false nếu không
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  
  if (!decoded || !decoded.exp) return true;
  
  // exp là thời gian hết hạn tính bằng giây
  const currentTime = Math.floor(Date.now() / 1000);
  
  return decoded.exp < currentTime;
};

/**
 * Refresh token
 * @returns {Promise<string|null>} - Promise chứa token mới hoặc null nếu thất bại
 */
export const refreshToken = async () => {
  try {
    // Gọi API để refresh token
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    
    if (data.token) {
      setToken(data.token);
      return data.token;
    }
    
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    removeToken();
    return null;
  }
};