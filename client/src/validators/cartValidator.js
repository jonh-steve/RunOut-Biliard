/**
 * Frontend Cart Validator
 * Các hàm kiểm tra dữ liệu giỏ hàng ở phía client
 */

/**
 * Kiểm tra ID sản phẩm hợp lệ
 * @param {string} productId - ID sản phẩm cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateProductId = (productId) => {
  if (!productId || productId.trim() === '') 
    return 'ID sản phẩm không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(productId)) 
    return 'ID sản phẩm không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra số lượng sản phẩm hợp lệ
 * @param {number|string} quantity - Số lượng cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateQuantity = (quantity) => {
  if (quantity === undefined || quantity === null || quantity === '') 
    return 'Số lượng không được để trống';
  
  const numQuantity = Number(quantity);
  
  if (isNaN(numQuantity) || !Number.isInteger(numQuantity)) 
    return 'Số lượng phải là số nguyên';
  
  if (numQuantity < 1) 
    return 'Số lượng phải lớn hơn 0';
  
  return true;
};

/**
 * Kiểm tra ID mục giỏ hàng hợp lệ
 * @param {string} itemId - ID mục giỏ hàng cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCartItemId = (itemId) => {
  if (!itemId || itemId.trim() === '') 
    return 'ID mục giỏ hàng không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(itemId)) 
    return 'ID mục giỏ hàng không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra mã giảm giá hợp lệ
 * @param {string} couponCode - Mã giảm giá cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateCouponCode = (couponCode) => {
  if (!couponCode || couponCode.trim() === '') 
    return 'Mã giảm giá không được để trống';
  
  if (couponCode.length < 3 || couponCode.length > 30) 
    return 'Mã giảm giá không h���p lệ';
  
  return true;
};

/**
 * Kiểm tra form thêm vào giỏ hàng
 * @param {Object} formData - Dữ liệu form thêm vào giỏ hàng
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAddToCartForm = (formData) => {
  const errors = {};
  
  const productIdResult = validateProductId(formData.productId);
  if (productIdResult !== true) errors.productId = productIdResult;
  
  const quantityResult = validateQuantity(formData.quantity);
  if (quantityResult !== true) errors.quantity = quantityResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cập nhật mục giỏ hàng
 * @param {Object} formData - Dữ liệu form cập nhật giỏ hàng
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateUpdateCartItemForm = (formData) => {
  const errors = {};
  
  const itemIdResult = validateCartItemId(formData.itemId);
  if (itemIdResult !== true) errors.itemId = itemIdResult;
  
  const quantityResult = validateQuantity(formData.quantity);
  if (quantityResult !== true) errors.quantity = quantityResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form xóa khỏi giỏ hàng
 * @param {Object} formData - Dữ liệu form xóa khỏi giỏ hàng
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateRemoveFromCartForm = (formData) => {
  const errors = {};
  
  const itemIdResult = validateCartItemId(formData.itemId);
  if (itemIdResult !== true) errors.itemId = itemIdResult;
  
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
  
  const couponCodeResult = validateCouponCode(formData.couponCode);
  if (couponCodeResult !== true) errors.couponCode = couponCodeResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};