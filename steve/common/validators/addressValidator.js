const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate address creation data
 */
const validateCreateAddress = [
    check('fullName')
        .notEmpty().withMessage('Họ tên không được để trống')
        .isLength({ min: 3 }).withMessage('Họ tên phải có ít nhất 3 ký tự'),
    
    check('phone')
        .notEmpty().withMessage('Số điện thoại không được để trống')
        .isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
    
    check('province')
        .notEmpty().withMessage('Tỉnh/Thành phố không được để trống'),
    
    check('district')
        .notEmpty().withMessage('Quận/Huyện không được để trống'),
    
    check('ward')
        .notEmpty().withMessage('Phường/Xã không được để trống'),
    
    check('street')
        .notEmpty().withMessage('Địa chỉ chi tiết không được để trống')
        .isLength({ min: 5 }).withMessage('Địa chỉ chi tiết phải có ít nhất 5 ký tự'),
    
    check('isDefault')
        .optional()
        .isBoolean().withMessage('Trạng thái mặc định phải là boolean'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                mes: errors.array()[0].msg 
            });
        }
        next();
    }
];

/**
 * Middleware to validate address update data
 */
const validateUpdateAddress = [
    check('fullName')
        .optional()
        .isLength({ min: 3 }).withMessage('Họ tên phải có ít nhất 3 ký tự'),
    
    check('phone')
        .optional()
        .isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
    
    check('province')
        .optional(),
    
    check('district')
        .optional(),
    
    check('ward')
        .optional(),
    
    check('street')
        .optional()
        .isLength({ min: 5 }).withMessage('Địa chỉ chi tiết phải có ít nhất 5 ký tự'),
    
    check('isDefault')
        .optional()
        .isBoolean().withMessage('Trạng thái mặc định phải là boolean'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                mes: errors.array()[0].msg 
            });
        }
        next();
    }
];

module.exports = {
    validateCreateAddress,
    validateUpdateAddress
};