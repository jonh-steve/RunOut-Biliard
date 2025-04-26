const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate notification creation data
 */
const validateCreateNotification = [
    check('title')
        .notEmpty().withMessage('Tiêu đề thông báo không được để trống')
        .isLength({ min: 3, max: 100 }).withMessage('Tiêu đề thông báo phải có từ 3 đến 100 ký tự'),
    
    check('content')
        .notEmpty().withMessage('Nội dung thông báo không được để trống')
        .isLength({ min: 5 }).withMessage('Nội dung thông báo phải có ít nhất 5 ký tự'),
    
    check('type')
        .optional()
        .isIn(['order', 'system', 'promotion', 'account']).withMessage('Loại thông báo không hợp lệ'),
    
    check('recipients')
        .optional()
        .isArray().withMessage('Danh sách người nhận phải là một mảng'),
    
    check('isGlobal')
        .optional()
        .isBoolean().withMessage('Trạng thái toàn cục phải là boolean'),
    
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
 * Middleware to validate notification update data
 */
const validateUpdateNotification = [
    check('title')
        .optional()
        .isLength({ min: 3, max: 100 }).withMessage('Tiêu đề thông báo phải có từ 3 đến 100 ký tự'),
    
    check('content')
        .optional()
        .isLength({ min: 5 }).withMessage('Nội dung thông báo phải có ít nhất 5 ký tự'),
    
    check('type')
        .optional()
        .isIn(['order', 'system', 'promotion', 'account']).withMessage('Loại thông báo không hợp lệ'),
    
    check('isRead')
        .optional()
        .isBoolean().withMessage('Trạng thái đã đọc phải là boolean'),
    
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
 * Middleware to validate mark notification as read
 */
const validateMarkAsRead = [
    check('notificationId')
        .notEmpty().withMessage('ID thông báo không được để trống')
        .isMongoId().withMessage('ID thông báo không hợp lệ'),
    
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
    validateCreateNotification,
    validateUpdateNotification,
    validateMarkAsRead
};