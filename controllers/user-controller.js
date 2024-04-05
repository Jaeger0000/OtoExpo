const User = require('../models/user');
const bcrypt = require('bcryptjs');
exports.getFavorite = (req, res, next) => {
    console.log('şuan  favoritee egetter');
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    async function init() {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }
            const user = await User.findByPk(req.session.user.id);
            const favorite = await user.getFavorite();
            const products = await favorite.getCars(); // üç farklı favorite böl 3 farklı değer yolla
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

exports.getUser = (req, res, next) => {
   
    async function init() {
        try {
            const userId = req.params.UserId;
            console.log(userId);
            const user = await User.findByPk(userId);
            if(user === null){
                return res.redirect('/');
            }
            if (user.id !== req.session.user.id) {
                return res.redirect('/');
            }
            var errormsg = req.flash('error');
            if (errormsg.length > 0) {
                errormsg = errormsg[0];
            } else {
                errormsg = null;
            }
            res.render('UserPages/user', { path: 'user/account', error: errormsg , user: user});
        } catch (error) {
            console.log(error);
        }


    }
    init();

}

exports.getUserPage = (req, res, next) => {
    const id = req.session.user.id ;
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
        catch(error){
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
        catch(error){
            console.log(error);
        }
    }
    userUpdate();
}

exports.postPasswordUpdate = (req, res, next) => {
    const oldpassword = req.body.oldPassword;
    const password = req.body.password;
    const cfrmPassword = req.body.cfrmPassword;
    console.log('old password:  '+oldpassword);
    console.log('old password:  ' + req.session.user.password);
    if(bcrypt.compareSync(oldpassword, req.session.user.password) === false){
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
        catch(error){
            console.log(error);
        }
    }
    userUpdate();
}

