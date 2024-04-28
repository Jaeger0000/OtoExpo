const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailSend = require('../util/mail/mail-send');
const { Op } = require('sequelize');

exports.getSignup = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }

    res.render('AuthPages/signup', {
        path: '/signup',
        error: errormsg
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
            return res.redirect('/signup');
        }
        const existsUser = await User.findOne({ where: { email: email } });
        if (existsUser) {
            req.flash('error',
                'Email already exists. Please enter a different email address');
            return res.redirect('/signup');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const passwordcrypt = bcrypt.hashSync(password, 12);
        const user = await User.create({
            name: name,
            surName: surName,
            email: email,
            password: passwordcrypt,
            isVerified: false,
        });
        user.verifyToken = token;
        user.verifyTokenExpiration = Date.now() + 3600000;
        mailSend.sendMailVerification(email,token);
        await user.save();
        await user.createFavorite();
        req.flash('error', 'You need to verify your account to register successfully');
        res.redirect('/login');

    } catch (error) {
        console.log(error);
    }

}
exports.getVerify = async (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    const token = req.params.token;
    const user = await User.findOne({
        where: {
            verifyToken: token,
            verifyTokenExpiration: {
                [Op.gt]: Date.now()
            }
        }
    });
    if (!user) {
        req.flash('error', "The link is invalid or expired");
        return res.redirect('/login');
    }
    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiration = null; // we need to performence improvements this code after the project because
    // we have to two more useless columns after the login process and if some user start to use the website and enter the a lot of
    // data to the database we will have a lot of useless data in the database
    await user.save();
    res.render('AuthPages/verified-page', {
        path: '/signup',
        error: errormsg
    });
}
exports.getLogin = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }

    res.render('AuthPages/login', {
        path: '/login',
        error: errormsg
    });
}

exports.postLogin = (req, res, next) => {
    async function compareUser() {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const user = await User.findOne({ where: { email: email, isVerified: true } });

            if (!user) {
                req.flash('error', "The entered email not exists");
                return res.redirect('/login');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                req.flash('error', "The entered password is incorrect");
                return res.redirect('/login');
            }
            req.session.user = user;
            req.session.isLoggedIn = true;
            await res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }
    compareUser();

}

exports.postLogout =async (req, res, next) => {
    await req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getForgetPass = (req, res, next) => {
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('AuthPages/forget-pass', { path: '/forgetPass', error: errormsg });
}
exports.postForgetPass = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        req.flash('error', 'The entered email not exists');
        return res.redirect('/forget-password');
    }
    const buffer = crypto.randomBytes(32);
    const token = buffer.toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    mailSend.sendMailForget(email, token);
    res.redirect('/login');
}

exports.getResetPass = async (req, res, next) => {
    const token = req.params.token;
    const user = await User.findOne({
        where: {
            resetToken: token,
            resetTokenExpiration: {
                [Op.gt]: Date.now()
            }
        }
    });
    if (!user) {
        req.flash('error', "The link is invalid or expired");
        return res.redirect('/forget-password');
    }
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    res.render('AuthPages/reset-password', { path: '/reset-password', error: errormsg, userId: user.id, token: token });
}

exports.postResetPass = async (req, res, next) => {
    const userId = req.body.userId;
    const password = req.body.password;
    const cfrmPassword = req.body.cfrmPassword;
    const token = req.body.token;
    if (password !== cfrmPassword) {
        req.flash('error', "Passwords do not match");
        return res.redirect(`/reset-password/${token}`);
    }
    const user = await User.findOne({
        where: {
            id: userId,
            resetToken: token,
            resetTokenExpiration: {
                [Op.gt]: Date.now()
            }
        }
    });
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/login');
    }
    const passwordcrypt = bcrypt.hashSync(password, 12);
    user.password = passwordcrypt;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();
    req.flash('error', "Password reset mail send successfully");
    res.redirect('/login');

}