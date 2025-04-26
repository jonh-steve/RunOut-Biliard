const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate product review creation
 */
const validateCreateReview = [
    check('star')
        .notEmpty().withMessage('Đánh giá sao không được để trống')
        .isFloat({ min: 1, max: 5 }).withMessage('Đánh giá sao phải từ 1 đến 5'),
    
    check('comment')
        .optional()
        .isLength({ min: 1 }).withMessage('Bình luận không được để trống nếu được cung cấp'),
    
    check('product')
        .notEmpty().withMessage('ID sản phẩm không được để trống'),
    
    check('images')
        .optional()
        .isArray().withMessage('Hình ảnh phải là một mảng'),
    
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
 * Middleware to validate product review update
 */
const validateUpdateReview = [
    check('star')
        .optional()
        .isFloat({ min: 1, max: 5 }).withMessage('Đánh giá sao phải từ 1 đến 5'),
    
    check('comment')
        .optional()
        .isLength({ min: 1 }).withMessage('Bình luận không được để trống nếu được cung cấp'),
    
    check('images')
        .optional()
        .isArray().withMessage('Hình ảnh phải là một mảng'),
    
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
 * Middleware to validate review reply
 */
const validateReviewReply = [
    check('content')
        .notEmpty().withMessage('Nội dung phản hồi không được để trống')
        .isLength({ min: 1, max: 500 }).withMessage('Nội dung phản hồi phải từ 1 đến 500 ký tự'),
    
    check('reviewId')
        .notEmpty().withMessage('ID đánh giá không được để trống'),
    
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
    validateCreateReview,
    validateUpdateReview,
    validateReviewReply
};