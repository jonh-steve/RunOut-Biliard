const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    return res.status(404).json({
        success: false,
        mes: error.message
    });
}

const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    return res.status(statusCode).json({
        success: false,
        mes: error?.message
    })
}

module.exports = {
    notFound,
    errorHandler
}