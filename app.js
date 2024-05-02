const express = require('express');

const store = require('./util/database/session-store');

const path = require('path');

const session = require('express-session');
const flash = require('connect-flash');
const csrf  = require('csurf');
const multer = require('multer');

const User = require('./models/user');

const databeseConnection = require('./util/database/databese-connection');

const multValues = require("./util/multer/multer-values");

const mainPageRoutes = require('./routes/main-page');
const authRoutes = require('./routes/auth-page');
const userRoutes = require('./routes/user-page');
const addProductRoutes = require('./routes/add-product');
const adminPages = require('./routes/admin-page');
const Admin = require('./models/admin');


const app = express();
const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: multValues.fileStorage, fileFilter: multValues.fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'oto-expo-databese', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    async function init(){
        try {
            if(req.session.user){
                const user =await User.findByPk(req.session.user.id);
                res.locals.user = user;
            }
            if(req.session.admin){
                const admin =await Admin.findByPk(req.session.admin.id);
                res.locals.admin = admin;
            }
            res.locals.isAuthenticated = req.session.isLoggedIn;
            res.locals.isAdminAuthenticated = req.session.isAdminLoggedIn;
            res.locals.csrfToken = req.csrfToken();
            next();
        } catch (error) {
            console.log(error);
        }
    }
    init();
});

app.use(adminPages);
app.use(mainPageRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(addProductRoutes);
app.use((req, res, next) => {
    res.status(404).render('MainPages/404', { pageTitle: 'Page Not Found',path: '/404', PageTitle: "404" });
});

databeseConnection;

app.listen(3000);
// home page düzenlenecek 

