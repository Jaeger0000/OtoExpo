const express = require('express');
const sequelize = require('./util/database');
const store = require('./util/session-store');

const path = require('path');

const session = require('express-session');

const flash = require('connect-flash');

const User = require('./models/user');
const Favorite = require('./models/favorite');
const FavoriteItem = require('./models/favorite-item');
const Cars = require('./models/cars');

const mainPageRoutes = require('./routes/main-page');
const authRoutes = require('./routes/auth-page');
const userRoutes = require('./routes/user-page');
const addProductRoutes = require('./routes/add-product');






const app = express();

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
app.use(userRoutes);


Cars.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Cars);

User.hasOne(Favorite);
Favorite.belongsTo(User);
Cars.belongsToMany(Favorite , {through: FavoriteItem});
Favorite.hasMany(Cars);



// sync the database and turn off logging

async function  init() {
    try {
        await sequelize.sync();
    } catch (error) {
        console.log(error);
    }
}
init();

app.listen(3000);



// Sadece add product page ekledim , direkt add product gitmesini engelleyen middleware eklenecek 
// error page eklenec olmayan bir uzantıya gitmeye çalışınca
//     Products table güncellenecek ve 1 ana table altında 3(duruma göre artabilir) farklı table çevrilicek,
// add product post methodu controller ve routes eklenecek,
// categories çekerken filtreleme ile çekme eklenecek,
// productsları favorilere ekleme olacak,
// user giriş yaptıktan sonra altında user ayarları menüsü ve ayarlar eklenecek,
// productslara yorum yapma ve yıldız verme eklenecek,

//   
//data yazdırırken html olarak yazmlarını sağlama eklenecek