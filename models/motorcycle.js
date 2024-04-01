const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Motorcycle = sequelize.define("motorcycle", {
    
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
  motorcycle_marka: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  motorcycle_model: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  production_year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  kilometer: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  motorcycle_color: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
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

module.exports = Motorcycle;