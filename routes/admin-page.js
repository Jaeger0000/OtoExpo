const express = require('express');

const adminController = require('../controllers/admin-controller');

const isNotLogin = require('../middleware/isNotLogin');
const isLogin = require('../middleware/isLogin');

const router = express.Router();

router.get('/admin-login',isNotLogin,adminController.getLogin);
router.post('/admin-login',isNotLogin,adminController.postLogin);

router.post('/admin-name-update',isLogin,adminController.postNameUpdate);
router.post('/admin-surname-update',isLogin,adminController.postSurnameUpdate);
router.post('/admin-email-update',isLogin,adminController.postEmailUpdate);
router.post('/admin-password-update',isLogin,adminController.postPasswordUpdate);


router.get('/admin/:UserId/all-cars',isLogin,adminController.getAllCars);
router.get('/admin/:UserId/all-motorcycles',isLogin,adminController.getAllMotorcycles);

router.post('/product-delete',isLogin,adminController.postDeleteProduct);
router.post('/edit-product/admin',isLogin,adminController.postEditProduct);

router.get('/admin/:UserId/product-edit/:productId',isLogin,adminController.getEditProduct);


router.get('/admin',isLogin,adminController.getAdminPage);

router.get('/admin/:UserId/account',isLogin,adminController.getAdmin);

router.get("/admin/:userId/mails",isLogin,adminController.getMails);
router.post('/email-delete',isLogin,adminController.emailDelete);

module.exports = router;