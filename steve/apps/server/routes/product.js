const router = require('express').Router();
const productCtrl = require('../controllers/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploader = require('../configs/Cloudinary');
const { validateCreateProduct, validateUpdateProduct, validateRating } = require('@common/validators/productValidator');

// Public routes
router.get('/', productCtrl.getAllProduct);
router.get('/:pid', productCtrl.getProduct);

// Routes requiring authentication
router.use(verifyAccessToken);
router.put('/ratings', validateRating, productCtrl.ratings);

// Routes requiring admin privileges
router.use(isAdmin);
router.post('/', validateCreateProduct, productCtrl.createProduct);
router.put('/:pid', validateUpdateProduct, productCtrl.updateProduct);
router.put('/upload/:pid', uploader.array('images', 10), productCtrl.uploadImageProduct);
router.delete('/:pid', productCtrl.deleteProduct);

module.exports = router
