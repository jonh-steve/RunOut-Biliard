/**
 * Frontend Payment Validator
 * Các hàm kiểm tra dữ liệu thanh toán ở phía client
 */

/**
 * Kiểm tra ID đơn hàng hợp lệ
 * @param {string} orderId - ID đơn hàng cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateOrderId = (orderId) => {
  if (!orderId || orderId.trim() === '') 
    return 'ID đơn hàng không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(orderId)) 
    return 'ID đơn hàng không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra số tiền thanh toán hợp lệ
 * @param {number|string} amount - Số tiền cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validatePaymentAmount = (amount) => {
  if (amount === undefined || amount === null || amount === '') 
    return 'Số tiền thanh toán không được để trống';
  
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) 
    return 'Số tiền thanh toán phải là số';
  
  if (numAmount <= 0) 
    return 'Số tiền thanh toán phải lớn hơn 0';
  
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
  
  const validMethods = ['COD', 'CREDIT_CARD', 'PAYPAL', 'MOMO', 'BANK_TRANSFER'];
  if (!validMethods.includes(paymentMethod)) 
    return 'Phương thức thanh toán không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra trạng thái thanh toán hợp lệ
 * @param {string} status - Trạng thái thanh toán cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validatePaymentStatus = (status) => {
  if (!status || status.trim() === '') 
    return 'Trạng thái thanh toán không được để trống';
  
  const validStatuses = ['Pending', 'Completed', 'Failed', 'Refunded'];
  if (!validStatuses.includes(status)) 
    return 'Trạng thái thanh toán không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra ID thanh toán hợp lệ
 * @param {string} paymentId - ID thanh toán cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validatePaymentId = (paymentId) => {
  if (!paymentId || paymentId.trim() === '') 
    return 'ID thanh toán không được để trống';
  
  // Kiểm tra định dạng MongoDB ObjectId
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(paymentId)) 
    return 'ID thanh toán không hợp lệ';
  
  return true;
};

/**
 * Kiểm tra ID giao dịch hợp lệ
 * @param {string} transactionId - ID giao dịch cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateTransactionId = (transactionId) => {
  if (!transactionId || transactionId.trim() === '') 
    return 'ID giao dịch không được để trống';
  
  return true;
};

/**
 * Kiểm tra lý do hoàn tiền hợp lệ
 * @param {string} reason - Lý do hoàn tiền cần kiểm tra
 * @returns {boolean|string} - true nếu hợp lệ, chuỗi lỗi nếu không hợp lệ
 */
export const validateRefundReason = (reason) => {
  if (!reason || reason.trim() === '') 
    return 'Lý do hoàn tiền không được để trống';
  
  if (reason.length < 10) 
    return 'Lý do hoàn tiền phải có ít nhất 10 ký tự';
  
  return true;
};

/**
 * Kiểm tra form tạo thanh toán
 * @param {Object} formData - Dữ liệu form thanh toán
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateCreatePaymentForm = (formData) => {
  const errors = {};
  
  const orderIdResult = validateOrderId(formData.orderId);
  if (orderIdResult !== true) errors.orderId = orderIdResult;
  
  const amountResult = validatePaymentAmount(formData.amount);
  if (amountResult !== true) errors.amount = amountResult;
  
  const paymentMethodResult = validatePaymentMethod(formData.paymentMethod);
  if (paymentMethodResult !== true) errors.paymentMethod = paymentMethodResult;
  
  if (formData.status !== undefined) {
    const statusResult = validatePaymentStatus(formData.status);
    if (statusResult !== true) errors.status = statusResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form cập nhật trạng thái thanh toán
 * @param {Object} formData - Dữ liệu form cập nhật thanh toán
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateUpdatePaymentForm = (formData) => {
  const errors = {};
  
  const statusResult = validatePaymentStatus(formData.status);
  if (statusResult !== true) errors.status = statusResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form xác minh thanh toán
 * @param {Object} formData - Dữ liệu form xác minh thanh toán
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateVerifyPaymentForm = (formData) => {
  const errors = {};
  
  const paymentIdResult = validatePaymentId(formData.paymentId);
  if (paymentIdResult !== true) errors.paymentId = paymentIdResult;
  
  const transactionIdResult = validateTransactionId(formData.transactionId);
  if (transactionIdResult !== true) errors.transactionId = transactionIdResult;
  
  const amountResult = validatePaymentAmount(formData.amount);
  if (amountResult !== true) errors.amount = amountResult;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Kiểm tra form yêu cầu hoàn tiền
 * @param {Object} formData - Dữ liệu form yêu cầu hoàn tiền
 * @returns {Object} - Kết quả kiểm tra với isValid và errors
 */
export const validateRefundRequestForm = (formData) => {
  const errors = {};
  
  const paymentIdResult = validatePaymentId(formData.paymentId);
  if (paymentIdResult !== true) errors.paymentId = paymentIdResult;
  
  const reasonResult = validateRefundReason(formData.reason);
  if (reasonResult !== true) errors.reason = reasonResult;
  
  if (formData.amount !== undefined) {
    const amountResult = validatePaymentAmount(formData.amount);
    if (amountResult !== true) errors.amount = amountResult;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};