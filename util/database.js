const Sequelize = require('sequelize');

const sequelize = new Sequelize('otoExpo-databese','root','Oguzhan6886', {dialect: 'mysql' , host: 'localhost'});

module.exports = sequelize;