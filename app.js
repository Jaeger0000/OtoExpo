const express = require('express');
const sequelize = require('./util/database');
const path = require('path');

const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const flash = require('connect-flash');

const Products = require('./models/products');
const User = require('./models/user');
const Favorite = require('./models/favorite');
const FavoriteItem = require('./models/favorite-item');

const mainPageRoutes = require('./routes/main-page');
const authRoutes = require('./routes/auth-page');


const app = express();

const store = new MySqlStore({
    host: 'localhost',
    user: 'root',
    password: '123456528',
    database: 'otoexpo-databese'
});





app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'oto-expo-databese', resave: false, saveUninitialized: false, store: store}));
app.use(flash());

app.use((req, res, next) => {
   
    async function init(){
        try {
            if(req.session.user){
                const user =await User.findByPk(req.session.user.id);
                res.locals.user = user;
            }
            res.locals.isAuthenticated = req.session.isLoggedIn;
            next();
        } catch (error) {
            console.log(error);
        }
    }
    init();
});

app.use(mainPageRoutes);
app.use(authRoutes);


Products.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Products);

User.hasOne(Favorite);
Favorite.belongsTo(User);
Products.belongsToMany(Favorite , {through: FavoriteItem});
Favorite.hasMany(Products);

// sync the database and turn off logging

async function  init() {
    try {
        await sequelize.sync();
    } catch (error) {
        console.log(error);
    }
}
init();

<<<<<<< Updated upstream
=======
app.listen(3006);
>>>>>>> Stashed changes





app.listen(3000);