const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate admin user creation
 */
const validateAdminCreateUser = [
    check('firstname')
        .notEmpty().withMessage('Họ không được để trống')
        .isLength({ min: 2 }).withMessage('Họ phải có ít nhất 2 ký tự'),
    
    check('lastname')
        .notEmpty().withMessage('Tên không được để trống')
        .isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự'),
    
    check('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ'),
    
    check('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    
    check('mobile')
        .optional()
        .isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
    
    check('role')
        .notEmpty().withMessage('Vai trò không được để trống')
        .isIn(['user', 'admin', 'editor', 'manager']).withMessage('Vai trò không hợp lệ'),
    
    check('status')
        .optional()
        .isIn(['active', 'inactive', 'blocked']).withMessage('Trạng thái không hợp lệ'),
    
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
 * Middleware to validate admin user update
 */
const validateAdminUpdateUser = [
    check('firstname')
        .optional()
        .isLength({ min: 2 }).withMessage('Họ phải có ít nhất 2 ký tự'),
    
    check('lastname')
        .optional()
        .isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự'),
    
    check('email')
        .optional()
        .isEmail().withMessage('Email không hợp lệ'),
    
    check('mobile')
        .optional()
        .isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
    
    check('role')
        .optional()
        .isIn(['user', 'admin', 'editor', 'manager']).withMessage('Vai trò không hợp lệ'),
    
    check('status')
        .optional()
        .isIn(['active', 'inactive', 'blocked']).withMessage('Trạng thái không hợp lệ'),
    
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
 * Middleware to validate admin password reset
 */
const validateAdminResetPassword = [
    check('userId')
        .notEmpty().withMessage('ID người dùng không được để trống')
        .isMongoId().withMessage('ID người dùng không hợp lệ'),
    
    check('newPassword')
        .notEmpty().withMessage('Mật khẩu mới không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
    
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
 * Middleware to validate admin user status update
 */
const validateAdminUpdateUserStatus = [
    check('userId')
        .notEmpty().withMessage('ID người dùng không được để trống')
        .isMongoId().withMessage('ID người dùng không hợp lệ'),
    
    check('status')
        .notEmpty().withMessage('Trạng thái không được để trống')
        .isIn(['active', 'inactive', 'blocked']).withMessage('Trạng thái không hợp lệ'),
    
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
 * Middleware to validate admin user role update
 */
const validateAdminUpdateUserRole = [
    check('userId')
        .notEmpty().withMessage('ID người dùng không được để trống')
        .isMongoId().withMessage('ID người dùng không hợp lệ'),
    
    check('role')
        .notEmpty().withMessage('Vai trò không được để trống')
        .isIn(['user', 'admin', 'editor', 'manager']).withMessage('Vai trò không hợp lệ'),
    
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
 * Middleware to validate admin product approval
 */
const validateAdminProductApproval = [
    check('productId')
        .notEmpty().withMessage('ID sản phẩm không được để trống')
        .isMongoId().withMessage('ID sản phẩm không hợp lệ'),
    
    check('status')
        .notEmpty().withMessage('Trạng thái không được để trống')
        .isIn(['approved', 'rejected', 'pending']).withMessage('Trạng thái không hợp lệ'),
    
    check('reason')
        .optional()
        .isLength({ min: 5 }).withMessage('Lý do phải có ít nhất 5 ký tự'),
    
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
 * Middleware to validate admin blog approval
 */
const validateAdminBlogApproval = [
    check('blogId')
        .notEmpty().withMessage('ID bài viết không được để trống')
        .isMongoId().withMessage('ID bài viết không hợp lệ'),
    
    check('status')
        .notEmpty().withMessage('Trạng thái không được để trống')
        .isIn(['approved', 'rejected', 'pending']).withMessage('Trạng thái không hợp lệ'),
    
    check('reason')
        .optional()
        .isLength({ min: 5 }).withMessage('Lý do phải có ít nhất 5 ký tự'),
    
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
 * Middleware to validate admin dashboard date range
 */
const validateAdminDashboardDateRange = [
    check('startDate')
        .optional()
        .isISO8601().withMessage('Ngày bắt đầu không hợp lệ'),
    
    check('endDate')
        .optional()
        .isISO8601().withMessage('Ngày kết thúc không hợp lệ')
        .custom((endDate, { req }) => {
            if (req.body.startDate && new Date(endDate) <= new Date(req.body.startDate)) {
                throw new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu');
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
    validateAdminCreateUser,
    validateAdminUpdateUser,
    validateAdminResetPassword,
    validateAdminUpdateUserStatus,
    validateAdminUpdateUserRole,
    validateAdminProductApproval,
    validateAdminBlogApproval,
    validateAdminDashboardDateRange
};