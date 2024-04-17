const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Products = sequelize.define("products", {
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
  marka: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  model: {
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
  color: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  
  // imageUrl: {
  //   type: Sequelize.STRING,
  //   allowNull: false,
  // },
  announce_details: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Products;
