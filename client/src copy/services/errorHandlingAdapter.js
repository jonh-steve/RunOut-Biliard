/**
 * Error Handling Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa việc xử lý lỗi giữa giao diện User và Client
 * Cung cấp interface thống nhất để quản lý lỗi trong cả hai giao diện
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationAdapter from './notificationAdapter';
import ApiService from './apiAdapter';
import { useAdaptiveNavigate } from './routeAdapter';

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';

/**
 * Các loại lỗi
 */
export const ERROR_TYPES = {
  NETWORK: 'network',
  API: 'api',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
};

/**
 * Context cho error handling
 */
const ErrorContext = createContext({
  error: null,
  setError: () => {},
  clearError: () => {},
  handleError: () => {}
});

/**
 * Provider cho ErrorContext
 * @param {Object} props - Props
 * @returns {React.Component} - Provider component
 */
export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);
  const navigate = useAdaptiveNavigate();
  
  // Xóa lỗi
  const clearError = () => {
    setError(null);
  };
  
  // Xử lý lỗi
  const handleError = (err, options = {}) => {
    const {
      showNotification = true,
      redirect = null,
      logToConsole = true,
      logToServer = false
    } = options;
    
    // Phân loại lỗi
    const errorInfo = classifyError(err);
    setError(errorInfo);
    
    // Log lỗi ra console
    if (logToConsole) {
      console.error('Error:', errorInfo);
    }
    
    // Log lỗi lên server
    if (logToServer) {
      logErrorToServer(errorInfo);
    }
    
    // Hiển thị thông báo
    if (showNotification) {
      showErrorNotification(errorInfo);
    }
    
    // Chuyển hướng nếu cần
    if (redirect) {
      navigate(redirect);
    } else {
      // Chuyển hướng tự động dựa trên loại lỗi
      if (errorInfo.type === ERROR_TYPES.AUTHENTICATION) {
        navigate('/login');
      } else if (errorInfo.type === ERROR_TYPES.AUTHORIZATION) {
        navigate('/403');
      } else if (errorInfo.type === ERROR_TYPES.NOT_FOUND) {
        navigate('/404');
      } else if (errorInfo.type === ERROR_TYPES.SERVER) {
        navigate('/500');
      }
    }
    
    return errorInfo;
  };
  
  // Context value
  const value = {
    error,
    setError,
    clearError,
    handleError
  };
  
  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
}

/**
 * Hook để sử dụng error handling
 * @returns {Object} - Error context
 */
export function useError() {
  return useContext(ErrorContext);
}

/**
 * Phân loại lỗi
 * @param {Error|Object} error - Đối tượng lỗi
 * @returns {Object} - Thông tin lỗi đã phân loại
 */
export function classifyError(error) {
  // Mặc định
  let errorInfo = {
    type: ERROR_TYPES.UNKNOWN,
    message: 'Đã xảy ra lỗi không xác định',
    status: null,
    data: null,
    originalError: error
  };
  
  // Nếu là lỗi network
  if (error.message && error.message.includes('Network Error')) {
    errorInfo = {
      ...errorInfo,
      type: ERROR_TYPES.NETWORK,
      message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.'
    };
  }
  // Nếu là lỗi từ API
  else if (error.response) {
    const { status, data } = error.response;
    
    errorInfo = {
      ...errorInfo,
      status,
      data,
      message: data.message || `Lỗi ${status}`
    };
    
    // Phân loại dựa trên status code
    if (status === 400) {
      errorInfo.type = ERROR_TYPES.VALIDATION;
    } else if (status === 401) {
      errorInfo.type = ERROR_TYPES.AUTHENTICATION;
      errorInfo.message = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';
    } else if (status === 403) {
      errorInfo.type = ERROR_TYPES.AUTHORIZATION;
      errorInfo.message = 'Bạn không có quyền thực hiện hành động này.';
    } else if (status === 404) {
      errorInfo.type = ERROR_TYPES.NOT_FOUND;
      errorInfo.message = 'Không tìm thấy tài nguyên yêu cầu.';
    } else if (status >= 500) {
      errorInfo.type = ERROR_TYPES.SERVER;
      errorInfo.message = 'Lỗi máy chủ. Vui lòng thử lại sau.';
    } else {
      errorInfo.type = ERROR_TYPES.API;
    }
  }
  // Nếu là lỗi validation
  else if (error.errors && typeof error.errors === 'object') {
    errorInfo = {
      ...errorInfo,
      type: ERROR_TYPES.VALIDATION,
      message: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
      data: error.errors
    };
  }
  // Nếu là lỗi thông thường
  else if (error instanceof Error) {
    errorInfo = {
      ...errorInfo,
      type: ERROR_TYPES.CLIENT,
      message: error.message
    };
  }
  
  return errorInfo;
}

/**
 * Hiển thị thông báo lỗi
 * @param {Object} errorInfo - Thông tin lỗi
 */
