const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate general settings update
 */
const validateGeneralSettings = [
    check('siteName')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('Tên trang web phải có từ 2 đến 100 ký tự'),
    
    check('siteDescription')
        .optional()
        .isLength({ min: 10, max: 500 }).withMessage('Mô tả trang web phải có từ 10 đến 500 ký tự'),
    
    check('logo')
        .optional(),
    
    check('favicon')
        .optional(),
    
    check('contactEmail')
        .optional()
        .isEmail().withMessage('Email liên hệ không hợp lệ'),
    
    check('contactPhone')
        .optional()
        .isMobilePhone('vi-VN').withMessage('Số điện thoại liên hệ không hợp lệ'),
    
    check('address')
        .optional()
        .isLength({ min: 10 }).withMessage('Địa chỉ phải có ít nhất 10 ký tự'),
    
    check('socialLinks')
        .optional()
        .isObject().withMessage('Liên kết mạng xã hội phải là một đối tượng'),
    
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
 * Middleware to validate payment settings update
 */
const validatePaymentSettings = [
    check('currency')
        .optional()
        .isLength({ min: 1, max: 10 }).withMessage('Đơn vị tiền tệ không hợp lệ'),
    
    check('paymentMethods')
        .optional()
        .isArray().withMessage('Phương thức thanh toán phải là một mảng'),
    
    check('paypalClientId')
        .optional(),
    
    check('paypalClientSecret')
        .optional(),
    
    check('stripePublicKey')
        .optional(),
    
    check('stripeSecretKey')
        .optional(),
    
    check('momoPartnerCode')
        .optional(),
    
    check('momoAccessKey')
        .optional(),
    
    check('momoSecretKey')
        .optional(),
    
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
 * Middleware to validate email settings update
 */
const validateEmailSettings = [
    check('emailService')
        .optional()
        .isIn(['smtp', 'sendgrid', 'mailgun']).withMessage('Dịch vụ email không hợp lệ'),
    
    check('smtpHost')
        .optional(),
    
    check('smtpPort')
        .optional()
        .isInt().withMessage('Cổng SMTP phải là số nguyên'),
    
    check('smtpUser')
        .optional(),
    
    check('smtpPassword')
        .optional(),
    
    check('smtpSecure')
        .optional()
        .isBoolean().withMessage('SMTP Secure phải là boolean'),
    
    check('sendgridApiKey')
        .optional(),
    
    check('mailgunApiKey')
        .optional(),
    
    check('mailgunDomain')
        .optional(),
    
    check('emailFrom')
        .optional()
        .isEmail().withMessage('Email gửi đi không hợp lệ'),
    
    check('emailReplyTo')
        .optional()
        .isEmail().withMessage('Email trả lời không hợp lệ'),
    
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
 * Middleware to validate shipping settings update
 */
const validateShippingSettings = [
    check('shippingMethods')
        .optional()
        .isArray().withMessage('Phương thức vận chuyển phải là một mảng'),
    
    check('freeShippingThreshold')
        .optional()
        .isNumeric().withMessage('Ngưỡng miễn phí vận chuyển phải là số')
        .custom(value => {
            if (value < 0) {
                throw new Error('Ngưỡng miễn phí vận chuyển không được âm');
            }
            return true;
        }),
    
    check('defaultShippingFee')
        .optional()
        .isNumeric().withMessage('Phí vận chuyển mặc định phải là số')
        .custom(value => {
            if (value < 0) {
                throw new Error('Phí vận chuyển mặc định không được âm');
            }
            return true;
        }),
    
    check('shippingZones')
        .optional()
        .isArray().withMessage('Vùng vận chuyển phải là một mảng'),
    
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
    validateGeneralSettings,
    validatePaymentSettings,
    validateEmailSettings,
    validateShippingSettings
};