const Admin = require('../models/admin');
const Products = require('../models/products');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const HelpMail = require('../models/help-mail');
const Comment = require('../models/comment');
const mailSend = require('../util/mail/mail-send');
const crypto = require('crypto');
const { Op } = require('sequelize');

exports.getSignup = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }

    res.render('AdminPages/admin-signup', {
        path: '/admin-signup',
        error: errormsg,
        PageTitle: 'Admin Signup'
    });
}
exports.postSignup = async (req, res, next) => {
    try {
        const name = req.body.name;
        const surName = req.body.surName;
        const email = req.body.email;
        const password = req.body.password;
        const cfrmPassword = req.body.cfrmPassword;
        if (password !== cfrmPassword) {
            req.flash('error',
                'Passwords do not match');
            return res.redirect('/admin-signup');
        }

        const existsAdmin = await Admin.findOne({ where: { email: email } });
        if (existsAdmin) {
            req.flash('error',
                'Email already exists. Please enter a different email address');
            return res.redirect('/admin-signup');
        }
        const adminMail = ["oguzhanceviz68@gmail.com",
            "tolgacevhan@gmail.com",
            "berk579.32@gmail.com",
            "huseyindonmez588@gmail.com",
            "mstf.bglm02@gmail.com"];
        if (!adminMail.includes(email)) {
            req.flash('error',
                'You are not authorized to register as an admin');
            return res.redirect('/admin-signup');
        }
        const passwordcrypt = bcrypt.hashSync(password, 12);
        const admin = await Admin.create({
            name: name,
            surName: surName,
            email: email,
            password: passwordcrypt,
        });
        await admin.save();

        res.redirect('/admin-login');
    } catch (error) {
        console.log(error);
    }

}

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
        req.session.admin = admin;
        req.session.isAdminLoggedIn = true;
        await sleep(1000); // delay for 1 second to update the session
        function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
        await res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}

exports.getForgetPass = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('AdminPages/forget-pass', { path: '/forgetPass', error: errormsg, PageTitle: 'Admin Forget Password' });
}

exports.postForgetPass = async (req, res, next) => {
    const email = req.body.email;
    const admin = await Admin.findOne({ where: { email: email } });
    if (!admin) {
        req.flash('error', 'The entered email not exists');
        return res.redirect('/admin-forget-password');
    }
    const buffer = crypto.randomBytes(32);
    const token = buffer.toString('hex');
    admin.resetToken = token;
    admin.resetTokenExpiration = Date.now() + 3600000;
    await admin.save();
    mailSend.sendAdminMailForget(email, token);
    res.redirect('/admin-login');
}

exports.getResetPass = async (req, res, next) => {
    const token = req.params.token;
    const admin = await Admin.findOne({
        where: {
            resetToken: token,
            resetTokenExpiration: {
                [Op.gt]: Date.now()
            }
        }
    });
    if (!admin) {
        req.flash('error', "The link is invalid or expired");
        return res.redirect('/admin-forget-password');
    }
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('AdminPages/reset-password',
        { path: '/reset-password', error: errormsg, adminId: admin.id, token: token, PageTitle: 'Admin Reset Password' });
}

exports.postResetPass = async (req, res, next) => {
    const adminId = req.body.adminId;
    const password = req.body.password;
    const cfrmPassword = req.body.cfrmPassword;
    const token = req.body.token;
    if (password !== cfrmPassword) {
        req.flash('error', "Passwords do not match");
        return res.redirect(`/admin-reset-password/${token}`);
    }
    const admin = await Admin.findOne({
        where: {
            id: adminId,
            resetToken: token,
            resetTokenExpiration: {
                [Op.gt]: Date.now()
            }
        }
    });
    if (!admin) {
        req.flash('error', 'Admin not found');
        return res.redirect('/admin-login');
    }
    const passwordcrypt = bcrypt.hashSync(password, 12);
    admin.password = passwordcrypt;
    admin.resetToken = null;
    admin.resetTokenExpiration = null;
    await admin.save();
    req.flash('error', "Password reset mail send successfully");
    res.redirect('/admin-login');

}
exports.getAdmin = async (req, res, next) => {

    try {
        const userId = req.params.UserId;
        const admin = await Admin.findByPk(userId);
        if (admin === null) {
            return res.redirect('/admin');
        }
        if (admin.id !== req.session.admin.id) {
            return res.redirect('/admin');
        }
        var errormsg = req.flash('error');
        if (errormsg.length > 0) {
            errormsg = errormsg[0];
        } else {
            errormsg = null;
        }
        res.render('AdminPages/admin-navbar-pages/user',
            { path: 'admin/account', error: errormsg, admin: admin, PageTitle: 'Admin' });
    } catch (error) {
        console.log(error);
    }

}
exports.getAdminPage = (req, res, next) => {
    const id = req.session.admin.id;
    res.redirect('/admin/' + id + '/account');
}


exports.postNameUpdate = async (req, res, next) => {
    const name = req.body.name;
    try {
        const admin = await Admin.findByPk(req.session.admin.id);
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
        const admin = await Admin.findByPk(req.session.admin.id);
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
        const admin = await Admin.findByPk(req.session.admin.id);
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
    if (bcrypt.compareSync(oldpassword, req.session.admin.password) === false) {
        req.flash('error',
            'The entered password is incorrect');
        return res.redirect('/admin');
    }
    if (password !== cfrmPassword) {
        req.flash('error',
            'Passwords do not match');
        return res.redirect('/admin');
    }

    try {
        const admin = await Admin.findByPk(req.session.admin.id);
        const passwordcrypt = bcrypt.hashSync(password, 12);
        admin.password = passwordcrypt;
        await admin.save();
        req.session.admin = admin;
        res.redirect('/admin');
    }
    catch (error) {
        console.log(error);
    }
}


exports.getAllCars = async (req, res, next) => {
    try {

        const products = await Products.findAll({ where: { type: 'car' } });
        res.render('AdminPages/admin-navbar-pages/all-cars',
            { path: '/all-cars', products: products, name: 'cars', PageTitle: 'All Cars' });
    } catch (error) {
        console.log(error);
    }
}
exports.getAllMotorcycles = async (req, res, next) => {
    try {
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
        res.redirect('/admin/all-' + name);
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
            { path: '/all-cars', product: car, name: 'edit', error: errormsg, PageTitle: 'Edit Product' });
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
        res.redirect('/admin/all-'+ car.type + 's');
    } catch (error) {
        console.log(error);
    }
}
exports.getMails = async (req, res, next) => {
    try {
        const mails = await HelpMail.findAll({ order: [['createdAt', 'ASC']] });
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
        res.redirect('/admin/mails');
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