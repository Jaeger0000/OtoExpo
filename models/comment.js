const Sequelize = require('sequelize');
const sequelize = require('../util/database/database');


const Comment = sequelize.define('comment',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    comment: {
        type: Sequelize.STRING,
        allowNull:true
    },
    replyTo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userFullName: {
        type: Sequelize.STRING,
        allowNull: false
    }
});   

module.exports = Comment;