
const Products = require('../models/products');
const Comment = require('../models/comment');
const FavoriteItem = require('../models/favorite-item');
const Admin = require('../models/admin');
const HelpMail = require('../models/help-mail');

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
            const admin = await Admin.findByPk(userId);
            var isAdmin = false;
            if(admin){
                isAdmin = true;
            }
            res.render('MainPages/product',{path:'/product',error: errormsg,product: product, comments: comments, favoriteNumber: favorite.length, userId: userId, PageTitle: "Product", isAdmin: isAdmin});
        } catch (error) {
            console.log(error);
        }
}
exports.getContact = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('MainPages/contact',{path:'/contact', PageTitle: "Contact", error: errormsg});
}
exports.getAbout = (req, res, next) => {
    res.render('MainPages/about',{path:'/about', PageTitle: "About"});
}


exports.postContact = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const title = req.body.title;
    const message = req.body.message;
    try {
        const helpMail = await HelpMail.create({
            title: title,
            message: message,
            name: name,
            email: email
        });
        await helpMail.save();
        req.flash('error', 'Message sent successfully');
        res.redirect('/contact');
    } catch (error) {
        console.log(error);
    }
}