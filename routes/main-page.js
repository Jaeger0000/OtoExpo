const express = require('express');

const mainPageController = require('../controllers/mainPage-controller');

const router = express.Router();


router.get('/products',mainPageController.getProducts);
router.get('/categories/:category',mainPageController.getCategories);
router.get('/categories',mainPageController.getCategories);
router.get('/favorite',mainPageController.getFavorite);


router.get('/',mainPageController.getIndex);



module.exports = router;