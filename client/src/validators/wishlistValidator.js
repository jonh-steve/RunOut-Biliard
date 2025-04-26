/**
 * Frontend Wishlist Validator
 * Các hàm kiểm tra dữ liệu danh sách yêu thích ở phía client
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
 * Kiểm tra form thêm vào danh sách yêu thích
 * @param {Object} formData - Dữ liệu form thêm vào danh sách yêu thích
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateAddToWishlistForm = (formData) => {
  const errors = {};
  
  const productIdResult = validateProductId(formData.productId);
  if (productIdResult !== true) errors.productId = productIdResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form xóa khỏi danh sách yêu thích
 * @param {Object} formData - Dữ liệu form xóa khỏi danh sách yêu thích
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateRemoveFromWishlistForm = (formData) => {
  const errors = {};
  
  const productIdResult = validateProductId(formData.productId);
  if (productIdResult !== true) errors.productId = productIdResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};