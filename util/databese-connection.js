const User = require('../models/user');
const Favorite = require('../models/favorite');
const FavoriteItem = require('../models/favorite-item');
const Cars = require('../models/cars');
const Motorcycle = require('../models/motorcycle');

const sequelize = require('../util/database');

Cars.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
Motorcycle.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});

User.hasMany(Cars);
User.hasMany(Motorcycle);

User.hasOne(Favorite);
Favorite.belongsTo(User);


Favorite.belongsToMany(Cars, {through: FavoriteItem});
Cars.belongsToMany(Favorite, {through: FavoriteItem});




// Motorcycle.belongsToMany(Favorite , {through: FavoriteItem});
// Favorite.belongsToMany(Motorcycle , {through: FavoriteItem});



// sync the database and turn off logging

async function  init() {
    try {
        await sequelize.sync({alter: true});
    } catch (error) {
        console.log(error);
    }
}
module.exports = init();