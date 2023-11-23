const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Adjust the path as needed

class UnitPrice extends Model {}

UnitPrice.init(
  {
    purchasePrice: DataTypes.DECIMAL,
    sellingPrice: DataTypes.DECIMAL,
    unitType: DataTypes.STRING,
  },
  { sequelize, modelName: "unitPrice" }
);

module.exports = UnitPrice;
