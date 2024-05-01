const express = require('express');

const adminController = require('../controllers/admin-controller');

const isNotLogin = require('../middleware/isNotLogin');
const isAdminLogin = require('../middleware/isAdminLogin');

const router = express.Router();

router.get('/admin-signup',isNotLogin,adminController.getSignup);
router.post('/admin-signup',isNotLogin,adminController.postSignup);

router.get('/admin-login',isNotLogin,adminController.getLogin);
router.post('/admin-login',isNotLogin,adminController.postLogin);

router.get('/admin-forget-password',isNotLogin,adminController.getForgetPass);
router.post('/admin-forget-password',isNotLogin,adminController.postForgetPass);

router.get('/admin-reset-password/:token',isNotLogin,adminController.getResetPass);
router.post('/admin-reset-password',isNotLogin,adminController.postResetPass);

router.post('/admin-name-update',isAdminLogin,adminController.postNameUpdate);
router.post('/admin-surname-update',isAdminLogin,adminController.postSurnameUpdate);
router.post('/admin-email-update',isAdminLogin,adminController.postEmailUpdate);
router.post('/admin-password-update',isAdminLogin,adminController.postPasswordUpdate);


router.get('/admin/all-cars',isAdminLogin,adminController.getAllCars);
router.get('/admin/all-motorcycles',isAdminLogin,adminController.getAllMotorcycles);

router.post('/product-delete',isAdminLogin,adminController.postDeleteProduct);
router.post('/edit-product/admin',isAdminLogin,adminController.postEditProduct);

router.get('/admin/:UserId/product-edit/:productId',isAdminLogin,adminController.getEditProduct);


router.get('/admin',isAdminLogin,adminController.getAdminPage);

router.get('/admin/:UserId/account',isAdminLogin,adminController.getAdmin);

router.get("/admin/mails",isAdminLogin,adminController.getMails);
router.post('/email-delete',isAdminLogin,adminController.emailDelete);

router.post("/admin-delete-comment",isAdminLogin, adminController.postDeleteComment);

module.exports = router;