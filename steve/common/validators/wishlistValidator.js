const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate add to wishlist
 */
const validateAddToWishlist = [
    check('productId')
        .notEmpty().withMessage('ID sản phẩm không được để trống')
        .isMongoId().withMessage('ID sản phẩm không hợp lệ'),
    
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
 * Middleware to validate remove from wishlist
 */
const validateRemoveFromWishlist = [
    check('productId')
        .notEmpty().withMessage('ID sản phẩm không được để trống')
        .isMongoId().withMessage('ID sản phẩm không hợp lệ'),
    
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
    validateAddToWishlist,
    validateRemoveFromWishlist
};