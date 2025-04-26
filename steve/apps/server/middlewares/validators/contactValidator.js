const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate contact form submission
 */
const validateContactForm = [
    check('name')
        .notEmpty().withMessage('Họ tên không được để trống')
        .isLength({ min: 3 }).withMessage('Họ tên phải có ít nhất 3 ký tự'),
    
    check('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ'),
    
    check('phone')
        .optional()
        .isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
    
    check('subject')
        .notEmpty().withMessage('Tiêu đề không được để trống')
        .isLength({ min: 5 }).withMessage('Tiêu đề phải có ít nhất 5 ký tự'),
    
    check('message')
        .notEmpty().withMessage('Nội dung tin nhắn không được để trống')
        .isLength({ min: 10 }).withMessage('Nội dung tin nhắn phải có ít nhất 10 ký tự'),
    
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
 * Middleware to validate contact response
 */
const validateContactResponse = [
    check('contactId')
        .notEmpty().withMessage('ID liên hệ không được để trống')
        .isMongoId().withMessage('ID liên hệ không hợp lệ'),
    
    check('response')
        .notEmpty().withMessage('Nội dung phản hồi không được để trống')
        .isLength({ min: 10 }).withMessage('Nội dung phản hồi phải có ít nhất 10 ký tự'),
    
    check('status')
        .optional()
        .isIn(['pending', 'responded', 'closed']).withMessage('Trạng thái không hợp lệ'),
    
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
    validateContactForm,
    validateContactResponse
};