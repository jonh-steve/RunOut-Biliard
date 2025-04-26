/**
 * Validation Middleware
 * Middleware trung tâm để xử lý lỗi validation
 */

const { validationResult } = require('express-validator');

/**
 * Middleware để xử lý kết quả validation và trả về lỗi nếu có
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      mes: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  
  next();
};

/**
 * Tạo middleware validation từ các rules
 * @param {Array} validationRules - Mảng các validation rules
 * @returns {Array} - Mảng middleware bao gồm các rules và handler
 */
const validate = (validationRules) => {
  return [...validationRules, handleValidationErrors];
};

module.exports = {
  handleValidationErrors,
  validate
};