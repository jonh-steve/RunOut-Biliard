# Hướng dẫn di chuyển API từ User sang Client

Tài liệu này cung cấp hướng dẫn chi tiết về cách di chuyển các tích hợp API từ thư mục User sang thư mục Client, đảm bảo tính nhất quán và hiệu quả trong việc giao tiếp với Server.

## Mục lục

1. [Tổng quan về kiến trúc API](#tổng-quan-về-kiến-trúc-api)
2. [Phân tích API hiện tại](#phân-tích-api-hiện-tại)
3. [Thiết kế lớp Service API](#thiết-kế-lớp-service-api)
4. [Xử lý xác thực và bảo mật](#xử-lý-xác-thực-và-bảo-mật)
5. [Xử lý lỗi và retry](#xử-lý-lỗi-và-retry)
6. [Caching và tối ưu hóa](#caching-và-tối-ưu-hóa)
7. [Kiểm thử API](#kiểm-thử-api)
8. [Checklist di chuyển API](#checklist-di-chuyển-api)

## Tổng quan về kiến trúc API

### Mô hình kiến trúc API

Trong quá trình di chuyển từ User sang Client, chúng ta sẽ áp dụng mô hình kiến trúc API sau:

```
Client
  ↓
  Service Layer (API Services)
  ↓
  Adapter Layer (Data Transformation)
  ↓
  HTTP Client (Axios/Fetch)
  ↓
Server
```

### Nguyên tắc thiết kế

1. **Tách biệt mối quan tâm**: Tách biệt logic gọi API, xử lý dữ liệu và xử lý lỗi
2. **Tính nhất quán**: Đảm bảo cách gọi API nhất quán trong toàn bộ ứng dụng
3. **Khả năng mở rộng**: Thiết kế để dễ dàng thêm mới hoặc thay đổi API
4. **Khả năng kiểm thử**: Thiết kế để dễ dàng mock và test
5. **Tái sử dụng**: Tối đa hóa khả năng tái sử dụng code

## Phân tích API hiện tại

### Kiểm kê API endpoints

Trước khi bắt đầu di chuyển, hãy kiểm kê tất cả các API endpoints được sử dụng trong User:

1. **Xác định tất cả các endpoints**:
   - Liệt kê URL, phương thức (GET, POST, PUT, DELETE)
   - Ghi chú tham số và payload
   - Ghi chú cấu trúc response

2. **Phân loại API theo chức năng**:
   - Authentication APIs
   - User APIs
   - Product APIs
   - Order APIs
   - v.v.

3. **Xác định dependencies**:
   - Các API phụ thuộc vào nhau
   - Thứ tự gọi API

### Phân tích cách gọi API hiện tại

Xem xét cách User đang gọi API:

1. **Thư viện HTTP client**:
   - Axios, Fetch, hoặc thư viện khác?
   - Cấu hình và interceptors

2. **Cấu trúc code**:
   - API được gọi trực tiếp trong component?
   - Có lớp service riêng không?
   - Có sử dụng hooks không?

3. **Xử lý lỗi**:
   - Cách xử lý lỗi API
   - Cách hiển thị lỗi cho người dùng

4. **Xử lý loading state**:
   - Cách hiển thị trạng thái loading
   - Cách xử lý concurrent requests

## Thiết kế lớp Service API

### Cấu trúc thư mục

Thiết lập cấu trúc thư mục cho API services trong Client:

```
Client/src/services/
├── api/
│   ├── apiClient.js       # HTTP client configuration
│   ├── authService.js     # Authentication API
│   ├── userService.js     # User API
│   ├── productService.js  # Product API
│   ├── orderService.js    # Order API
│   └── ...
├── adapters/              # Data transformation adapters
├── hooks/                 # Custom hooks for API
└── index.js               # Export all services
```

### HTTP Client Configuration

Tạo một HTTP client được cấu hình sẵn:

```javascript
// Client/src/services/api/apiClient.js
import axios from 'axios';
import { getToken, refreshToken } from '../auth/tokenService';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await refreshToken();
        const token = getToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Service Template

Tạo template cho các API service:

```javascript
// Client/src/services/api/userService.js
import apiClient from './apiClient';
import { userAdapter } from '../adapters/userAdapter';

export const userService = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return userAdapter.toClient(response.data);
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user profile
   */
  updateProfile: async (userData) => {
    try {
      const data = userAdapter.toServer(userData);
      const response = await apiClient.put('/users/me', data);
      return userAdapter.toClient(response.data);
    } catch (error) {
      throw error;
    }
  },
  
  // Other user-related API methods
};
```

### Data Adapters

Tạo adapters để chuyển đổi dữ liệu giữa client và server:

```javascript
// Client/src/services/adapters/userAdapter.js
export const userAdapter = {
  /**
   * Convert server response to client model
   * @param {Object} serverData - Data from server
   * @returns {Object} Client model
   */
  toClient: (serverData) => {
    return {
      id: serverData._id,
      firstName: serverData.firstname,
      lastName: serverData.lastname,
      email: serverData.email,
      phone: serverData.mobile,
      role: serverData.role,
      createdAt: new Date(serverData.createdAt),
      // Transform other fields as needed
    };
  },
  
  /**
   * Convert client model to server format
   * @param {Object} clientData - Data from client
   * @returns {Object} Server format
   */
  toServer: (clientData) => {
    return {
      firstname: clientData.firstName,
      lastname: clientData.lastName,
      email: clientData.email,
      mobile: clientData.phone,
      // Transform other fields as needed
    };
  }
};
```

### Custom Hooks

Tạo custom hooks để sử dụng API services trong components:

```javascript
// Client/src/services/hooks/useUser.js
import { useState, useEffect, useCallback } from 'react';
import { userService } from '../api/userService';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  return {
    user,
    loading,
    error,
    fetchUser,
    updateUser
  };
};
```

## Xử lý xác thực và bảo mật

### Token Management

Tạo service để quản lý tokens:

```javascript
// Client/src/services/auth/tokenService.js
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenService = {
  /**
   * Save authentication tokens
   * @param {string} token - JWT token
   * @param {string} refreshToken - Refresh token
   */
  saveTokens: (token, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  
  /**
   * Get current token
   * @returns {string|null} JWT token
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  /**
   * Get refresh token
   * @returns {string|null} Refresh token
   */
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  /**
   * Clear all tokens
   */
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} Is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
```

### Authentication Service

Tạo service để xử lý đăng nhập, đăng ký và đăng xuất:

```javascript
// Client/src/services/api/authService.js
import apiClient from './apiClient';
import { tokenService } from '../auth/tokenService';

export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, refreshToken, user } = response.data;
      
      tokenService.saveTokens(token, refreshToken);
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token, refreshToken, user } = response.data;
      
      tokenService.saveTokens(token, refreshToken);
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.clearTokens();
    }
  },
  
  /**
   * Refresh authentication token
   * @returns {Promise<string>} New token
   */
  refreshToken: async () => {
    try {
      const refreshToken = tokenService.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.post('/auth/refresh-token', {
        refreshToken
      });
      
      const { token, newRefreshToken } = response.data;
      tokenService.saveTokens(token, newRefreshToken);
      
      return token;
    } catch (error) {
      tokenService.clearTokens();
      throw error;
    }
  }
};
```

## Xử lý lỗi và retry

### Error Handling

Tạo utility để xử lý lỗi API:

```javascript
// Client/src/services/utils/errorHandler.js
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const errorHandler = {
  /**
   * Get user-friendly error message
   * @param {Error} error - Error object
   * @returns {string} User-friendly error message
   */
  getErrorMessage: (error) => {
    if (error instanceof ApiError) {
      return error.message;
    }
    
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const data = error.response.data;
      
      if (data && data.message) {
        return data.message;
      }
      
      switch (status) {
        case 400:
          return 'Yêu cầu không hợp lệ';
        case 401:
          return 'Bạn cần đăng nhập để thực hiện hành động này';
        case 403:
          return 'Bạn không có quyền thực hiện hành động này';
        case 404:
          return 'Không tìm thấy dữ liệu yêu cầu';
        case 500:
          return 'Đã xảy ra lỗi từ máy chủ';
        default:
          return `Lỗi ${status}: Vui lòng thử lại sau`;
      }
    }
    
    if (error.request) {
      // Request made but no response received
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.';
    }
    
    // Something else happened
    return error.message || 'Đã xảy ra lỗi không xác định';
  },
  
  /**
   * Create ApiError from axios error
   * @param {Error} error - Axios error
   * @returns {ApiError} Formatted API error
   */
  createApiError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data.message || errorHandler.getErrorMessage(error);
      return new ApiError(message, status, data);
    }
    
    return new ApiError(
      errorHandler.getErrorMessage(error),
      error.request ? 0 : 500
    );
  }
};
```

### Retry Logic

Tạo utility để retry API calls:

```javascript
// Client/src/services/utils/retryUtils.js
/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.baseDelay - Base delay in ms
 * @param {Function} options.shouldRetry - Function to determine if should retry
 * @returns {Promise<any>} Function result
 */
