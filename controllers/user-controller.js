const User = require('../models/user');

exports.getFavorite = (req, res, next) => {
    console.log('şuan  favoritee egetter');
    var errormsg = req.flash('error');
    if (errormsg.length > 0) {
        errormsg = errormsg[0];
    } else {
        errormsg = null;
    }
    async function init(){
        try {
            if(!req.session.user){
                return res.redirect('/login');
            }
            const user = await User.findByPk(req.session.user.id);
            const favorite = await user.getFavorite();
            const products = await favorite.getProducts();
            console.log('şuan  favoritee egettesdssssssdsdsr');
            res.render('UserPages/favorite',{
                path:'/favorite',
                error: errormsg,
                favorites: products
            });
            console.log('şuan  favoritee egettesdssssssdsdsr');
        } catch (error) {
            console.log(error);
        }
    }
    init();
}