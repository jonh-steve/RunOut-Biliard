/**
 * Frontend Coupon Validator
 * Các hàm kiểm tra dữ liệu mã giảm giá ở phía client
 */

/**
 * Kiểm tra tên mã giảm giá hợp lệ
 * @param {string} name - Tên mã giảm giá cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCouponName = (name) => {
  if (!name || name.trim() === '') 
    return 'Tên mã giảm giá không được để trống';
  
  if (name.length < 3 || name.length > 30) 
    return 'Tên mã giảm giá phải có từ 3 đến 30 ký tự';
  
  const nameRegex = /^[A-Z0-9_]+$/;
  if (!nameRegex.test(name)) 
    return 'Tên mã giảm giá chỉ được chứa chữ hoa, số và dấu gạch dưới';
  
  return true;
};

/**
 * Kiểm tra giá trị giảm giá hợp lệ
 * @param {number|string} discount - Giá trị giảm giá cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCouponDiscount = (discount) => {
  if (discount === undefined || discount === null || discount === '') 
    return 'Giá trị giảm giá không được để trống';
  
  const numDiscount = Number(discount);
  
  if (isNaN(numDiscount)) 
    return 'Giá trị giảm giá phải là số';
  
  if (numDiscount < 1 || numDiscount > 99) 
    return 'Giá trị giảm giá phải từ 1% đến 99%';
  
  return true;
};

/**
 * Kiểm tra ngày hết hạn hợp lệ
 * @param {string|Date} expiry - Ngày hết hạn cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCouponExpiry = (expiry) => {
  if (!expiry) 
    return 'Ngày hết hạn không được để trống';
  
  let expiryDate;
  
  if (expiry instanceof Date) {
    expiryDate = expiry;
  } else {
    expiryDate = new Date(expiry);
  }
  
  if (isNaN(expiryDate.getTime())) 
    return 'Ngày hết hạn không hợp lệ';
  
  const currentDate = new Date();
  if (expiryDate <= currentDate) 
    return 'Ngày hết hạn phải lớn hơn ngày hiện tại';
  
  return true;
};

/**
 * Kiểm tra giá trị đơn hàng tối thiểu hợp lệ
 * @param {number|string} minOrderAmount - Giá trị đơn hàng tối thiểu cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateMinOrderAmount = (minOrderAmount) => {
  if (!minOrderAmount) return true; // Không bắt buộc
  
  const numAmount = Number(minOrderAmount);
  
  if (isNaN(numAmount)) 
    return 'Giá trị đơn hàng tối thiểu phải là số';
  
  if (numAmount < 0) 
    return 'Giá trị đơn hàng tối thiểu không được âm';
  
  return true;
};

/**
 * Kiểm tra số lần sử dụng tối đa hợp lệ
 * @param {number|string} maxUsage - Số lần sử dụng tối đa cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateMaxUsage = (maxUsage) => {
  if (!maxUsage) return true; // Không bắt buộc
  
  const numUsage = Number(maxUsage);
  
  if (isNaN(numUsage) || !Number.isInteger(numUsage)) 
    return 'Số lần sử dụng tối đa phải là số nguyên';
  
  if (numUsage < 1) 
    return 'Số lần sử dụng tối đa phải lớn hơn 0';
  
  return true;
};

/**
 * Kiểm tra form tạo/cập nhật mã giảm giá
 * @param {Object} formData - Dữ liệu form mã giảm giá
 * @param {boolean} isUpdate - Có phải đang cập nhật không (nếu true, một số trường có thể không bắt buộc)
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateCouponForm = (formData, isUpdate = false) => {
  const errors = {};
  
  // Nếu đang cập nhật, chỉ kiểm tra các trường được cung cấp
  if (isUpdate) {
    if (formData.name !== undefined) {
      const nameResult = validateCouponName(formData.name);
      if (nameResult !== true) errors.name = nameResult;
    }
    
    if (formData.discount !== undefined) {
      const discountResult = validateCouponDiscount(formData.discount);
      if (discountResult !== true) errors.discount = discountResult;
    }
    
    if (formData.expiry !== undefined) {
      const expiryResult = validateCouponExpiry(formData.expiry);
      if (expiryResult !== true) errors.expiry = expiryResult;
    }
    
    if (formData.minOrderAmount !== undefined) {
      const minOrderResult = validateMinOrderAmount(formData.minOrderAmount);
      if (minOrderResult !== true) errors.minOrderAmount = minOrderResult;
    }
    
    if (formData.maxUsage !== undefined) {
      const maxUsageResult = validateMaxUsage(formData.maxUsage);
      if (maxUsageResult !== true) errors.maxUsage = maxUsageResult;
    }
  } else {
    // Nếu đang tạo mới, kiểm tra tất cả các trường bắt buộc
    const nameResult = validateCouponName(formData.name);
    if (nameResult !== true) errors.name = nameResult;
    
    const discountResult = validateCouponDiscount(formData.discount);
    if (discountResult !== true) errors.discount = discountResult;
    
    const expiryResult = validateCouponExpiry(formData.expiry);
    if (expiryResult !== true) errors.expiry = expiryResult;
    
    if (formData.minOrderAmount !== undefined) {
      const minOrderResult = validateMinOrderAmount(formData.minOrderAmount);
      if (minOrderResult !== true) errors.minOrderAmount = minOrderResult;
    }
    
    if (formData.maxUsage !== undefined) {
      const maxUsageResult = validateMaxUsage(formData.maxUsage);
      if (maxUsageResult !== true) errors.maxUsage = maxUsageResult;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form áp dụng mã giảm giá
 * @param {Object} formData - Dữ liệu form áp dụng mã giảm giá
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateApplyCouponForm = (formData) => {
  const errors = {};
  
  if (!formData.couponCode || formData.couponCode.trim() === '') {
    errors.couponCode = 'Mã giảm giá không được để trống';
  }
  
  if (!formData.cartItems || !Array.isArray(formData.cartItems) || formData.cartItems.length === 0) {
    errors.cartItems = 'Giỏ hàng phải có ít nhất một sản phẩm';
  }
  
  if (formData.totalAmount === undefined || formData.totalAmount === null) {
    errors.totalAmount = 'Tổng giá trị đơn hàng không được để trống';
  } else {
    const numAmount = Number(formData.totalAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      errors.totalAmount = 'Tổng giá trị đơn hàng phải lớn hơn 0';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};