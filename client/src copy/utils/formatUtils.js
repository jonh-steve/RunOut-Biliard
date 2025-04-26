/**
 * Định dạng số tiền thành chuỗi tiền tệ
 * @param {number} amount - Số tiền cần định dạng
 * @param {string} currency - Loại tiền tệ (mặc định: 'VND')
 * @param {string} locale - Locale để định dạng (mặc định: 'vi-VN')
 * @returns {string} - Chuỗi tiền tệ đã định dạng
 */
export const formatCurrency = (amount, currency = 'VND', locale = 'vi-VN') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Định dạng ngày tháng
 * @param {Date|string|number} date - Ngày cần định dạng
 * @param {string} format - Định dạng (short, medium, long, full)
 * @param {string} locale - Locale để định dạng (mặc định: 'vi-VN')
 * @returns {string} - Chuỗi ngày tháng đã định dạng
 */
export const formatDate = (date, format = 'medium', locale = 'vi-VN') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    long: { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    full: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' },
  };
  
  return new Intl.DateTimeFormat(locale, options[format]).format(dateObj);
};

/**
 * Rút gọn văn bản nếu quá dài
 * @param {string} text - Văn bản cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Văn bản đã rút gọn
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Định dạng số điện thoại
 * @param {string} phoneNumber - Số điện thoại cần định dạng
 * @returns {string} - Số điện thoại đã định dạng
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Xóa tất cả ký tự không phải số
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Định dạng số điện thoại Việt Nam: 0xxx xxx xxx
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  // Định dạng số điện thoại Việt Nam có mã quốc gia: +84 xxx xxx xxx
  if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return '+84 ' + cleaned.substring(2).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phoneNumber;
};