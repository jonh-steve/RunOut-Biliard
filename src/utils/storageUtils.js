/**
 * Lưu dữ liệu vào localStorage
 * @param {string} key - Khóa lưu trữ
 * @param {*} value - Giá trị cần lưu
 */
export const setLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Lấy dữ liệu từ localStorage
 * @param {string} key - Khóa lưu trữ
 * @param {*} defaultValue - Giá trị mặc định nếu không tìm thấy
 * @returns {*} - Giá trị đã lưu hoặc giá trị mặc định
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Xóa dữ liệu từ localStorage
 * @param {string} key - Khóa lưu trữ
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Xóa tất cả dữ liệu từ localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Lưu dữ liệu vào sessionStorage
 * @param {string} key - Khóa lưu trữ
 * @param {*} value - Giá trị cần lưu
 */
export const setSessionStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to sessionStorage:', error);
  }
};

/**
 * Lấy dữ liệu từ sessionStorage
 * @param {string} key - Khóa lưu trữ
 * @param {*} defaultValue - Giá trị mặc định nếu không tìm thấy
 * @returns {*} - Giá trị đã lưu hoặc giá trị mặc định
 */
export const getSessionStorage = (key, defaultValue = null) => {
  try {
    const serializedValue = sessionStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return defaultValue;
  }
};

/**
 * Xóa dữ liệu từ sessionStorage
 * @param {string} key - Khóa lưu trữ
 */
export const removeSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from sessionStorage:', error);
  }
};

/**
 * Xóa tất cả dữ liệu từ sessionStorage
 */
export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
};