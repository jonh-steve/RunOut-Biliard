const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate add to cart
 */
const validateAddToCart = [
    check('productId')
        .notEmpty().withMessage('ID sản phẩm không được để trống')
        .isMongoId().withMessage('ID sản phẩm không hợp lệ'),
    
    check('quantity')
        .notEmpty().withMessage('Số lượng không được để trống')
        .isInt({ min: 1 }).withMessage('Số lượng phải là số nguyên lớn hơn 0'),
    
    check('color')
        .optional(),
    
    check('size')
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
 * Middleware to validate update cart item
 */
const validateUpdateCartItem = [
    check('itemId')
        .notEmpty().withMessage('ID mục giỏ hàng không được để trống')
        .isMongoId().withMessage('ID mục giỏ hàng không hợp lệ'),
    
    check('quantity')
        .notEmpty().withMessage('Số lượng không được để trống')
        .isInt({ min: 1 }).withMessage('Số lượng phải là số nguyên lớn hơn 0'),
    
    check('color')
        .optional(),
    
    check('size')
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
 * Middleware to validate remove from cart
 */
const validateRemoveFromCart = [
    check('itemId')
        .notEmpty().withMessage('ID mục giỏ hàng không được để trống')
        .isMongoId().withMessage('ID mục giỏ hàng không hợp lệ'),
    
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
 * Middleware to validate apply coupon to cart
 */
const validateApplyCoupon = [
    check('couponCode')
        .notEmpty().withMessage('Mã giảm giá không được để trống')
        .isLength({ min: 3, max: 30 }).withMessage('Mã giảm giá không hợp lệ'),
    
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
    validateAddToCart,
    validateUpdateCartItem,
    validateRemoveFromCart,
    validateApplyCoupon
};