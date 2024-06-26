const express = require('express');
const router = express.Router();

const userController = require('../controllers/user-controller');
const isLogin = require('../middleware/isLogin');

router.get('/favorite',isLogin,userController.getFavorite);
router.post('/favorite',isLogin,userController.postFavorite);
router.post('/delete-favorite',isLogin,userController.postDeleteFavorite);


router.get('/user/:UserId/my-cars',isLogin,userController.getMyCars);
router.get('/user/:UserId/my-motorcycles',isLogin,userController.getMyMotorcycles);
router.get('/user/:UserId/product-edit/:productId',isLogin,userController.getEditMyProduct);
router.post('/my-product/delete',isLogin,userController.postDeleteMyProduct);


router.post('/edit-product',isLogin,userController.postEditProduct);


router.get('/user/:UserId/account',isLogin,userController.getUser);
router.post('/name-update',isLogin,userController.postNameUpdate);
router.post('/surname-update',isLogin,userController.postSurnameUpdate);
router.post('/email-update',isLogin,userController.postEmailUpdate);
router.post('/password-update',isLogin,userController.postPasswordUpdate);

router.get('/user',isLogin,userController.getUserPage);

router.post("/add-to-comment",isLogin, userController.postComment);
router.post("/delete-comment",isLogin, userController.postDeleteComment);

router.post('/add-to-comment-to-comment',isLogin, userController.postCommentToComment)

router.get("/user/:userId/help",isLogin,userController.getHelpPage);

router.post("/user/:userId/help",isLogin,userController.postHelpPage);



module.exports = router;