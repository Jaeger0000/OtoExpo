const express = require('express');
const router = express.Router();

const userController = require('../controllers/user-controller');
const isLogin = require('../middleware/isLogin');

router.get('/favorite',userController.getFavorite);
router.get('/user/:UserId/account',isLogin,userController.getUser);
router.post('/name-update',isLogin,userController.postNameUpdate);
router.post('/surname-update',isLogin,userController.postSurnameUpdate);
router.post('/email-update',isLogin,userController.postEmailUpdate);
router.post('/password-update',isLogin,userController.postPasswordUpdate);

router.get('/user',isLogin,userController.getUserPage);



module.exports = router;