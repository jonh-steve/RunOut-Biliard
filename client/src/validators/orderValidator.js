/**
 * Frontend Order Validator
 * Các hàm kiểm tra dữ liệu đơn hàng ở phía client
 */

/**
 * Kiểm tra sản phẩm trong đơn hàng hợp lệ
 * @param {Array} products - Mảng sản phẩm cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateOrderProducts = (products) => {
  if (!products || !Array.isArray(products)) 
    return 'Sản phẩm phải là một mảng';
  
  if (products.length === 0) 
    return 'Đơn hàng phải có ít nhất một sản phẩm';
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    if (!product.product) 
      return `Sản phẩm thứ ${i + 1} không có ID`;
    
    if (!product.count || product.count <= 0) 
      return `Số lượng sản phẩm thứ ${i + 1} phải lớn hơn 0`;
  }
  
  return true;
};

/**
 * Kiểm tra địa chỉ giao hàng hợp lệ
 * @param {string} address - Địa chỉ cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateOrderAddress = (address) => {
  if (!address || address.trim() === '') 
    return 'Địa chỉ giao hàng không được để trống';
  
  if (address.length < 10) 
    return 'Địa chỉ giao hàng phải có ít nhất 10 ký tự';
  
  return true;
};

/**
 * Kiểm tra phương thức thanh toán hợp lệ
 * @param {string} paymentMethod - Phương thức thanh toán cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validatePaymentMethod = (paymentMethod) => {
  if (!paymentMethod || paymentMethod.trim() === '') 
    return 'Phương thức thanh toán không được để trống';
  
  const validMethods = ['COD', 'CREDIT_CARD', 'PAYPAL', 'MOMO'];
  if (!validMethods.includes(paymentMethod)) 
    return 'Phương thức thanh toán không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra tổng giá trị đơn hàng hợp lệ
 * @param {number|string} totalPrice - Tổng giá trị cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateTotalPrice = (totalPrice) => {
  if (totalPrice === undefined || totalPrice === null || totalPrice === '') 
    return 'Tổng giá trị đơn hàng không được để trống';
  
  const numPrice = Number(totalPrice);
  
  if (isNaN(numPrice)) 
    return 'Tổng giá trị đơn hàng phải là số';
  
  if (numPrice <= 0) 
    return 'Tổng giá trị đơn hàng phải lớn hơn 0';
  
  return true;
};

/**
 * Kiểm tra trạng thái đơn hàng hợp lệ
 * @param {string} status - Trạng thái đơn hàng cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateOrderStatus = (status) => {
  if (!status || status.trim() === '') 
    return 'Trạng thái đơn hàng không được để trống';
  
  const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) 
    return 'Trạng thái đơn hàng không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra form tạo đơn hàng
 * @param {Object} formData - Dữ liệu form đơn hàng
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateOrderForm = (formData) => {
  const errors = {};
  
  const productsResult = validateOrderProducts(formData.products);
  if (productsResult !== true) errors.products = productsResult;
  
  const addressResult = validateOrderAddress(formData.address);
  if (addressResult !== true) errors.address = addressResult;
  
  const paymentMethodResult = validatePaymentMethod(formData.paymentMethod);
  if (paymentMethodResult !== true) errors.paymentMethod = paymentMethodResult;
  
  const totalPriceResult = validateTotalPrice(formData.totalPrice);
  if (totalPriceResult !== true) errors.totalPrice = totalPriceResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cập nhật trạng thái đơn hàng
 * @param {Object} formData - Dữ liệu form cập nhật trạng thái
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateUpdateOrderStatusForm = (formData) => {
  const errors = {};
  
  const statusResult = validateOrderStatus(formData.status);
  if (statusResult !== true) errors.status = statusResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};