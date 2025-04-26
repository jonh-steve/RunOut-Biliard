const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate SEO settings update
 */
const validateSeoSettings = [
    check('metaTitle')
        .optional()
        .isLength({ min: 5, max: 70 }).withMessage('Tiêu đề meta phải có từ 5 đến 70 ký tự'),
    
    check('metaDescription')
        .optional()
        .isLength({ min: 50, max: 160 }).withMessage('Mô tả meta phải có từ 50 đến 160 ký tự'),
    
    check('metaKeywords')
        .optional()
        .isArray().withMessage('Từ khóa meta phải là một mảng'),
    
    check('ogTitle')
        .optional()
        .isLength({ min: 5, max: 70 }).withMessage('Tiêu đề Open Graph phải có từ 5 đến 70 ký tự'),
    
    check('ogDescription')
        .optional()
        .isLength({ min: 50, max: 160 }).withMessage('Mô tả Open Graph phải có từ 50 đến 160 ký tự'),
    
    check('ogImage')
        .optional(),
    
    check('twitterTitle')
        .optional()
        .isLength({ min: 5, max: 70 }).withMessage('Tiêu đề Twitter phải có từ 5 đến 70 ký t���'),
    
    check('twitterDescription')
        .optional()
        .isLength({ min: 50, max: 160 }).withMessage('Mô tả Twitter phải có từ 50 đến 160 ký tự'),
    
    check('twitterImage')
        .optional(),
    
    check('canonicalUrl')
        .optional()
        .isURL().withMessage('URL chuẩn phải là một URL hợp lệ'),
    
    check('robotsTxt')
        .optional(),
    
    check('sitemapSettings')
        .optional()
        .isObject().withMessage('Cài đặt sitemap phải là một đối tượng'),
    
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
 * Middleware to validate page SEO data
 */
const validatePageSeo = [
    check('pageId')
        .notEmpty().withMessage('ID trang không được để trống')
        .isMongoId().withMessage('ID trang không hợp lệ'),
    
    check('metaTitle')
        .optional()
        .isLength({ min: 5, max: 70 }).withMessage('Tiêu đề meta phải có từ 5 đến 70 ký tự'),
    
    check('metaDescription')
        .optional()
        .isLength({ min: 50, max: 160 }).withMessage('Mô tả meta phải có từ 50 đến 160 ký tự'),
    
    check('metaKeywords')
        .optional()
        .isArray().withMessage('Từ khóa meta phải là một mảng'),
    
    check('ogTitle')
        .optional()
        .isLength({ min: 5, max: 70 }).withMessage('Tiêu đề Open Graph phải có từ 5 đến 70 ký tự'),
    
    check('ogDescription')
        .optional()
        .isLength({ min: 50, max: 160 }).withMessage('Mô tả Open Graph phải có từ 50 đến 160 ký tự'),
    
    check('ogImage')
        .optional(),
    
    check('canonicalUrl')
        .optional()
        .isURL().withMessage('URL chuẩn phải là một URL hợp lệ'),
    
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
 * Middleware to validate product SEO data
 */
const validateProductSeo = [
    check('productId')
        .notEmpty().withMessage('ID sản phẩm không được để trống')
        .isMongoId().withMessage('ID sản phẩm không hợp lệ'),
    
    check('metaTitle')
        .optional()
        .isLength({ min: 5, max: 70 }).withMessage('Tiêu đề meta phải có từ 5 đến 70 ký tự'),
    
    check('metaDescription')
        .optional()
        .isLength({ min: 50, max: 160 }).withMessage('Mô tả meta phải có từ 50 đến 160 ký tự'),
    
    check('metaKeywords')
        .optional()
        .isArray().withMessage('Từ khóa meta phải là một mảng'),
    
    check('ogTitle')
        .optional()
        .isLength({ min: 5, max: 70 }).withMessage('Tiêu đề Open Graph phải có từ 5 đến 70 ký tự'),
    
    check('ogDescription')
        .optional()
        .isLength({ min: 50, max: 160 }).withMessage('Mô tả Open Graph phải có từ 50 đến 160 ký tự'),
    
    check('ogImage')
        .optional(),
    
    check('canonicalUrl')
        .optional()
        .isURL().withMessage('URL chuẩn phải là một URL hợp lệ'),
    
    check('structuredData')
        .optional()
        .isObject().withMessage('Dữ liệu có cấu trúc phải là một đối tượng'),
    
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
 * Middleware to validate blog post SEO data
 */
const validateBlogSeo = [
    check('blogId')
        .notEmpty().withMessage('ID bài viết không được để trống')
        .isMongoId().withMessage('ID bài viết không hợp lệ'),
    
    check('metaTitle')
        .optional()
        .isLength({ min: 5, max: 70 }).withMessage('Tiêu đề meta phải có từ 5 đến 70 ký tự'),
    
    check('metaDescription')
        .optional()
        .isLength({ min: 50, max: 160 }).withMessage('Mô tả meta phải có từ 50 đến 160 ký tự'),
    
    check('metaKeywords')
        .optional()
        .isArray().withMessage('Từ khóa meta phải là một mảng'),
    
    check('ogTitle')
        .optional()
        .isLength({ min: 5, max: 70 }).withMessage('Tiêu đề Open Graph phải có từ 5 đến 70 ký tự'),
    
    check('ogDescription')
        .optional()
        .isLength({ min: 50, max: 160 }).withMessage('Mô tả Open Graph phải có từ 50 đến 160 ký tự'),
    
    check('ogImage')
        .optional(),
    
    check('canonicalUrl')
        .optional()
        .isURL().withMessage('URL chuẩn phải là một URL hợp lệ'),
    
    check('structuredData')
        .optional()
        .isObject().withMessage('Dữ liệu có cấu trúc phải là một đối tượng'),
    
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
    validateSeoSettings,
    validatePageSeo,
    validateProductSeo,
    validateBlogSeo
};