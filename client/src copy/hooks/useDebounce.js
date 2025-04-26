import { useState, useEffect } from 'react';

/**
 * Custom hook để debounce giá trị
 * @param {*} value - Giá trị cần debounce
 * @param {number} delay - Thời gian delay (ms)
 * @returns {*} - Giá trị đã debounce
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Tạo timeout để cập nhật giá trị sau delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: hủy timeout nếu value hoặc delay thay đổi
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;