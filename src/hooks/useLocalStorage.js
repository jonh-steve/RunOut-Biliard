import { useState, useEffect } from 'react';

/**
 * Custom hook để làm việc với localStorage
 * @param {string} key - Khóa lưu trữ
 * @param {*} initialValue - Giá trị ban đầu
 * @returns {Array} - [storedValue, setValue, removeValue]
 */
const useLocalStorage = (key, initialValue) => {
  // Hàm để lấy giá trị ban đầu từ localStorage hoặc sử dụng initialValue
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State để lưu trữ giá trị hiện tại
  const [storedValue, setStoredValue] = useState(readValue);

  // Hàm để cập nhật giá trị trong state và localStorage
  const setValue = value => {
    try {
      // Cho phép value là một function như useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Lưu vào state
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Hàm để xóa giá trị khỏi localStorage
  const removeValue = () => {
    try {
      // Xóa khỏi localStorage
      window.localStorage.removeItem(key);
      
      // Đặt state về giá trị ban đầu
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Lắng nghe sự thay đổi từ các tab/window khác
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };
    
    // Đăng ký event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;