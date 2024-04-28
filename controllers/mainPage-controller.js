
const Products = require('../models/products');
const Comment = require('../models/comment');
const FavoriteItem = require('../models/favorite-item');

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

exports.getProduct =async (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
        try {
            const product = await Products.findByPk(req.params.productId);
            if(!product){
                req.flash('error', 'Product not found');
                return res.redirect('/products');
            }
            const comments = await Comment.findAll({where: {replyTo: req.params.productId}});
            const favorite = await FavoriteItem.findAll({where: {productId: req.params.productId}});
            var userId = "";
            if(req.session.user){
                userId = req.session.user.id;
            }
            res.render('MainPages/product',{path:'/product',error: errormsg,product: product, comments: comments, favoriteNumber: favorite.length, userId: userId});
        } catch (error) {
            console.log(error);
        }
}
