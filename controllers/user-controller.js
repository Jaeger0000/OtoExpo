const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Products = require('../models/products');
const { where } = require('sequelize');
exports.getFavorite = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    async function init() {
        try {
            const user = await User.findByPk(req.session.user.id);
            const favorite = await user.getFavorite();
            const products = await favorite.getProducts(); // üç farklı favorite böl 3 farklı değer yolla
            res.render('UserPages/favorite', {
                path: '/favorite',
                error: errormsg,
                favorites: products
            });

        } catch (error) {
            console.log(error);
        }
    }
    init();
}


exports.postFavorite = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        const user = await User.findByPk(req.session.user.id);
        const favorite = await user.getFavorite();

        const products = await favorite.getProducts({ where: { id: productId } });

        if (products.length > 0) {
            await req.flash('error', 'Product already exists in the favorite list');
            return res.redirect('/favorite');

        } else {
            const product = await Products.findByPk(productId);
            await favorite.addProducts(product, { through: { quantity: 1 } });
        }
        res.redirect('/favorite');
    } catch (error) {
        console.log(error);
    }
};

exports.postDeleteFavorite = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        const user = await User.findByPk(req.session.user.id);
        const favorite = await user.getFavorite();
        const products = await favorite.getProducts({ where: { id: productId } });
        const product = products[0];
        await favorite.removeProduct(product);
        res.redirect('/favorite');
    } catch (error) {
        console.log(error);
    }

}

exports.getUser = (req, res, next) => {

    async function init() {
        try {
            const userId = req.params.UserId;
            const user = await User.findByPk(userId);
            if (user === null) {
                return res.redirect('/user');
            }
            if (user.id !== req.session.user.id) {
                return res.redirect('/user');
            }
            var errormsg = req.flash('error');
            if (errormsg.length > 0) {
                errormsg = errormsg[0];
            } else {
                errormsg = null;
            }
            res.render('UserPages/user-navbar-pages/user', { path: 'user/account', error: errormsg, user: user });
        } catch (error) {
            console.log(error);
        }


    }
    init();

}

exports.getUserPage = (req, res, next) => {
    const id = req.session.user.id;
    res.redirect('/user/' + id + '/account');
}

exports.postNameUpdate = (req, res, next) => {
    const name = req.body.name;
    async function userUpdate() {
        try {
            const user = await User.findByPk(req.session.user.id);
            user.name = name;
            await user.save();
            res.redirect('/user');
        } catch (error) {
            console.log(error);
        }
    }
    userUpdate();
}

exports.postSurnameUpdate = (req, res, next) => {
    const surName = req.body.surName;
    async function userUpdate() {
        try {
            const user = await User.findByPk(req.session.user.id);
            user.surName = surName;
            await user.save();
            res.redirect('/user');
        }
        catch (error) {
            console.log(error);
        }
    }
    userUpdate();
}
exports.postEmailUpdate = (req, res, next) => {
    const email = req.body.email;
    async function userCmpr() {
        const existsUser = await User.findOne({ where: { email: email } });
        if (existsUser) {
            req.flash('error',
                'Email already exists. Please enter a different email address');
            return res.redirect('/user');
        }
    }
    userCmpr();
    async function userUpdate() {
        try {
            const user = await User.findByPk(req.session.user.id);
            user.email = email;
            await user.save();
            res.redirect('/user');
        }
        catch (error) {
            console.log(error);
        }
    }
    userUpdate();
}

exports.postPasswordUpdate = (req, res, next) => {
    const oldpassword = req.body.oldPassword;
    const password = req.body.password;
    const cfrmPassword = req.body.cfrmPassword;
    console.log('old password:  ' + oldpassword);
    console.log('old password:  ' + req.session.user.password);
    if (bcrypt.compareSync(oldpassword, req.session.user.password) === false) {
        req.flash('error',
            'The entered password is incorrect');
        return res.redirect('/user');
    }
    if (password !== cfrmPassword) {
        req.flash('error',
            'Passwords do not match');
        return res.redirect('/user');
    }
    async function userUpdate() {
        try {
            const user = await User.findByPk(req.session.user.id);
            console.log(password);
            const passwordcrypt = bcrypt.hashSync(password, 12);
            user.password = passwordcrypt;
            await user.save();
            req.session.user = user;
            res.redirect('/user');
        }
        catch (error) {
            console.log(error);
        }
    }
    userUpdate();
}

