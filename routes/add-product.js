const express = require('express');
const router = express.Router();

const isLogin = require('../middleware/isLogin');

const addProductController = require('../controllers/add-product-controller');

router.get('/add-product', isLogin, addProductController.getAddProduct);

router.get('/add-product/car', isLogin, addProductController.getAddProductCar);
router.post('/add-product/car', isLogin, addProductController.postAddProductCar);

router.get('/add-product/motorcycle', isLogin, addProductController.getAddProductMotorcycle);
router.post('/add-product/motorcycle', isLogin, addProductController.postAddProductMotorcycle);


module.exports = router;