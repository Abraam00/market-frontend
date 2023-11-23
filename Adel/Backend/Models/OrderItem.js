const { Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Adjust the path as needed

class OrderItem extends Model {}

OrderItem.init(
  {
    quantity: DataTypes.INTEGER,
    unitType: DataTypes.STRING,
    unitPrice: DataTypes.DECIMAL,
    productId: DataTypes.INTEGER,
  },
  { sequelize, modelName: "orderItem" }
);

module.exports = OrderItem;
