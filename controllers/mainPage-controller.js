
const Products = require('../models/products');

exports.getIndex = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('MainPages/index',{path:'/', error: errormsg});
}
exports.getProducts = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    async function init(){
        try {
            const products = await Products.findAll();
            res.render('MainPages/products',{path:'/products',error: errormsg,products: products});
        } catch (error) {
            console.log(error);
        }
    }
    init();
}

exports.getCategories = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('MainPages/categories',{
        path:'/categories',
        error: errormsg,
        category: req.params.category
    });
}