export function showErrorNotification(errorInfo) {
  switch (errorInfo.type) {
    case ERROR_TYPES.NETWORK:
      NotificationAdapter.error('Lỗi kết nối', {
        title: 'Lỗi kết nối',
        message: errorInfo.message
      });
      break;
    case ERROR_TYPES.AUTHENTICATION:
      NotificationAdapter.warning('Phiên làm việc hết hạn', {
        title: 'Yêu cầu đăng nhập',
        message: errorInfo.message
      });
      break;
    case ERROR_TYPES.AUTHORIZATION:
      NotificationAdapter.error('Không có quyền', {
        title: 'Không có quyền',
        message: errorInfo.message
      });
      break;
    case ERROR_TYPES.VALIDATION:
      NotificationAdapter.warning('Dữ liệu không hợp lệ', {
        title: 'Dữ liệu không hợp lệ',
        message: errorInfo.message
      });
      break;
    case ERROR_TYPES.NOT_FOUND:
      NotificationAdapter.warning('Không tìm thấy', {
        title: 'Không tìm thấy',
        message: errorInfo.message
      });
      break;
    case ERROR_TYPES.SERVER:
      NotificationAdapter.error('Lỗi máy chủ', {
        title: 'Lỗi máy chủ',
        message: errorInfo.message
      });
      break;
    default:
      NotificationAdapter.error('Đã xảy ra lỗi', {
        title: 'Đã xảy ra lỗi',
        message: errorInfo.message
      });
  }
}

/**
 * Log lỗi lên server
 * @param {Object} errorInfo - Thông tin lỗi
 */
export async function logErrorToServer(errorInfo) {
  try {
    // Loại bỏ các thông tin nhạy cảm
    const sanitizedError = {
      ...errorInfo,
      originalError: undefined
    };
    
    // Gửi lỗi lên server
    await ApiService.post('/logs/error', {
      error: sanitizedError,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  } catch (err) {
    // Không làm gì nếu không gửi được lỗi lên server
    console.warn('Failed to log error to server:', err);
  }
}

/**
 * HOC để thêm error handling vào component
 * @param {React.Component} Component - Component cần wrap
 * @returns {React.Component} - Component đã được wrap
 */
export function withErrorHandling(Component) {
  return (props) => {
    const errorContext = useError();
    
    return <Component {...props} errorHandling={errorContext} />;
  };
}

/**
 * Component để hiển thị lỗi
 * @param {Object} props - Props
 * @param {Object} props.error - Đối tượng lỗi
 * @param {Function} props.onRetry - Callback khi retry
 * @param {Function} props.onBack - Callback khi back
 * @returns {React.Component} - Component hiển thị lỗi
 */
export function ErrorDisplay({ error, onRetry, onBack }) {
  if (!error) return null;
  
  let title = 'Đã xảy ra lỗi';
  let icon = '⚠️';
  
  switch (error.type) {
    case ERROR_TYPES.NETWORK:
      title = 'Lỗi kết nối';
      icon = '📶';
      break;
    case ERROR_TYPES.AUTHENTICATION:
      title = 'Yêu cầu đăng nhập';
      icon = '🔒';
      break;
    case ERROR_TYPES.AUTHORIZATION:
      title = 'Không có quyền';
      icon = '🚫';
      break;
    case ERROR_TYPES.VALIDATION:
      title = 'Dữ liệu không hợp lệ';
      icon = '📝';
      break;
    case ERROR_TYPES.NOT_FOUND:
      title = 'Không tìm thấy';
      icon = '🔍';
      break;
    case ERROR_TYPES.SERVER:
      title = 'Lỗi máy chủ';
      icon = '🖥️';
      break;
  }
  
  return (
    <div className={isClientInterface ? "bg-red-50 border border-red-200 rounded-lg p-4 my-4" : "alert alert-danger"}>
      <div className={isClientInterface ? "flex items-center mb-2" : "d-flex align-items-center mb-2"}>
        <span className={isClientInterface ? "text-2xl mr-2" : "h4 mr-2"}>{icon}</span>
        <h4 className={isClientInterface ? "text-lg font-medium text-red-800" : "h5 text-danger"}>{title}</h4>
      </div>
      <p className={isClientInterface ? "text-red-700 mb-4" : "text-danger mb-3"}>{error.message}</p>
      <div className={isClientInterface ? "flex space-x-2" : "d-flex"}>
        {onRetry && (
          <button
            onClick={onRetry}
            className={isClientInterface ? "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" : "btn btn-danger mr-2"}
          >
            Thử lại
          </button>
        )}
        {onBack && (
          <button
            onClick={onBack}
            className={isClientInterface ? "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" : "btn btn-secondary"}
          >
            Quay lại
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Component để bắt lỗi trong component tree
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log lỗi
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log lỗi lên server nếu cần
    if (this.props.logToServer) {
      const errorData = classifyError(error);
      logErrorToServer({
        ...errorData,
        componentStack: errorInfo.componentStack
      });
    }
    
    // Callback khi có lỗi
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }
      
      // Default fallback
      return (
        <ErrorDisplay
          error={classifyError(this.state.error)}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Hook để xử lý lỗi trong async function
 * @param {Function} fn - Async function cần xử lý lỗi
 * @param {Object} options - Các tùy chọn
 * @returns {Function} - Wrapped function với xử lý lỗi
 */
export function useAsyncErrorHandler(fn, options = {}) {
  const { handleError } = useError();
  
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, options);
      throw error;
    }
  };
}

/**
 * Error Handling Adapter - Sử dụng cho cả hai giao diện
 */
export default {
  ERROR_TYPES,
  ErrorProvider,
  useError,
  classifyError,
  showErrorNotification,
  logErrorToServer,
  withErrorHandling,
  ErrorDisplay,
  ErrorBoundary,
  useAsyncErrorHandler
};