import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

/**
 * Custom hook để sử dụng NotificationContext
 * 
 * @returns {Object} Notification context value
 * @property {Array} notifications - Danh sách các thông báo
 * @property {Function} addNotification - Hàm thêm thông báo mới
 * @property {Function} addSuccessNotification - Hàm thêm thông báo thành công
 * @property {Function} addErrorNotification - Hàm thêm thông báo lỗi
 * @property {Function} addWarningNotification - Hàm thêm thông báo cảnh báo
 * @property {Function} addInfoNotification - Hàm thêm thông báo thông tin
 * @property {Function} removeNotification - Hàm xóa thông báo
 * @property {Function} clearAllNotifications - Hàm xóa tất cả thông báo
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};