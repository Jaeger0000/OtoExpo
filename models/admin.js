const Sequelize = require('sequelize');
const sequelize = require('../util/database/database');

const Admin = sequelize.define('admin',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    surName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    resetToken:{
        type: Sequelize.STRING
    },
    resetTokenExpiration:{
        type: Sequelize.DATE
    },
});

module.exports = Admin;