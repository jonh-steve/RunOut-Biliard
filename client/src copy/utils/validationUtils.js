/**
 * Kiểm tra email hợp lệ
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} - Kết quả kiểm tra
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra số điện thoại Việt Nam hợp lệ
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean} - Kết quả kiểm tra
 */
export const isValidVietnamesePhone = (phone) => {
  if (!phone) return false;
  
  // Xóa tất cả ký tự không phải số
  const cleaned = phone.replace(/\D/g, '');
  
  // Kiểm tra số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return true;
  }
  
  // Kiểm tra số điện thoại Việt Nam có mã quốc gia (11 số, bắt đầu bằng 84)
  if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return true;
  }
  
  return false;
};

/**
 * Kiểm tra mật khẩu mạnh
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {Object} - Kết quả kiểm tra và lý do
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, reason: 'Mật khẩu không được để trống' };
  }
  
  if (password.length < 8) {
    return { isValid: false, reason: 'Mật khẩu phải có ít nhất 8 ký tự' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, reason: 'Mật khẩu phải có ít nhất 1 chữ hoa' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, reason: 'Mật khẩu phải có ít nhất 1 chữ thường' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, reason: 'Mật khẩu phải có ít nhất 1 chữ số' };
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, reason: 'Mật khẩu phải có ít nhất 1 ký tự ��ặc biệt' };
  }
  
  return { isValid: true, reason: '' };
};

/**
 * Kiểm tra URL hợp lệ
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean} - Kết quả kiểm tra
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Kiểm tra chuỗi chỉ chứa chữ cái và khoảng trắng
 * @param {string} text - Chuỗi cần kiểm tra
 * @returns {boolean} - Kết quả kiểm tra
 */
export const isAlphaOnly = (text) => {
  if (!text) return false;
  
  const alphaRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
  return alphaRegex.test(text);
};

/**
 * Kiểm tra chuỗi chỉ chứa chữ số
 * @param {string} text - Chuỗi cần kiểm tra
 * @returns {boolean} - Kết quả kiểm tra
 */
export const isNumericOnly = (text) => {
  if (!text) return false;
  
  const numericRegex = /^[0-9]+$/;
  return numericRegex.test(text);
};