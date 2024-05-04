const User = require('../../models/user');
const Favorite = require('../../models/favorite');
const FavoriteItem = require('../../models/favorite-item');
const Products = require('../../models/products');
const Comment = require('../../models/comment');

const sequelize = require('./database');

Products.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});

User.hasMany(Products);

User.hasOne(Favorite);
Favorite.belongsTo(User);

Comment.belongsTo(User, {constraints: true, onDelete: 'CASCADE' });
User.hasMany(Comment);



Favorite.belongsToMany(Products, {through: FavoriteItem});
Products.belongsToMany(Favorite, {through: FavoriteItem});




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
module.exports = init({alter: true});

sequelize.sync({alter: true});