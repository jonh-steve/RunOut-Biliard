const {validationResult} = require('express-validator');
// middleware to validate the request body
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            mes: 'du lieu nhap vao khong hop le ',
            field : errors.array().map((error) => {
                return {
                    field: error.param,
                    message: error.msg,
                }
            })
        });
    }
    next();
}
module.exports = {
    validateRequest,
}