export const retryWithBackoff = async (fn, {
  maxRetries = 3,
  baseDelay = 300,
  shouldRetry = (error) => true
} = {}) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries - 1 || !shouldRetry(error)) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, i);
      
      // Add some jitter
      const jitter = delay * 0.1 * Math.random();
      
      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
  
  throw lastError;
};
```

## Caching và tối ưu hóa

### Response Caching

Tạo utility để cache API responses:

```javascript
// Client/src/services/utils/cacheUtils.js
const cache = new Map();

export const cacheUtils = {
  /**
   * Get cached data
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null
   */
  get: (key) => {
    const item = cache.get(key);
    
    if (!item) return null;
    
    // Check if expired
    if (item.expiry && item.expiry < Date.now()) {
      cache.delete(key);
      return null;
    }
    
    return item.data;
  },
  
  /**
   * Set data in cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in ms
   */
  set: (key, data, ttl = 0) => {
    const item = {
      data,
      expiry: ttl ? Date.now() + ttl : null
    };
    
    cache.set(key, item);
  },
  
  /**
   * Remove item from cache
   * @param {string} key - Cache key
   */
  remove: (key) => {
    cache.delete(key);
  },
  
  /**
   * Clear entire cache
   */
  clear: () => {
    cache.clear();
  },
  
  /**
   * Get cached API response or fetch from API
   * @param {Function} fetchFn - Function to fetch data
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in ms
   * @returns {Promise<any>} Data
   */
  getOrFetch: async (fetchFn, key, ttl = 5 * 60 * 1000) => {
    const cachedData = cacheUtils.get(key);
    
    if (cachedData) {
      return cachedData;
    }
    
    const data = await fetchFn();
    cacheUtils.set(key, data, ttl);
    
    return data;
  }
};
```

### Request Debouncing and Throttling

Tạo hooks để debounce và throttle API requests:

```javascript
// Client/src/services/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Debounce a value
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in ms
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
};
```

```javascript
// Client/src/services/hooks/useThrottle.js
import { useState, useEffect, useRef } from 'react';

