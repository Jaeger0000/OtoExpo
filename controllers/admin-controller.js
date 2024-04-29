const Admin = require('../models/admin');
const Products = require('../models/products');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const HelpMail = require('../models/help-mail');
const Comment = require('../models/comment');

exports.getLogin = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }

    res.render('AdminPages/admin-login', {
        path: '/admin-login',
        error: errormsg,
        PageTitle: 'Admin Login'
    });
}

exports.postLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const admin = await Admin.findOne({ where: { email: email } });
        if (!admin) {
            req.flash('error', "The entered email not exists");
            return res.redirect('/admin-login');
        }
        const isEqual = await bcrypt.compare(password, admin.password);
        if (!isEqual) {
            req.flash('error', "The entered password is incorrect");
            return res.redirect('/admin-login');
        }
        req.session.user = admin;
        req.session.isAdminLoggedIn = true;
        await res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}
exports.getAdmin = async (req, res, next) => {

    try {
        const userId = req.params.UserId;
        const user = await Admin.findByPk(userId);
        if (user === null) {
            return res.redirect('/admin');
        }
        if (user.id !== req.session.user.id) {
            return res.redirect('/admin');
        }
        var errormsg = req.flash('error');
        if (errormsg.length > 0) {
            errormsg = errormsg[0];
        } else {
            errormsg = null;
        }
        res.render('AdminPAges/admin-navbar-pages/user',
            { path: 'admin/account', error: errormsg, user: user, PageTitle: 'Admin' });
    } catch (error) {
        console.log(error);
    }

}
exports.getAdminPage = (req, res, next) => {
    const id = req.session.user.id;
    res.redirect('/admin/' + id + '/account');
}


exports.postNameUpdate = async (req, res, next) => {
    const name = req.body.name;
    try {
        const admin = await Admin.findByPk(req.session.user.id);
        admin.name = name;
        await admin.save();
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
    }
}

exports.postSurnameUpdate = async (req, res, next) => {
    const surName = req.body.surName;

    try {
        const admin = await Admin.findByPk(req.session.user.id);
        admin.surName = surName;
        await admin.save();
        res.redirect('/admin');
    }
    catch (error) {
        console.log(error);
    }
}
exports.postEmailUpdate = async (req, res, next) => {
    const email = req.body.email;

    const existsUser = await Admin.findOne({ where: { email: email } });
    if (existsUser) {
        req.flash('error',
            'Email already exists. Please enter a different email address');
        return res.redirect('/admin');
    }

    try {
        const admin = await Admin.findByPk(req.session.user.id);
        admin.email = email;
        await admin.save();
        res.redirect('/admin');
    }
    catch (error) {
        console.log(error);
    }
}

exports.postPasswordUpdate = async (req, res, next) => {
    const oldpassword = req.body.oldPassword;
    const password = req.body.password;
    const cfrmPassword = req.body.cfrmPassword;
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

    try {
        const admin = await Admin.findByPk(req.session.user.id);
        const passwordcrypt = bcrypt.hashSync(password, 12);
        admin.password = passwordcrypt;
        await admin.save();
        req.session.user = admin;
        res.redirect('/admin');
    }
    catch (error) {
        console.log(error);
    }
}


exports.getAllCars = async (req, res, next) => {
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

        const products = await Products.findAll({ where: { type: 'car' } });
        res.render('AdminPages/admin-navbar-pages/all-cars', 
        { path: '/all-cars', products: products, name: 'cars', PageTitle: 'All Cars' });
    } catch (error) {
        console.log(error);
    }
}
exports.getAllMotorcycles = async (req, res, next) => {
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
        const products = await Products.findAll({ where: { type: 'motorcycle' } });
        res.render('AdminPages/admin-navbar-pages/all-motorcycles', 
        { path: '/all-motorcycles', products: products, name: 'motorcycles', PageTitle: 'All Motorcycles' });
    } catch (error) {
        console.log(error);
    }
}

exports.postDeleteProduct = async (req, res, next) => {
    const productId = req.body.productId;
    const name = req.body.name;
    try {
        const products = await Products.findAll({ where: { id: productId } });
        const product = products[0];
        await product.destroy();
        await product.save();
        res.redirect('/admin/' + req.session.user.id + '/all-'+name );
    } catch (error) {
        console.log(error);
    }

}

exports.getEditProduct = async (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    const productId = req.params.productId;
    try {
        const cars = await Products.findAll({ where: { id: productId } });
        const car = cars[0];
        res.render('AdminPages/admin-navbar-pages/edit-product', 
        { path: '/all-cars', product: car, name: 'edit', error: errormsg, PageTitle: 'Edit Product'});
    } catch (error) {
        console.log(error);
    }


}
exports.postEditProduct = async (req, res, next) => {

    const productId = req.body.productId;
    const name = req.body.name;
    const car_marka = req.body.car_marka;
    const car_model = req.body.car_model;
    const year = req.body.year;
    const price = req.body.price;
    const description = req.body.description;
    // const imageUrl = req.body.imageUrl;
    try {
        const products = await Products.findAll({ where: { id: productId } });
        const car = products[0];
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
exports.getMails = async (req, res, next) => {
    try {
        const mails = await HelpMail.findAll();
        
        res.render('AdminPages/admin-navbar-pages/mail', 
        { path: '/mails', PageTitle: 'Mails', mails: mails });
    } catch (error) {
        console.log(error);
    }
}

exports.emailDelete = async (req, res, next) => {
    const emailId = req.body.emailId;
    const name = req.body.name;
    try {
        const emails = await HelpMail.findAll({ where: { id: emailId } });
        const email = emails[0];
        await email.destroy();
        await email.save();
        res.redirect('/admin/' + req.session.user.id + '/mails' );
    } catch (error) {
        console.log(error);
    }
}
exports.postDeleteComment = async (req, res, next) => {
    const commentId = req.body.commentId;
    const productId = req.body.productId;
    try {
        const comments = await Comment.findAll({ where: { id: commentId } });
        const comment = comments[0];
        await comment.destroy();
        await comment.save();
        res.redirect('/product/' + productId);
    } catch (error) {
        console.log(error);
    }
}