const express = require('express');

const mainPageController = require('../controllers/mainPage-controller');

const router = express.Router();


router.get('/products',mainPageController.getProducts);
router.get('/products/:category',mainPageController.getCategories);

router.get('/product/:productId',mainPageController.getProduct);

router.get('/contact',mainPageController.getContact);
router.get('/about',mainPageController.getAbout);


router.get('/',mainPageController.getIndex);



module.exports = router;