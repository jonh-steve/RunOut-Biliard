const userRouter = require('./user');
const productRouter = require('./product');
const categoryRouter = require('./category');
const blogCategoryRouter = require('./blogCategory');
const blogRouter = require('./blog');
const brandRouter = require('./brand');
const couponRouter = require('./coupon');
const billRouter = require('./bill');

const { notFound, errorHandler } = require('../middlewares/ErrorHandler');

/**
 * Initialize all application routes
 * @param {Express} app - Express application instance
 */
const initRoute = (app) => {
    // API routes - each route uses its own validators defined in respective router files
    app.use('/api/user', userRouter);
    app.use('/api/product', productRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/blog-category', blogCategoryRouter);
    app.use('/api/blog', blogRouter);
    app.use('/api/brand', brandRouter);
    app.use('/api/coupon', couponRouter);
    app.use('/api/bill', billRouter);

    // Error handling middleware - these should be last in the middleware chain
    app.use(notFound);
    app.use(errorHandler);
}

module.exports = initRoute;
