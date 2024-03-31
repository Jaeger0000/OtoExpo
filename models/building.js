const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Buildings = sequelize.define("buildings", {
    
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  area:{
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  number_of_rooms:{
    type: Sequelize.STRING,// Seçenek sunacağız 1+0,1+1 gibi değer girilmeyecek
    allowNull: false,
  },
  Furnished: {
    type: Sequelize.STRING, // Seçenek sunacağız eşyalı sız gibi
    allowNull: false,
  },
  color: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  announce_details: {
    type: Sequelize.TEXT, 
    allowNull: false,
  },
});

module.exports = Buildings;