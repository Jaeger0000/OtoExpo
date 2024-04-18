const Sequelize = require('sequelize');

// const sequelize = new Sequelize('OtoExpo_simplypast','OtoExpo_simplypast','c53cdce7a5a2a1b83af4202ad78f1e318a5246d2', {dialect: 'mysql' , host: 'dyy.h.filess.io', port: 3307});

const sequelize = new Sequelize('otoexpo-databese','root','123456528', {dialect: 'mysql' , host: 'localhost'});

module.exports = sequelize;