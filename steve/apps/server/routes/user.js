const router = require('express').Router();
const userCtrl = require('../controllers/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const { validateRegister, validateLogin, validateUpdateUser } = require('@common/validators/userValidator');

// Routes không yêu cầu xác thực
router.post('/register', validateRegister, userCtrl.register);
router.post('/login', validateLogin, userCtrl.login);
router.post('/refreshToken', userCtrl.refreshAccessToken);
router.post('/forgot-password', userCtrl.forgotPassword);
router.put('/reset-password', userCtrl.resetPassword);

// Routes yêu cầu xác thực
router.use(verifyAccessToken);
router.get('/getCurrent', userCtrl.getCurrent);
router.put('/current', validateUpdateUser, userCtrl.updateUser);
router.get('/logout', userCtrl.logout);
router.put('/addToWishlist', userCtrl.addToWishlist);
router.put('/deleteFromWishlist', userCtrl.deleteFromWishlist);

// Routes yêu cầu quyền admin
router.use(isAdmin);
router.get('/', userCtrl.getUsers);
router.delete('/', userCtrl.deleteUser);
router.put('/admin/update/:uid', userCtrl.updateUserByAdmin);
router.post('/admin/create', userCtrl.addUserByAdmin);
router.get('/admin/get/:uid', userCtrl.getUserById);
module.exports = router