/**
 * Throttle a value
 * @param {any} value - Value to throttle
 * @param {number} limit - Limit in ms
 * @returns {any} Throttled value
 */
export const useThrottle = (value, limit = 300) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);
  
  return throttledValue;
};
```

## Kiểm thử API

### Unit Testing API Services

Tạo unit tests cho API services:

```javascript
// Client/src/services/api/__tests__/userService.test.js
import { userService } from '../userService';
import apiClient from '../apiClient';
import { userAdapter } from '../../adapters/userAdapter';

// Mock dependencies
jest.mock('../apiClient');
jest.mock('../../adapters/userAdapter');

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getCurrentUser', () => {
    it('should fetch current user and transform data', async () => {
      // Mock API response
      const mockResponse = {
        data: {
          _id: '123',
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com'
        }
      };
      
      // Mock transformed data
      const mockTransformedData = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };
      
      // Setup mocks
      apiClient.get.mockResolvedValueOnce(mockResponse);
      userAdapter.toClient.mockReturnValueOnce(mockTransformedData);
      
      // Call the service
      const result = await userService.getCurrentUser();
      
      // Assertions
      expect(apiClient.get).toHaveBeenCalledWith('/users/me');
      expect(userAdapter.toClient).toHaveBeenCalledWith(mockResponse.data);
      expect(result).toEqual(mockTransformedData);
    });
    
    it('should throw error when API call fails', async () => {
      // Mock API error
      const mockError = new Error('API error');
      apiClient.get.mockRejectedValueOnce(mockError);
      
      // Call the service and expect error
      await expect(userService.getCurrentUser()).rejects.toThrow(mockError);
      expect(apiClient.get).toHaveBeenCalledWith('/users/me');
    });
  });
  
  // More tests for other methods
});
```

### Integration Testing

Tạo integration tests để kiểm tra tương tác giữa các services:

```javascript
// Client/src/services/__tests__/integration.test.js
import { authService } from '../api/authService';
import { userService } from '../api/userService';
import { tokenService } from '../auth/tokenService';
import apiClient from '../api/apiClient';

