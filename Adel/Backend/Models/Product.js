const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Adjust the path as needed
const UnitPrice = require("../Models/UnitPrice"); // Import UnitPrice model

class Product extends Model {}

Product.init(
  {
    serialNum: DataTypes.STRING,
    name: DataTypes.STRING,
  },
  { sequelize, modelName: "product" }
);

// Define relationships
Product.hasMany(UnitPrice, { foreignKey: "productId" });

module.exports = Product;
