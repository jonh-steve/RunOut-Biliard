const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate blog creation data
 */
const validateCreateBlog = [
    check('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    
    check('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    
    check('category')
        .notEmpty().withMessage('Category is required'),
    
    check('content')
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
    
    check('image')
        .optional(),
    
    check('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
    
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
 * Middleware to validate blog update data
 */
const validateUpdateBlog = [
    check('title')
        .optional()
        .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    
    check('description')
        .optional()
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    
    check('category')
        .optional(),
    
    check('content')
        .optional()
        .isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
    
    check('image')
        .optional(),
    
    check('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
    
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
 * Middleware to validate blog comment
 */
const validateBlogComment = [
    check('content')
        .notEmpty().withMessage('Comment content is required')
        .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
    
    check('blog')
        .notEmpty().withMessage('Blog ID is required'),
    
    check('parentComment')
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
    validateCreateBlog,
    validateUpdateBlog,
    validateBlogComment
};
