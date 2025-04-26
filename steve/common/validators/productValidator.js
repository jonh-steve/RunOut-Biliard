const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate product creation data
 */
const validateCreateProduct = [
    check('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    
    check('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Price must be greater than 0');
            }
            return true;
        }),
    
    check('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    
    check('category')
        .notEmpty().withMessage('Category is required'),
    
    check('brand')
        .optional(),
    
    check('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    
    check('sold')
        .optional()
        .isInt({ min: 0 }).withMessage('Sold count must be a non-negative integer'),
    
    check('images')
        .optional()
        .isArray().withMessage('Images must be an array'),
    
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
 * Middleware to validate product update data
 */
const validateUpdateProduct = [
    check('title')
        .optional()
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    
    check('price')
        .optional()
        .isNumeric().withMessage('Price must be a number')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Price must be greater than 0');
            }
            return true;
        }),
    
    check('description')
        .optional()
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    
    check('category')
        .optional(),
    
    check('brand')
        .optional(),
    
    check('quantity')
        .optional()
        .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    
    check('sold')
        .optional()
        .isInt({ min: 0 }).withMessage('Sold count must be a non-negative integer'),
    
    check('images')
        .optional()
        .isArray().withMessage('Images must be an array'),
    
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
 * Middleware to validate product ratings
 */
const validateProductRating = [
    check('star')
        .notEmpty().withMessage('Rating star is required')
        .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    
    check('comment')
        .optional()
        .isLength({ min: 1 }).withMessage('Comment cannot be empty if provided'),
    
    check('pid')
        .notEmpty().withMessage('Product ID is required'),
    
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
    validateCreateProduct,
    validateUpdateProduct,
    validateProductRating
};
