const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate category creation data
 */
const validateCreateCategory = [
    check('title')
        .notEmpty().withMessage('Category name cannot be empty')
        .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters')
        .custom(value => {
            // Check that category name doesn't contain special characters
            const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (specialCharsRegex.test(value)) {
                throw new Error('Category name cannot contain special characters');
            }
            return true;
        }),
    
    check('image')
        .optional(),
    
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
 * Middleware to validate category update data
 */
const validateUpdateCategory = [
    check('title')
        .optional()
        .isLength({ min: 2 }).withMessage('Category name must be at least 2 characters')
        .custom(value => {
            if (!value) return true;
            // Check that category name doesn't contain special characters
            const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (specialCharsRegex.test(value)) {
                throw new Error('Category name cannot contain special characters');
            }
            return true;
        }),
    
    check('image')
        .optional(),
    
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
    validateCreateCategory,
    validateUpdateCategory
};
