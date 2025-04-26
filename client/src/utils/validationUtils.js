/**
 * Validation Utils
 * Các hàm tiện ích để hỗ trợ validation
 */

/**
 * Kiểm tra email hợp lệ
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} - true nếu email hợp lệ
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra số điện thoại Việt Nam hợp lệ
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean} - true nếu số điện thoại hợp lệ
 */
export const isValidVietnamesePhone = (phone) => {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};

/**
 * Kiểm tra URL hợp lệ
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean} - true nếu URL hợp lệ
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Kiểm tra mật khẩu mạnh
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {boolean} - true nếu mật khẩu đủ mạnh
 */
export const isStrongPassword = (password) => {
  // Ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Kiểm tra mật khẩu trung bình
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {boolean} - true nếu mật khẩu đủ mạnh
 */
export const isMediumPassword = (password) => {
  // Ít nhất 6 ký tự, có chữ hoa và số
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};

/**
 * Kiểm tra MongoDB ObjectId hợp lệ
 * @param {string} id - ID cần kiểm tra
 * @returns {boolean} - true nếu ID hợp lệ
 */
export const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Kiểm tra chuỗi chỉ chứa chữ cái và số
 * @param {string} str - Chuỗi cần kiểm tra
 * @returns {boolean} - true nếu chuỗi hợp lệ
 */
export const isAlphanumeric = (str) => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(str);
};

/**
 * Kiểm tra chuỗi chỉ chứa chữ cái
 * @param {string} str - Chuỗi cần kiểm tra
 * @returns {boolean} - true nếu chuỗi hợp lệ
 */
export const isAlphabetic = (str) => {
  const alphabeticRegex = /^[a-zA-Z]+$/;
  return alphabeticRegex.test(str);
};

/**
 * Kiểm tra chuỗi chỉ chứa số
 * @param {string} str - Chuỗi cần kiểm tra
 * @returns {boolean} - true nếu chuỗi hợp lệ
 */
export const isNumeric = (str) => {
  const numericRegex = /^[0-9]+$/;
  return numericRegex.test(str);
};

/**
 * Kiểm tra chuỗi là số thập phân hợp lệ
 * @param {string} str - Chuỗi cần kiểm tra
 * @returns {boolean} - true nếu chuỗi hợp lệ
 */
export const isDecimal = (str) => {
  const decimalRegex = /^[0-9]+(\.[0-9]+)?$/;
  return decimalRegex.test(str);
};

/**
 * Kiểm tra ngày hợp lệ
 * @param {string|Date} date - Ngày cần kiểm tra
 * @returns {boolean} - true nếu ngày hợp lệ
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  const d = new Date(date);
  return !isNaN(d.getTime());
};

/**
 * Kiểm tra ngày trong tương lai
 * @param {string|Date} date - Ngày cần kiểm tra
 * @returns {boolean} - true nếu ngày trong tương lai
 */
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  
  const d = new Date(date);
  const now = new Date();
  
  return d > now;
};

/**
 * Kiểm tra ngày trong quá khứ
 * @param {string|Date} date - Ngày cần kiểm tra
 * @returns {boolean} - true nếu ngày trong quá khứ
 */
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  
  const d = new Date(date);
  const now = new Date();
  
  return d < now;
};

/**
 * Kiểm tra độ tuổi hợp lệ
 * @param {string|Date} birthDate - Ngày sinh cần kiểm tra
 * @param {number} minAge - Tuổi tối thiểu
 * @returns {boolean} - true nếu tuổi hợp lệ
 */
export const isValidAge = (birthDate, minAge = 18) => {
  if (!isValidDate(birthDate)) return false;
  
  const d = new Date(birthDate);
  const now = new Date();
  
  const age = now.getFullYear() - d.getFullYear();
  const monthDiff = now.getMonth() - d.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < d.getDate())) {
    return age - 1 >= minAge;
  }
  
  return age >= minAge;
};

/**
 * Kiểm tra mã màu hex hợp lệ
 * @param {string} color - Mã màu cần kiểm tra
 * @returns {boolean} - true nếu mã màu hợp lệ
 */
export const isValidHexColor = (color) => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
};

/**
 * Kiểm tra mã zip code Việt Nam hợp lệ
 * @param {string} zipCode - Mã zip code cần kiểm tra
 * @returns {boolean} - true nếu mã zip code hợp lệ
 */
export const isValidVietnameseZipCode = (zipCode) => {
  // Zip code Việt Nam có 6 chữ số
  const zipCodeRegex = /^\d{6}$/;
  return zipCodeRegex.test(zipCode);
};

/**
 * Kiểm tra mã số thuế Việt Nam hợp lệ
 * @param {string} taxCode - Mã số thuế cần kiểm tra
 * @returns {boolean} - true nếu mã số thuế hợp lệ
 */
export const isValidVietnameseTaxCode = (taxCode) => {
  // Mã số thuế Việt Nam có 10 hoặc 13 chữ số
  const taxCodeRegex = /^\d{10}(\d{3})?$/;
  return taxCodeRegex.test(taxCode);
};

/**
 * Kiểm tra CMND/CCCD Việt Nam hợp lệ
 * @param {string} idCard - CMND/CCCD cần kiểm tra
 * @returns {boolean} - true nếu CMND/CCCD hợp lệ
 */
export const isValidVietnameseIdCard = (idCard) => {
  // CMND có 9 hoặc 12 chữ số, CCCD có 12 chữ số
  const idCardRegex = /^(\d{9}|\d{12})$/;
  return idCardRegex.test(idCard);
};

/**
 * Tạo đối tượng lỗi từ mảng lỗi API
 * @param {Array} errors - Mảng lỗi từ API
 * @returns {Object} - Đối tượng lỗi
 */
export const formatApiErrors = (errors) => {
  if (!Array.isArray(errors)) return {};
  
  return errors.reduce((acc, error) => {
    if (error.param) {
      acc[error.param] = error.msg;
    }
    return acc;
  }, {});
};

/**
 * Kiểm tra form có lỗi không
 * @param {Object} errors - Đối tượng lỗi
 * @returns {boolean} - true nếu form có lỗi
 */
export const hasFormErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Lấy thông báo lỗi đầu tiên
 * @param {Object} errors - Đối tượng lỗi
 * @returns {string} - Thông báo lỗi đầu tiên
 */
export const getFirstErrorMessage = (errors) => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : '';
};