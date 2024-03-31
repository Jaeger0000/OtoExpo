const express = require('express');
const router = express.Router();

const addProductController = require('../controllers/add-product-controller');

router.get('/add',addProductController.getAddProduct);



module.exports = router;