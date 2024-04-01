const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Cars = sequelize.define("cars", {
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
  car_marka: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  car_model: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  production_year: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  kilometer: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  car_color: {
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

module.exports = Cars;
