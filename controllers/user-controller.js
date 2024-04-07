const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Car = require('../models/cars');
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


exports.postFavorite = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        const user = await User.findByPk(req.session.user.id);
        const favorite = await user.getFavorite();
        const cars = await favorite.getCars({ where: { id: productId } });

        if (cars.length > 0) {
            const car = cars[0];
            const oldQuantity = car.favoriteItem.quantity;
            const newQuantity = oldQuantity + 1;
            await favorite.addCar(car, { through: { quantity: newQuantity } });
        } else {
            const car = await Car.findByPk(productId);
            await favorite.addCar(car, { through: { quantity: 1 } });
        }
        res.redirect('/favorite');
    } catch (error) {
        console.log(error);
        // Handle the error appropriately, such as sending an error response
        // res.status(500).send('Internal Server Error');
        // or redirecting the user to an error page
        // res.redirect('/error');
    }
};

exports.postDeleteFavorite = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        const user = await User.findByPk(req.session.user.id);
        const favorite = await user.getFavorite();
        const cars = await favorite.getCars({ where: { id: productId } });
        const car = cars[0];
        await favorite.removeCar(car);
        res.redirect('/favorite');
    } catch (error) {
        console.log(error);
        // Handle the error appropriately, such as sending an error response
        // res.status(500).send('Internal Server Error');
        // or redirecting the user to an error page
        // res.redirect('/error');
    }

}

exports.getUser = (req, res, next) => {
   
    async function init() {
        try {
            const userId = req.params.UserId;
            console.log(userId);
            const user = await User.findByPk(userId);
            if(user === null){
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

