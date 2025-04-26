const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate payment creation data
 */
const validateCreatePayment = [
    check('orderId')
        .notEmpty().withMessage('ID đơn hàng không được để trống')
        .isMongoId().withMessage('ID đơn hàng không hợp lệ'),
    
    check('amount')
        .notEmpty().withMessage('Số tiền thanh toán không được để trống')
        .isNumeric().withMessage('Số tiền thanh toán phải là số')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Số tiền thanh toán phải lớn hơn 0');
            }
            return true;
        }),
    
    check('paymentMethod')
        .notEmpty().withMessage('Phương thức thanh toán không được để trống')
        .isIn(['COD', 'CREDIT_CARD', 'PAYPAL', 'MOMO', 'BANK_TRANSFER']).withMessage('Phương thức thanh toán không hợp lệ'),
    
    check('status')
        .optional()
        .isIn(['Pending', 'Completed', 'Failed', 'Refunded']).withMessage('Trạng thái thanh toán không hợp lệ'),
    
    check('transactionId')
        .optional(),
    
    check('paymentDetails')
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
 * Middleware to validate payment update data
 */
const validateUpdatePayment = [
    check('status')
        .notEmpty().withMessage('Trạng thái thanh toán không được để trống')
        .isIn(['Pending', 'Completed', 'Failed', 'Refunded']).withMessage('Trạng thái thanh toán không hợp lệ'),
    
    check('transactionId')
        .optional(),
    
    check('paymentDetails')
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
 * Middleware to validate payment verification
 */
const validateVerifyPayment = [
    check('paymentId')
        .notEmpty().withMessage('ID thanh toán không được để trống')
        .isMongoId().withMessage('ID thanh toán không hợp lệ'),
    
    check('transactionId')
        .notEmpty().withMessage('ID giao dịch không được để trống'),
    
    check('amount')
        .notEmpty().withMessage('Số tiền thanh toán không được để trống')
        .isNumeric().withMessage('Số tiền thanh toán phải là số')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Số tiền thanh toán phải lớn hơn 0');
            }
            return true;
        }),
    
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
 * Middleware to validate refund request
 */
const validateRefundRequest = [
    check('paymentId')
        .notEmpty().withMessage('ID thanh toán không được để trống')
        .isMongoId().withMessage('ID thanh toán không hợp lệ'),
    
    check('reason')
        .notEmpty().withMessage('L�� do hoàn tiền không được để trống')
        .isLength({ min: 10 }).withMessage('Lý do hoàn tiền phải có ít nhất 10 ký tự'),
    
    check('amount')
        .optional()
        .isNumeric().withMessage('Số tiền hoàn lại phải là số')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Số tiền hoàn lại phải lớn hơn 0');
            }
            return true;
        }),
    
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
    validateCreatePayment,
    validateUpdatePayment,
    validateVerifyPayment,
    validateRefundRequest
};