// Mock dependencies
jest.mock('../api/apiClient');
jest.mock('../auth/tokenService');

describe('API Services Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should set auth token after login', async () => {
    // Mock API response
    const mockLoginResponse = {
      data: {
        token: 'fake-token',
        refreshToken: 'fake-refresh-token',
        user: {
          _id: '123',
          firstname: 'John',
          lastname: 'Doe'
        }
      }
    };
    
    // Setup mocks
    apiClient.post.mockResolvedValueOnce(mockLoginResponse);
    
    // Call login
    await authService.login('john@example.com', 'password');
    
    // Assertions
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'john@example.com',
      password: 'password'
    });
    
    expect(tokenService.saveTokens).toHaveBeenCalledWith(
      'fake-token',
      'fake-refresh-token'
    );
  });
  
  it('should use auth token for user API calls', async () => {
    // Mock token
    tokenService.getToken.mockReturnValue('fake-token');
    
    // Mock API response
    apiClient.get.mockResolvedValueOnce({
      data: { _id: '123', firstname: 'John' }
    });
    
    // Call user service
    await userService.getCurrentUser();
    
    // Check if token was used
    expect(apiClient.interceptors.request.use).toHaveBeenCalled();
    // Note: This is a simplified test. In reality, you'd need to test the actual interceptor function
  });
  
  // More integration tests
});
```

## Checklist di chuyển API

Sử dụng checklist này để đảm bảo bạn không bỏ sót bất kỳ bước nào trong quá trình di chuyển API:

### Phân tích và chuẩn bị

- [ ] Kiểm kê tất cả API endpoints trong User
- [ ] Phân loại API theo chức năng
- [ ] Xác định dependencies giữa các API
- [ ] Phân tích cách xử lý xác th���c hiện tại
- [ ] Phân tích cách xử lý lỗi hiện tại

### Thiết lập cơ sở hạ tầng

- [ ] Tạo cấu trúc thư mục cho API services
- [ ] Cài đặt các dependencies cần thiết (axios, etc.)
- [ ] Thiết lập HTTP client với cấu hình cơ bản
- [ ] Thiết lập interceptors cho xác thực và xử lý lỗi
- [ ] Tạo các utility functions cho xử lý lỗi, retry, và caching

### Triển khai API Services

- [ ] Tạo service cho xác thực (login, register, logout)
- [ ] Tạo service cho quản lý token
- [ ] Tạo các service cho từng nhóm API (user, product, order, etc.)
- [ ] Tạo các adapter để chuyển đổi dữ liệu
- [ ] Tạo các custom hooks để sử dụng API services

### Kiểm thử

- [ ] Viết unit tests cho mỗi API service
- [ ] Viết integration tests cho tương tác giữa các services
- [ ] Kiểm thử xử lý lỗi và retry
- [ ] Kiểm thử xác thực và refresh token
- [ ] Kiểm thử hiệu suất và caching

### Tích hợp và chuyển đổi

- [ ] Cập nhật các component để sử dụng API services mới
- [ ] Đảm bảo tất cả API calls đều thông qua lớp service
- [ ] Kiểm tra tương thích với Server
- [ ] Theo dõi và ghi log các API calls
- [ ] Tối ưu hóa hiệu suất

## Kết luận

Di chuyển API từ User sang Client là một quá trình quan trọng đòi hỏi sự cẩn thận và phương pháp. Bằng cách tuân theo hướng dẫn này, bạn có thể đảm bảo quá trình di chuyển diễn ra suôn sẻ và tạo ra một kiến trúc API mạnh mẽ, dễ bảo trì trong thư mục Client mới.

Hãy nhớ rằng mục tiêu cuối cùng là có một lớp service API nhất quán, dễ sử dụng và hiệu quả, giúp giao tiếp với Server một cách đáng tin cậy và hiệu quả.