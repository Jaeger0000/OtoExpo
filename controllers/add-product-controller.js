const { name } = require('ejs');
const User = require('../models/user');

exports.getAddProduct = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('UserPages/add-product-pages/add-product', { path: '/add-product', error: errormsg});
}

exports.getAddProductCar = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('UserPages/add-product-pages/add-product-car', { path: '/add-product', error: errormsg, name: "car" });
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
    //const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const userId = req.session.user.id;
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
                // imageUrl: imageUrl,
                announce_details: description
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
    res.render('UserPages/add-product-pages/add-product-motorcycle', { path: '/add-product', error: errormsg, name: "motorcycle"  });
}


exports.postAddProductMotorcycle = (req, res, next) => {
    const name = req.body.name;
    const marka = req.body.marka;
    const model = req.body.model;
    const year = req.body.year;
    const kilometer = req.body.kilometer;
    const color = req.body.color;
    const price = req.body.price;
    //const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const userId = req.session.user.id;
    const type = req.body.type;
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
                // imageUrl: imageUrl,
                announce_details: description
            });
            res.redirect('/products'); // my products page eklenip oraya yönlendirilicek
        } catch (error) {
            console.log(error);
        }
    }
    init();
}
exports.getAddProductBuilding = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('UserPages/add-product-pages/add-product-building', { path: '/add-product', error: errormsg });
}


exports.postAddProductBuilding = (req, res, next) => {
    const name = req.body.name;
    const car_marka = req.body.car_marka;
    const car_model = req.body.car_model;
    const production_year = req.body.production_year;
    const kilometer = req.body.kilometer;
    const car_color = req.body.car_color;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const announce_details = req.body.announce_details;
    const userId = req.session.user.id;
    async function init() {
        try {
            const user = await User.findByPk(userId);
            await user.createCar({
                name: name,
                car_marka: car_marka,
                car_model: car_model,
                production_year: production_year,
                kilometer: kilometer,
                car_color: car_color,
                price: price,
                imageUrl: imageUrl,
                announce_details: announce_details
            });
            res.redirect('/products'); // my products page eklenip oraya yönlendirilicek
        } catch (error) {
            console.log(error);
        }
    }
    init();
}