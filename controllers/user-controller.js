const User = require('../models/user');

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
    const userId = req.params.UserId;
    async function init() {
        try {
            const user = await User.findByPk(userId);
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

