const express = require('express');

const authController = require('../controllers/auth-controller');

const isNotLogin = require('../middleware/isNotLogin');
const isLogin = require('../middleware/isLogin');

const router = express.Router();

router.get('/signup',isNotLogin,authController.getSignup);
router.post('/signup',isNotLogin,authController.postSignup);

router.get('/login',isNotLogin,authController.getLogin);
router.post('/login',isNotLogin,authController.postLogin);

router.post('/logout',isLogin,authController.postLogout);

router.get('/forget-password',isNotLogin,authController.getForgetPass);
router.post('/forget-password',isNotLogin,authController.postForgetPass);

router.get('/reset-password/:token',isNotLogin,authController.getResetPass);
router.post('/reset-password',isNotLogin,authController.postResetPass);

router.get('/verify/:token',isNotLogin,authController.getVerify);


module.exports = router;