exports.getMyCars = async (req, res, next) => {
    try {
        const userId = req.params.UserId;
        const userSId = req.session.user.id;
        const user = await User.findByPk(userId);
        if (user === null) {
            return res.redirect('/user/'+ userSId + '/my-cars');
        }
        if (user.id !== req.session.user.id) {
            return res.redirect('/user/'+ userSId + '/my-cars');
        }

        const products = await user.getProducts({ where: { type: 'car' } });
        res.render('UserPages/user-navbar-pages/my-cars', { path: '/my-cars', products: products, name: 'cars' });
    } catch (error) {
        console.log(error);
    }
}
exports.getMyMotorcycles = async (req, res, next) => {
    try {
        const userId = req.params.UserId;
        const userSId = req.session.user.id;
        const user = await User.findByPk(userId);
        if (user === null) {
            return res.redirect('/user/'+ userSId + '/my-motorcycles');
        }
        if (user.id !== req.session.user.id) {
            return res.redirect('/user/'+ userSId + '/my-motorcycles');
        }
        const products = await user.getProducts({ where: { type: 'motorcycle' } });
        res.render('UserPages/user-navbar-pages/my-motorcycles', { path: '/my-motorcycles', products: products, name: 'motorcycles' });
    } catch (error) {
        console.log(error);
    }
}

exports.getEditMyProduct = async (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }


    const productId = req.params.productId;
    try {
        const user = await User.findByPk(req.session.user.id);
        const cars = await user.getProducts({ where: { id: productId } });
        const car = cars[0];
        console.log(car);
        res.render('UserPages/user-navbar-pages/edit-my-product', { path: '/my-cars', product: car, name: 'editt', error: errormsg });
    } catch (error) {
        console.log(error);
    }


}

exports.postEditMyProduct = async (req, res, next) => {
    const productId = req.body.productId;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    try {
        const user = await User.findByPk(req.session.user.id);
        const cars = await user.getProducts({ where: { id: productId } });
        const car = cars[0];
        car.name = name;
        car.price = price;
        car.description = description;
        car.imageUrl = imageUrl;
        await car.save();
        res.redirect('/user/' + req.session.user.id + '/my-cars');
    } catch (error) {
        console.log(error);
    }

}

exports.postDeleteMyProduct = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        const user = await User.findByPk(req.session.user.id);
        const products = await user.getProducts({ where: { id: productId } });
        const product = products[0];
        await product.destroy();
        await product.save();
        res.redirect('/user/' + req.session.user.id + '/my-cars');
    } catch (error) {
        console.log(error);
    }

}



exports.postEditMyCar = async (req, res, next) => {

    const productId = req.body.productId;
    const name = req.body.name;
    const car_marka = req.body.car_marka;
    const car_model = req.body.car_model;
    const year = req.body.year;
    const price = req.body.price;
    const description = req.body.description;
    // const imageUrl = req.body.imageUrl;
    try {
        const user = await User.findByPk(req.session.user.id);
        const cars = await user.getProducts({ where: { id: productId } });
        const car = cars[0];
        car.name = name;
        car.price = price;
        car.description = description;
        car.car_marka = car_marka;
        car.car_model = car_model;
        car.year = year;
        // car.imageUrl = imageUrl;
        await car.save();
        res.redirect('/user/' + req.session.user.id + '/my-cars');
    } catch (error) {
        console.log(error);
    }
}


exports.postComment = async (req, res, next) => {
    const comment = req.body.comment;
    const productId = req.body.productId;
    try {
        const user = await User.findByPk(req.session.user.id);
        await user.createComment({ comment: comment, replyTo: productId, userFullName: user.name + ' ' + user.surName});
        res.redirect('/product/' + productId);
    } catch (error) {
        console.log(error);
    }
}

exports.postDeleteComment = async (req, res, next) => {
    const commentId = req.body.commentId;
    const productId = req.body.productId;
    try {
        const user = await User.findByPk(req.session.user.id);
        const comments = await user.getComments({ where: { id: commentId } });
        const comment = comments[0];
        await comment.destroy();
        await comment.save();
        res.redirect('/product/' + productId);
    } catch (error) {
        console.log(error);
    }
}