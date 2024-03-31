const User = require('../models/user');
const bcrypt = require('bcryptjs');

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
exports.postSignup = (req, res, next) => {
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
    async function userCmpr() {
        const existsUser = await User.findOne({ where: { email: email } });
        if (existsUser) {
            req.flash('error',
            'Email already exists. Please enter a different email address');
            return res.redirect('/signup');
        }
    }
    userCmpr();
    async function userCreate() {
        try {
            const passwordcrypt = bcrypt.hashSync(password, 12);
            const user = await User.create({
                name: name,
                surName: surName,
                email: email,
                password: passwordcrypt
            });
            await user.save();
            await user.createFavorite();
            res.redirect('/login');
        } catch (error) {
            console.log(error);
        }
    }
    userCreate();
    
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

            const user = await User.findOne({ where: { email: email } });

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
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }
    compareUser();
    
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}
