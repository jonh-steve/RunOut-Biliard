const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate newsletter subscription
 */
const validateNewsletterSubscription = [
    check('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ'),
    
    check('name')
        .optional()
        .isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự'),
    
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
 * Middleware to validate newsletter unsubscription
 */
const validateNewsletterUnsubscription = [
    check('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ'),
    
    check('reason')
        .optional()
        .isLength({ min: 5 }).withMessage('Lý do phải có ít nhất 5 ký tự'),
    
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
 * Middleware to validate newsletter campaign creation
 */
const validateNewsletterCampaign = [
    check('title')
        .notEmpty().withMessage('Tiêu đề chiến dịch không được để trống')
        .isLength({ min: 5 }).withMessage('Tiêu đề chiến dịch phải có ít nhất 5 ký tự'),
    
    check('content')
        .notEmpty().withMessage('Nội dung email không được để trống')
        .isLength({ min: 20 }).withMessage('Nội dung email phải có ít nhất 20 ký tự'),
    
    check('subject')
        .notEmpty().withMessage('Chủ đề email không được để trống')
        .isLength({ min: 5 }).withMessage('Chủ đề email phải có ít nhất 5 ký tự'),
    
    check('recipients')
        .optional()
        .isArray().withMessage('Danh sách người nhận phải là một mảng'),
    
    check('sendToAll')
        .optional()
        .isBoolean().withMessage('Gửi cho tất cả phải là boolean'),
    
    check('scheduledDate')
        .optional()
        .isISO8601().withMessage('Ngày lên lịch không hợp lệ'),
    
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
    validateNewsletterSubscription,
    validateNewsletterUnsubscription,
    validateNewsletterCampaign
};