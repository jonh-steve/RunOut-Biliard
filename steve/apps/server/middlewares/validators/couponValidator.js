const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate coupon creation data
 */
const validateCreateCoupon = [
    check('name')
        .notEmpty().withMessage('Coupon name is required')
        .isLength({ min: 3, max: 30 }).withMessage('Coupon name must be between 3 and 30 characters')
        .matches(/^[A-Z0-9_]+$/).withMessage('Coupon name can only contain uppercase letters, numbers, and underscores'),
    
    check('discount')
        .notEmpty().withMessage('Discount value is required')
        .isFloat({ min: 1, max: 99 }).withMessage('Discount value must be between 1% and 99%'),
    
    check('expiry')
        .notEmpty().withMessage('Expiry date is required')
        .isISO8601().withMessage('Invalid expiry date format')
        .custom(value => {
            const expiryDate = new Date(value);
            const currentDate = new Date();
            
            if (expiryDate <= currentDate) {
                throw new Error('Expiry date must be greater than current date');
            }
            return true;
        }),
    
    check('isActive')
        .optional()
        .isBoolean().withMessage('Active status must be a boolean'),
    
    check('applicableProducts')
        .optional()
        .isArray().withMessage('Applicable products must be an array'),
    
    check('minOrderAmount')
        .optional()
        .isNumeric().withMessage('Minimum order amount must be a number')
        .custom(value => {
            if (value < 0) {
                throw new Error('Minimum order amount cannot be negative');
            }
            return true;
        }),
    
    check('maxUsage')
        .optional()
        .isInt({ min: 1 }).withMessage('Maximum usage must be a positive integer'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: errors.array()[0].msg 
            });
        }
        next();
    }
];

/**
 * Middleware to validate coupon update data
 */
const validateUpdateCoupon = [
    check('name')
        .optional()
        .isLength({ min: 3, max: 30 }).withMessage('Coupon name must be between 3 and 30 characters')
        .matches(/^[A-Z0-9_]+$/).withMessage('Coupon name can only contain uppercase letters, numbers, and underscores'),
    
    check('discount')
        .optional()
        .isFloat({ min: 1, max: 99 }).withMessage('Discount value must be between 1% and 99%'),
    
    check('expiry')
        .optional()
        .isISO8601().withMessage('Invalid expiry date format')
        .custom(value => {
            const expiryDate = new Date(value);
            const currentDate = new Date();
            
            if (expiryDate <= currentDate) {
                throw new Error('Expiry date must be greater than current date');
            }
            return true;
        }),
    
    check('isActive')
        .optional()
        .isBoolean().withMessage('Active status must be a boolean'),
    
    check('applicableProducts')
        .optional()
        .isArray().withMessage('Applicable products must be an array'),
    
    check('minOrderAmount')
        .optional()
        .isNumeric().withMessage('Minimum order amount must be a number')
        .custom(value => {
            if (value < 0) {
                throw new Error('Minimum order amount cannot be negative');
            }
            return true;
        }),
    
    check('maxUsage')
        .optional()
        .isInt({ min: 1 }).withMessage('Maximum usage must be a positive integer'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: errors.array()[0].msg 
            });
        }
        next();
    }
];

/**
 * Middleware to validate coupon application
 */
const validateApplyCoupon = [
    check('couponCode')
        .notEmpty().withMessage('Coupon code is required')
        .isLength({ min: 3, max: 30 }).withMessage('Invalid coupon code'),
    
    check('cartItems')
        .notEmpty().withMessage('Cart items are required')
        .isArray().withMessage('Cart items must be an array')
        .custom(cartItems => {
            if (cartItems.length === 0) {
                throw new Error('Cart must have at least one item');
            }
            return true;
        }),
    
    check('totalAmount')
        .notEmpty().withMessage('Total order amount is required')
        .isNumeric().withMessage('Total order amount must be a number')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Total order amount must be greater than 0');
            }
            return true;
        }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: errors.array()[0].msg 
            });
        }
        next();
    }
];

module.exports = {
    validateCreateCoupon,
    validateUpdateCoupon,
    validateApplyCoupon
};
