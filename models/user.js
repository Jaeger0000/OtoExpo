const Sequelize = require('sequelize');
const sequelize = require('../util/database/database');

const User = sequelize.define('user',{
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
    isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    resetToken:{
        type: Sequelize.STRING
    },
    resetTokenExpiration:{
        type: Sequelize.DATE
    },
    verifyToken:{
        type: Sequelize.STRING
    },
    verifyTokenExpiration:{
        type: Sequelize.DATE
    } 
});

module.exports = User;