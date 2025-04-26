const { check, validationResult } = require('express-validator');

/**
 * Middleware to validate order creation data
 */
const validateCreateOrder = [
    check('products')
        .notEmpty().withMessage('Sản phẩm không được để trống')
        .isArray().withMessage('Sản phẩm phải là một mảng')
        .custom(products => {
            if (products.length === 0) {
                throw new Error('Đơn hàng phải có ít nhất một sản phẩm');
            }
            
            // Kiểm tra từng sản phẩm trong đơn hàng
            for (const product of products) {
                if (!product.product) {
                    throw new Error('ID sản phẩm không được để trống');
                }
                if (!product.count || product.count <= 0) {
                    throw new Error('Số lượng sản phẩm phải lớn hơn 0');
                }
            }
            
            return true;
        }),
    
    check('address')
        .notEmpty().withMessage('Địa chỉ giao hàng không được để trống'),
    
    check('paymentMethod')
        .notEmpty().withMessage('Phương thức thanh toán không được để trống')
        .isIn(['COD', 'CREDIT_CARD', 'PAYPAL', 'MOMO']).withMessage('Phương thức thanh toán không hợp lệ'),
    
    check('totalPrice')
        .notEmpty().withMessage('Tổng giá trị đơn hàng không được để trống')
        .isNumeric().withMessage('Tổng giá trị đơn hàng phải là số')
        .custom(value => {
            if (value <= 0) {
                throw new Error('Tổng giá trị đơn hàng phải lớn hơn 0');
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
 * Middleware to validate order status update
 */
const validateUpdateOrderStatus = [
    check('status')
        .notEmpty().withMessage('Trạng thái đơn hàng không được để trống')
        .isIn(['Processing', 'Shipped', 'Delivered', 'Cancelled']).withMessage('Trạng thái đơn hàng không hợp lệ'),
    
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
    validateCreateOrder,
    validateUpdateOrderStatus
};