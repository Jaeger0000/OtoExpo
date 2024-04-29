
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
    res.render('MainPages/index',{path:'/', error: errormsg, PageTitle: "OtoExpo"});
}
exports.getProducts =async (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
        try {
            const products = await Products.findAll();
            res.render('MainPages/products',{path:'/products',error: errormsg,products: products,PageTitle: "Products"});
        } catch (error) {
            console.log(error);
        }
}

exports.getCategories =async (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
   
    try {
        var category = req.params.category;
        var PageTitle;
        if(category === "motorcycles"){
            category = "motorcycle";
            PageTitle = "Motorcycles";
        }
        else if(category === "cars"){
            category = "car";
            PageTitle = "Cars";
        }else{
            req.flash('error', 'Category not found');
            return res.redirect('/products');
        }
        const products = await Products.findAll({where: {type: category} } ) ;
        res.render('MainPages/products',{path:'/products',error: errormsg,products: products, PageTitle: PageTitle});
    } catch (error) {
        
    }
    
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
            res.render('MainPages/product',{path:'/product',error: errormsg,product: product, comments: comments, favoriteNumber: favorite.length, userId: userId, PageTitle: "Product"});
        } catch (error) {
            console.log(error);
        }
}
exports.getContact = (req, res, next) => {
    res.render('MainPages/contact',{path:'/contact', PageTitle: "Contact"});
}
exports.getAbout = (req, res, next) => {
    res.render('MainPages/about',{path:'/about', PageTitle: "About"});
}
