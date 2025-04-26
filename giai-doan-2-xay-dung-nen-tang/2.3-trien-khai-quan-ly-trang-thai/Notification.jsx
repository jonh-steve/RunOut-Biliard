import React from 'react';
import { useNotification } from './useNotification';
import Alert from '../../components/common/Alert/Alert.client';

/**
 * NotificationContainer component
 * 
 * Hiển thị tất cả các thông báo từ NotificationContext.
 * 
 * @returns {React.ReactElement} NotificationContainer component
 */
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

/**
 * Notification component
 * 
 * Hiển thị một thông báo.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.notification - Thông tin thông báo
 * @param {Function} props.onClose - Hàm xử lý khi đóng thông báo
 * @returns {React.ReactElement} Notification component
 */
const Notification = ({ notification, onClose }) => {
  const { id, type, title, message } = notification;
  
  return (
    <div
      className="animate-slide-in"
      style={{
        animation: 'slideIn 0.3s ease-out forwards',
      }}
    >
      <Alert
        severity={type}
        title={title}
        closable
        onClose={onClose}
      >
        {message}
      </Alert>
    </div>
  );
};

export default NotificationContainer;

// CSS Animation
const slideInAnimation = `
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

.animate-slide-out {
  animation: slideOut 0.3s ease-in forwards;
}
`;

// Thêm CSS animation vào document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = slideInAnimation;
  document.head.appendChild(style);
}