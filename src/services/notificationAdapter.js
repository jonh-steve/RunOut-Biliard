/**
 * Notification Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa hệ thống thông báo giữa giao diện User và Client
 * Cung cấp interface thống nhất để hiển thị thông báo trong cả hai giao diện
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert as MuiAlert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorHandlingAdapter from './errorHandlingAdapter';

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';

// Các loại thông báo
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Thời gian hiển thị mặc định (ms)
const DEFAULT_AUTO_HIDE_DURATION = 5000;

// Vị trí hiển thị mặc định
const DEFAULT_POSITION = {
  vertical: 'top',
  horizontal: 'right'
};

/**
 * Component Alert cho Material UI
 */
function MuiAlertComponent(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * Component Alert cho Tailwind CSS
 */
function TailwindAlertComponent({ severity, onClose, children, className = '', ...props }) {
  const severityClasses = {
    [NOTIFICATION_TYPES.SUCCESS]: 'bg-green-500',
    [NOTIFICATION_TYPES.ERROR]: 'bg-red-500',
    [NOTIFICATION_TYPES.WARNING]: 'bg-yellow-500',
    [NOTIFICATION_TYPES.INFO]: 'bg-blue-500'
  };
  
  const severityIcons = {
    [NOTIFICATION_TYPES.SUCCESS]: <CheckCircleIcon className="h-5 w-5" />,
    [NOTIFICATION_TYPES.ERROR]: <ErrorIcon className="h-5 w-5" />,
    [NOTIFICATION_TYPES.WARNING]: <WarningIcon className="h-5 w-5" />,
    [NOTIFICATION_TYPES.INFO]: <InfoIcon className="h-5 w-5" />
  };
  
  return (
    <div className={`flex items-center p-4 rounded-md text-white ${severityClasses[severity]} ${className}`} {...props}>
      <div className="flex-shrink-0 mr-2">
        {severityIcons[severity]}
      </div>
      <div className="flex-grow">{children}</div>
      {onClose && (
        <button
          type="button"
          className="flex-shrink-0 ml-2 text-white focus:outline-none"
          onClick={onClose}
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

/**
 * Component Snackbar cho Tailwind CSS
 */
function TailwindSnackbar({
  open,
  autoHideDuration,
  onClose,
  anchorOrigin,
  children,
  className = '',
  ...props
}) {
  const [isVisible, setIsVisible] = useState(open);
  
  useEffect(() => {
    setIsVisible(open);
    
    if (open && autoHideDuration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, autoHideDuration);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [open, autoHideDuration, onClose]);
  
  if (!isVisible) {
    return null;
  }
  
  // Xác định vị trí
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  };
  
  const position = `${anchorOrigin.vertical}-${anchorOrigin.horizontal}`;
  const positionClass = positionClasses[position] || positionClasses['top-right'];
  
  return (
    <div
      className={`fixed z-50 ${positionClass} transition-opacity duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Hiển thị thông báo trong giao diện User (Material UI)
 * @param {Object} options - Các tùy chọn
 * @returns {void}
 */
function showMaterialNotification(options) {
  const {
    message,
    type = NOTIFICATION_TYPES.INFO,
    autoHideDuration = DEFAULT_AUTO_HIDE_DURATION,
    position = DEFAULT_POSITION,
    action = null,
    onClose = null
  } = options;
  
  // Dispatch action để hiển thị thông báo
  const store = window.__REDUX_STORE__;
  if (store) {
    const actionCreators = ReduxNotificationAdapter.getActionCreators();
    store.dispatch(actionCreators.showNotification({
      message,
      type,
      autoHideDuration,
      position,
      action,
      onClose
    }));
  } else {
    console.error('Redux store not found. Make sure to initialize the store before using notifications.');
  }
}

/**
 * Hiển thị thông báo trong giao diện Client (Tailwind CSS)
 * @param {Object} options - Các tùy chọn
 * @returns {void}
 */
function showTailwindNotification(options) {
  const {
    message,
    type = NOTIFICATION_TYPES.INFO,
    autoHideDuration = DEFAULT_AUTO_HIDE_DURATION,
    position = DEFAULT_POSITION,
    action = null,
    onClose = null
  } = options;
  
  // Sử dụng Context API để hiển thị thông báo
  const notificationContext = window.__NOTIFICATION_CONTEXT__;
  if (notificationContext) {
    notificationContext.showNotification({
      message,
      type,
      autoHideDuration,
      position,
      action,
      onClose
    });
  } else {
    console.error('Notification context not found. Make sure to wrap your app with NotificationProvider.');
  }
}

/**
 * Hiển thị thông báo thành công
 * @param {string} message - Nội dung thông báo
 * @param {Object} options - Các tùy chọn
 * @returns {void}
 */
function success(message, options = {}) {
  const notificationOptions = {
    ...options,
    message,
    type: NOTIFICATION_TYPES.SUCCESS
  };
  
  if (isClientInterface) {
    showTailwindNotification(notificationOptions);
  } else {
    showMaterialNotification(notificationOptions);
  }
}

/**
 * Hiển thị thông báo lỗi
 * @param {string} message - Nội dung thông báo
 * @param {Object} options - Các tùy chọn
 * @returns {void}
 */
function error(message, options = {}) {
  const notificationOptions = {
    ...options,
    message,
    type: NOTIFICATION_TYPES.ERROR
  };
  
  if (isClientInterface) {
    showTailwindNotification(notificationOptions);
  } else {
    showMaterialNotification(notificationOptions);
  }
}

/**
 * Hiển thị thông báo cảnh báo
 * @param {string} message - Nội dung thông báo
 * @param {Object} options - Các tùy chọn
 * @returns {void}
 */
function warning(message, options = {}) {
  const notificationOptions = {
    ...options,
    message,
    type: NOTIFICATION_TYPES.WARNING
  };
  
  if (isClientInterface) {
    showTailwindNotification(notificationOptions);
  } else {
    showMaterialNotification(notificationOptions);
  }
}

/**
 * Hiển thị thông báo thông tin
 * @param {string} message - Nội dung thông báo
 * @param {Object} options - Các tùy chọn
 * @returns {void}
 */
function info(message, options = {}) {
  const notificationOptions = {
    ...options,
    message,
    type: NOTIFICATION_TYPES.INFO
  };
  
  if (isClientInterface) {
    showTailwindNotification(notificationOptions);
  } else {
    showMaterialNotification(notificationOptions);
  }
}

/**
 * Xử lý lỗi từ API và hiển thị thông báo
 * @param {Error|Object} error - Lỗi từ API
 * @param {Object} options - Các tùy chọn
 * @returns {void}
 */
function handleApiError(error, options = {}) {
  const errorInfo = ErrorHandlingAdapter.classifyError(error);
  
  // Hiển thị thông báo lỗi
  const message = errorInfo.message || 'Đã xảy ra lỗi';
  
  error(message, {
    autoHideDuration: 7000, // Thời gian hiển thị lâu hơn cho lỗi
    ...options
  });
  
  // Log lỗi
  console.error('API Error:', errorInfo);
  
  return errorInfo;
}

/**
 * Redux Notification Adapter - Sử dụng cho giao diện User
 */
export class ReduxNotificationAdapter {
  /**
   * Tạo các action types cho Redux
   * @returns {Object} - Các action types
   */
  static getActionTypes() {
    return {
      SHOW_NOTIFICATION: 'NOTIFICATION_SHOW',
      HIDE_NOTIFICATION: 'NOTIFICATION_HIDE',
      HIDE_ALL_NOTIFICATIONS: 'NOTIFICATION_HIDE_ALL'
    };
  }

  /**
   * Tạo các action creators cho Redux
   * @returns {Object} - Các action creators
   */
  static getActionCreators() {
    const actionTypes = this.getActionTypes();
    
    return {
      showNotification: (notification) => ({
        type: actionTypes.SHOW_NOTIFICATION,
        payload: {
          id: Date.now(),
          ...notification
        }
      }),
      
      hideNotification: (id) => ({
        type: actionTypes.HIDE_NOTIFICATION,
        payload: id
      }),
      
      hideAllNotifications: () => ({
        type: actionTypes.HIDE_ALL_NOTIFICATIONS
      })
    };
  }

  /**
   * Tạo reducer cho Redux
   * @returns {Function} - Reducer function
   */
  static createReducer() {
    const actionTypes = this.getActionTypes();
    
    const initialState = {
      notifications: []
    };
    
    return (state = initialState, action) => {
      switch (action.type) {
        case actionTypes.SHOW_NOTIFICATION:
          return {
            ...state,
            notifications: [...state.notifications, action.payload]
          };
          
        case actionTypes.HIDE_NOTIFICATION:
          return {
            ...state,
            notifications: state.notifications.filter(
              notification => notification.id !== action.payload
            )
          };
          
        case actionTypes.HIDE_ALL_NOTIFICATIONS:
          return {
            ...state,
            notifications: []
          };
          
        default:
          return state;
      }
    };
  }

  /**
   * Tạo các selectors cho Redux
   * @returns {Object} - Các selectors
   */
  static getSelectors() {
    return {
      getNotifications: (state) => state.notification.notifications
    };
  }
}

/**
 * Component NotificationContainer cho Redux
 */
export function ReduxNotificationContainer() {
  const dispatch = useDispatch();
  const actionCreators = ReduxNotificationAdapter.getActionCreators();
  const selectors = ReduxNotificationAdapter.getSelectors();
  const notifications = useSelector(selectors.getNotifications);
  
  const handleClose = useCallback((id) => {
    dispatch(actionCreators.hideNotification(id));
  }, [dispatch, actionCreators]);
  
  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.autoHideDuration || DEFAULT_AUTO_HIDE_DURATION}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={notification.position || DEFAULT_POSITION}
        >
          <MuiAlertComponent
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            action={notification.action}
          >
            {notification.message}
          </MuiAlertComponent>
        </Snackbar>
      ))}
    </>
  );
}

/**
 * Context API Notification Adapter - Sử dụng cho giao diện Client
 */
export class ContextNotificationAdapter {
  /**
   * Tạo Context cho notification
   * @returns {React.Context} - Notification Context
   */
  static createContext() {
    return createContext({
      notifications: [],
      showNotification: () => {},
      hideNotification: () => {},
      hideAllNotifications: () => {}
    });
  }

  /**
   * Tạo Provider cho notification context
   * @param {React.Context} NotificationContext - Notification context
   * @returns {Function} - Provider component
   */
  static createProvider(NotificationContext) {
    return ({ children }) => {
      const [notifications, setNotifications] = useState([]);
      
      // Hiển thị thông báo
      const showNotification = useCallback((notification) => {
        const id = Date.now();
        
        setNotifications(prev => [
          ...prev,
          {
            id,
            ...notification
          }
        ]);
        
        // Tự động ẩn thông báo sau một khoảng thời gian
        if (notification.autoHideDuration !== 0) {
          const autoHideDuration = notification.autoHideDuration || DEFAULT_AUTO_HIDE_DURATION;
          
          setTimeout(() => {
            hideNotification(id);
          }, autoHideDuration);
        }
        
        return id;
      }, []);
      
      // Ẩn thông báo
      const hideNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      }, []);
      
      // Ẩn tất cả thông báo
      const hideAllNotifications = useCallback(() => {
        setNotifications([]);
      }, []);
      
      // Lưu context vào window để có thể truy cập từ bên ngoài
      useEffect(() => {
        window.__NOTIFICATION_CONTEXT__ = {
          showNotification,
          hideNotification,
          hideAllNotifications
        };
        
        return () => {
          delete window.__NOTIFICATION_CONTEXT__;
        };
      }, [showNotification, hideNotification, hideAllNotifications]);
      
      // Context value
      const value = {
        notifications,
        showNotification,
        hideNotification,
        hideAllNotifications
      };
      
      return (
        <NotificationContext.Provider value={value}>
          {children}
          <NotificationContainer notifications={notifications} onClose={hideNotification} />
        </NotificationContext.Provider>
      );
    };
  }

  /**
   * Tạo hook để sử dụng notification
   * @param {React.Context} NotificationContext - Notification context
   * @returns {Function} - Hook function
   */
  static createHook(NotificationContext) {
    return () => useContext(NotificationContext);
  }
}

/**
 * Component NotificationContainer cho Context API
 */
export function NotificationContainer({ notifications, onClose }) {
  return (
    <>
      {notifications.map((notification) => (
        <TailwindSnackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.autoHideDuration || DEFAULT_AUTO_HIDE_DURATION}
          onClose={() => onClose(notification.id)}
          anchorOrigin={notification.position || DEFAULT_POSITION}
        >
          <TailwindAlertComponent
            severity={notification.type}
            onClose={() => onClose(notification.id)}
          >
            {notification.message}
          </TailwindAlertComponent>
        </TailwindSnackbar>
      ))}
    </>
  );
}

/**
 * Hook để sử dụng notification trong cả hai giao diện
 * @returns {Object} - Notification methods
 */
export function useNotification() {
  if (isClientInterface) {
    // Client interface sử dụng Context API
    const NotificationContext = React.createContext();
    const context = useContext(NotificationContext);
    
    return {
      success: (message, options) => context.showNotification({
        message,
        type: NOTIFICATION_TYPES.SUCCESS,
        ...options
      }),
      
      error: (message, options) => context.showNotification({
        message,
        type: NOTIFICATION_TYPES.ERROR,
        ...options
      }),
      
      warning: (message, options) => context.showNotification({
        message,
        type: NOTIFICATION_TYPES.WARNING,
        ...options
      }),
      
      info: (message, options) => context.showNotification({
        message,
        type: NOTIFICATION_TYPES.INFO,
        ...options
      }),
      
      show: context.showNotification,
      hide: context.hideNotification,
      hideAll: context.hideAllNotifications
    };
  } else {
    // User interface sử dụng Redux
    const dispatch = useDispatch();
    const actionCreators = ReduxNotificationAdapter.getActionCreators();
    
    return {
      success: (message, options) => dispatch(actionCreators.showNotification({
        message,
        type: NOTIFICATION_TYPES.SUCCESS,
        ...options
      })),
      
      error: (message, options) => dispatch(actionCreators.showNotification({
        message,
        type: NOTIFICATION_TYPES.ERROR,
        ...options
      })),
      
      warning: (message, options) => dispatch(actionCreators.showNotification({
        message,
        type: NOTIFICATION_TYPES.WARNING,
        ...options
      })),
      
      info: (message, options) => dispatch(actionCreators.showNotification({
        message,
        type: NOTIFICATION_TYPES.INFO,
        ...options
      })),
      
      show: (options) => dispatch(actionCreators.showNotification(options)),
      hide: (id) => dispatch(actionCreators.hideNotification(id)),
      hideAll: () => dispatch(actionCreators.hideAllNotifications())
    };
  }
}

/**
 * HOC để thêm notification vào component
 * @param {React.Component} Component - Component cần wrap
 * @returns {React.Component} - Wrapped component
 */
export function withNotification(Component) {
  return (props) => {
    const notification = useNotification();
    return <Component {...props} notification={notification} />;
  };
}

/**
 * Notification Adapter - Sử dụng cho cả hai giao diện
 */
export default {
  // Các phương thức chính
  success,
  error,
  warning,
  info,
  handleApiError,
  
  // Các constants
  NOTIFICATION_TYPES,
  DEFAULT_AUTO_HIDE_DURATION,
  DEFAULT_POSITION,
  
  // Các components
  MuiAlertComponent,
  TailwindAlertComponent,
  TailwindSnackbar,
  ReduxNotificationContainer,
  NotificationContainer,
  
  // Các hooks và HOCs
  useNotification,
  withNotification,
  
  // Adapter classes
  ReduxNotificationAdapter,
  ContextNotificationAdapter
};