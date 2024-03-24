const User = require('../models/user');

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
    res.render('MainPages/products',{path:'/products',error: errormsg});
}

exports.getCategories = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    
    console.log(req.params.category);
    res.render('MainPages/categories',{
        path:'/categories',
        error: errormsg,
        category: req.params.category
    });
}

exports.getFavorite = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    async function init(){
        try {
            const user = await User.findByPk(req.session.user.id);
            const favorite = await user.getFavorite();
            const products = await favorite.getProducts();
            return res.render('MainPages/favorite',{path:'/favorite',error: errormsg, favorites: products});
        } catch (error) {
            console.log(error);
        }
    }
    init();
}