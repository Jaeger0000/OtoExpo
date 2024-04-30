const Sequelize = require('sequelize');
const sequelize = require('../util/database/database');


const HelpMail = sequelize.define('helpMail',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull:true
    },
    message: {
        type: Sequelize.STRING,
        allowNull:true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
});   

module.exports = HelpMail;