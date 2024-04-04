const express = require('express');
const router = express.Router();

const userController = require('../controllers/user-controller');
const isLogin = require('../middleware/isLogin');

router.get('/favorite',userController.getFavorite);
router.get('/user/:UserId/account',isLogin,userController.getUser);



module.exports = router;