const express = require('express');
const router = express.Router();

const userController = require('../controllers/user-controller');

router.get('/favorite',userController.getFavorite);



module.exports = router;