const { name } = require('ejs');
const User = require('../models/user');

exports.getAddProduct = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('UserPages/add-product-pages/add-product', 
    { path: '/add-product', error: errormsg, PageTitle: "Add Product"});
}

exports.getAddProductCar = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('UserPages/add-product-pages/add-product-car',
     { path: '/add-product', error: errormsg, name: "car", PageTitle: "Add Car"});
}

exports.postAddProductCar = (req, res, next) => {
    const name = req.body.name;
    const marka = req.body.marka;
    const model = req.body.model;
    const year = req.body.year;
    const kilometer = req.body.kilometer;
    const color = req.body.color;
    const price = req.body.price;
    const type = req.body.type;
    const description = req.body.description;
    const adress = req.body.adress;
    const userId = req.session.user.id;
    const image = req.file;
    var imageUrl;
    if(image){
        const bfimageUrl = image.path;
        imageUrl = bfimageUrl.replace('public', '');
    }
    async function init() {
        try {
            const user = await User.findByPk(userId);
            await user.createProduct({
                name: name,
                marka: marka,
                model: model,
                production_year: year,
                kilometer: kilometer,
                color: color,
                price: price,
                type: type,
                imageUrl: imageUrl,
                announce_details: description,
                adress: adress
            });
            res.redirect('/products'); // my products page eklenip oraya yönlendirilicek
        } catch (error) {
            console.log(error);
        }
    }
    init();
}


exports.getAddProductMotorcycle = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('UserPages/add-product-pages/add-product-motorcycle',
     { path: '/add-product', error: errormsg, name: "motorcycle", PageTitle: "Add Motorcycle"});
}


exports.postAddProductMotorcycle = (req, res, next) => {
    const name = req.body.name;
    const marka = req.body.marka;
    const model = req.body.model;
    const year = req.body.year;
    const kilometer = req.body.kilometer;
    const color = req.body.color;
    const price = req.body.price;
    const description = req.body.description;
    const adress = req.body.adress;
    const userId = req.session.user.id;
    const type = req.body.type;
    const image = req.file;
    var imageUrl;
    if(image){
        const bfimageUrl = image.path;
        imageUrl = bfimageUrl.replace('public', '');
    }
    async function init() {
        try {
            const user = await User.findByPk(userId);
            await user.createProduct({
                name: name,
                marka: marka,
                model: model,
                production_year: year,
                kilometer: kilometer,
                color: color,
                price: price,
                type: type,
                imageUrl: imageUrl,
                announce_details: description,
                adress: adress
            });
            res.redirect('/products'); // my products page eklenip oraya yönlendirilicek
        } catch (error) {
            console.log(error);
        }
    }
    init();
}