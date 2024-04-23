const Sequelize = require('sequelize');
const dbValue = require('./database-values');




//const sequelize = new Sequelize('OtoExpo_simplypast','OtoExpo_simplypast','c53cdce7a5a2a1b83af4202ad78f1e318a5246d2', {dialect: 'mysql' , host: 'dyy.h.filess.io', port: 3307});

const sequelize = new Sequelize(dbValue.database,dbValue.user,dbValue.password, {dialect: 'mysql' , host: dbValue.host});





module.exports = sequelize;