import React, { createContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Tạo context
export const NotificationContext = createContext(null);

/**
 * NotificationProvider component
 * 
 * Cung cấp context cho việc quản lý trạng thái thông báo trong toàn bộ ứng dụng.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} NotificationProvider component
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  /**
   * Thêm thông báo mới
   * @param {Object} notification - Thông tin thông báo
   * @param {string} notification.type - Loại thông báo (success, error, warning, info)
   * @param {string} notification.message - Nội dung thông báo
   * @param {string} notification.title - Tiêu đề thông báo (optional)
   * @param {number} notification.duration - Thời gian hiển thị (ms, mặc định: 5000)
   * @returns {string} ID của thông báo
   */
  const addNotification = useCallback(({ type = 'info', message, title, duration = 5000 }) => {
    const id = uuidv4();
    
    const newNotification = {
      id,
      type,
      message,
      title,
      duration,
      createdAt: new Date(),
    };
    
    setNotifications((prev) => [...prev, newNotification]);
    
    // Tự động xóa thông báo sau duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);
  
  /**
   * Thêm thông báo thành công
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề thông báo (optional)
   * @param {number} duration - Thời gian hiển thị (ms, mặc định: 5000)
   * @returns {string} ID của thông báo
   */
  const addSuccessNotification = useCallback((message, title = 'Thành công', duration = 5000) => {
    return addNotification({ type: 'success', message, title, duration });
  }, [addNotification]);
  
  /**
   * Thêm thông báo lỗi
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề thông báo (optional)
   * @param {number} duration - Thời gian hiển thị (ms, mặc định: 5000)
   * @returns {string} ID của thông báo
   */
  const addErrorNotification = useCallback((message, title = 'Lỗi', duration = 5000) => {
    return addNotification({ type: 'error', message, title, duration });
  }, [addNotification]);
  
  /**
   * Thêm thông báo cảnh báo
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề thông báo (optional)
   * @param {number} duration - Thời gian hiển thị (ms, mặc định: 5000)
   * @returns {string} ID của thông báo
   */
  const addWarningNotification = useCallback((message, title = 'Cảnh báo', duration = 5000) => {
    return addNotification({ type: 'warning', message, title, duration });
  }, [addNotification]);
  
  /**
   * Thêm thông báo thông tin
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề thông báo (optional)
   * @param {number} duration - Thời gian hiển thị (ms, mặc định: 5000)
   * @returns {string} ID của thông báo
   */
  const addInfoNotification = useCallback((message, title = 'Thông tin', duration = 5000) => {
    return addNotification({ type: 'info', message, title, duration });
  }, [addNotification]);
  
  /**
   * Xóa thông báo
   * @param {string} id - ID của thông báo cần xóa
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);
  
  /**
   * Xóa tất cả thông báo
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // Giá trị context
  const value = {
    notifications,
    addNotification,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
    removeNotification,
    clearAllNotifications,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};